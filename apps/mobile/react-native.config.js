module.exports = {
  dependencies: {
    // notifee는 Android 포그라운드 알림 표시에만 쓴다. iOS에 링크되면 UNUserNotificationCenter
    // delegate를 RNFB와 서로 가로채서 포그라운드 배너(firebase.json 설정)가 깨질 수 있어 제외한다.
    '@notifee/react-native': {
      platforms: { ios: null },
    },
  },
};
