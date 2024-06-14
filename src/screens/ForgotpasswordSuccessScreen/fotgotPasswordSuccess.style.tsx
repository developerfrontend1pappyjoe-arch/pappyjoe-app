import {StyleSheet} from 'react-native';
import {colorList, globalStyles} from '../../styles/global.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerIamgeContainer: {
    flex: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colorList.blue_900,
  },
  headerImage: {
    objectFit: 'contain',
  },
  formContainer: {
    flex: 6,
    paddingTop: 32,
    backgroundColor: colorList.white,
    paddingHorizontal: 20,
  },
  resendBtn: {
    ...globalStyles.text14,
    fontWeight: '500',
    color: colorList.primary,
    textDecorationLine: 'underline',
    textAlign: 'center',
    paddingVertical: 32,
  },
});
