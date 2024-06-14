import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';

import {styles} from './forgotPassword.styles';
import {CustomHeaderDesc} from '../../components/CustomHeaderDesc';
import {globalStyles} from '../../styles/global.styles';
import {CustomButton} from '../../components/CustomButton';
import {NavigationList} from '../../routes/NavigationList';
import {isValidEmail} from '../../utils/commonUtils';
import axios from 'axios';
import {API_URL} from '../../utils/constants';
import {CustomLoaderRound} from '../../components/CustomLoaderRound';

const ForgotPasswordHeaderImage = require('../../assets/ForgotPasswordScreen/ForgotPasswordHeaderImage.png');

export const ForgotPasswordScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState({email: '', password: ''});

  const handleResetPasswordApi = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('email', email);
    axios
      .post(API_URL.resetPassword, formData, {
        headers: {
          'Content-Type': 'multipart/form-data; ',
        },
      })
      .then(res => {
        setLoading(false);
        Alert.alert('Success', res?.data?.message, [
          {
            text: 'Ok',
            onPress: () => {
              navigation.navigate(NavigationList.forgotPasswordSuccess);
            },
          },
        ]);
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('Error', err?.response?.data?.message);
      });
  };

  const handleSubmit = () => {
    if (!isValidEmail(email)) {
      setErrors({...errors, email: 'Email id is invalid'});
    } else {
      handleResetPasswordApi();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={ForgotPasswordHeaderImage} style={styles.headerImage} />
      </View>
      <View style={styles.formContainer}>
        <CustomHeaderDesc
          headerText="Forgot Password?"
          desc="Enter the Email Address associated with your account below"
        />

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={text => {
              setEmail(text);
              setErrors({...errors, email: ''});
            }}
          />
        </View>
        <Text style={[globalStyles.errorText, {marginBottom: 10}]}>
          {errors?.email}
        </Text>

        {isLoading ? (
          <CustomLoaderRound />
        ) : (
          <CustomButton
            btnName="Continue"
            navigate={
              () => handleSubmit()
              // navigation.navigate(NavigationList.forgotPasswordSuccess)
            }
          />
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate(NavigationList.login)}>
          <Text style={styles.backToLoginBtn}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
