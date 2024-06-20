import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import RNFS from "react-native-fs";
import { CustomLoaderRound } from "../../components/CustomLoaderRound";
import { CameraViews } from "../AppoinmentsDetailsScreen/components/files/CameraViews";
import { Button, Text } from "react-native-paper";
import { colorList } from "../../styles/global.styles";
import { CustomHeader } from "../../components/CustomHeader";
import { ArrowLeftIcon } from "../../assets";
import { API_URL } from "../../utils/constants";
import { axiosInstance as axios } from "../../config/axios.config.custom";
import { CustomImageViewer } from "../AppoinmentsDetailsScreen/components/files/ImageViewer";
import { launchImageLibrary } from "react-native-image-picker";
import ImageResizer from 'react-native-image-resizer';
export const ProfileProfile = ({ navigation, route }: any) => {
  const { patientDetails } = route.params;
  const [isLoading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<any>(null);
  const [imageViews, setImageViews] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imagePreview,setImagePreview] = useState<any>(null)
  const [downloadProgress,setDownloadProgress] = useState("")
  useEffect(() => {
    if(patientDetails.Photo){
      getFileDetails();
    }
    console.log(patientDetails);
  }, [patientDetails]);

  const handleConfirmImage = async (file) => {
    const resizedImage = await ImageResizer.createResizedImage(
      file.uri,
      800, // maxWidth
      600, // maxHeight
      'JPEG', // format
      80, // quality (1-100, 100 being the highest quality)
    );
    setImageFile({
      name:resizedImage.name,
      type:file.type,
      uri:resizedImage.uri
    });
    setImagePreview({
      name:resizedImage.name,
      type:file.type,
      uri:resizedImage.uri
    })
    setShowCamera(false);
  };

  const galleryPicker = async () => {
    try {
      const { assets } = await launchImageLibrary({ mediaType: "photo" });
      const temp = [...assets];
      temp.forEach((el) => {
        el.name = el.fileName;
        el.size = el.fileSize;
      });
      setImageFile(temp[0])
      setImagePreview(temp[0])
    } catch (err) {
      console.error("Errrr ===> ", err);
    }
  };

  const handleSubmitApi = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("patient_id", patientDetails?.id);
      formData.append("image", imageFile);
      const { data } = await axios.post(
        `${API_URL.patientProfileUpload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.status == 200) {
        setLoading(false);
        Alert.alert("Success", data?.message, [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (err) {
      setLoading(false);
      Alert.alert("Failed", err.response.data.message, [
        {
          text: "OK",
          onPress: () => {},
        },
      ]);
    }
  };

  const downloadFiles = async (url, fileName) => {
    try {
      const sanitizedFileName = fileName.replace(/\s/g, "");
      const downloadDest = `${RNFS.DocumentDirectoryPath}/${sanitizedFileName}`;
      const fileExists = await RNFS.exists(downloadDest);
      if (fileExists) {
        return downloadDest; 
      }
      setImageLoading(true);
      const options = {
        fromUrl: url,
        toFile: downloadDest,
        background: true,
        discretionary: true,
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          setDownloadProgress(`Loading: ${progress.toFixed(2)}% ...`)
          // console.log(`Progress: ${progress.toFixed(2)}%`);
        },
      };
      return new Promise((resolve, reject) => {
        RNFS.downloadFile(options)
          .promise.then((response) => {
            console.log("File downloaded!", response);
            setLoading(false);
            resolve(downloadDest);
          })
          .catch((err) => {
            console.log("Download error:", err);
            reject(err);
          });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getFileDetails = async () => {
    const result = await downloadFiles(
      patientDetails.Photo,
      patientDetails.Photo?.split("/").pop()
    );
    const fileInfo = await RNFS.stat(result);
    if (fileInfo) {
      setImageLoading(false);
    }
    const { size } = fileInfo;
    const obj = {
      name: patientDetails.Photo?.split("/").pop(),
      size: size,
      type: `image/${patientDetails.Photo?.split("/").pop().split(".").pop()}`,
      uri: `file://${result}`,
    };
    setImagePreview(obj)
  };

  const displayImageUrl = useMemo(() => {
    let urlContent = null
    if (imageFile?.uri) {
      urlContent = imageFile.uri;
    }
    if (patientDetails?.Photo) {
      urlContent = patientDetails.Photo;
    }
    if(imagePreview?.uri){
      urlContent = imagePreview?.uri
    }
    console.log(urlContent);
   return urlContent 
  }, [patientDetails, imageFile, imagePreview]);

  if (showCamera) return <CameraViews setImageFiles={handleConfirmImage} />;
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <CustomHeader
        headerText="Patient Profile"
        leftIcon={ArrowLeftIcon}
        leftIconAction={() => navigation.goBack()}
      />
      <View
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        {isLoading ? (
          <CustomLoaderRound />
        ) : (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Button
                mode="contained"
                onPress={() => setShowCamera(true)}
                buttonColor={colorList.socondary}
                style={{
                  marginVertical: 10,
                }}
              >
                Take Photo
              </Button>
              <Button
                mode="contained"
                onPress={galleryPicker}
                buttonColor={colorList.socondary}
                style={{
                  marginVertical: 10,
                }}
              >
                Gallery
              </Button>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
                aspectRatio: 0.7,
              }}
            >
              {displayImageUrl != null ? (
                imageLoading && !imageFile?.uri ? (
                  <View>
                    <Text>{downloadProgress}</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setImageViews(true);
                    }}
                  >
                    <Image
                      source={{ uri: displayImageUrl }}
                      style={{
                        width: 300,
                        height: 400,
                        resizeMode: "contain",
                        borderRadius: 10,
                      }}
                    />
                  </TouchableOpacity>
                )
              ) : (
                <Text>No File Uploaded...!</Text>
              )}
            </View>
            <View style={{ flex: 0.2 }}>
              <Button
                mode="elevated"
                onPress={handleSubmitApi}
                buttonColor={colorList.primary}
                textColor={colorList.white}
              >
                Submit
              </Button>
            </View>
          </>
        )}
      </View>
      {imageViews && imagePreview && (
        <CustomImageViewer
          visible={imageViews}
          close={() => setImageViews(false)}
          img={[imagePreview]}
        />
      )}
    </SafeAreaView>
  );
};
