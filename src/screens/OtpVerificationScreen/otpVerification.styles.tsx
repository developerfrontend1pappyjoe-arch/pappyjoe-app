import {StyleSheet} from 'react-native';
import {colorList, globalStyles} from '../../styles/global.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 4.5,
    backgroundColor: colorList.blue_900,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bgImage: {
    objectFit: 'contain',
  },
  formContainer: {
    flex: 7.5,
    paddingHorizontal: 25,
    backgroundColor: colorList.white,
    paddingTop: 20,
  },
  headerText: {
    ...globalStyles.text22,
    lineHeight: 27,
    textAlign: 'center',
    color: colorList.blue_200,
  },
  inputContainer: {
    marginTop: 25,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    ...globalStyles.text14,
    color: colorList.blue_200,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E9F1',
    flex: 1,
    borderRadius: 8,
  },
  termsAndConditionContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    textAlign: 'center',
  },
  termsAndConditionLabel1: {
    ...globalStyles.text14,
    lineHeight: 17,
    color: colorList.blue_200,
    marginHorizontal: 8,
  },
  termsAndConditionLabel2: {
    ...globalStyles.text14,
    lineHeight: 17,
    color: colorList.socondary,
    textDecorationLine: 'underline',
  },

  registerBtnBgStyle: {
    backgroundColor: colorList.socondary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
  },
  LoginBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginLabel1: {
    ...globalStyles.text14,
    lineHeight: 17,
    color: colorList.blue_300,
  },
  loginLabel2: {
    ...globalStyles.text14,
    fontWeight: '500',
    color: colorList.primary,
    lineHeight: 17,
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  resendBtnContainer: {
    marginTop: 10,
  },
  resendBtn: {
    ...globalStyles.text14,
    fontWeight: '500',
    color: colorList.socondary,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginBottom: 15,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  otpInput: {
    borderColor: colorList.blue_300,
    borderRadius: 8,
    color: '#000',
  },
  otpInputHighlighted: {
    color: colorList.blue_900,
  },
});
