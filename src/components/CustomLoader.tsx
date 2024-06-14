import LottieView from 'lottie-react-native';
import {useRef} from 'react';
import {StyleSheet, View} from 'react-native';

export const CustomLoader = () => {
  const animation = useRef(null);

  return (
    <View style={styles.cosntainer}>
      <LottieView
        autoPlay
        ref={animation}
        style={styles.animation}
        source={require('../assets/pre-loader.json')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cosntainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  animation: {
    width: 200,
    height: 200,
    backgroundColor: '#eee',
  },
});
