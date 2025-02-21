import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colorList } from "../styles/global.styles";
import LottieView from "lottie-react-native";
export const CustomLoaderRound = ({ center, color=colorList.primary }: any) => {
   const animation = useRef(null);
  return (
  <View style={styles.container}>
    <LottieView
      autoPlay
      ref={animation}
      style={[styles.animation]}
      source={require("../assets/lottie_files/pre-loader.json")}
    />
  </View>
);}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  animation: {
    width: 400,
    height: 400,
  },
});
