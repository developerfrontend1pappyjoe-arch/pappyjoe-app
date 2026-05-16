import React, { memo, useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import MetrialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

import { AddIcon } from "../assets";
import { colorList } from "../styles/global.styles";
import { NavigationList } from "../routes/NavigationList";
import { useModal } from "hooks";
import { assignPatientDetails } from "redux/actions";

const btnIconSize = 23;

const ROUTE_TAB_INDEX: Record<string, number> = {
  [NavigationList.home]: 1,
  [NavigationList.patientList]: 2,
  [NavigationList.billingList]: 3,
  [NavigationList.profile]: 4,
};

const AddAllModal = ({ closeModal, navigate }: any) => {
  return (
    <View
      style={{
        padding: 10,
        borderRadius: 10,
        width: Dimensions.get("screen").width - 20,
        height: Dimensions.get("screen").height * 0.15,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          closeModal();
          navigate(NavigationList.bookingAppoinment);
        }}
        style={{
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colorList.primary,
          marginBottom: 15,
          width: Dimensions.get("screen").width - 60,
        }}
      >
        <Text style={{ fontSize: 18, padding: 10, color: colorList.white }}>
          New Appointment
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          closeModal();
          navigate(NavigationList.addpatient);
        }}
        style={{
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colorList.socondary,
          width: Dimensions.get("screen").width - 60,
        }}
      >
        <Text style={{ fontSize: 18, padding: 10, color: colorList.white }}>
          New Patient
        </Text>
      </TouchableOpacity>
    </View>
  );
};

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
      style={{
        flexDirection: "row",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        justifyContent: "space-evenly",
        paddingTop: 8,
        paddingBottom: Math.max(insets.bottom, 8),
      }}
    >
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.wrapper}
        onPress={() => navigateToTab(NavigationList.home)}
      >
        <MetrialIcon
          style={{ margin: 0, padding: 0 }}
          name={activeTabIndex === 1 ? "home-variant" : "home-variant-outline"}
          size={btnIconSize + 1}
          color={activeTabIndex === 1 ? colorList.primary : colorList.Grey1}
        />
        <Text
          style={[
            styles.labelStyle,
            activeTabIndex === 1 && { color: colorList.primary },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        style={styles.wrapper}
        onPress={() => navigateToTab(NavigationList.patientList)}
      >
        <MetrialIcon
          style={{ margin: 0, padding: 0 }}
          name={
            activeTabIndex === 2 ? "clipboard-text" : "clipboard-text-outline"
          }
          color={activeTabIndex === 2 ? colorList.primary : colorList.Grey1}
          size={btnIconSize}
        />
        <Text
          style={[
            styles.labelStyle,
            activeTabIndex === 2 && { color: colorList.primary },
          ]}
        >
          Patient List
        </Text>
      </TouchableOpacity>

      <View style={styles.wrapper}>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.customAddButtonWrapper}
          onPress={openModal}
        >
          <Image source={AddIcon} style={styles.customAddButton} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        style={styles.wrapper}
        onPress={() => navigateToTab(NavigationList.billingList)}
      >
        <IonIcon
          style={{ margin: 0, padding: 0 }}
          name={activeTabIndex === 3 ? "receipt" : "receipt-outline"}
          color={activeTabIndex === 3 ? colorList.primary : colorList.Grey1}
          size={btnIconSize - 1}
        />
        <Text
          style={[
            styles.labelStyle,
            activeTabIndex === 3 && { color: colorList.primary },
          ]}
        >
          Billing
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        style={styles.wrapper}
        onPress={() => navigateToTab(NavigationList.profile)}
      >
        <IonIcon
          style={{ margin: 0, padding: 0 }}
          name={
            activeTabIndex === 4
              ? "person-circle-sharp"
              : "person-circle-outline"
          }
          color={activeTabIndex === 4 ? colorList.primary : colorList.Grey1}
          size={btnIconSize + 3}
        />
        <Text
          style={[
            styles.labelStyle,
            activeTabIndex === 4 && { color: colorList.primary },
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>

      <CustomModal
        title="Add"
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
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    flex: 1,
    display: "flex",
  },
  customAddButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colorList.socondary,
    borderRadius: 10,
    width: 50,
    height: 50,
    position: "relative",
    top: -30,
  },
  customAddButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  labelStyle: {
    fontSize: 10,
    fontWeight: "500",
    lineHeight: 9,
    marginTop: 4,
    color: colorList.Grey1,
    paddingTop: 3,
  },
});
