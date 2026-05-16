import React, { memo, useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import MetrialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

import { colorList } from "../styles/global.styles";
import { NavigationList } from "../routes/NavigationList";
import { useModal } from "hooks";
import { assignPatientDetails } from "redux/actions";

const ICON_SIZE = 24;
const FAB_SIZE = 52;
const FAB_ICON_SIZE = 28;
const NOTCH_WIDTH = FAB_SIZE + 28;

const ROUTE_TAB_INDEX: Record<string, number> = {
  [NavigationList.home]: 1,
  [NavigationList.patientList]: 2,
  [NavigationList.billingList]: 3,
  [NavigationList.profile]: 4,
};

type TabConfig = {
  routeName: string;
  tabIndex: number;
  label: string;
  type: "material" | "ion";
  iconActive: string;
  iconInactive: string;
};

const LEFT_TABS: TabConfig[] = [
  {
    routeName: NavigationList.home,
    tabIndex: 1,
    label: "Home",
    type: "material",
    iconActive: "home-variant",
    iconInactive: "home-variant-outline",
  },
  {
    routeName: NavigationList.patientList,
    tabIndex: 2,
    label: "Patients",
    type: "material",
    iconActive: "clipboard-account",
    iconInactive: "clipboard-account-outline",
  },
];

const RIGHT_TABS: TabConfig[] = [
  {
    routeName: NavigationList.billingList,
    tabIndex: 3,
    label: "Billing",
    type: "ion",
    iconActive: "receipt",
    iconInactive: "receipt-outline",
  },
  {
    routeName: NavigationList.profile,
    tabIndex: 4,
    label: "Profile",
    type: "ion",
    iconActive: "person-circle",
    iconInactive: "person-circle-outline",
  },
];

const AddAllModal = ({ closeModal, navigate }: any) => {
  return (
    <View style={modalStyles.container}>
      <Pressable
        style={({ pressed }) => [
          modalStyles.actionBtn,
          modalStyles.primaryBtn,
          pressed && modalStyles.pressed,
        ]}
        onPress={() => {
          closeModal();
          navigate(NavigationList.bookingAppoinment);
        }}
      >
        <MetrialIcon name="calendar-plus" size={22} color={colorList.white} />
        <Text style={modalStyles.actionText}>New Appointment</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          modalStyles.actionBtn,
          modalStyles.secondaryBtn,
          pressed && modalStyles.pressed,
        ]}
        onPress={() => {
          closeModal();
          navigate(NavigationList.addpatient);
        }}
      >
        <MetrialIcon name="account-plus" size={22} color={colorList.white} />
        <Text style={modalStyles.actionText}>New Patient</Text>
      </Pressable>
    </View>
  );
};

type TabItemProps = {
  config: TabConfig;
  isActive: boolean;
  onPress: () => void;
};

const TabItem = memo(function TabItem({
  config,
  isActive,
  onPress,
}: TabItemProps) {
  const iconColor = isActive ? colorList.primary : colorList.Grey1;
  const iconName = isActive ? config.iconActive : config.iconInactive;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabItem,
        pressed && styles.tabItemPressed,
      ]}
    >
      {config.type === "material" ? (
        <MetrialIcon name={iconName} size={ICON_SIZE} color={iconColor} />
      ) : (
        <IonIcon name={iconName} size={ICON_SIZE} color={iconColor} />
      )}
      <Text
        style={[styles.tabLabel, isActive && styles.tabLabelActive]}
        numberOfLines={1}
      >
        {config.label}
      </Text>
      {isActive && <View style={styles.activeDot} />}
    </Pressable>
  );
});

export const CustomTabBar = memo(function CustomTabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { CustomModal } = useModal();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  const activeTabIndex =
    ROUTE_TAB_INDEX[state.routes[state.index]?.name ?? ""] ?? 1;

  const navigateToTab = useCallback(
    (routeName: string) => {
      const routeIndex = state.routes.findIndex((r) => r.name === routeName);
      if (routeIndex < 0) {
        return;
      }

      const route = state.routes[routeIndex];
      const isFocused = state.index === routeIndex;

      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    },
    [navigation, state.index, state.routes]
  );

  const openModal = () => {
    dispatch(assignPatientDetails(null));
    setIsModalVisible(true);
  };
  const closeModal = () => setIsModalVisible(false);
  const rootNavigation = navigation.getParent() ?? navigation;

  return (
    <View
      style={[
        styles.outer,
        { paddingBottom: Math.max(insets.bottom, 6) },
      ]}
    >
      <View style={styles.barShadow}>
        <View style={styles.bar}>
          <View style={styles.notchBridge} />
          <View style={styles.notchCurve} />

          <View style={styles.tabsRow}>
            <View style={styles.sideTabs}>
              {LEFT_TABS.map((tab) => (
                <TabItem
                  key={tab.routeName}
                  config={tab}
                  isActive={activeTabIndex === tab.tabIndex}
                  onPress={() => navigateToTab(tab.routeName)}
                />
              ))}
            </View>

            <View style={styles.fabSlot} pointerEvents="box-none">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Quick add"
                onPress={openModal}
                style={({ pressed }) => [
                  styles.fab,
                  pressed && styles.fabPressed,
                ]}
              >
                <MetrialIcon
                  name="plus"
                  size={FAB_ICON_SIZE}
                  color={colorList.white}
                />
              </Pressable>
            </View>

            <View style={styles.sideTabs}>
              {RIGHT_TABS.map((tab) => (
                <TabItem
                  key={tab.routeName}
                  config={tab}
                  isActive={activeTabIndex === tab.tabIndex}
                  onPress={() => navigateToTab(tab.routeName)}
                />
              ))}
            </View>
          </View>
        </View>
      </View>

      <CustomModal
        title="Quick actions"
        open={isModalVisible}
        handleCloseModal={closeModal}
      >
        <AddAllModal
          closeModal={closeModal}
          navigate={rootNavigation.navigate}
        />
      </CustomModal>
    </View>
  );
});

const styles = StyleSheet.create({
  outer: {
    width: "100%",
    backgroundColor: colorList.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colorList.Grey6,
    ...Platform.select({
      ios: {
        shadowColor: colorList.dark,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  barShadow: {
    width: "100%",
    backgroundColor: colorList.white,
  },
  bar: {
    width: "100%",
    backgroundColor: colorList.white,
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 8,
    overflow: "visible",
  },
  notchBridge: {
    position: "absolute",
    top: -1,
    alignSelf: "center",
    width: NOTCH_WIDTH,
    height: FAB_SIZE / 2 + 6,
    backgroundColor: colorList.white,
    borderTopLeftRadius: NOTCH_WIDTH / 2,
    borderTopRightRadius: NOTCH_WIDTH / 2,
    zIndex: 1,
  },
  notchCurve: {
    position: "absolute",
    top: FAB_SIZE / 2 - 2,
    alignSelf: "center",
    width: NOTCH_WIDTH - 8,
    height: 12,
    backgroundColor: colorList.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 1,
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
  },
  sideTabs: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    paddingVertical: 2,
  },
  tabItemPressed: {
    opacity: 0.7,
  },
  tabLabel: {
    fontSize: 8,
    fontWeight: "500",
    color: colorList.Grey1,
    marginTop: 2,
    textAlign: "center",
  },
  tabLabelActive: {
    color: colorList.primary,
    fontWeight: "600",
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colorList.primary,
    marginTop: 3,
  },
  fabSlot: {
    width: NOTCH_WIDTH,
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: -(FAB_SIZE / 2) - 4,
    paddingBottom: 2,
    zIndex: 10,
  },
  fabLabel: {
    fontSize: 7,
    fontWeight: "500",
    color: colorList.Grey1,
    marginTop: 3,
    textAlign: "center",
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: colorList.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colorList.white,
    ...Platform.select({
      ios: {
        shadowColor: colorList.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  fabPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.92,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 12,
    width: Dimensions.get("screen").width - 24,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  primaryBtn: {
    backgroundColor: colorList.primary,
  },
  secondaryBtn: {
    backgroundColor: colorList.socondary,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: colorList.white,
  },
  pressed: {
    opacity: 0.88,
  },
});
