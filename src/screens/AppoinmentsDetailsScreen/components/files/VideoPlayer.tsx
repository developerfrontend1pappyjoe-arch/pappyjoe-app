import {useRef} from 'react';
import {Dimensions, Image, Platform, View} from 'react-native';
import {Button, Modal, Portal, Text} from 'react-native-paper';
import Video from 'react-native-video';
import {CloseIcon} from '../../../../assets';

export const VideoPlayer = ({visible, hideModal, url}: any) => {
  const playerRef = useRef(null);

  const onBuffer = (text: any) => {
    console.log('Buffer ===> ', text);
  };

  const videoError = (err: any) => {
    console.log('Eroor on Video play ===> ', err);
  };

  return (
    <View
      style={{
        width: Dimensions.get('screen').width * 0.85,
        height: Dimensions.get('screen').height * 0.7,
        borderRadius: 10,
      }}>
      <Button
        onPress={() => hideModal()}
        style={
          Platform.OS == 'ios'
            ? {
                width: 30,
                height: 30,
                position: 'absolute',
                top: -50,
                right: 0,
              }
            : {
                // width: 40,
                // height: 40,
                position: 'absolute',
                top: -70,
                right: 0,
              }
        }>
        <Image
          source={CloseIcon}
          style={
            Platform.OS === 'ios'
              ? {
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                  tintColor: '#fff',
                }
              : {
                  width: 20,
                  height: 10,
                  resizeMode: 'contain',
                  tintColor: '#fff',
                }
          }
        />
      </Button>
      <Video
        source={{
          uri: url,
        }}
        ref={playerRef}
        onBuffer={onBuffer}
        onError={videoError}
        resizeMode="contain"
        style={{
          flex: 1,
          borderRadius: 8,
        }}
        controls></Video>
    </View>
  );
};
