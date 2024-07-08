import React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  useCameraDevice,
} from "react-native-vision-camera";
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { Button, Icon, Surface, Text, TextInput } from "react-native-paper";
import RNFS from "react-native-fs";
import { colorList } from "../../../../styles/global.styles";

export const CameraViews = ({ setImageFiles }: any) => {
  const device = useCameraDevice("back");
  const cameraRef = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [showPermisionBtn,setShowPermisionBtn] = useState(true)
  const [imgExtention,setImgExtention] = useState<string>("")
  async function requestCameraPermission() {
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("clicked----------------->");
        setShowPermisionBtn(false)
      } else {
        // console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }


  const takePicture = async () => {
    if (cameraRef !== null) {
      const photo = await cameraRef.current.takePhoto();
      handleFileDetails(photo?.path);
    }
  };

  const handleConfirm = async () => {
    const photos = { ...photoUri };
    const fileExtension = photoUri?.name.split(".")?.pop();
    const fileName = `${imageFileName}.${fileExtension}`;
    if (imageFileName !== "") {
      const newPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.moveFile(photos?.uri, newPath);
      photos.uri = `file://${newPath}`;
      photos.name = fileName;
      setImageFiles(photos);
    } else setImageFiles(photoUri);
  };

  const handleFileDetails = async (filePath: any) => {
    try {
      const fileInfo = await RNFS.stat(filePath);
      const { size } = fileInfo;
      const type = filePath?.split(".").pop();
      const parts = filePath.split("/");
      const name = parts[parts.length - 1];
      const fileObj = {
        uri: `file://${filePath}`,
        name: name,
        size: size,
        type: `image/${type}`,
      };
      const splitedName = name.split('.')
      setImageFileName(splitedName[0])
      setImgExtention(splitedName[1])
      setPhotoUri(fileObj);
    } catch (error) {
      console.error("Error:-------------->", error);
    }
  };

  const PendingView = () => {
    return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap:15
      }}>
      <Text>No permission has been granted for the camera.</Text>
      <Button mode="contained-tonal" onPress={requestCameraPermission}>
      Grant Permission
      </Button>
    </View>
  )};

  const checkPermision = async()=>{
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA
    )
    if(!granted){
      requestCameraPermission()
    }
    setShowPermisionBtn(!granted)
  }
  useEffect(() => {
    checkPermision()
  }, [device]);

  if (showPermisionBtn) {
    return <PendingView />
  }else{
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {photoUri ? (
          <View style={{ flex: 1, width: Dimensions.get("screen").width * 1 }}>
            <ImageViewer
              imageUrls={[
                {
                  url: photoUri?.uri,
                },
              ]}
            />
            <TextInput
              placeholder="File name"
              onChangeText={setImageFileName}
              right={<TextInput.Affix text={`.${imgExtention}`} />}
              value={imageFileName}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginVertical: 10,
              }}
            >
              <Button mode="contained" onPress={() => setPhotoUri(null)}>
                Retake
              </Button>
              <Button mode="contained" onPress={handleConfirm}>
                Confirm
              </Button>
            </View>
          </View>
        ) : (
          <>
            <Camera
              ref={cameraRef}
              photo={true}
              style={{
                flex: 1,
                width: Dimensions.get("screen").width,
                height: Dimensions.get("screen").height * 0.5,
                position: "relative",
              }}
              device={device}
              isActive={true}
              enableZoomGesture
              resizeMode="contain"
              enableHighQualityPhotos
            />
            <TouchableOpacity
              onPress={takePicture}
              style={
                Platform.OS === "ios"
                  ? {
                      position: "absolute",
                      bottom: 30,
                      left: "40%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {
                      position: "absolute",
                      bottom: 50,
                      left: "40%",
                      // backgroundColor: colorList.primary,
                      width: 80,
                      height: 80,
                      borderRadius: 100,
                      justifyContent: "center",
                      alignItems: "center",
                    }
              }
            >
              <Icon source={"camera-iris"} color="white" size={80} />
              {Platform.OS === "ios" ? (
                <Surface
                  elevation={5}
                  style={{
                    backgroundColor: "red",
                    width: 80,
                    height: 80,
                    borderRadius: 100,
                  }}
                />
              ) : null}
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    );
  }

};
