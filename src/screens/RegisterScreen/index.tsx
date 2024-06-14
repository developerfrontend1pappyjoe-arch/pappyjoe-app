import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {Dropdown, SelectCountry} from 'react-native-element-dropdown';

import {styles} from './register.styles';
import {
  ToasterTypes,
  colorList,
  globalStyles,
} from '../../styles/global.styles';
import {NavigationList} from '../../routes/NavigationList';
import {CustomButton} from '../../components/CustomButton';
import {
  CallIcon,
  EyeOpenIcon,
  LogoImage,
  MailGreyIcon,
  PasswordIcon,
  UkFlag,
  UserIcon,
} from '../../assets';
import {Errormessage} from '../../components/CustomErrorHandler';
import {isValidEmail, isValidPhoneNumber} from '../../utils/commonUtils';
import {useMutation} from '@tanstack/react-query';
import {saveRegisterDetails} from './services/Register.services';
import {useToast} from 'react-native-toast-notifications';
import {CustomLoader} from '../../components/CustomLoader';
import {getCountriesList} from '../../services/getCountriesList';

export const RegisterScreen = ({navigation}: any) => {
  const toast = useToast();

  const getCountryListApi = () => {
    getCountriesList()
      .then(res => {
        console.log('Res Country List', res?.data);
        setCountriesList(res?.data?.country);
      })
      .catch(err => {
        console.log('Errrrr', err);
        setCountriesList([]);
      });
  };
  useEffect(() => {
    getCountryListApi();
  }, []);

  const [isSecureText, setIsSecureText] = useState(true);
  const [countriesList, setCountriesList] = useState([]);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    country: '91',
    phoneNumber: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    country: '',
    phoneNumber: '',
    password: '',
  });

  const {mutate, isLoading, error} = useMutation({
    mutationFn: saveRegisterDetails,
    onSuccess: (res: any) => {
      toast.show('Successfull...!!!', {
        type: ToasterTypes.success,
      });

      setTimeout(() => {
        navigation.navigate(NavigationList.otpVerification, {
          data: registerData,
        });
      }, 1500);
    },
    onError: (err: any) => {
      console.log('Errrrr', err.response.data.message);
      toast.show(err.response.data.message, {
        type: ToasterTypes.error,
      });
    },
  });

  const handleRegister = () => {
    let isValid = true;

    if (registerData?.name?.trim() === '') {
      setErrors(prev => ({...prev, name: 'Name is required'}));
      isValid = false;
    }

    if (registerData?.email?.trim() === '') {
      setErrors(prev => ({...prev, email: 'Email is required'}));
      isValid = false;
    } else if (!isValidEmail(registerData?.email)) {
      setErrors(prev => ({...prev, email: 'Invalid email format'}));
      isValid = false;
    }

    if (!registerData?.country) {
      setErrors(prev => ({...prev, country: '* required'}));
      isValid = false;
    }

    if (registerData?.phoneNumber.trim() === '') {
      setErrors(prev => ({...prev, phoneNumber: 'Phone Number is required'}));
      isValid = false;
    } else if (!isValidPhoneNumber(registerData?.phoneNumber)) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: 'Invalid phone number format',
      }));
      isValid = false;
    }

    if (registerData?.password?.trim() === '') {
      setErrors(prev => ({...prev, password: 'Password is required'}));
      isValid = false;
    }
    if (isValid) {
      const formData = new FormData();
      formData.append('name', registerData?.name);
      formData.append('email', registerData?.email);
      formData.append('country_code', registerData?.country);
      formData.append('mobile', registerData?.phoneNumber);

      console.log('Payloads', formData);
      console.log('Payloads registerData', registerData);

      mutate(formData);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <CustomLoader />
      ) : (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          <ScrollView style={{flex: 1}}>
            <View style={styles.imageContainer}>
              <Image source={LogoImage} style={styles.bgImage} />
              <Text style={styles.headerImageHead}>Get Started</Text>
              <Text style={styles.headerImageDesc}>
                Create your new account
              </Text>
            </View>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <View style={styles.inputMainWrapper}>
                  <View
                    style={[
                      styles.inputWrapper,
                      {marginBottom: !errors?.name ? 12 : 0},
                    ]}>
                    <View style={styles.inputIconWrapper}>
                      <Image source={UserIcon} style={styles.inputIcon} />
                    </View>
                    <TextInput
                      style={styles.inputs}
                      placeholder="Your Name"
                      placeholderTextColor={colorList.Grey1}
                      value={registerData?.name}
                      onChangeText={text => {
                        setRegisterData(prev => ({...prev, name: text}));
                        setErrors({...errors, name: ''});
                      }}
                    />
                  </View>
                  {errors?.name && <Errormessage message={errors?.name} />}
                </View>

                <View style={styles.inputMainWrapper}>
                  <View
                    style={[
                      styles.inputWrapper,
                      {marginBottom: !errors?.email ? 12 : 0},
                    ]}>
                    <View style={styles.inputIconWrapper}>
                      <Image source={MailGreyIcon} style={styles.inputIcon} />
                    </View>
                    <TextInput
                      style={styles.inputs}
                      placeholder="Email Address"
                      placeholderTextColor={colorList.Grey1}
                      value={registerData?.email}
                      onChangeText={text => {
                        setRegisterData(prev => ({...prev, email: text}));
                        setErrors({...errors, email: ''});
                      }}
                      keyboardType="email-address"
                    />
                  </View>
                  {errors?.email && <Errormessage message={errors.email} />}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 1,
                  }}>
                  <View
                    style={[
                      styles.inputMainWrapper,
                      {flex: 3, marginRight: 10},
                    ]}>
                    <View
                      style={[
                        styles.inputWrapper,
                        {marginBottom: !errors?.phoneNumber ? 12 : 0},
                      ]}>
                      <View style={styles.inputIconWrapper}>
                        <Image source={CallIcon} style={styles.inputIcon} />
                      </View>
                      <TextInput
                        style={[styles.inputs, {paddingRight: 15, width: 50}]}
                        placeholder="Code"
                        placeholderTextColor={colorList.Grey1}
                        value={registerData?.country}
                        onChangeText={text => {
                          setRegisterData(prev => ({...prev, country: text}));
                          setErrors({...errors, country: ''});
                        }}
                        keyboardType="phone-pad"
                      />
                    </View>
                    {errors?.country && (
                      <Errormessage message={errors.country} />
                    )}
                  </View>

                  <View style={[styles.inputMainWrapper, {flex: 9}]}>
                    <View
                      style={[
                        styles.inputWrapper,
                        {marginBottom: !errors?.phoneNumber ? 12 : 0},
                      ]}>
                      <View style={styles.inputIconWrapper}>
                        <Image source={CallIcon} style={styles.inputIcon} />
                      </View>
                      <TextInput
                        style={[styles.inputs, {width: '60%'}]}
                        placeholder="Phone Number"
                        placeholderTextColor={colorList.Grey1}
                        value={registerData?.phoneNumber}
                        onChangeText={text => {
                          setRegisterData(prev => ({
                            ...prev,
                            phoneNumber: text,
                          }));
                          setErrors({...errors, phoneNumber: ''});
                        }}
                        keyboardType="phone-pad"
                      />
                    </View>
                    {errors?.phoneNumber && (
                      <Errormessage message={errors.phoneNumber} />
                    )}
                  </View>
                </View>

                <View style={styles.inputMainWrapper}>
                  <View
                    style={[
                      styles.inputWrapper,
                      {marginBottom: !errors?.password ? 12 : 0},
                    ]}>
                    <View style={styles.inputIconWrapper}>
                      <Image source={PasswordIcon} style={styles.inputIcon} />
                    </View>
                    <TextInput
                      style={[styles.inputs, {width: '77%'}]}
                      placeholder="Password"
                      placeholderTextColor={colorList.Grey1}
                      value={registerData.password}
                      onChangeText={text => {
                        setRegisterData(prev => ({...prev, password: text}));
                        setErrors({...errors, password: ''});
                      }}
                      secureTextEntry={isSecureText}
                    />
                    <TouchableOpacity
                      style={styles.inputIconWrapper}
                      onPress={() => setIsSecureText(prev => !prev)}>
                      <Image source={EyeOpenIcon} style={styles.inputIcon} />
                    </TouchableOpacity>
                  </View>
                  {errors?.password && (
                    <Errormessage message={errors.password} />
                  )}
                </View>
              </View>

              <CustomButton
                btnName="Register"
                navigate={handleRegister}
                bgStyles={styles.registerBtnBgStyle}
              />

              <TouchableOpacity
                activeOpacity={0.4}
                onPress={() => navigation.navigate(NavigationList.login)}
                style={styles.registerBtnContainer}>
                <Text style={styles.registerBtnLabel1}>
                  You have already account?
                </Text>
                <Text style={styles.registerBtnLabel2}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};
