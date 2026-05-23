import {StyleSheet} from 'react-native';
import {colorList, FONT_SIZE} from './global.styles';

export const FormStyles = StyleSheet.create({
  label: {
    fontSize: FONT_SIZE.md,
    marginVertical: 10,
    color: colorList.GreyDark1,
  },
  input: {
    fontSize: FONT_SIZE.md,
    height: 40,
  },
});
