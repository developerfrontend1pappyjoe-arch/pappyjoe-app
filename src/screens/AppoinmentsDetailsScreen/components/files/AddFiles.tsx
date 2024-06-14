import React, {useEffect, useState} from 'react';
import {API_URL} from '../../../../utils/constants';
import {Alert, Dimensions, Image, TouchableOpacity, View} from 'react-native';
import {Button, Divider, Text, TextInput} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import {useCameraPermission} from 'react-native-vision-camera';
import {launchImageLibrary} from 'react-native-image-picker';

import Icons from 'react-native-vector-icons/MaterialIcons';

import {colorList} from '../../../../styles/global.styles';
import {CustomLoaderRound} from '../../../../components/CustomLoaderRound';
import {CameraViews} from './CameraViews';
import {VideoPlayer} from './VideoPlayer';
import {axiosInstance as axios} from '../../../../config/axios.config.custom';
import {CustomImageViewer} from './ImageViewer';
import RNFS from 'react-native-fs';

export const AddFilesPopup = ({close, patientDetails, refetch}: any) => {
  const [files, setFiles] = useState<any>([]);
  const [imageFiles, setImageFiles] = useState<any>([]);
  const [videoFiles, setVideoFiles] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [showVideoData, setShowVideoData] = useState(null);

  const {hasPermission, requestPermission} = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then(res => {
        console.log('Rqqq Permissin is Done', res);
      });
    }
  }, [hasPermission, requestPermission]);

  const pickVideo = async () => {
    try {
      const result = await launchImageLibrary({mediaType: 'mixed'});
      const temp = [...result?.assets];
      temp.forEach(el => {
        el.name = el.fileName;
        el.size = el.fileSize;
      });
      if (
        temp[0]?.fileName.split('.').pop() === 'jpg' ||
        temp[0]?.fileName.split('.').pop() === 'png'
      ) {
        setImageFiles(prev => [...prev, ...temp]);
      } else setVideoFiles(temp);
    } catch (err) {
      console.error('Errrr ===> ', err);
    }
  };

  const addFilesApi = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('patient_id', patientDetails?.id);
    [...files, ...imageFiles, ...videoFiles].forEach((el: any) => {
      formData.append('file[]', el);
    });

    axios
      .post(API_URL.addFiles, formData, {
        headers: {
          'Content-Type': 'multipart/form-data; ',
        },
      })
      .then(res => {
        setLoading(false);
        Alert.alert('Success', res.data.message || 'Done', [
          {
            text: 'OK',
            onPress: () => {
              refetch();
              close();
            },
          },
        ]);
      })
      .catch(err => {
        console.log('Errrrrrrr add files', err);
        Alert.alert(
          'Success',
          err?.response.data?.message || 'Something Went Wrong',
        );
        setLoading(false);
      });
  };

  const openDocPicker = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    });
    setFiles(res);
  };

  const handleConfirmImage = (image: any) => {
    const imgList = [];
    imgList.push(image);
    setImageFiles(imgList);
    setTimeout(() => {
      setShowCamera(false);
    }, 50);
  };

  const handleRemoveFiles = index => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleRemoveImage = index => {
    const updatedImageFiles = [...imageFiles];
    updatedImageFiles.splice(index, 1);
    setImageFiles(updatedImageFiles);
  };
  const handleRemoveVideos = index => {
    const updatedVideoFiles = [...videoFiles];
    updatedVideoFiles.splice(index, 1);
    setVideoFiles(updatedVideoFiles);
  };

  const handlePlayVideos = data => {
    setShowVideo(true);
    setShowVideoData(data);
  };

  const [imageViews, setImageViews] = useState(false);
  const [imageViewData, setImageViewData] = useState([]);
  const [editFileName, setEditFileName] = useState({
    isEdit: false,
    name: '',
    extension: '',
  });

  const handleChangeFileName = async (
    index: number,
    name: string,
    path: string,
  ) => {
    const filesObjList = [...imageFiles];
    const newPath = `${RNFS.DocumentDirectoryPath}/${name}`;
    await RNFS.moveFile(path, newPath);
    filesObjList[index].uri = `file://${newPath}`;
    filesObjList[index].name = name;
    filesObjList[index].fileName = name;
    setImageFiles(filesObjList);
  };

  const handleEditFileNames = (
    index: number,
    fileName: string,
    uri: string,
  ) => {
    const nameOnly = fileName.split('.')[0];
    const ext = fileName.split('.')[1];
    if (!editFileName.isEdit) {
      setEditFileName(prev => ({...prev, isEdit: true, name: nameOnly, ext}));
    } else {
      setEditFileName(prev => ({...prev, isEdit: false, ext}));
      Alert.alert('Info', 'Are you sure,you want to change the name ?', [
        {text: 'No'},
        {
          text: 'Yes',
          onPress: () =>
            handleChangeFileName(index, `${editFileName.name}.${ext}`, uri),
        },
      ]);
    }
  };

  if (imageViews && imageViewData?.length) {
    return (
      <CustomImageViewer
        visible={imageViews}
        close={() => setImageViews(false)}
        img={imageViewData}
      />
    );
  } else if (showCamera) {
    return <CameraViews setImageFiles={handleConfirmImage} />;
  } else if (showVideo) {
    return (
      <View>
        <VideoPlayer
          visible={showVideo}
          hideModal={() => {
            setShowVideo(false);
          }}
          url={showVideoData?.uri}
        />
      </View>
    );
  } else {
    return (
      <View
        style={{
          width: Dimensions.get('screen').width * 0.85,
          minHeight: 200,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
          }}>
          <View>
            <Button
              mode="elevated"
              icon={'upload'}
              onPress={openDocPicker}
              style={{backgroundColor: colorList.primary}}
              labelStyle={{color: colorList.white}}>
              Upload
            </Button>
          </View>
          <View>
            <Button
              mode="elevated"
              icon={'camera'}
              onPress={() => setShowCamera(true)}
              style={{marginVertical: 10}}>
              Camera
            </Button>
          </View>
          <View>
            <Button
              mode="elevated"
              icon={'view-gallery-outline'}
              onPress={pickVideo}>
              Gallery
            </Button>
          </View>
        </View>

        <View style={{marginVertical: 20}}>
          {imageFiles?.length
            ? imageFiles?.map((item: any, index: number) => {
                return (
                  <View key={index}>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={{flex: 6}}
                        onPress={() => {
                          setImageViewData([item]);
                          setImageViews(true);
                        }}>
                        <Image
                          source={{uri: item?.uri}}
                          style={{
                            width: 100,
                            height: 100,
                            resizeMode: 'cover',
                            borderRadius: 10,
                          }}
                        />
                      </TouchableOpacity>
                      <View style={{flex: 3, justifyContent: 'center'}}>
                        <Button
                          mode="elevated"
                          onPress={() => handleRemoveImage(index)}
                          style={{backgroundColor: colorList.red}}
                          labelStyle={{
                            color: colorList.white,
                          }}>
                          <Icons
                            name="delete"
                            size={20}
                            color={colorList.white}
                          />
                        </Button>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      {editFileName?.isEdit ? (
                        <TextInput
                          mode="flat"
                          value={editFileName?.name}
                          onChangeText={text =>
                            setEditFileName(prev => ({...prev, name: text}))
                          }
                          style={{
                            flex: 0.8,
                            backgroundColor: colorList.white,
                            maxHeight: 40,
                          }}
                        />
                      ) : (
                        <Text>{item?.fileName}</Text>
                      )}
                      <Button
                        mode="elevated"
                        onPress={() =>
                          handleEditFileNames(index, item.name, item.uri)
                        }
                        style={{backgroundColor: colorList.socondary}}
                        labelStyle={{color: colorList.white}}>
                        <Icons name="edit" size={20} />
                      </Button>
                    </View>
                    <Divider style={{marginVertical: 10}} />
                  </View>
                );
              })
            : null}

          {videoFiles?.length
            ? videoFiles?.map((item: any, index: number) => {
                return (
                  <>
                    <View>
                      <Text style={{marginVertical: 10}}>{item?.fileName}</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <View style={{flex: 5.5, marginRight: 20}}>
                          <Button
                            mode="contained"
                            icon={'play-outline'}
                            onPress={() => handlePlayVideos(item)}
                            labelStyle={{
                              color: colorList.white,
                            }}>
                            Play
                          </Button>
                        </View>
                        <View
                          style={{
                            flex: 3,
                            justifyContent: 'center',
                          }}>
                          <Button
                            mode="elevated"
                            onPress={() => handleRemoveVideos(index)}
                            style={{backgroundColor: colorList.red, width: 70}}
                            labelStyle={{
                              color: colorList.white,
                            }}>
                            <Icons
                              name="delete"
                              size={20}
                              color={colorList.white}
                            />
                          </Button>
                        </View>
                      </View>
                    </View>
                    <Divider style={{marginVertical: 10}} />
                  </>
                );
              })
            : null}

          {files?.length
            ? files?.map((li: any, index: number) => {
                return (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 10,
                      }}>
                      <View
                        style={{
                          flex: 6,
                          justifyContent: 'center',
                        }}>
                        <Text variant="labelMedium">{li?.name}</Text>
                      </View>
                      <View style={{flex: 3, alignItems: 'flex-end'}}>
                        <Button
                          mode="elevated"
                          onPress={() => handleRemoveFiles(li, index)}
                          style={{
                            backgroundColor: colorList.red,
                            width: 70,
                          }}
                          labelStyle={{color: colorList.white}}>
                          <Icons
                            name="delete"
                            size={20}
                            color={colorList.white}
                          />
                        </Button>
                      </View>
                    </View>
                    <Divider />
                  </>
                );
              })
            : null}

          {!imageFiles?.length && !videoFiles?.length && !files?.length && (
            <Text
              variant="labelLarge"
              style={{
                textAlign: 'center',
              }}>
              No Files Uploaded...!
            </Text>
          )}
        </View>

        {isLoading ? (
          <CustomLoaderRound />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 20,
            }}>
            <Button
              mode="elevated"
              icon={'close'}
              onPress={close}
              style={{backgroundColor: colorList.red}}
              labelStyle={{color: colorList.white}}>
              Cancel
            </Button>
            <Button
              mode="elevated"
              icon={'check'}
              style={{backgroundColor: colorList.primary}}
              labelStyle={{color: colorList.white}}
              onPress={addFilesApi}>
              Submit
            </Button>
          </View>
        )}
      </View>
    );
  }
};
