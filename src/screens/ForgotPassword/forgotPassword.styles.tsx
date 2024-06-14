import {StyleSheet} from 'react-native';
import {colorList, globalStyles} from '../../styles/global.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorList.white,
  },
  imageContainer: {
    flex: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colorList.blue_900,
  },
  headerImage: {
    objectFit: 'contain',
  },
  formContainer: {
    flex: 7,
    marginTop: 32,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },
  input: {
    ...globalStyles.text14,
    color: colorList.blue_200,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E9F1',
    flex: 1,
    borderRadius: 8,
  },
  backToLoginBtn: {
    ...globalStyles.text14,
    fontWeight: '500',
    color: colorList.primary,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 32,
  },
});
