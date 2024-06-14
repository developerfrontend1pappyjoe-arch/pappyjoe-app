import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {CustomButtonTypes} from '../types/CustomButton';
import {colorList} from '../styles/global.styles';

export const CustomButton = ({
  btnName,
  bgColor,
  bgStyles,
  labelStyle,
  navigate,
  borderStyle,
}: CustomButtonTypes) => {
  return (
    <TouchableOpacity
      activeOpacity={0.4}
      onPress={navigate}
      style={
        bgStyles
          ? bgStyles
          : bgColor
            ? [styles.container, {backgroundColor: bgColor}]
            : [styles.container, borderStyle && {borderStyle}]
      }>
      <Text style={labelStyle ?? styles.text}>{btnName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorList.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  text: {
    textAlign: 'center',
    color: colorList.white,
    fontWeight: '700',
  },
});
