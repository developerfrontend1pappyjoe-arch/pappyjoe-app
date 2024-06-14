import {Image, View, Text} from 'react-native';
import {styles} from '../WelcomeScreen/welcome.styles';
import {LogoImage} from '../../assets';

export const SplashScreen = () => {
  return (
    <View style={{flex: 1}}>
      <View style={styles.welcomeBgImageContainer}>
        <Image source={LogoImage} style={styles.welcomeBgImage} />
        <Text style={styles.welcomeHead}>PappyJoe</Text>
        <Text style={styles.welcomeDesc}>Redefining healthcare.</Text>
      </View>
    </View>
  );
};
