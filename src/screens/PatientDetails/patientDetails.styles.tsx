import {StyleSheet} from 'react-native';
import {colorList} from '../../styles/global.styles';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  labelTextContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    borderRadius: 12,
  },
  labelIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorList.Grey1,
    marginLeft: 10,
  },
});
