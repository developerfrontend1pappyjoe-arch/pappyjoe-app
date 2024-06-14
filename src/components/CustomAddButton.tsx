import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {AddIcon} from '../assets';
import {colorList} from '../styles/global.styles';

export const CustomAddButton = ({onClick}: any) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={onClick} style={styles.customAddButtonWrapper}>
        <Image source={AddIcon} style={styles.customAddButton} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  customAddButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorList.socondary,
    borderRadius: 10,
    width: 50,
    height: 50,
  },
  customAddButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
