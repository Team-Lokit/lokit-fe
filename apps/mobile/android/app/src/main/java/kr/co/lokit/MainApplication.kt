package kr.co.lokit

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    createDefaultNotificationChannel()
  }

  // channel_id 없이 오는 FCM notification 메시지가 이 채널(IMPORTANCE_HIGH)로 떨어져야
  // 카톡/인스타처럼 heads-up 배너로 뜬다. IMPORTANCE_DEFAULT(기본값)면 알림함에만 조용히 쌓인다.
  private fun createDefaultNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

    val channel =
      NotificationChannel(
        getString(R.string.default_notification_channel_id),
        "기본 알림",
        NotificationManager.IMPORTANCE_HIGH,
      )
    val notificationManager = getSystemService(NotificationManager::class.java)
    notificationManager.createNotificationChannel(channel)
  }
}
