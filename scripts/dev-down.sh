#!/bin/bash
# ================================================================
# dev-down.sh — dev-up.sh로 띄운 환경 종료
#   - dev 프로세스 종료 (next, metro, react-native 등)
#   - 8081(metro) / 3000(web) 포트 점유 프로세스 강제 종료
#   - iOS Simulator / Android 에뮬레이터 종료
#   - dev-up.sh로 띄운 Terminal.app/iTerm2 창 정리
# 사용법: ./scripts/dev-down.sh
# ================================================================

set -e

ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "❌ git 레포 안에서 실행해주세요."; exit 1; }

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}✔${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC}  $1"; }
step() { echo -e "\n${GREEN}▶ $1${NC}"; }

# ── 1. dev 프로세스 종료 ─────────────────────────────────────
step "1/3  dev 프로세스 종료"

KILLED=0
PATTERNS=(
  "next-server"
  "next dev"
  "pnpm dev:https"
  "pnpm dev "
  "react-native start"
  "react-native run-ios"
  "react-native run-android"
  "metro/src/cli"
)

for pattern in "${PATTERNS[@]}"; do
  if pgrep -f "$pattern" >/dev/null 2>&1; then
    pkill -f "$pattern" 2>/dev/null && KILLED=1 || true
  fi
done

if [ "$KILLED" = "1" ]; then
  sleep 1
  log "dev 프로세스 종료 완료"
else
  log "정리할 dev 프로세스 없음"
fi

# 포트 점유 프로세스 강제 종료 (metro 8081, web 3000)
for port in 8081 3000; do
  PORT_PIDS=$(lsof -ti :$port 2>/dev/null | tr '\n' ' ')
  if [ -n "$PORT_PIDS" ]; then
    kill -9 $PORT_PIDS 2>/dev/null || true
    log "포트 $port 점유 프로세스 종료: $PORT_PIDS"
  fi
done

# ── 2. iOS Simulator / Android 에뮬레이터 종료 ───────────────
step "2/3  iOS Simulator / Android 에뮬레이터 종료"

# iOS Simulator
if pgrep -f "Simulator\.app" >/dev/null 2>&1; then
  xcrun simctl shutdown all 2>/dev/null || true
  osascript -e 'tell application "Simulator" to quit' 2>/dev/null || true
  log "iOS Simulator 종료 요청"
else
  log "iOS Simulator 실행 안 됨 — 건너뜀"
fi

# Android 에뮬레이터 (adb emu kill)
EMU_LIST=$(adb devices 2>/dev/null | awk '/^emulator-/ {print $1}')
if [ -n "$EMU_LIST" ]; then
  for emu in $EMU_LIST; do
    adb -s "$emu" emu kill 2>/dev/null || true
  done
  log "Android 에뮬레이터 종료 요청"
else
  # adb로 잡히지 않는 좀비 qemu가 있으면 강제 종료
  if pgrep -f "qemu-system" >/dev/null 2>&1; then
    pkill -f "qemu-system" 2>/dev/null || true
    log "qemu-system 프로세스 강제 종료"
  else
    log "Android 에뮬레이터 실행 안 됨 — 건너뜀"
  fi
fi

# ── 3. 터미널 창 정리 ────────────────────────────────────────
step "3/3  터미널 창 정리"

# 매칭 마커:
#   - 'pnpm dev' (HTTP/HTTPS 둘 다 커버), 'pnpm ios', 'pnpm android' (dev-up.sh가 띄운 탭)
#   - 'Welcome to Metro' (react-native이 자체 spawn한 metro 서버 창)
#   - 'EADDRINUSE' (포트 충돌로 멈춘 창)

# 3-1. Terminal.app:
#   (a) 매칭 탭의 (windowId, tty) 쌍 수집
#   (b) 추가: launchPackager.command 이름 가진 좀비 윈도우 ID도 수집 (탭 0개로 매칭 불가한 케이스 대응)
#   (c) TTY 프로세스(셸 포함) kill
#   (d) 수집한 winId로 직접 close (재매칭 없이)
WIN_TTY_LIST=$(osascript 2>/dev/null <<'OSAEOF' || echo ""
set output to ""
tell application "System Events"
  if not (exists process "Terminal") then return ""
end tell
tell application "Terminal"
  try
    repeat with w in (every window)
      try
        set wId to id of w
        set wName to name of w
        set matched to false
        try
          repeat with t in (tabs of w)
            try
              set h to history of t
              if h contains "pnpm dev" or h contains "pnpm ios" or h contains "pnpm android" or h contains "pnpm start" or h contains "Welcome to Metro" or h contains "EADDRINUSE" then
                set output to output & wId & ":" & (tty of t) & linefeed
                set matched to true
              end if
            end try
          end repeat
        end try
        -- 좀비 윈도우(탭 0개) 또는 launchPackager 이름 매칭 — TTY 없이 close만
        if not matched and wName contains "launchPackager" then
          set output to output & wId & ":" & linefeed
        end if
      end try
    end repeat
  end try
end tell
return output
OSAEOF
)

WIN_IDS_TO_CLOSE=()
if [ -n "$WIN_TTY_LIST" ]; then
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    win_id="${line%%:*}"
    tty_path="${line#*:}"
    WIN_IDS_TO_CLOSE+=("$win_id")
    if [ -n "$tty_path" ]; then
      PIDS=$(lsof -t "$tty_path" 2>/dev/null || true)
      if [ -n "$PIDS" ]; then
        kill -9 $PIDS 2>/dev/null || true
      fi
    fi
  done <<< "$WIN_TTY_LIST"
  sleep 1
fi

TERMINAL_CLOSED=0
if [ ${#WIN_IDS_TO_CLOSE[@]} -gt 0 ]; then
  UNIQUE_IDS=$(printf '%s\n' "${WIN_IDS_TO_CLOSE[@]}" | sort -u)
  while IFS= read -r win_id; do
    [ -z "$win_id" ] && continue
    if osascript -e "tell application \"Terminal\" to close window id $win_id saving no" 2>/dev/null; then
      TERMINAL_CLOSED=$((TERMINAL_CLOSED + 1))
    fi
  done <<< "$UNIQUE_IDS"
fi
log "Terminal.app 창 ${TERMINAL_CLOSED}개 close"

# 3-2. iTerm2: 동일 패턴
if [ -d "/Applications/iTerm.app" ]; then
  ITERM_TTY_LIST=$(osascript 2>/dev/null <<'OSAEOF' || echo ""
set output to ""
tell application "System Events"
  if not (exists process "iTerm2") then return ""
end tell
tell application "iTerm"
  try
    repeat with w in (every window)
      try
        repeat with t in (tabs of w)
          repeat with s in (sessions of t)
            try
              set txt to (contents of s)
              if txt contains "pnpm dev" or txt contains "pnpm ios" or txt contains "pnpm android" or txt contains "pnpm start" or txt contains "Welcome to Metro" or txt contains "EADDRINUSE" then
                set output to output & (tty of s) & linefeed
              end if
            end try
          end repeat
        end repeat
      end try
    end repeat
  end try
end tell
return output
OSAEOF
)
  if [ -n "$ITERM_TTY_LIST" ]; then
    while IFS= read -r tty_path; do
      [ -z "$tty_path" ] && continue
      PIDS=$(lsof -t "$tty_path" 2>/dev/null || true)
      if [ -n "$PIDS" ]; then
        kill -9 $PIDS 2>/dev/null || true
      fi
    done <<< "$ITERM_TTY_LIST"
    sleep 1
  fi

  ITERM_CLOSED=$(osascript 2>/dev/null <<'OSAEOF' || echo 0
set closedCount to 0
tell application "System Events"
  if not (exists process "iTerm2") then return 0
end tell
tell application "iTerm"
  set winList to (every window)
  repeat with w in winList
    set shouldClose to false
    try
      repeat with t in (tabs of w)
        repeat with s in (sessions of t)
          try
            set txt to (contents of s)
            if txt contains "pnpm dev" or txt contains "pnpm ios" or txt contains "pnpm android" or txt contains "pnpm start" or txt contains "Welcome to Metro" or txt contains "EADDRINUSE" then
              set shouldClose to true
              exit repeat
            end if
          end try
        end repeat
        if shouldClose then exit repeat
      end repeat
    end try
    if shouldClose then
      try
        close w
        set closedCount to closedCount + 1
      end try
    end if
  end repeat
end tell
return closedCount
OSAEOF
)
  log "iTerm2 창 ${ITERM_CLOSED}개 닫음"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🧹 리뷰 환경 종료 완료"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
