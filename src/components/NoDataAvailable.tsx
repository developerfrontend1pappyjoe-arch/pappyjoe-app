import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import {colorList} from '../styles/global.styles';
import {NoDataImage} from '../assets';

export const NoDataAvailable = () => {
  return (
    <View style={styles.constainer}>
      {/* <Text style={styles.text}>No Data Available</Text> */}

      <Image
        source={NoDataImage}
        style={{
          resizeMode: 'contain',
          width: 200,
          height: 200,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: colorList.dark,
  },
});
