import {StyleSheet} from 'react-native';
import {colorList} from '../../../styles/global.styles';

export const filterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colorList.white,
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Android elevation for a shadow effect
    width: '90%',
  },
  filterHeader: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 17,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 17,
    color: colorList.dark,
    marginBottom: 10,
  },
  // dropdown
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 12,
    fontSize: 14,
    color: colorList.dark,
  },
  dropdownContainerStyle: {
    backgroundColor: colorList.white,
  },
  dropdownItemTextStyle: {
    color: colorList.dark,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
    fontWeight: '400',
    color: colorList.dark,
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
    // height: 50,
    // fontSize: 16,
    // borderWidth: 0.5,
    // borderRadius: 8,
    // paddingLeft: 10,
    // marginTop: 16,
    color: colorList.dark,
  },
  checkboxText: {
    color: colorList.Grey1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 17,
    height: 17,
    borderWidth: 2,
    borderColor: colorList.Grey1,
    borderRadius: 5,
    marginRight: 10,
    color: 'red',
  },
  checked: {
    backgroundColor: '#3498db',
    marginRight: 10,
  },
  labels: {
    fontSize: 16,
    color: colorList.Grey1,
  },
});
