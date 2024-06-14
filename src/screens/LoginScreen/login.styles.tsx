import {StyleSheet} from 'react-native';
import {colorList, globalStyles} from '../../styles/global.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    objectFit: 'contain',
  },
  headerImageHead: {
    fontSize: 24,
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '700',
    color: colorList.dark,
    marginTop: 22,
    marginBottom: 8,
  },
  headerImageDesc: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '400',
    color: colorList.Grey1,
  },

  formContainer: {
    flex: 1,
    paddingTop: 32,
  },

  inputWrapper: {
    // borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 12,
    height: 50,
  },
  inputIconWrapper: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  inputIcon: {
    width: 19,
    height: 19,
    resizeMode: 'contain',
  },
  inputs: {
    fontSize: 14,
    lineHeight: 15,
    fontWeight: '500',
    color: colorList.dark,
    borderWidth: 0,
    width: '100%',
  },
  rememberForgotWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rememberMeCheckBoxFill: {
    width: 20,
    height: 20,
    backgroundColor: colorList.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberMeCheckBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colorList.Grey1,
    borderRadius: 4,
  },
  remberMeText: {marginLeft: 8, color: colorList.Grey1},
  forgotPassText: {
    color: colorList.primary,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 15,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  btnWrapper: {
    marginTop: 40,
  },

  registerBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  registerBtnLabel1: {
    fontSize: 16,
    fontWeight: '500',
    color: colorList.Grey2,
    lineHeight: 17,
  },
  registerBtnLabel2: {
    fontSize: 17,
    fontWeight: '700',
    color: colorList.dark,
    lineHeight: 17,
    marginLeft: 6,
  },
  socialMediaContainer: {
    flex: 1,
  },
});
