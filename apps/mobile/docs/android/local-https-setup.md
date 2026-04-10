# Android 에뮬레이터 로컬 HTTPS 개발 환경 설정

로컬 웹 서버(`https://local.lokit.co.kr:3000`)를 Android 에뮬레이터 웹뷰에서 접속하기 위한 설정 가이드입니다.

## 사전 준비

- [iOS 인증서 설정](https://limgabi.notion.site/iOS-33e874d2cec98017a35ac3454300ecb9) 완료 (mkcert 설치 및 인증서 생성)

## 1. 에뮬레이터 생성

`/etc/hosts` 수정을 위해 root 권한이 필요합니다. **Google Play가 아닌 Google APIs** 이미지로 에뮬레이터를 생성해야 합니다.

Android Studio에서:

1. **Tools > Device Manager > Create Device**
2. 기기 선택 (예: Pixel 6)
3. 시스템 이미지에서 **"Google APIs"** 선택 (Google Play가 아닌 것)
4. API 30 (Android 11) 권장

> Google Play 이미지는 보안이 잠겨있어 root가 불가합니다.

## 2. 에뮬레이터 hosts 등록

에뮬레이터를 `-writable-system` 옵션으로 부팅한 뒤, 도메인을 등록합니다.

```bash
# 에뮬레이터 부팅
emulator -avd <AVD_NAME> -writable-system

# root 활성화 및 시스템 마운트
adb root
adb remount

# 리부팅이 필요하다고 나오면
adb reboot
adb root
adb remount

# hosts에 도메인 추가
adb shell "echo '10.0.2.2 local.lokit.co.kr' >> /etc/hosts"

# 확인
adb shell "cat /etc/hosts"
```

> `10.0.2.2`는 에뮬레이터에서 호스트 머신의 localhost를 가리키는 특수 IP입니다.

## 3. mkcert 루트 CA를 앱에 복사

iOS 시뮬레이터는 설정에서 인증서를 직접 설치하고 신뢰를 켤 수 있지만, Android 에뮬레이터는 환경에 따라 인증서 설치 메뉴가 없는 경우가 있어서, 앱의 디버그 빌드에 인증서를 직접 포함시키는 방식을 사용합니다.

아래 파일에서 디버그 빌드가 mkcert 인증서를 신뢰하도록 설정되어 있습니다.

- 네트워크 보안 설정: [`android/app/src/debug/res/xml/network_security_config.xml`](../../android/app/src/debug/res/xml/network_security_config.xml)
- 디버그 매니페스트: [`android/app/src/debug/AndroidManifest.xml`](../../android/app/src/debug/AndroidManifest.xml)

각 팀원은 자신의 mkcert 루트 CA를 아래 경로에 복사하면 됩니다.

```bash
cp "$(mkcert -CAROOT)/rootCA.pem" apps/mobile/android/app/src/debug/res/raw/mkcert_ca.pem
```

> 이 파일은 `.gitignore`에 포함되어 있으므로 각자 복사해야 합니다.

## 4. 빌드 및 확인

```bash
# Metro 서버 (터미널 1)
pnpm start

# 웹 서버 (터미널 2)
cd apps/web && pnpm dev:https

# Android 빌드 (터미널 3)
pnpm android
```
