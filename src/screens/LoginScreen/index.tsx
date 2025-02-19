import React from "react"
import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import {TextInput} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';

import {useMutation} from '@tanstack/react-query';
import {useToast} from 'react-native-toast-notifications';
import {connect, useDispatch} from 'react-redux';

import {saveLoginDetail} from './services/saveLogin';
import {NavigationList} from '../../routes/NavigationList';
import {isRequiredField, isValidEmail} from '../../utils/commonUtils';
import {Errormessage} from '@components/CustomErrorHandler';

import {styles} from './login.styles';
import {
  LogoImage,
  WhiteTickIcon,
} from '../../assets';
import {ToasterTypes, colorList} from '../../styles/global.styles';
import {addLoginDetails} from '../../redux/actions';
import {CustomLoaderRound} from '@components/CustomLoaderRound';
import {clearStoreData, getStoreData, storeData} from '../../utils/commonUtil';
import {Button} from 'react-native-paper';

const LoginScreen = ({navigation,route:{params}}: any) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const saveLoginDataToStore = (data: any) => dispatch(addLoginDetails(data));

  const {mutate, isLoading} = useMutation({
    mutationFn: saveLoginDetail,
    onSuccess: async (res: any) => {
      toast.show('Successfull...!!!', {
        type: ToasterTypes.success,
      });
      saveLoginDataToStore(res.data.data);
      setTimeout(() => {
        navigation.navigate(NavigationList.homeBottomNav);
      }, 250);
    },
    onError: (err: any) => {
      // console.log('Errrrr', err.response.data.message);
      toast.show(err.response.data.message, {
        type: ToasterTypes.error,
      });
    },
  });

  const [isSecureText, setIsSecureText] = useState(true);
  // const [isFocuz, setIsFocuz] = useState(0);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({username: '', password: ''});

  const validateEmail = (email: string): string | null => {
    if (!email) {
      return "Email is required.";
    }
    if (/\s/.test(email)) {
      return "Email cannot contain spaces.";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format. Please enter a valid email (e.g., example@domain.com).";
    }
    return null; // Valid email, no error message
  };

  const getRememberMeData = async () => {
    const result = await getStoreData('loginData');
    // console.log('loginData', loginData);
    if (result) {
      setIsRememberMe(true);
      setLoginData(result);
    }
  };

  const storeRememberMe = async () => {
    const result = await storeData('loginData', {
      username: loginData?.username,
      password: loginData?.password,
    });
    // console.log('Result for storing ....', result);
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {username: '', password: ''};
    const emailError = validateEmail(loginData.username)
    if (!isValidEmail(loginData.username) || Boolean(emailError)) {
      newErrors.username = emailError || 'Email is required';
      formIsValid = false;
    }

    if (!isRequiredField(loginData.password)) {
      newErrors.password = 'Password is required';
      formIsValid = false;
    }
    setErrors(newErrors);
    return formIsValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      if (isRememberMe) storeRememberMe();
      mutate(loginData);
    }
  };

  const handleOnBlur = (key : keyof typeof errors)=>{
    const errorText = validateEmail(loginData.username)
    if(errorText){
      setErrors(prev=>({
        ...prev,
        [key]:errorText
      }))
    }
  }

const handleRememberPassword = async ()=>{
    if(isRememberMe){
      const result = await getStoreData('loginData');
       if(result){clearStoreData("loginData")}
       setIsRememberMe(false)
    }else{
       setIsRememberMe(true)
    }
}

useEffect(() => {
  getRememberMeData();
  // console.log(params);
}, []);

useEffect(() => {
  // console.log("params---------------------------->",params);
  if(params?.data?.email && params?.data?.password){
     const {email} = params.data
     setLoginData({
      ...loginData,
      username:email,
     })
  }
}, [params]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <StatusBar
        backgroundColor={'#fff'}
        barStyle={'dark-content'}
        showHideTransition={'slide'}
      />
      <View style={styles.container}>
        {isLoading ? (
          <CustomLoaderRound center />
        ) : (
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 20}>
            <View style={styles.imageContainer}>
              <Image source={LogoImage} style={styles.bgImage} />
              <Text style={styles.headerImageHead}>Welcome</Text>
              <Text style={styles.headerImageDesc}>
                Sign in to our application for great experience.
              </Text>
            </View>

            <View style={{flex: 1}}>
              <View>
                <View
                  style={[
                    styles.inputWrapper,
                    // {
                    //   borderColor:
                    //     isFocuz === 1 ? colorList.primary : colorList.Grey1,
                    // },
                  ]}>
                  {/* <View style={styles.inputIconWrapper}>
                    <Image source={MailIcon} style={styles.inputIcon} />
                  </View> */}
                  <TextInput
                    mode="outlined"
                    left={
                      <TextInput.Icon
                        icon={'email-outline'}
                        iconColor={colorList.dark}
                        size={20}
                      />
                    }
                    style={styles.inputs}
                    placeholder="Email Address"
                    placeholderTextColor={colorList.Grey1}
                    keyboardType="email-address"
                    value={loginData.username}
                    onChangeText={text => {
                      setLoginData(prev => ({...prev, username: text}));
                      setErrors({...errors, username: ''});
                    }}
                    // onFocus={() => {handleOnBlur()}}
                    onBlur={() => {handleOnBlur("username")}}
                  />
                </View>
                <Errormessage message={errors.username} />

                <View
                  style={[
                    styles.inputWrapper,
                    // {
                    //   borderColor:
                    //     isFocuz === 2 ? colorList.primary : colorList.Grey1,
                    // },
                  ]}>
                  <TextInput
                    mode="outlined"
                    left={
                      <TextInput.Icon
                        icon={() => (
                          <Icon
                            name={'lock-outline'}
                            size={20}
                            color={colorList.dark}
                          />
                        )}
                        size={20}
                      />
                    }
                    right={
                      <TextInput.Icon
                        onPress={() => setIsSecureText(prev => !prev)}
                        icon={() => (
                          <Icon
                            name={
                              isSecureText ? 'visibility' : 'visibility-off'
                            }
                            size={20}
                            color={colorList.GreyDark1}
                          />
                        )}
                        size={20}
                      />
                    }
                    style={[styles.inputs]}
                    placeholder="Password"
                    placeholderTextColor={colorList.Grey1}
                    value={loginData.password}
                    onChangeText={text => {
                      setLoginData(prev => ({...prev, password: text}));
                      setErrors({...errors, password: ''});
                    }}
                    // onFocus={() => setIsFocuz(2)}
                    // onBlur={() => setIsFocuz(0)}
                    secureTextEntry={isSecureText}
                  />
                  {/* <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}>
                    <TouchableOpacity
                      style={[
                        styles.inputIconWrapper,
                        {
                          padding: 5,
                        },
                      ]}
                      onPress={() => setIsSecureText(prev => !prev)}>
                      <Image source={EyeOpenIcon} style={styles.inputIcon} />
                    </TouchableOpacity>
                  </View> */}
                </View>
                <Errormessage message={errors.password} />
              </View>
              <View style={styles.rememberForgotWrapper}>
                <TouchableOpacity
                  onPress={handleRememberPassword}
                  style={{flexDirection: 'row'}}>
                  {isRememberMe ? (
                    <View style={styles.rememberMeCheckBoxFill}>
                      <Image
                        source={WhiteTickIcon}
                        style={{width: 12, height: 12}}
                      />
                    </View>
                  ) : (
                    <View style={styles.rememberMeCheckBox} />
                  )}
                  <Text style={styles.remberMeText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(NavigationList.forgotPassword)
                  }>
                  <Text style={styles.forgotPassText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.btnWrapper}>
                <Button
                  mode="elevated"
                  buttonColor={colorList.primary}
                  textColor={colorList.white}
                  onPress={handleLogin}>
                  LogIn {''}
                </Button>
              </View>
              <TouchableOpacity
                activeOpacity={0.4}
                onPress={() => navigation.navigate(NavigationList.register)}
                style={styles.registerBtnContainer}>
                <Text style={styles.registerBtnLabel1}>
                  Don't have an account?
                </Text>
                <Text style={styles.registerBtnLabel2}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state: any) => ({
  loginDetails: state.loginData,
});

const mapDispatchToProps = (dispatch: any) => ({
  saveLoginDataToStore: (data: any) => dispatch(addLoginDetails(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
