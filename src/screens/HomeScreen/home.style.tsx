import {Dimensions, StyleSheet} from 'react-native';
import {colorList} from '../../styles/global.styles';

export const styles = StyleSheet.create({
  //Header Styles
  HeaderContainer: {},
  HeaderImage: {
    width: 115,
    height: 32,
    resizeMode: 'contain',
  },
  HeaderDropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 5,
  },
  HeaderDropdownText: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 16,
    color: colorList.dark,
    marginRight: 4,
  },
  HeaderDropdownIcon: {},
  //End
  counterContainer: {
    borderRadius: 12,
    padding: 15,
    width: Dimensions.get('screen').width * 0.43,
  },
  counterNumber: {
    fontSize: 32,
    lineHeight: 35,
    fontWeight: '600',
    color: colorList.white,
    marginBottom: 8,
  },
  counterLabel: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: colorList.white,
  },
  counterNumber1: {
    fontSize: 32,
    lineHeight: 35,
    fontWeight: '600',
    color: colorList.Black,
    marginBottom: 8,
  },
  counterLabel1: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: colorList.Grey1,
  },
  upcommingAppoinmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 16,
  },
  upcommingAppoinmentsHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 17,
    color: colorList.dark,
  },
  upcommingAppoinmentsViewAll: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 15,
    color: colorList.Grey1,
    textDecorationLine: 'underline',
    paddingBottom: 5,
  },
  appoinmentContainer: {
    marginBottom: 12,
    backgroundColor: colorList.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 35,
  },
  appoinmentNameContainer: {
    flex: 7,
  },
  appoinmentNameSocial: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appoinmentNameSocialContainer: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appoinmentNameLabel: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 12,
    color: colorList.Grey1,
  },
  appoinmentNameText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 5,
    color: colorList.dark,
  },
  appoinmentDateTimeContainer: {
    flexDirection: 'row',
  },
  appoinmentCalanderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 7,
    height: 40,
  },
  appoinmentDate: {
    marginLeft: 5,
    marginRight: 12,
    fontWeight: '500',
    fontSize: 13,
    color: colorList.dark,
  },
  appoinmentTimeContainer: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 40,
  },
  appoinmentTime: {
    fontWeight: '500',
    fontSize: 12,
    color: colorList.Grey1,
    marginLeft: 5,
  },
  appoinmentHrizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: colorList.Grey5,
  },
  appoinmentToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  appoinmentToLabelTextContainer: {
    marginLeft: 10,
  },
  appoinmentToLabel: {
    fontSize: 11,
    lineHeight: 12,
    fontWeight: '400',
    color: colorList.Grey1,
  },
  appoinmentToText: {
    fontSize: 13,
    lineHeight: 14,
    fontWeight: '600',
    color: colorList.dark,
    marginTop: 5,
  },
});
