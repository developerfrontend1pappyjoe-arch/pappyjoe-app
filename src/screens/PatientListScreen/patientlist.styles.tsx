import {StyleSheet} from 'react-native';
import {colorList} from '../../styles/global.styles';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginBottom: 70,
  },
  listContainer: {
    backgroundColor: colorList.white,
    padding: 16,
    margin: 4,
    flexDirection: 'row',
    borderRadius: 12,
  },
  listImage: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flex: 8,
  },
  listContentWrapper: {
    marginLeft: 16,
  },
  listContentHeading: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 20,
    color: colorList.Black,
    marginBottom: 8,
  },
  listContentid: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16,
    color: colorList.Grey1,
    marginBottom: 8,
  },
  listSocial: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
