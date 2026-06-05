import { useEffect } from "react";
import { InteractionManager, NativeModules, Platform } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { NavigationList } from "../routes/NavigationList";

/**
 * Play in-app update flow — only on Android 12+ (API 31+).
 * Skipped on Android 11 and below to avoid Play Core / native crashes on older devices.
 */
export const useAppUpdateCheck = (
  navigation: NavigationProp<ParamListBase>
) => {
  useEffect(() => {
    if (Platform.OS !== "android" || Platform.Version < 31) {
      return;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      void (async () => {
        try {
          const { AppInfo } = NativeModules;
          if (!AppInfo?.getVersion || !AppInfo?.getBuildNumber) {
            return;
          }

          const SpInAppUpdates = (
            await import("sp-react-native-in-app-updates")
          ).default;

          const inAppUpdates = new SpInAppUpdates(false);
          const curVersion = await AppInfo.getVersion();
          const code = await AppInfo.getBuildNumber();
          const result = await inAppUpdates.checkNeedsUpdate({
            curVersion,
          });
          const storeVersionCode = (result.other as { versionCode?: string })
            ?.versionCode;

          if (storeVersionCode != code || result.shouldUpdate) {
            navigation.navigate(NavigationList.update);
          }
        } catch {
          // Non-fatal: never block app launch.
        }
      })();
    });

    return () => task.cancel();
  }, [navigation]);
};
