import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "../navigation/navigationRef";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { NavigationList } from "./NavigationList";
import LoginScreen from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPassword";
import { ForgotPasswordSuccesScreen } from "../screens/ForgotpasswordSuccessScreen";
import { OTPVerificationScreen } from "../screens/OtpVerificationScreen/indx";
import { OTPSuccesScreen } from "../screens/OTPSuccessScreen";
import { BottomHomeNavigation } from "../navigation/BottomHomeNavigation";
import { AppoinmentDetails } from "../screens/AppoinmentsDetailsScreen";
import { PatientDetails } from "../screens/PatientDetails";
import { SplashScreen } from "../screens/SplashScreen";
import { AddPatients } from "../screens/AddPatientScreen";
import { AddNewAppoinments } from "../screens/AddAppoinments";
import { PatientProfilePhoto } from "../screens/PatientProfileEdit";
import UpdateScreen from "components/UpdateScreen";
import Billing from "screens/Billing";
import { colorList } from "styles/global.styles";
import AddInvoice from "screens/Billing/Invoice/components/AddInvoice";
import {
  HEADER_SAFE_AREA_EDGES,
  withAppSafeArea,
} from "../components/AppSafeArea";

const Stack = createNativeStackNavigator();

export const NavigationContainers = () => {
  return (
    <NavigationContainer ref={navigationRef}>
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
