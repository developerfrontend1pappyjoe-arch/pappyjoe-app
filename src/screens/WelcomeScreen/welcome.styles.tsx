import {StyleSheet} from 'react-native';
import {colorList,} from '../../styles/global.styles';
import { FONTSIZE, } from '../../utils/commonThemes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorList.white,
  },
  welcomeBgImageContainer: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeBgImage: {
    objectFit: 'cover',
  },
  welcomeHead: {
    marginTop: 24,
    marginBottom: 8,
    fontWeight: '700',
    fontSize: FONTSIZE.fs28,
    lineHeight: 32,
    color: colorList.dark,
  },
  welcomeDesc: {
    fontWeight: '700',
    fontSize: FONTSIZE.fs16,
    lineHeight: 16,
    color: colorList.Grey1,
  },
  buttonWrapper: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  loginBtnBg: {
    backgroundColor: colorList.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  loginBtnLabel: {
    textAlign: 'center',
    color: colorList.white,
    fontWeight: '700',
    fontSize: 14,
  },
  registerBtnBg: {
    backgroundColor: colorList.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorList.primary,
  },
  registerBtnLabel: {
    textAlign: 'center',
    color: colorList.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
