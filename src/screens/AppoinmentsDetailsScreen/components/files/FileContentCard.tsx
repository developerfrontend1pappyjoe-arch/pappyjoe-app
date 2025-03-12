import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PermissionsAndroid, Platform, View } from "react-native";
import {
  Button,
  Card,
  Icon,
  Text,
  ActivityIndicator,
  Menu,
  Divider,
} from "react-native-paper";
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
  const [openMenu, setOpenMenu] = useState(false);
  const handleOpenShareModal = () => setOpenedShareListId(keyId);
  const handleCloseShareModal = () => setOpenedShareListId(null);
  const [isDownloadCicked, setIsDownloadClicked] = useState(false);
  const [isAlreadyDownloaded, setIsAlreadyDownloaded] = useState(false);
  const [downloadProgress, seDownloadProgress] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [fileOpenLoading, setFileOpenLoading] = useState(false);
  const downloadFile = async (url, fileName): Promise<boolean> => {
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
            setIsDownloadClicked(false);
            resolve(true);
          })
          .catch((err) => {
            setIsDownloadClicked(false);
            console.log("Download error:", err);
            reject(false);
          });
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      setIsDownloadClicked(false);
      return Promise.reject(false);
    }
  };

  const checkStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        return hasPermission;
      } catch (error) {
        Alert.alert("Error", "Permission check error");
        return false;
      }
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message:
              "PappyJoe needs access to your storage to save and upload files.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        return PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        Alert.alert("Error", "Permission request error");
        return false;
      }
    }
  };

  const startDownload = async () => {
    if (await checkStoragePermission()) {
      await downloadFile(fileData?.file, fileData?.file?.split("/").pop());
    } else {
      if (await requestStoragePermission()) {
        await downloadFile(fileData?.file, fileData?.file?.split("/").pop());
      }
    }
  };

  const handleDownloadFiles = () => {
    setIsDownloadClicked(true);
    startDownload();
  };

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
      setLoading(false);
      Alert.alert("Somthing went wrong,please try agin later");
    }
  };

  const getFileName = (url: string) => {
    return url.split("/").pop();
  };

  const checkFileDownloaded = async () => {
    const fileName = fileData?.file?.split("/").pop();
    const sanitizedFileName = fileName.replace(/\s/g, "");
    const result = await RNFS.exists(
      `${RNFS.DownloadDirectoryPath}/Pappyjoe/${sanitizedFileName}`
    );
    setIsDownloadClicked(false);
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
    const fileName = fileData.file.split("/").pop();
    const fileExtention: ExtentionTypes = fileName?.split(".").pop();
    const type = extensions[fileExtention];
    if (type == allFileTypes.doc) {
      setFileOpenLoading(true);
      viewFile(fileData.file);
    } else {
      handleShowFileViewer({ type, url: fileData.file });
    }
  }, [fileData]);

  const checkExtention = (url: string) => {
    const name = url.split("/").pop();
    const ex = name?.split(".").pop();
    return extensions[ex];
  };

  const deleteFromLocal = async () => {
    const fileName = fileData.file.split("/").pop();
    const sanitizedFileName = fileName?.replace(/\s/g, "");
    const downloadDest = `${RNFS.DownloadDirectoryPath}/Pappyjoe/${sanitizedFileName}`;
    try {
      await RNFS.unlink(downloadDest);
      setIsAlreadyDownloaded(false);
      setIsDownloadClicked(false);
      Alert.alert("Success", "File deleted successfully");
      setOpenMenu(false);
    } catch (error) {
      Alert.alert("Error", "Failed to delete file");
      setOpenMenu(false);
    }
  };

  const deleteFromCloud = () => {
    Alert.alert(
      "Delete file",
      "Are you sure want to delete this file",
      [
        {
          text: "CANCEL",
          style: "cancel",
        },
        { text: "CONFIRM", onPress: () => handleDeleteFilesApi() },
      ],
      { cancelable: false }
    );
    setOpenMenu(false);
  };

  const deleteFile = useCallback(() => {
    if (isAlreadyDownloaded) {
      setOpenMenu(true);
    } else {
      deleteFromCloud();
    }
  }, [isAlreadyDownloaded]);

  useEffect(() => {
    checkFileDownloaded();
    return () => {
      setLoading(false);
      setIsAlreadyDownloaded(false);
      setFileOpenLoading(false);
    };
  }, [fileData]);
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
                <View style={{ flexDirection: "row", gap: 5 }}>
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
            <Text>
              {" "}
              <Icon color={colorList.blue} size={20} source={"download"} />{" "}
              {downloadProgress} %{" "}
            </Text>
          )}
          {!isAlreadyDownloaded && !isDownloadCicked && !isLoading && (
            <Button
              compact
              mode="text"
              loading={isDownloadCicked}
              disabled={isDownloadCicked || isLoading}
              contentStyle={{
                // backgroundColor: colorList.primary,
              }}
              labelStyle={{
                //  color: colorList.white 
                }}
              onPress={handleDownloadFiles}
            >
              <Icons color={colorList.primary} name="download" size={25} />
            </Button>
          )}

          {isAlreadyDownloaded && (
            <Icon
              size={25}
              color={colorList.socondary}
              source="check-underline"
            />
          )}
          {/* <Button
            compact
            mode="elevated"
            disabled={isLoading}
            onPress={deleteFile}
            contentStyle={{ backgroundColor: colorList.red }}
            labelStyle={{ color: colorList.white }}
            loading={isLoading}
          >
            <Icons name="delete" size={20} />
          </Button> */}
          <Menu
            visible={openMenu}
            onDismiss={() => setOpenMenu(false)}
            anchor={
              <Button
                mode="text"
                disabled={isLoading || isDownloadCicked}
                loading={isLoading}
                contentStyle={{ 
                  // backgroundColor: colorList.red
                 }}
                labelStyle={{ color: colorList.red }}
                onPress={deleteFile}
              >
                <Icons name="delete" size={23} />
              </Button>
            }
          >
            <Menu.Item
              disabled={isLoading}
              onPress={deleteFromCloud}
              title="Delete from cloud"
            />
            <Divider />
            <Menu.Item onPress={deleteFromLocal} title="Delete from local" />
          </Menu>
          {!isLoading && (
            <ShareModalContents
              open={openedShareListId === keyId}
              openMenu={handleOpenShareModal}
              closeMenu={handleCloseShareModal}
              data={fileData}
            />
          )}
        </Card.Actions>
      </Card>
    </>
  );
}

export default React.memo(FileContentCard);
