import {View, Text, Image,} from 'react-native';
import {styles} from './otpSuccess.style';
import {CustomButton} from '../../components/CustomButton';
import {NavigationList} from '../../routes/NavigationList';
import {colorList} from '../../styles/global.styles';
import React, { useEffect } from 'react';
import { Icon } from 'react-native-paper';

const OTPSuccessHeaderImage = require('../../assets/OTPSuccessScreen/OTPSuccessImageHeader.png');

export const OTPSuccesScreen = ({
  navigation,
  route: {
    params: {data},
  },
}: any) => {
  // console.log('params 00000', data);

  // const resentEmail = () => {
  //   return console.log('Resend');
  // };
useEffect(()=>{
  console.log("data-------------------------->",data);
},[data])
  return (
    <View style={styles.container}>
      <View style={styles.headerIamgeContainer}>
        <Image source={OTPSuccessHeaderImage} style={styles.headerImage} />
      </View>
      <View style={styles.formContainer}>
        <View style={styles.headerSection}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headingLabel1}>All Done,</Text>
            <Text style={styles.headingLabel2}>{data?.name || ''}</Text>
          </View>
          <View>
            <Text style={styles.desc1}>Thank you for choosing Pappyjoe!</Text>
            <Text style={styles.desc2}>
              Your journey to a more streamlined and effective medical practice
              begins now.
            </Text>
            <Text style={styles.desc3}>
            Credentials send to <Icon color={colorList.socondary} size={20} source={"email"}/> {data?.email}
            </Text>
          </View>
        </View>
        <View style={styles.btnSession}>
          <CustomButton
            btnName="Login to continue"
            bgColor={colorList.socondary}
            navigate={() => navigation.navigate(NavigationList.login,{data})}
          />
        </View>
      </View>
    </View>
  );
};
