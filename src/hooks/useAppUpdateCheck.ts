import { useEffect } from "react";
import { NativeModules, Platform } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import SpInAppUpdates, {
  AndroidInAppUpdateExtras,
} from "sp-react-native-in-app-updates";
import { NavigationList } from "../routes/NavigationList";

const inAppUpdates = new SpInAppUpdates(false);

export const useAppUpdateCheck = (
  navigation: NavigationProp<ParamListBase>
) => {
  useEffect(() => {
    const { AppInfo } = NativeModules;
    const checkUpdate = async () => {
      try {
        const curVersion = await AppInfo.getVersion();
        const code = await AppInfo.getBuildNumber();
        inAppUpdates
          .checkNeedsUpdate({ curVersion: curVersion })
          .then((result) => {
            if (
              (result.other as AndroidInAppUpdateExtras).versionCode != code ||
              result.shouldUpdate
            ) {
              if (Platform.OS === "android") {
                navigation.navigate(NavigationList.update);
              }
            }
          })
          .catch(() => {
            console.log("Error in update check 1");
          });
      } catch {
        console.log("Error in update check 2");
      }
    };
    checkUpdate();
  }, [navigation]);
};
