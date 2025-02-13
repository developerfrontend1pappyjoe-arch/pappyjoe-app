import React, { useRef } from "react"
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import {colorList} from '../styles/global.styles';
import {NoDataImage} from '../assets';
import LottieView from "lottie-react-native";

export const NoDataAvailable = () => {
  const animation = useRef(null);
  return (
    <View style={styles.container}>
       <LottieView
             autoPlay
             ref={animation}
             style={styles.animation}
             source={require('../assets/lottie_files/empty_data.json')}
           />
           <Text style={styles.text}>No data</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  animation: {
    width: 200,
    height: 200,
    padding:0,
    margin:0,
  },
  text:{
     fontSize:20,
     fontWeight:"bold"
  }
});
