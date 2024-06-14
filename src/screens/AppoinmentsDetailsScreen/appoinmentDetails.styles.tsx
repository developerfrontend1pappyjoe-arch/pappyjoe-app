import {StyleSheet, Dimensions} from 'react-native';
import {colorList} from '../../styles/global.styles';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  patientDetailsContainer: {
    backgroundColor: colorList.white,
    borderRadius: 12,
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
  },
  profileImage: {
    width: 52,
    height: 52,
    resizeMode: 'cover',
    borderRadius: 100,
  },
  profileNameFilnoWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  profileNameText: {
    fontSize: 18,
    fontWeight: '600',
    color: colorList.dark,
    textTransform: 'capitalize',
  },
  profileFileNoContainer: {
    borderRadius: 4,
    backgroundColor: colorList.Green,
    flexDirection: 'row',
    padding: 4,
    marginLeft: 8,
  },
  profileFileNo: {
    fontSize: 12,
    fontWeight: '500',
    marginHorizontal: 4,
    color: colorList.socondary,
  },
  patientIdContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  profilePatientIdLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: colorList.Grey1,
    marginRight: 5,
  },
  profilePatientId: {
    fontSize: 14,
    fontWeight: '500',
    color: colorList.dark,
  },
  hrLine: {
    height: 1,
    backgroundColor: colorList.Grey6,
    marginVertical: 16,
  },
  phoneContainar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
  },
  leftSideImageStyle: {
    width: 16,
    height: 16,
  },
  leftSidePhoneLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: colorList.Grey1,
    marginLeft: 8,
    marginRight: 10,
  },
  rightSection: {
    flexDirection: 'row',
  },
  leftSidePhoneText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorList.dark,
    marginRight: 8,
  },
  rightSideImageWrapperStyle: {
    width: 40,
  },
  rightSideImageStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 8,
  },
  HorizontalMenusContainer: {
    borderColor: colorList.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: colorList.white,
    height: 40,
  },
  HorizontalMenusFocusedText: {
    fontSize: 14,
    fontWeight: '600',
    color: colorList.primary,
  },
  HorizontalMenusNormalText: {
    fontSize: 14,
    fontWeight: '400',
    color: colorList.Grey1,
  },
  menuListDetailsChiefComplainsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colorList.dark,
    marginTop: 10,
  },
  menuListDetailsChiefComplainsText: {
    fontSize: 13,
    fontWeight: '400',
    color: colorList.Grey1,
    marginTop: 8,
    lineHeight: 20,
  },
  menuListDetailsChiefComplaintsContainer: {
    // backgroundColor: colorList.white,
    padding: 5,
    borderRadius: 12,
    minHeight: 300,
    flex: 1,
  },
  menuListDetailsChiefComplainsProfileLabel: {fontSize: 12, fontWeight: '500'},
  MenuListDetailsChiefComplaintsAddBtnContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  addComplaintPopupsContainer: {width: Dimensions.get('screen').width * 0.8},
  AddComplaintPopupsHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colorList.dark,
    textAlign: 'center',
  },
  AddComplaintPopupsHeaderLabel: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  AddComplaintPopupsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colorList.dark,
    marginBottom: 12,
    marginTop: 12,
  },
  addComplaintPopupsBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});
