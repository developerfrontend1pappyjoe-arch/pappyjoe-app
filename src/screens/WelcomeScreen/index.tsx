import {Image, Text, View} from 'react-native';
import {styles} from './welcome.styles';
import {CustomButton} from '../../components/CustomButton';
import {NavigationList} from '../../routes/NavigationList';
import {LogoImage} from '../../assets';
import {NavigationProps} from '../../types/CommonTypes';

export const WelcomeScreen: React.FC<NavigationProps> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.welcomeBgImageContainer}>
        <Image source={LogoImage} style={styles.welcomeBgImage} />
        <Text style={styles.welcomeHead}>PappyJoe</Text>
        <Text style={styles.welcomeDesc}>Redefining healthcare.</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton
          btnName={'Log In'}
          bgStyles={styles.loginBtnBg}
          labelStyle={styles.loginBtnLabel}
          navigate={() => navigation.navigate(NavigationList.login)}
        />
        {/* <CustomButton
          btnName={'Register'}
          bgStyles={styles.registerBtnBg}
          labelStyle={styles.registerBtnLabel}
          navigate={() => navigation.navigate(NavigationList.register)}
        /> */}
      </View>
    </View>
  );
};
