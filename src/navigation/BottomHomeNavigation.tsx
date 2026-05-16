import React, { memo, useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Platform,
  StatusBar,
} from "react-native";
import { TabView, SceneMap, Route } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CustomTabBar } from "../components/CustomBottomNavBar";
import { NavigationList } from "../routes/NavigationList";
import { HomeScreen } from "../screens/HomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import PatientListScreen from "../screens/PatientListScreen";
import BillingPatientList from "../screens/Billing/component/BillingPatientList";
import { colorList } from "../styles/global.styles";
import {
  TAB_HOME_SCREEN_EDGES,
  TAB_SCREEN_HEADER_EDGES,
  withAppSafeArea,
} from "../components/AppSafeArea";

const HomeTabScreen = withAppSafeArea(HomeScreen, TAB_HOME_SCREEN_EDGES);
const PatientListTabScreen = withAppSafeArea(
  PatientListScreen,
  TAB_SCREEN_HEADER_EDGES
);
const BillingListTabScreen = withAppSafeArea(
  BillingPatientList,
  TAB_SCREEN_HEADER_EDGES
);
const ProfileTabScreen = withAppSafeArea(ProfileScreen, TAB_SCREEN_HEADER_EDGES);

const TAB_ROUTES: Route[] = [
  { key: NavigationList.home, title: "Home" },
  { key: NavigationList.patientList, title: "Patient List" },
  { key: NavigationList.billingList, title: "Billing Area" },
  { key: NavigationList.profile, title: "My Profile" },
];

const TAB_BAR_CONTENT_HEIGHT = 68;

const ROUTE_STUBS = {
  home: {
    key: NavigationList.home,
    name: NavigationList.home,
    params: {},
  },
  patientList: {
    key: NavigationList.patientList,
    name: NavigationList.patientList,
    params: {},
  },
  billingList: {
    key: NavigationList.billingList,
    name: NavigationList.billingList,
    params: {},
  },
  profile: {
    key: NavigationList.profile,
    name: NavigationList.profile,
    params: {},
  },
};

const TabScreenHeader = memo(function TabScreenHeader({
  title,
}: {
  title: string;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop:
            Platform.OS === "android"
              ? StatusBar.currentHeight || 0
              : insets.top,
        },
      ]}
    >
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
});

const HomeScene = memo(function HomeScene() {
  const navigation = useNavigation<any>();
  return (
    <HomeTabScreen navigation={navigation} route={ROUTE_STUBS.home} />
  );
});

const PatientListScene = memo(function PatientListScene() {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.scene}>
      <TabScreenHeader title="Patient List" />
      <View style={styles.sceneBody}>
        <PatientListTabScreen
          navigation={navigation}
          route={ROUTE_STUBS.patientList}
        />
      </View>
    </View>
  );
});

const BillingListScene = memo(function BillingListScene() {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.scene}>
      <TabScreenHeader title="Billing Area" />
      <View style={styles.sceneBody}>
        <BillingListTabScreen
          navigation={navigation}
          route={ROUTE_STUBS.billingList}
        />
      </View>
    </View>
  );
});

const ProfileScene = memo(function ProfileScene() {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.scene}>
      <TabScreenHeader title="My Profile" />
      <View style={styles.sceneBody}>
        <ProfileTabScreen navigation={navigation} route={ROUTE_STUBS.profile} />
      </View>
    </View>
  );
});

const renderScene = SceneMap({
  [NavigationList.home]: HomeScene,
  [NavigationList.patientList]: PatientListScene,
  [NavigationList.billingList]: BillingListScene,
  [NavigationList.profile]: ProfileScene,
});

export function BottomHomeNavigation() {
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const rootNavigation = useNavigation<any>();
  const [index, setIndex] = useState(0);

  const handleTabPress = useCallback((nextIndex: number) => {
    setIndex((current) => (current === nextIndex ? current : nextIndex));
  }, []);

  const tabBarBottomSpace = useMemo(
    () => TAB_BAR_CONTENT_HEIGHT + Math.max(insets.bottom, 6),
    [insets.bottom]
  );

  const initialLayout = useMemo(
    () => ({ width: layout.width }),
    [layout.width]
  );

  const navigationState = useMemo(
    () => ({ index, routes: TAB_ROUTES }),
    [index]
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={navigationState}
        renderScene={renderScene}
        onIndexChange={handleTabPress}
        initialLayout={initialLayout}
        renderTabBar={() => null}
        swipeEnabled={false}
        animationEnabled={false}
        lazy={false}
        lazyPreloadDistance={1}
        style={[styles.tabView, { marginBottom: tabBarBottomSpace }]}
      />

      <View style={styles.tabBarContainer} pointerEvents="box-none">
        <CustomTabBar
          activeIndex={index}
          onTabPress={handleTabPress}
          rootNavigation={rootNavigation}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorList.white,
    overflow: "visible",
  },
  tabView: {
    flex: 1,
  },
  tabBarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    overflow: "visible",
    ...Platform.select({
      android: {
        elevation: 20,
      },
    }),
  },
  scene: {
    flex: 1,
    backgroundColor: colorList.white,
  },
  sceneBody: {
    flex: 1,
  },
  header: {
    backgroundColor: colorList.primary,
    paddingBottom: 14,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
    minHeight: 56,
  },
  headerTitle: {
    color: colorList.white,
    fontSize: 17,
    fontWeight: "600",
  },
});
