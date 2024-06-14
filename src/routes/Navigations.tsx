import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useEffect, useState} from 'react';

import {NavigationList} from './NavigationList';
import LoginScreen from '../screens/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen';
import {WelcomeScreen} from '../screens/WelcomeScreen';
import {ForgotPasswordScreen} from '../screens/ForgotPassword';
import {ForgotPasswordSuccesScreen} from '../screens/ForgotpasswordSuccessScreen';
import {OTPVerificationScreen} from '../screens/OtpVerificationScreen/indx';
import {OTPSuccesScreen} from '../screens/OTPSuccessScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {PatientListScreen} from '../screens/PatientListScreen';
import {CommingSoonScreen} from '../screens/CommingSoonScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {CustomTabBar} from '../components/CustomBottomNavBar';
import {useDispatch, useSelector} from 'react-redux';
import {handleLoggedInStatus} from '../redux/actions';
import {AppoinmentDetails} from '../screens/AppoinmentsDetailsScreen';
import {PatientDetails} from '../screens/PatientDetails';

import {SplashScreen} from '../screens/SplashScreen';
import {AddPatients} from '../screens/AddPatientScreen';
import {AddNewAppoinments} from '../screens/AddAppoinments';

import {ProfileProfile} from '../screens/PatientProfileEdit';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomHomeNavigation = () => {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name={NavigationList.home}
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={NavigationList.patientList}
        component={PatientListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={NavigationList.commingSoon}
        component={CommingSoonScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={NavigationList.profile}
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const AuthCheck = ({navigation}: any) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector<any>(state => state.isLoggedIn);
  const token = useSelector<any>(
    state => state?.loginData?.Authorization_Bearer,
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

  return (
    <Stack.Navigator initialRouteName={NavigationList.splash}>
      <Stack.Screen
        name={NavigationList.splash}
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationList.welcome}
        component={WelcomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationList.login}
        component={LoginScreen}
        options={{headerShown: false, animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name={NavigationList.homeBottomNav}
        component={BottomHomeNavigation}
        options={{headerShown: false, animation: 'slide_from_right'}}
      />
    </Stack.Navigator>
  );
};

export const NavigationContainers = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={NavigationList.auth}>
        <Stack.Screen
          name={NavigationList.auth}
          component={AuthCheck}
          options={{headerShown: false, animation: 'slide_from_right'}}
        />
        <Stack.Screen
          name={NavigationList.register}
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={NavigationList.otpVerification}
          component={OTPVerificationScreen}
          options={{headerShown: false, animation: 'slide_from_right'}}
        />
        <Stack.Screen
          name={NavigationList.otpSuccess}
          component={OTPSuccesScreen}
          options={{headerShown: false, animation: 'slide_from_right'}}
        />
        <Stack.Screen
          name={NavigationList.forgotPassword}
          component={ForgotPasswordScreen}
          options={{headerShown: false, animation: 'slide_from_right'}}
        />
        <Stack.Screen
          name={NavigationList.forgotPasswordSuccess}
          component={ForgotPasswordSuccesScreen}
          options={{headerShown: false, animation: 'slide_from_right'}}
        />
        <Stack.Screen
          name={NavigationList.appoinmentDetails}
          component={AppoinmentDetails}
          options={{headerShown: false, animation: 'slide_from_right'}}
        />
        <Stack.Screen
          name={NavigationList.addpatient}
          component={AddPatients}
          options={{headerShown: false, animation: 'slide_from_right'}}
        />
        <Stack.Screen
          name={NavigationList.patientDetails}
          component={PatientDetails}
          options={{headerShown: false, animation: 'slide_from_right'}}
        />
        <Stack.Screen
          name={NavigationList.bookingAppoinment}
          component={AddNewAppoinments}
          options={{headerShown: false, animation: 'slide_from_right'}}
        />
        <Stack.Screen
          name={NavigationList.patientProfile}
          component={ProfileProfile}
          options={{headerShown: false, animation: 'slide_from_right'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
