import React, { useRef } from "react"
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import {colorList} from '../styles/global.styles';
import {NoDataImage} from '../assets';
import LottieView from "lottie-react-native";

export const NoDataAvailable = () => {
  const animation = useRef(null);
  return (
    <View style={styles.container}>
           <Image source={NoDataImage} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: 220,
    height: 220,
    padding:0,
    margin:0,
  },
  text:{
     fontSize:20,
     fontWeight:"bold",
     color:colorList.blue
  }
});
