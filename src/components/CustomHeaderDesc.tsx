import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {colorList, globalStyles} from '../styles/global.styles';
import {CustomHeaderDescTypes} from '../types/CustomHeaderDesc';

export const CustomHeaderDesc = ({
  headerText,
  desc,
  headerStyle,
  descStyle,
}: CustomHeaderDescTypes) => {
  return (
    <View style={styles.container}>
      <Text style={headerStyle ?? styles.heading}>{headerText}</Text>
      <Text style={descStyle ?? styles.desc}>{desc}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  heading: {
    ...globalStyles.text24,
    color: colorList.blue_200,
    textAlign: 'center',
    lineHeight: 29,
  },
  desc: {
    ...globalStyles.text14,
    color: colorList.blue_300,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 12,
    opacity: 0.5,
  },
});
