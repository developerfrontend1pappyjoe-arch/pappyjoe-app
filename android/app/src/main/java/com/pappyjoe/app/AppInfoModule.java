package com.pappyjoe.app;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class AppInfoModule extends ReactContextBaseJavaModule {

  public AppInfoModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "AppInfo";
  }

  @ReactMethod
  public void getVersion(Promise promise) {
    try {
      String version = getCurrentActivity().getPackageManager().getPackageInfo(getCurrentActivity().getPackageName(), 0).versionName;
      promise.resolve(version);
    } catch (Exception e) {
      promise.reject("Error", e);
    }
  }

  @ReactMethod
  public void getBuildNumber(Promise promise) {
    try {
      int buildNumber = getCurrentActivity().getPackageManager().getPackageInfo(getCurrentActivity().getPackageName(), 0).versionCode;
      promise.resolve(Integer.toString(buildNumber));
    } catch (Exception e) {
      promise.reject("Error", e);
    }
  }
}
