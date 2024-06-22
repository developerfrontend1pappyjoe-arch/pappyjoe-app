import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Card, Icon, Text } from "react-native-paper";
import Icons from "react-native-vector-icons/MaterialIcons";
import { colorList } from "styles/global.styles";
import RNFS from "react-native-fs";
import { Alert } from "react-native";
import { ShareModalContents } from "./ShareModalContents";
import { API_URL } from "utils/constants";
import { axiosInstance as axios } from "../../../../config/axios.config.custom";
import extensions from "./fileExtentionTypes";
import { TouchableOpacity } from "react-native";
import { ExtentionTypes } from "./fileExtentionTypes";
function FileContentCard({ keyId, fileData,handleShowFileViewer }) {
  const [openedShareListId, setOpenedShareListId] = useState(null);
  const handleOpenShareModal = () => setOpenedShareListId(keyId);
  const handleCloseShareModal = () => setOpenedShareListId(null);
  const [isDownloadCicked, setIsDownloadClicked] = useState(false);
  const [isAlreadyDownloaded, setIsAlreadyDownloaded] = useState(false);
  const [downloadProgress, seDownloadProgress] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const downloadFile = async (url, fileName) => {
    try {
      const sanitizedFileName = fileName.replace(/\s/g, "");
      const isDirectoryExist = await RNFS.exists(
        `${RNFS.DownloadDirectoryPath}/Pappyjoe`
      );
      if (!isDirectoryExist) {
        await RNFS.mkdir(`${RNFS.DownloadDirectoryPath}/Pappyjoe`);
      }

      const downloadDest = `${RNFS.DownloadDirectoryPath}/Pappyjoe/${sanitizedFileName}`;
      const options = {
        fromUrl: url,
        toFile: downloadDest,
        background: true,
        discretionary: true,
        progress: (res) => {
          const progress = parseFloat(
            ((res.bytesWritten / res.contentLength) * 100).toFixed(2)
          );
          seDownloadProgress(progress);
        },
      };

      return new Promise((resolve, reject) => {
        RNFS.downloadFile(options)
          .promise.then((response) => {
            console.log("File downloaded!", response);
            Alert.alert(
              "Info",
              `Download Completed, please check path : "${downloadDest}" `
            );
            seDownloadProgress(0);
            setIsAlreadyDownloaded(true);
            resolve(downloadDest);
          })
          .catch((err) => {
            setIsDownloadClicked(false);
            console.log("Download error:", err);
            reject(err);
          });
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      setIsDownloadClicked(false);
      return Promise.reject(error);
    }
  };
  const handleDownloadFiles = useCallback(() => {
    setIsDownloadClicked(true);
    downloadFile(fileData?.file, fileData?.file?.split("/").pop());
  },[]);

  const handleDeleteFilesApi = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("id", fileData.id);
      const result = await axios.delete(`${API_URL.addFiles}`, {
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (result.status == 200) {
        Alert.alert("File deleted",result.data.message);
      }
    } catch (error) {
      Alert.alert("Somthing went wrong,please try agin later");
    }
  };

  const handleDeleteFiles = useCallback(() => {
    Alert.alert("Warning", "Are you sure, you want to delete this File ?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Confirm",
        onPress: () => handleDeleteFilesApi(fileData?.id),
      },
    ]);
  },[]);

  const getFileName = (url: string) => {
    return url.split("/").pop();
  };

  const checkFileDownloaded =async () => {
    const fileName = fileData?.file?.split("/").pop()
    const sanitizedFileName = fileName.replace(/\s/g, "");
  const result = await RNFS.exists(
        `${RNFS.DownloadDirectoryPath}/Pappyjoe/${sanitizedFileName}`
      )
      setIsAlreadyDownloaded(result)
  };

const checkFileType = useCallback(()=>{
    const fileExtention : ExtentionTypes =  (fileData.file.split('/').pop())?.split('.').pop()
   const type = extensions[fileExtention];
   handleShowFileViewer({type,url:fileData.file}) 
  },[])

  useEffect(() => {
    checkFileDownloaded();
  }, []);
  return (
    <>
      <Card key={`imageContainer${keyId}`}>
        <TouchableOpacity onPress={checkFileType} style={{ padding: 4 }}>
          <Card.Cover source={{ uri: fileData.file }} />
        </TouchableOpacity>
        <Card.Content>
          <Text variant="bodyMedium">{getFileName(fileData.file)}</Text>
        </Card.Content>
        <Card.Actions style={{ gap: 10 }}>
          {downloadProgress > 0 && (
            <Text>Downloading {downloadProgress} % </Text>
          )}
          {(!isAlreadyDownloaded && !isDownloadCicked) && (
            <Button
              compact
              mode="elevated"
              loading={isDownloadCicked}
              disabled={isDownloadCicked}
              contentStyle={{
                backgroundColor: colorList.primary,
              }}
              labelStyle={{ color: colorList.white }}
              onPress={handleDownloadFiles}
            >
              <Icons name="download" size={20} />
            </Button> 
          )}
          {isAlreadyDownloaded && (
            <Icon
              size={30}
              color={colorList.primary}
              source="check-underline"
            />
          )}
          <Button
            compact
            mode="elevated"
            disabled={isLoading}
            onPress={handleDeleteFiles}
            contentStyle={{ backgroundColor: colorList.red }}
            labelStyle={{ color: colorList.white }}
            loading={isLoading}
          >
            <Icons name="delete" size={20} />
          </Button>
          <ShareModalContents
            open={openedShareListId === keyId}
            openMenu={handleOpenShareModal}
            closeMenu={handleCloseShareModal}
            data={fileData}
          />
        </Card.Actions>
      </Card>
    </>
  );
}

export default React.memo(FileContentCard);
