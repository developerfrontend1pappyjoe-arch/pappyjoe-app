import React, { useCallback, useEffect, useState } from "react";
import {View } from "react-native";
import { Button, Card, Icon, Text,ActivityIndicator } from "react-native-paper";
import Icons from "react-native-vector-icons/MaterialIcons";
import { colorList } from "styles/global.styles";
import RNFS from "react-native-fs";
import { Alert } from "react-native";
import { ShareModalContents } from "./ShareModalContents";
import { API_URL } from "utils/constants";
import { axiosInstance as axios } from "../../../../config/axios.config.custom";
import extensions, { allFileTypes } from "./fileExtentionTypes";
import { TouchableOpacity } from "react-native";
import { ExtentionTypes } from "./fileExtentionTypes";
import FileViewer from "react-native-file-viewer";
function FileContentCard({
  keyId,
  fileData,
  handleShowFileViewer,
  handleDelete,
}) {
  const [openedShareListId, setOpenedShareListId] = useState(null);
  const handleOpenShareModal = () => setOpenedShareListId(keyId);
  const handleCloseShareModal = () => setOpenedShareListId(null);
  const [isDownloadCicked, setIsDownloadClicked] = useState(false);
  const [isAlreadyDownloaded, setIsAlreadyDownloaded] = useState(false);
  const [downloadProgress, seDownloadProgress] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [fileOpenLoading, setFileOpenLoading] = useState(false);
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
  }, []);

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
        Alert.alert("File deleted", result.data.message);
        handleDelete();
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
  }, []);

  const getFileName = (url: string) => {
    return url.split("/").pop();
  };

  const checkFileDownloaded = async () => {
    const fileName = fileData?.file?.split("/").pop();
    const sanitizedFileName = fileName.replace(/\s/g, "");
    const result = await RNFS.exists(
      `${RNFS.DownloadDirectoryPath}/Pappyjoe/${sanitizedFileName}`
    );
    setIsAlreadyDownloaded(result);
  };

  const clearCache = async () => {
    try {
      const files = await RNFS.readDir(RNFS.CachesDirectoryPath);
      for (const file of files) {
        await RNFS.unlink(file.path);
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const viewFile = async (uri: string) => {
    const fileName = uri.split("/").pop();
    const sanitizedFileName = fileName?.replace(/\s/g, "");
    const destinationUri = `${RNFS.CachesDirectoryPath}/${sanitizedFileName}`;
    const downloadDest = `${RNFS.DownloadDirectoryPath}/Pappyjoe/${sanitizedFileName}`;
    try {
      const isCleared = await clearCache();
      if (!isCleared) {
        throw new Error("Failed to clear cache");
      }
      const fileExists = await RNFS.exists(destinationUri);
      const isAlreadyDownloaded = await RNFS.exists(downloadDest);
      if (isAlreadyDownloaded) {
        await FileViewer.open(`file://${downloadDest}`, {
          displayName: sanitizedFileName,
        });
        setFileOpenLoading(false);
        return;
      }
      if (!fileExists) {
        await RNFS.downloadFile({ fromUrl: uri, toFile: destinationUri })
          .promise;
      }
      await FileViewer.open(`file://${destinationUri}`, {
        displayName: sanitizedFileName,
      });
      setFileOpenLoading(false);
    } catch (error) {
      setFileOpenLoading(false);
      console.log("Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const checkFileType = useCallback(async () => {
    const fileName = fileData.file.split("/").pop()
    const fileExtention: ExtentionTypes = fileName?.split(".").pop();
    const type = extensions[fileExtention];
    const downloadDest = `${RNFS.DownloadDirectoryPath}/Pappyjoe/${fileName}`
    if (type == allFileTypes.doc) {
      setFileOpenLoading(true);
      viewFile(fileData.file);
    } else {
      handleShowFileViewer({ type, url:fileData.file});
    }
  }, []);

  const checkExtention = (url: string) => {
    const name = url.split("/").pop();
    const ex = name?.split(".").pop();
    return extensions[ex];
  };

  useEffect(() => {
    checkFileDownloaded();
  }, []);
  return (
    <>
      <Card
        key={`imageContainer${keyId}`}
        style={{ backgroundColor: colorList.white }}
      >
        <TouchableOpacity onPress={checkFileType} style={{ padding: 4 }}>
          {checkExtention(fileData.file) == allFileTypes.image && (
            <Card.Cover source={{ uri: fileData.file }} />
          )}
          {checkExtention(fileData.file) == allFileTypes.video && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Icon
                color={colorList.primary}
                size={100}
                source={"play-circle"}
              />
            </View>
          )}
          {checkExtention(fileData.file) == allFileTypes.doc && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {fileOpenLoading ? (
                <View style={{flexDirection:"row",gap:5}}>
                  <Text>Opening file</Text>
                  <ActivityIndicator size={20} />
                </View>
              ) : (
                <Icon
                  color={colorList.Grey1}
                  size={100}
                  source={"file-document"}
                />
              )}
            </View>
          )}
        </TouchableOpacity>
        <Card.Content>
          <Text variant="bodyMedium">{getFileName(fileData.file)}</Text>
        </Card.Content>
        <Card.Actions style={{ gap: 10 }}>
          {downloadProgress > 0 && (
            <Text>Downloading {downloadProgress} % </Text>
          )}
          {!isAlreadyDownloaded && !isDownloadCicked && (
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
