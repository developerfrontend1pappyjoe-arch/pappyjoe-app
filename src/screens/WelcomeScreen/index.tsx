import { useEffect, useRef } from "react";
import { Image, Text, View } from "react-native";
import { styles } from "./welcome.styles";
import { CustomButton } from "../../components/CustomButton";
import { NavigationList } from "../../routes/NavigationList";
import { LogoImage } from "../../assets";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/native";

const AUTO_LOGIN_DELAY_MS = 4000;

type WelcomeNav = NativeStackNavigationProp<ParamListBase>;

export const WelcomeScreen = ({ navigation }: { navigation: WelcomeNav }) => {
  const hasNavigated = useRef(false);

  const goToLogin = () => {
    if (hasNavigated.current) {
      return;
    }
    hasNavigated.current = true;
    navigation.replace(NavigationList.login);
  };

  useEffect(() => {
    const timer = setTimeout(goToLogin, AUTO_LOGIN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.welcomeBgImageContainer}>
        <Image source={LogoImage} style={styles.welcomeBgImage} />
        <Text style={styles.welcomeHead}>PappyJoe</Text>
        <Text style={styles.welcomeDesc}>Redefining healthcare.</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton
          btnName={"Log In"}
          bgStyles={styles.loginBtnBg}
          labelStyle={styles.loginBtnLabel}
          navigate={goToLogin}
        />
      </View>
    </View>
  );
};
