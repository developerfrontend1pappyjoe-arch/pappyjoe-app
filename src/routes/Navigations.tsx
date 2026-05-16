import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { navigationRef } from "../navigation/navigationRef";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import React, {
  FC,
  PropsWithChildren,
  ReactNode,
  Suspense,
  useEffect,
} from "react";
import { NavigationList } from "./NavigationList";
import LoginScreen from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPassword";
import { ForgotPasswordSuccesScreen } from "../screens/ForgotpasswordSuccessScreen";
import { OTPVerificationScreen } from "../screens/OtpVerificationScreen/indx";
import { OTPSuccesScreen } from "../screens/OTPSuccessScreen";
import { HomeScreen } from "../screens/HomeScreen";
// import { CommingSoonScreen } from "../screens/CommingSoonScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { CustomTabBar } from "../components/CustomBottomNavBar";
import { useDispatch, useSelector } from "react-redux";
import { handleLoggedInStatus } from "../redux/actions";
import { AppoinmentDetails } from "../screens/AppoinmentsDetailsScreen";
import { PatientDetails } from "../screens/PatientDetails";
import { SplashScreen } from "../screens/SplashScreen";
import { AddPatients } from "../screens/AddPatientScreen";
import { AddNewAppoinments } from "../screens/AddAppoinments";
import { PatientProfilePhoto } from "../screens/PatientProfileEdit";
import UpdateScreen from "components/UpdateScreen";
import SpInAppUpdates, {
  AndroidInAppUpdateExtras,
} from "sp-react-native-in-app-updates";
import { Platform, Text, View, Dimensions } from "react-native";
import { NativeModules } from "react-native";
import Billing from "screens/Billing";
import { colorList } from "styles/global.styles";
import BillingPatientList from "screens/Billing/component/BillingPatientList";
import PatientListScreen from "../screens/PatientListScreen";
import AddInvoice from "screens/Billing/Invoice/components/AddInvoice";
import {
  HEADER_SAFE_AREA_EDGES,
  TAB_HOME_SCREEN_EDGES,
  TAB_SCREEN_HEADER_EDGES,
  withAppSafeArea,
} from "../components/AppSafeArea";
const inAppUpdates = new SpInAppUpdates(false);
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

const tabHeaderOptions = {
  headerShown: true,
  headerTintColor: colorList.white,
  headerStyle: {
    backgroundColor: colorList.primary,
  },
};

const renderCustomTabBar = (props: BottomTabBarProps) => (
  <CustomTabBar {...props} />
);

const BottomHomeNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName={NavigationList.home}
      tabBar={renderCustomTabBar}
      screenOptions={{
        lazy: true,
        freezeOnBlur: true,
        headerTitleAlign: "center",
      }}
    >
      <Tab.Screen
        name={NavigationList.home}
        component={HomeTabScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={NavigationList.patientList}
        component={PatientListTabScreen}
        options={{
          ...tabHeaderOptions,
          title: "Patient List",
        }}
      />
      <Tab.Screen
        name={NavigationList.billingList}
        component={BillingListTabScreen}
        options={{
          ...tabHeaderOptions,
          title: "Billing Area",
        }}
      />
      <Tab.Screen
        name={NavigationList.profile}
        component={ProfileTabScreen}
        options={{
          ...tabHeaderOptions,
          title: "My Profile",
        }}
      />
    </Tab.Navigator>
  );
};

const AuthCheck = ({ navigation }: any) => {
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
        .catch((e) => {
          console.log("Error in update check 1");
        });
    } catch (error) {
      console.log("Error in update check 2");
    }
  };

  const dispatch = useDispatch();
  const isLoggedIn = useSelector<any>((state) => state.isLoggedIn);
  const token = useSelector<any>(
    (state) => state?.loginData?.Authorization_Bearer
  );

  useEffect(() => {
    if (token) {
      dispatch(handleLoggedInStatus(true));
    } else {
      dispatch(handleLoggedInStatus(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate(NavigationList.homeBottomNav);
    } else {
      navigation.navigate(NavigationList.login);
    }
  }, [isLoggedIn, navigation]);

  useEffect(() => {
    checkUpdate();
  }, []);
  return (
    <Stack.Navigator initialRouteName={NavigationList.splash}>
      <Stack.Screen
        name={NavigationList.splash}
        component={withAppSafeArea(SplashScreen)}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationList.welcome}
        component={withAppSafeArea(WelcomeScreen)}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationList.login}
        component={withAppSafeArea(LoginScreen)}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name={NavigationList.homeBottomNav}
        component={BottomHomeNavigation}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
};

export const NavigationContainers = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={NavigationList.auth}>
        <Stack.Screen
          name={NavigationList.auth}
          component={AuthCheck}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name={NavigationList.register}
          component={withAppSafeArea(RegisterScreen)}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationList.otpVerification}
          component={withAppSafeArea(OTPVerificationScreen)}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name={NavigationList.otpSuccess}
          component={withAppSafeArea(OTPSuccesScreen)}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name={NavigationList.forgotPassword}
          component={withAppSafeArea(ForgotPasswordScreen)}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name={NavigationList.forgotPasswordSuccess}
          component={withAppSafeArea(ForgotPasswordSuccesScreen)}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name={NavigationList.appoinmentDetails}
          component={withAppSafeArea(AppoinmentDetails)}
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name={NavigationList.addpatient}
          component={withAppSafeArea(AddPatients)}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name={NavigationList.patientDetails}
          component={withAppSafeArea(PatientDetails)}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name={NavigationList.bookingAppoinment}
          component={withAppSafeArea(AddNewAppoinments)}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name={NavigationList.patientProfilePhoto}
          component={withAppSafeArea(PatientProfilePhoto)}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name={NavigationList.patientEdit}
          component={withAppSafeArea(AddPatients)}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name={NavigationList.billing}
          component={withAppSafeArea(Billing, HEADER_SAFE_AREA_EDGES)}
          options={{
            title: "Billing",
            headerShown: true,
            headerTintColor: colorList.white,
            headerStyle: {
              backgroundColor: colorList.primary,
            },
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name={NavigationList.addInvoice}
          component={withAppSafeArea(AddInvoice, HEADER_SAFE_AREA_EDGES)}
          options={{
            title: "Add invoice",
            headerShown: true,
            headerTintColor: colorList.white,
            headerStyle: {
              backgroundColor: colorList.primary,
            },
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name={NavigationList.update}
          component={withAppSafeArea(UpdateScreen)}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
