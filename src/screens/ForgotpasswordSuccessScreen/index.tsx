import {View, Text, Image, TouchableOpacity} from 'react-native';
import {styles} from './fotgotPasswordSuccess.style';
import {CustomHeaderDesc} from '../../components/CustomHeaderDesc';
import {CustomButton} from '../../components/CustomButton';
import {NavigationList} from '../../routes/NavigationList';

const HeaderImage = require('../../assets/ForgotPasswordSuccessScreen/ForgotPasswordSuccessImage.png');

export const ForgotPasswordSuccesScreen = ({navigation}: any) => {
  const resentEmail = () => {
    return console.log('Resend');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerIamgeContainer}>
        <Image source={HeaderImage} style={styles.headerImage} />
      </View>
      <View style={styles.formContainer}>
        <CustomHeaderDesc
          headerText="New Password Sent"
          desc="Use the new password when logging in we've sent to mail id. please check."
        />

        {/* <TouchableOpacity onPress={resentEmail}>
          <Text style={styles.resendBtn}>Resend</Text>
        </TouchableOpacity> */}
        <View style={{marginVertical: 20}}>
          <CustomButton
            btnName="Back to Login"
            navigate={() => navigation.navigate(NavigationList.login)}
          />
        </View>
      </View>
    </View>
  );
};
