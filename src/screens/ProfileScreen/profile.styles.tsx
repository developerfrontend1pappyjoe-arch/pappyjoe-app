import {StyleSheet} from 'react-native';
import {colorList} from '../../styles/global.styles';
export const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  clinickContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  clicnicHeadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clinicHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: colorList.dark,
  },
  clinicLabelTextContaine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clinicLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colorList.dark,
  },
  clinicText: {
    fontSize: 12,
    fontWeight: '400',
    color: colorList.Grey1,
    marginTop: 8,
  },
  hrLine: {
    height: 1,
    backgroundColor: colorList.Grey6,
    marginVertical: 16,
  },
  addMoreClicnicBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoreClicnicBtn: {
    fontSize: 14,
    fontWeight: '700',
    color: colorList.primary,
    marginTop: 8,
  },
  //   Profile Features List
  profMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: colorList.white,
    borderRadius: 12,
    paddingVertical: 5,
    paddingRight: 15,
  },
  profIconLabelContainer: {flexDirection: 'row', alignItems: 'center'},
  profIconContainer: {
    backgroundColor: '#fff',
    borderRadius: 100,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profFeatureIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  profFeaturelabel: {
    fontSize: 16,
    fontWeight: '400',
    color: colorList.dark,
    marginLeft: 12,
  },
  profFeatureIcon2: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});
