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

  headerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headingLabel1: {
    ...globalStyles.text22,
    color: colorList.blue_200,
  },
  headingLabel2: {
    ...globalStyles.text22,
    color: colorList.primary,
  },
  desc1: {
    ...globalStyles.text14,
    color: colorList.blue_300,
    textAlign: 'center',
  },
  desc2: {
    ...globalStyles.text14,
    color: colorList.blue_300,
    textAlign: 'center',
    marginVertical: 20,
  },
  headerSection: {
    flex: 2,
  },
  btnSession: {
    flex: 1,
    justifyContent: 'center',
  },
});
