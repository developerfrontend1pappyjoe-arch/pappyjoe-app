import { useRef } from "react";
import { Alert, Dimensions, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-paper";
import Video from "react-native-video";
import { colorList } from "styles/global.styles";

export const VideoPlayer = ({ visible, hideModal, url }: any) => {
  const playerRef = useRef(null);
  const onBuffer = (text: any) => {
    console.log("Buffer ===> ", text);
  };

  const videoError = (err: any) => {
   Alert.alert("Error","There was an error loading the video.")
  };

  return (
    
      <View
        style={{
          width: Dimensions.get("screen").width * 0.85,
          height: Dimensions.get("screen").height * 0.7,
          borderRadius: 10,
        }}
      >
        <TouchableOpacity onPress={() => hideModal()} style={{alignSelf:"flex-end"}}>
          <Icon size={25} color={colorList.red} source={"close-circle"} />
        </TouchableOpacity>
        <Video
          source={{ uri: url}}
          ref={playerRef}
          onBuffer={onBuffer}
          onError={videoError}
          resizeMode="contain"
          style={{
            flex: 1,
            borderRadius: 8,
          }}
          controls={true}
        ></Video>
      </View>
  );
};
