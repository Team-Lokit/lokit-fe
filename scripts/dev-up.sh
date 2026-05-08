#!/bin/bash
# ================================================================
# dev-up.sh — PR 리뷰/로컬 개발 환경 자동 세팅
#
# 동작 순서
#   1. 브랜치 체크아웃 + git pull
#   2. 의존성 변경 감지 → pnpm install / pod install (변경 시에만)
#   3. 기존 dev 프로세스 정리 + Android 에뮬레이터 부팅(Pixel google_apis +
#      -writable-system 필수, /etc/hosts 매핑을 위해)
#   4. 터미널 4개 실행: web(https) / metro / iOS / Android
#   5. Android /etc/hosts 에 local.lokit.co.kr → 10.0.2.2 매핑
#
# 사용법:
#   ./scripts/dev-up.sh [branch-name]   브랜치명 생략 시 현재 브랜치
#
# 종료:
#   ./scripts/dev-down.sh               dev 프로세스/시뮬·에뮬/터미널 정리
# ================================================================

set -e

ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "❌ git 레포 안에서 실행해주세요."; exit 1; }
WEB_DIR="$ROOT_DIR/apps/web"
MOBILE_DIR="$ROOT_DIR/apps/mobile"
MAIN_BRANCH="main"
ANDROID_HOST="local.lokit.co.kr"
ANDROID_IP="10.0.2.2"  # Android 에뮬레이터에서 호스트 머신 접근 IP

# ── 디바이스 오버라이드 (값 비우면 자동 선택) ─────────────────
# 다른 AVD/시뮬레이터를 쓰고 싶을 때만 이 두 상수를 수정하세요.
#   - Android: google_apis 태그(=Google APIs 이미지)인 AVD 이름.
#              비워두면 'Pixel*' 우선, 그 외 첫 google_apis AVD 자동 선택.
#              주의: Google Play 이미지(Tag: google_apis_playstore)는 adb root 차단으로 사용 불가.
#   - iOS:     `xcrun simctl list devices` 에 보이는 시뮬레이터 이름.
#              비워두면 react-native run-ios 기본 동작.
ANDROID_AVD_OVERRIDE=""    # 예: "Nexus_7_API_30"
IOS_SIMULATOR_OVERRIDE=""  # 예: "iPhone 15 Pro"

ANDROID_DEVICE_ID=""        # ensure_google_apis_emulator가 채움 (예: emulator-5554)

# ── 색상 ──────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}✔${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC}  $1"; }
error(){ echo -e "${RED}✖${NC}  $1"; exit 1; }
step() { echo -e "\n${GREEN}▶ $1${NC}"; }

# ── 0. 브랜치 결정 (인자 없으면 현재 브랜치) ─────────────────
BRANCH=$1
if [ -z "$BRANCH" ]; then
  BRANCH=$(git -C "$ROOT_DIR" rev-parse --abbrev-ref HEAD)
  if [ -z "$BRANCH" ] || [ "$BRANCH" = "HEAD" ]; then
    error "현재 브랜치를 확인할 수 없습니다. 브랜치명을 인자로 전달해주세요."
  fi
  warn "브랜치 인자 없음 — 현재 브랜치로 실행: $BRANCH"
fi

# ── 1. Git fetch + checkout ───────────────────────────────────
step "1/4  Git checkout: $BRANCH"
cd "$ROOT_DIR"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"
log "체크아웃 완료"

# ── 2. 패키지 변경 감지 → 선택적 설치 ───────────────────────
step "2/4  의존성 변경 감지"

PKG_CHANGED=$(git diff "origin/$MAIN_BRANCH"...HEAD -- '**/package.json' 'pnpm-lock.yaml' 2>/dev/null | grep -c "^+" || echo 0)
POD_CHANGED=$(git diff "origin/$MAIN_BRANCH"...HEAD -- 'apps/mobile/ios/Podfile.lock' 2>/dev/null | grep -c "^+" || echo 0)

if [ "$PKG_CHANGED" -gt 0 ]; then
  log "package.json / pnpm-lock.yaml 변경 감지 → pnpm install 실행"
  cd "$ROOT_DIR"
  pnpm install
else
  log "패키지 변경 없음 — pnpm install 건너뜀"
fi

if [ "$POD_CHANGED" -gt 0 ]; then
  log "Podfile.lock 변경 감지 → pod install 실행"
  cd "$MOBILE_DIR/ios"
  pod install
  cd "$ROOT_DIR"
else
  log "Pod 변경 없음 — pod install 건너뜀"
fi

# ── google_apis AVD 자동 부팅 ─────────────────────────────────
# Google Play 이미지는 adb root 차단으로 /etc/hosts 수정 불가.
# google_apis 태그의 AVD를 찾아 미리 부팅해두면 react-native run-android가 그 디바이스를 사용함.
ensure_google_apis_emulator() {
  local SDK="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
  local EMULATOR_BIN="$SDK/emulator/emulator"
  local AVDMANAGER="$SDK/cmdline-tools/latest/bin/avdmanager"

  # 이미 떠있는 에뮬레이터 확인
  # google_apis + writable-system이면 그대로 사용, 그 외엔 종료 후 재부팅
  local existing
  existing=$(adb devices 2>/dev/null | awk '/^emulator-/ {print $1; exit}')
  if [ -n "$existing" ]; then
    local build_type
    build_type=$(adb -s "$existing" shell getprop ro.build.type 2>/dev/null | tr -d '\r')
    if [ "$build_type" = "userdebug" ]; then
      # writable-system 여부 확인: /system 쓰기 가능?
      adb -s "$existing" root >/dev/null 2>&1 || true
      sleep 1
      local rw_test
      rw_test=$(adb -s "$existing" shell "touch /system/.lokit-rw-test 2>&1; rm -f /system/.lokit-rw-test 2>&1" 2>&1)
      if ! echo "$rw_test" | grep -qiE "read-only|permission|EROFS"; then
        log "이미 google_apis + writable-system 에뮬레이터 실행 중: $existing"
        ANDROID_DEVICE_ID="$existing"
        return 0
      fi
      warn "기존 google_apis 에뮬레이터($existing)가 -writable-system 없이 부팅됨 — /etc/hosts 수정 불가, 재부팅 진행"
    else
      warn "기존 에뮬레이터($existing)가 Google Play 이미지(${build_type:-unknown}) — 종료 후 google_apis로 교체"
    fi
    adb -s "$existing" emu kill 2>/dev/null || true
    sleep 2
    if pgrep -f "qemu-system" >/dev/null 2>&1; then
      pkill -f "qemu-system" 2>/dev/null || true
      sleep 2
    fi
  fi

  if [ ! -x "$EMULATOR_BIN" ]; then
    warn "emulator 바이너리 없음: $EMULATOR_BIN"
    return 1
  fi
  if [ ! -x "$AVDMANAGER" ]; then
    warn "avdmanager 없음: $AVDMANAGER (Android Studio cmdline-tools 설치 필요)"
    return 1
  fi

  # AVD 선택: 오버라이드 우선, 없으면 google_apis 자동 선택
  local avd_name="$ANDROID_AVD_OVERRIDE"
  if [ -n "$avd_name" ]; then
    log "ANDROID_AVD_OVERRIDE 사용: $avd_name"
  else
    # Tag/ABI 줄은 "Based on: ... Tag/ABI: <value>" 포맷이라 줄 시작 앵커 없이 매칭
    # 우선순위: Pixel > 그 외 google_apis (WebView 도메인 설정이 Pixel에서 검증됨)
    avd_name=$("$AVDMANAGER" list avd 2>/dev/null | awk '
      /^[[:space:]]*Name:/ { name = $2 }
      /Tag\/ABI:/ {
        if ($NF ~ /^google_apis\//) {
          if (name ~ /^Pixel/ && !pixel) pixel = name
          else if (!fallback) fallback = name
        }
      }
      END {
        if (pixel) print pixel
        else if (fallback) print fallback
      }
    ')
  fi

  if [ -z "$avd_name" ]; then
    warn "google_apis 태그의 AVD를 찾을 수 없습니다."
    warn "Android Studio Device Manager에서 'Google APIs' 이미지로 AVD 생성 필요"
    warn "(또는 dev-up.sh 상단의 ANDROID_AVD_OVERRIDE 에 AVD 이름 직접 지정)"
    return 1
  fi

  log "google_apis AVD 자동 선택: $avd_name (백그라운드 부팅 with -writable-system)"
  nohup "$EMULATOR_BIN" -avd "$avd_name" -writable-system >/dev/null 2>&1 &
  disown 2>/dev/null || true

  # adb가 디바이스를 인식할 때까지 대기 (max 30s)
  local emu_id=""
  for i in $(seq 1 15); do
    emu_id=$(adb devices 2>/dev/null | awk '/^emulator-/ {print $1; exit}')
    if [ -n "$emu_id" ]; then
      log "에뮬레이터 adb 등록 확인: $emu_id"
      ANDROID_DEVICE_ID="$emu_id"
      break
    fi
    sleep 2
  done
  if [ -z "$emu_id" ]; then
    warn "에뮬레이터가 30초 내에 adb에 등록되지 않음 — pnpm android가 다른 AVD를 띄울 수 있음"
    return 1
  fi

  # boot_completed까지 대기 (max 60s) — 부팅 도중 react-native가 default AVD를 추가로 띄우는 것 방지
  wait_boot() {
    local target=$1
    log "에뮬레이터 부팅 완료 대기 중 ($target)..."
    for i in $(seq 1 30); do
      local boot
      boot=$(adb -s "$target" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')
      if [ "$boot" = "1" ]; then
        log "에뮬레이터 부팅 완료: $target"
        return 0
      fi
      sleep 2
    done
    warn "에뮬레이터 boot_completed 60초 내 미달성"
    return 1
  }
  wait_boot "$emu_id" || true

  # /system writable 만들기 (writable-system + disable-verity + remount)
  log "/system writable 설정 중 (adb root + remount)..."
  adb -s "$emu_id" root >/dev/null 2>&1 || true
  sleep 2
  local remount_out
  remount_out=$(adb -s "$emu_id" remount 2>&1 || true)
  if echo "$remount_out" | grep -qi "succeeded"; then
    log "adb remount 성공 — /system writable"
  else
    # disable-verity + reboot 후 재시도 필요
    warn "remount 실패 — disable-verity + reboot 후 재시도"
    adb -s "$emu_id" disable-verity >/dev/null 2>&1 || true
    adb -s "$emu_id" reboot >/dev/null 2>&1 || true
    sleep 5
    # adb 재등록 + boot_completed 다시 대기
    for i in $(seq 1 15); do
      adb devices 2>/dev/null | grep -q "^${emu_id}" && break
      sleep 2
    done
    wait_boot "$emu_id" || true
    adb -s "$emu_id" root >/dev/null 2>&1 || true
    sleep 2
    remount_out=$(adb -s "$emu_id" remount 2>&1 || true)
    if echo "$remount_out" | grep -qi "succeeded"; then
      log "adb remount 성공 (after disable-verity + reboot)"
    else
      warn "adb remount 여전히 실패 — /etc/hosts 자동 설정 불가"
      warn "remount output: $(echo "$remount_out" | tail -3)"
    fi
  fi

  return 0
}

# ── Android etc/hosts 설정 ────────────────────────────────────
# 호출 시점에는 에뮬레이터가 이미 부팅 완료된 상태(ensure_google_apis_emulator가 보장)
# $ANDROID_DEVICE_ID가 비어있으면 adb가 단일 디바이스 자동 선택
setup_android_hosts() {
  local adb_target=""
  if [ -n "$ANDROID_DEVICE_ID" ]; then
    adb_target="-s $ANDROID_DEVICE_ID"
  fi

  ROOT_OUT=$(adb $adb_target root 2>&1 || true)
  if echo "$ROOT_OUT" | grep -qi "production build"; then
    warn "에뮬레이터가 Google Play 이미지(production build)임 — adb root 차단됨"
    warn "/etc/hosts 자동 설정 불가. Android Studio Device Manager에서 'Google APIs' 이미지로 AVD 재생성 필요"
    warn "(앱은 https://local.lokit.co.kr:3000 을 못 띄워요)"
    return
  fi
  sleep 1

  EXISTING=$(adb $adb_target shell "grep '$ANDROID_HOST' /etc/hosts 2>/dev/null" || true)
  if [ -n "$EXISTING" ]; then
    log "Android /etc/hosts 이미 설정되어 있음"
    return
  fi

  WRITE_OUT=$(adb $adb_target shell "echo '$ANDROID_IP $ANDROID_HOST' >> /etc/hosts" 2>&1 || true)
  VERIFY=$(adb $adb_target shell "grep '$ANDROID_HOST' /etc/hosts 2>/dev/null" || true)
  if [ -n "$VERIFY" ]; then
    log "Android /etc/hosts 설정 완료: $ANDROID_IP $ANDROID_HOST"
  else
    warn "Android /etc/hosts 쓰기 실패: ${WRITE_OUT:-권한 부족}"
    warn "수동 확인: adb $adb_target shell cat /etc/hosts"
  fi
}

# ── 3.5. 기존 dev 프로세스 정리 ──────────────────────────────
step "3/4  기존 dev 프로세스 정리 + 개발 서버 실행"

cleanup_dev_processes() {
  local killed=0
  local patterns=(
    "next-server"
    "next dev"
    "pnpm dev:https"
    "pnpm dev "
    "react-native start"
    "react-native run-ios"
    "react-native run-android"
    "metro/src/cli"
  )
  for pattern in "${patterns[@]}"; do
    if pgrep -f "$pattern" >/dev/null 2>&1; then
      pkill -f "$pattern" 2>/dev/null && killed=1 || true
    fi
  done
  if [ "$killed" = "1" ]; then
    sleep 1
    log "기존 dev 프로세스 종료 완료"
  else
    log "정리할 dev 프로세스 없음"
  fi
}

cleanup_dev_processes

# Android 에뮬레이터를 google_apis로 미리 부팅 (pnpm android 전에)
ensure_google_apis_emulator || true

# ── 개발 서버 실행 ─────────────────────────────────────────────
# 4 탭/창: web(https), metro, ios(--no-packager), android(--no-packager --deviceId)
# - metro를 별도 탭으로 미리 띄움 → ios/android의 metro 자동 spawn 비활성 (--no-packager)
# - android는 --deviceId로 Pixel 명시 → react-native가 default AVD(Nexus) 추가 부팅 방지

ANDROID_FLAGS="--no-packager"
if [ -n "$ANDROID_DEVICE_ID" ]; then
  ANDROID_FLAGS="$ANDROID_FLAGS --deviceId $ANDROID_DEVICE_ID"
fi

IOS_FLAGS="--no-packager"
if [ -n "$IOS_SIMULATOR_OVERRIDE" ]; then
  # 시뮬레이터 이름에 공백 가능 → 단일 인용으로 감쌈 (do script가 그대로 셸로 전달)
  IOS_FLAGS="$IOS_FLAGS --simulator '$IOS_SIMULATOR_OVERRIDE'"
fi

wait_for_metro() {
  for i in $(seq 1 20); do
    if lsof -iTCP:8081 -sTCP:LISTEN >/dev/null 2>&1; then
      log "Metro 8081 바인드 확인"
      return 0
    fi
    sleep 1
  done
  warn "Metro가 20초 내에 8081 포트에 바인드되지 않음 — ios/android가 자체 metro spawn할 수 있음"
}

launch_iterm_phase1() {
  osascript <<EOF
tell application "iTerm"
  activate
  tell current window
    set webTab to (create tab with default profile)
    tell current session of webTab
      write text "cd '$WEB_DIR' && pnpm dev:https"
    end tell
    set metroTab to (create tab with default profile)
    tell current session of metroTab
      write text "cd '$MOBILE_DIR' && pnpm start"
    end tell
  end tell
end tell
EOF
}

launch_iterm_phase2() {
  osascript <<EOF
tell application "iTerm"
  tell current window
    set iosTab to (create tab with default profile)
    tell current session of iosTab
      write text "cd '$MOBILE_DIR' && pnpm ios -- $IOS_FLAGS"
    end tell
    set androidTab to (create tab with default profile)
    tell current session of androidTab
      write text "cd '$MOBILE_DIR' && pnpm android -- $ANDROID_FLAGS"
    end tell
  end tell
end tell
EOF
}

launch_terminal_phase1() {
  osascript <<EOF
tell application "Terminal"
  activate
  do script "cd '$WEB_DIR' && pnpm dev:https"
  do script "cd '$MOBILE_DIR' && pnpm start"
end tell
EOF
}

launch_terminal_phase2() {
  osascript <<EOF
tell application "Terminal"
  do script "cd '$MOBILE_DIR' && pnpm ios -- $IOS_FLAGS"
  do script "cd '$MOBILE_DIR' && pnpm android -- $ANDROID_FLAGS"
end tell
EOF
}

if [ -d "/Applications/iTerm.app" ]; then
  if launch_iterm_phase1; then
    log "iTerm2 phase 1 실행 (web + metro)"
    wait_for_metro
    launch_iterm_phase2 && log "iTerm2 phase 2 실행 (ios + android)"
  else
    warn "iTerm2 실행 실패 — Terminal.app으로 재시도"
    launch_terminal_phase1
    wait_for_metro
    launch_terminal_phase2
  fi
else
  launch_terminal_phase1 && log "Terminal.app phase 1 실행 (web + metro)"
  wait_for_metro
  launch_terminal_phase2 && log "Terminal.app phase 2 실행 (ios + android)"
fi

# ── 5. Android hosts 백그라운드 처리 ─────────────────────────
step "4/4  Android /etc/hosts 백그라운드 설정"
setup_android_hosts &

# ── 완료 메시지 ───────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 리뷰 환경 세팅 완료: $BRANCH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  웹      → 터미널에서 URL 확인"
echo "  iOS     → 시뮬레이터 자동 실행"
echo "  Android → 에뮬레이터 자동 실행"
echo "           (/etc/hosts 백그라운드 설정 중)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
