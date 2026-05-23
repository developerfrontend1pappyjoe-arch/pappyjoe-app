import {StyleSheet} from 'react-native';
import {colorList} from '../../../styles/global.styles';

export const headerStyles = StyleSheet.create({
  clinicLabelTextContaine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clinicLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colorList.dark,
  },
  clinicText: {
    fontSize: 11,
    fontWeight: '400',
    color: colorList.Grey1,
    marginTop: 8,
  },
  hrLine: {
    height: 1,
    backgroundColor: colorList.Grey6,
    marginVertical: 16,
  },
});
