import {Dimensions, StyleSheet} from 'react-native';
import {colorList} from '../../../../styles/global.styles';

export const vitalsStyles = StyleSheet.create({
  wrapper: {
    width: Dimensions.get('screen').width * 0.8,
    flex: 1,
    height: 'auto',
    maxHeight: Dimensions.get('screen').height * 0.7,
  },
  container: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 0,
  },
  errorText: {
    color: 'red',
    marginTop: 1,
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
  },
  errorMessage: {
    color: 'red',
    marginBottom: 5,
  },

  rowContainer: {
    flexDirection: 'row',
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    // marginTop: 12,
    fontSize: 14,
    color: colorList.dark,
  },
  placeholderStyle: {
    fontSize: 14,
    fontWeight: '400',
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
