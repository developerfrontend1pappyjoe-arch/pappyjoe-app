import { useEffect, useRef } from "react";
import { Image, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "../WelcomeScreen/welcome.styles";
import { LogoImage } from "../../assets";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/native";
import { NavigationList } from "../../routes/NavigationList";
import { handleLoggedInStatus } from "../../redux/actions";
import { useAppUpdateCheck } from "../../hooks/useAppUpdateCheck";

const SPLASH_DELAY_MS = 2000;

type SplashNav = NativeStackNavigationProp<ParamListBase>;

export const SplashScreen = ({
  navigation,
}: {
  navigation: SplashNav;
}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: any) => state.isLoggedIn);
  const token = useSelector(
    (state: any) => state?.loginData?.Authorization_Bearer
  );
  const hasNavigated = useRef(false);

  useAppUpdateCheck(navigation);

  useEffect(() => {
    dispatch(handleLoggedInStatus(!!token));
  }, [token, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasNavigated.current) {
        return;
      }
      hasNavigated.current = true;
      if (isLoggedIn) {
        navigation.replace(NavigationList.homeBottomNav);
      } else {
        navigation.replace(NavigationList.welcome);
      }
    }, SPLASH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isLoggedIn, navigation]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.welcomeBgImageContainer}>
        <Image source={LogoImage} style={styles.welcomeBgImage} />
        <Text style={styles.welcomeHead}>PappyJoe</Text>
        <Text style={styles.welcomeDesc}>Redefining healthcare.</Text>
      </View>
    </View>
  );
};
