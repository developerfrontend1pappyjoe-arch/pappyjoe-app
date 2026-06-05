package com.pappyjoe.app;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AppInfoModule extends ReactContextBaseJavaModule {

  public AppInfoModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "AppInfo";
  }

  private PackageInfo getPackageInfo() throws PackageManager.NameNotFoundException {
    ReactApplicationContext context = getReactApplicationContext();
    PackageManager packageManager = context.getPackageManager();
    String packageName = context.getPackageName();

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      return packageManager.getPackageInfo(
          packageName,
          PackageManager.PackageInfoFlags.of(0));
    }
    return packageManager.getPackageInfo(packageName, 0);
  }

  @ReactMethod
  public void getVersion(Promise promise) {
    try {
      promise.resolve(getPackageInfo().versionName);
    } catch (Exception e) {
      promise.reject("APP_INFO_ERROR", e);
    }
  }

  @ReactMethod
  public void getBuildNumber(Promise promise) {
    try {
      PackageInfo packageInfo = getPackageInfo();
      long buildNumber =
          Build.VERSION.SDK_INT >= Build.VERSION_CODES.P
              ? packageInfo.getLongVersionCode()
              : packageInfo.versionCode;
      promise.resolve(Long.toString(buildNumber));
    } catch (Exception e) {
      promise.reject("APP_INFO_ERROR", e);
    }
  }
}
