import {StyleSheet} from 'react-native';
import {colorList, globalStyles} from '../../styles/global.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorList.white,
  },
  imageContainer: {
    flex: 4,
    backgroundColor: colorList.white,
    justifyContent: 'flex-end',
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
    flex: 8,
    paddingHorizontal: 20,
    backgroundColor: colorList.white,
    paddingTop: 30,
  },
  inputMainWrapper: {
    flexDirection: 'column',
  },
  inputWrapper: {
    borderColor: '#919199',
    borderWidth: 0.5,
    flexDirection: 'row',
    borderRadius: 12,
    height: 48,
  },
  inputIconWrapper: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  inputIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  inputs: {
    fontSize: 14,
    lineHeight: 15,
    fontWeight: '500',
    color: colorList.dark,
    borderWidth: 0,
    width: '85%',
  },
  inputContainer: {
    marginTop: 25,
  },
  registerBtnBgStyle: {
    backgroundColor: colorList.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
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
  dropdownWrapper: {
    height: 48,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dropdownImage: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  dropdownIconStyle: {
    width: 20,
    height: 20,
  },

  label: {
    fontSize: 16,
    marginVertical: 5,
    color: colorList.Black,
  },
  input: {
    height: 40,
    borderColor: colorList.Grey4,
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: colorList.Black,
    fontSize: 14,
    lineHeight: 15,
    fontWeight: '500',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 5,
  },
  fieldContainer: {
    marginBottom: 0,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  dropdown: {
    height: 48,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
    fontSize: 14,
    color: colorList.Grey2,
  },
  placeholderStyle: {
    fontSize: 14,
    color: colorList.Grey1,
    lineHeight: 15,
    fontWeight: '500',
  },
  selectedTextStyle: {
    fontSize: 14,
    fontWeight: '400',
    color: colorList.dark,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 50,
    fontSize: 16,
    // borderWidth: 0.5,
    borderRadius: 8,
    // paddingLeft: 10,
    // marginTop: 16,
  },
  dropdownContainerStyle: {
    backgroundColor: colorList.white,
  },
  dropdownItemTextStyle: {
    color: colorList.dark,
  },
});
