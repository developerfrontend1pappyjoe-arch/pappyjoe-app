import React, {useEffect, useRef, useState} from 'react';
import {API_URL} from '../../../../utils/constants';
import {useQuery} from '@tanstack/react-query';
import {CustomLoaderRound} from '../../../../components/CustomLoaderRound';
import {
  Dimensions,
  ScrollView,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import {Button, Divider, Surface, Text} from 'react-native-paper';
import {NoDataAvailable} from '../../../../components/NoDataAvailable';
import Icons from 'react-native-vector-icons/MaterialIcons';

import ImageView from 'react-native-image-viewing';
import Pdf from 'react-native-pdf';

import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {CustomModal} from '../../../../components/CustomModal';
import lodash from 'lodash';
import {colorList} from '../../../../styles/global.styles';
import {CustomAddButton} from '../../../../components/CustomAddButton';
import {styles} from '../../appoinmentDetails.styles';

import {AddFilesPopup} from './AddFiles';
import {CloseLargeImage} from '../../../../assets';
import {ShareModal} from '../ShareModal';
import {ShareModalContents} from './ShareModalContents';
import moment from 'moment';
import {CustomImageViewer} from './ImageViewer';
import {axiosInstance as axios} from '../../../../config/axios.config.custom';
import {VideoPlayer} from './VideoPlayer';

export const MenuListDetailsFileList = ({patientDetails}: any) => {
  const [isLoading, setLoading] = useState(false);
  const [isPopup, setIspoup] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [fileList, setFileList] = useState(null);
  const [imageViews, setImageViews] = useState(false);
  const [imageViewData, setImageViewData] = useState([]);
  const [docList, setDocs] = useState({
    image: [],
    pdf: null,
    doc: null,
  });
  const [visible, setIsVisible] = useState({
    image: false,
    pdf: false,
  });
  const [isVideoPlayer, setIsVideoPlayer] = useState(false);
  const [isVideoPlayerUrl, setIsVideoPlayerUrl] = useState(null);
  const [downloadProgress, seDownloadProgress] = useState({
    index: '',
    progress: '',
  });
  const [buttonInAction, setButtonInAction] = useState(false);

  const [openedShareListId, setOpenedShareListId] = useState(null);
  const handleOpenShareModal = (listId: any) => setOpenedShareListId(listId);
  const handleCloseShareModal = () => setOpenedShareListId(null);

  const getFileListApi = async () => {
    setLoading(true);
    try {
      axios
        .get(`${API_URL.fileslist}?patient_id=${patientDetails?.id}`)
        .then(res => {
          console.log('Files Data ===> 2223333', res?.data?.data);
          setLoading(false);
          if (
            res?.data?.data?.length &&
            lodash.isEqual(res?.data?.data, [[]])
          ) {
            setFileList(null);
          } else {
            const data = res?.data?.data;
            const sortedData = data.sort(
              (a, b) => new Date(b.date) - new Date(a.date),
            );
            const groupedData = sortedData.reduce((acc, curr) => {
              if (!acc[curr.date]) {
                acc[curr.date] = [];
              }
              acc[curr.date].push(curr);
              return acc;
            }, {});
            console.log('Finals ===> ', groupedData);

            setFileList(groupedData);
          }
        })
        .catch(err => {
          console.log('Error for geting files ', err);
        });
    } catch (error) {
      console.error('Err in getFileList Details....', error);
      setFileList(null);
    }
  };

  useEffect(() => {
    getFileListApi();
    setTimeout(() => {
      setRefetch(false);
    }, 1000);
  }, [refetch]);

  const handleFiles = (fileUri: any) => {
    const fileName = fileUri.split('/').pop();
    const fileExt = fileName.split('.').pop();

    if (fileExt == 'pdf') {
      setDocs(prev => ({...prev, pdf: {uri: fileUri, cache: true}}));
      setIsVisible(pre => ({...pre, pdf: true}));
    } else if (fileExt == 'doc' || fileExt == 'docx') {
      // openDocument(fileUri);
      Alert.alert('Format Not Supporteds');
      // setDocs(prev => ({...prev, doc: fileUri}));
    } else if (fileExt == 'png' || fileExt == 'jpeg') {
      setDocs(prev => ({...prev, image: [{uri: fileUri}]}));
      setIsVisible(pre => ({...pre, image: true}));
    }
  };

  const handleDeleteFilesApi = (id: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('id', id);
      axios
        .delete(`${API_URL.addFiles}`, {
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          console.log('data', res.data);
          setLoading(false);
          if (res?.status === 200) {
            setLoading(false);
            console.log('Resss', res.data);

            Alert.alert('Success', res?.data?.message || 'Added Successfully', [
              {
                text: 'OK',
                onPress: () => setRefetch(true),
              },
            ]);
          } else {
            setLoading(false);
            Alert.alert(
              res.data?.message || 'Somthing went wrong,please try agin later',
            );
          }
        })
        .catch(err => {
          console.log('Error for geting files ', err);
          Alert.alert(
            err?.response?.data?.message ||
              'Somthing went wrong,please try agin later',
          );
        });
    } catch (error) {
      console.error('Err in getFileList Details....', error);
      Alert.alert(
        error?.response?.data?.message ||
          'Somthing went wrong,please try agin later',
      );
    }
  };

  const handleDeleteFiles = item => {
    Alert.alert('Warning', 'Are you sure, you want to delete this File ?', [
      {text: 'Cancel', onPress: () => {}},
      {
        text: 'Confirm',
        onPress: () => handleDeleteFilesApi(item?.id),
      },
    ]);
  };

  const downloadFile = async (index, url, fileName) => {
    try {
      setButtonInAction(true);
      const sanitizedFileName = fileName.replace(/\s/g, '');
      const downloadDest = `${RNFS.DownloadDirectoryPath}/${sanitizedFileName}`;
      const options = {
        fromUrl: url,
        toFile: downloadDest,
        background: true,
        discretionary: true,
        progress: res => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Progress: ${progress.toFixed(2)}%`);
          seDownloadProgress({index: index, progress: progress.toFixed(2)});
        },
      };

      return new Promise((resolve, reject) => {
        RNFS.downloadFile(options)
          .promise.then(response => {
            console.log('File downloaded!', response);
            // setLoading(false);
            Alert.alert(
              'Info',
              `Download Completed, please check path : "${downloadDest}" `,
            );
            setButtonInAction(false);
            seDownloadProgress({index: 0, progress: ''});
            resolve(downloadDest);
          })
          .catch(err => {
            console.log('Download error:', err);
            reject(err);
          });
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      return Promise.reject(error);
    }
  };

  const handleDownloadFiles = async (index: string, url) => {
    const resultFilePath = await downloadFile(
      index,
      url?.file,
      url?.file?.split('/').pop(),
    );
    console.log('Resss', resultFilePath);
    console.log('handleDownloadFiles ===>', url);
  };

  return (
    <View style={{flex: 1, borderRadius: 10}}>
      {isLoading ? (
        <CustomLoaderRound />
      ) : (
        <>
          <ScrollView
            style={{
              maxHeight: Dimensions.get('screen').height * 0.55,
            }}>
            {fileList && Object.entries(fileList)?.length ? (
              Object.entries(fileList)?.map(([key, val], ids: number) => {
                return (
                  <Surface
                    key={ids}
                    style={{
                      backgroundColor: colorList.white,
                      borderRadius: 8,
                      padding: 10,
                      margin: 2,
                      marginBottom: 10,
                    }}>
                    <View style={{marginVertical: 5}}>
                      <Text
                        variant="titleMedium"
                        style={{color: colorList.dark}}>
                        {moment(key).format('DD-MM-YYYY')}
                      </Text>
                      <Divider style={{marginVertical: 10}} />
                    </View>
                    {val && val?.length
                      ? val?.map((item: any, ids2: number) => {
                          return (
                            <React.Fragment key={ids2}>
                              <Surface
                                style={{
                                  padding: 10,
                                  borderRadius: 8,
                                  margin: 5,
                                  marginBottom: 15,
                                  backgroundColor: colorList.white,
                                }}>
                                <TouchableOpacity
                                  onPress={() => handleFiles(item?.file)}
                                  style={{
                                    flex: 7,
                                  }}>
                                  {item?.file
                                    ?.split('/')
                                    ?.pop()
                                    ?.split('.')
                                    .pop() == 'jpg' ||
                                  item?.file
                                    ?.split('/')
                                    ?.pop()
                                    ?.split('.')
                                    .pop() == 'jpeg' ||
                                  item?.file
                                    ?.split('/')
                                    ?.pop()
                                    ?.split('.')
                                    .pop() == 'png' ? (
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                      }}>
                                      <TouchableOpacity
                                        onPress={() => {
                                          setImageViews(true);
                                          setImageViewData([{uri: item.file}]);
                                        }}
                                        style={{
                                          flex: 4,
                                        }}>
                                        <Image
                                          source={{uri: item?.file}}
                                          style={{
                                            width: 90,
                                            height: 90,
                                            borderRadius: 20,
                                          }}
                                        />
                                      </TouchableOpacity>
                                      <View
                                        style={{
                                          flex: 8,
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <Text
                                          variant="labelMedium"
                                          style={{
                                            color: colorList.dark,
                                            marginTop: 10,
                                            width: '100%',
                                          }}>
                                          {item?.file?.split('/')?.pop()}
                                        </Text>
                                        <Divider style={{marginVertical: 5}} />
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                          }}>
                                          <Button
                                            mode="elevated"
                                            onPress={() =>
                                              handleDownloadFiles(
                                                `${ids}${ids2}`,
                                                item,
                                              )
                                            }
                                            disabled={
                                              buttonInAction &&
                                              downloadProgress?.index === ids2
                                            }
                                            style={{
                                              backgroundColor: colorList.blue,
                                              marginRight: 5,
                                            }}
                                            labelStyle={{
                                              color: colorList.white,
                                            }}>
                                            {downloadProgress?.index ==
                                              `${ids}${ids2}` &&
                                            downloadProgress?.progress !==
                                              '' ? (
                                              <Text variant="labelSmall">
                                                {`${downloadProgress.progress}%`}
                                              </Text>
                                            ) : (
                                              <Icons
                                                name="download"
                                                color={colorList.white}
                                                size={20}
                                              />
                                            )}
                                          </Button>
                                          <Button
                                            mode="elevated"
                                            onPress={() =>
                                              handleDeleteFiles(item)
                                            }
                                            style={{
                                              backgroundColor: colorList.red,
                                              marginRight: 5,
                                            }}
                                            labelStyle={{
                                              color: colorList.white,
                                            }}>
                                            <Icons
                                              name="delete"
                                              color={colorList.white}
                                              size={20}
                                            />
                                          </Button>
                                          <ShareModalContents
                                            open={
                                              openedShareListId ===
                                              `${ids}${ids2}`
                                            }
                                            openMenu={() =>
                                              handleOpenShareModal(
                                                `${ids}${ids2}`,
                                              )
                                            }
                                            closeMenu={handleCloseShareModal}
                                            data={{...item, ...patientDetails}}
                                          />
                                        </View>
                                      </View>
                                    </View>
                                  ) : item?.file
                                      ?.split('/')
                                      ?.pop()
                                      ?.split('.')
                                      .pop() == 'mp4' ? (
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                      }}>
                                      <View
                                        style={{
                                          flex: 5,
                                          justifyContent: 'center',
                                        }}>
                                        <Button
                                          onPress={() => {
                                            setIsVideoPlayer(true);
                                            setIsVideoPlayerUrl(item);
                                          }}
                                          mode="text"
                                          textColor={colorList.dark}>
                                          {item?.file?.split('/')?.pop()}
                                        </Button>
                                      </View>
                                      <View
                                        style={{
                                          flex: 7,
                                          flexDirection: 'row',
                                          justifyContent: 'center',
                                        }}>
                                        <Button
                                          mode="elevated"
                                          onPress={() =>
                                            handleDeleteFiles(item)
                                          }
                                          style={{
                                            backgroundColor: colorList.red,
                                            marginRight: 10,
                                          }}
                                          labelStyle={{color: colorList.white}}>
                                          <Icons
                                            name="delete"
                                            color={colorList.white}
                                          />
                                        </Button>
                                        <ShareModalContents
                                          open={
                                            openedShareListId ===
                                            `${ids}${ids2}`
                                          }
                                          openMenu={() =>
                                            handleOpenShareModal(
                                              `${ids}${ids2}`,
                                            )
                                          }
                                          closeMenu={handleCloseShareModal}
                                          data={item}
                                        />
                                      </View>
                                    </View>
                                  ) : (
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                      }}>
                                      <View
                                        style={{
                                          flex: 5,
                                          justifyContent: 'center',
                                        }}>
                                        <Text
                                          variant="labelMedium"
                                          style={{
                                            color: colorList.dark,
                                          }}>
                                          {item?.file?.split('/')?.pop()}
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          flex: 7,
                                          flexDirection: 'row',
                                          justifyContent: 'center',
                                        }}>
                                        <Button
                                          mode="elevated"
                                          onPress={() =>
                                            handleDeleteFiles(item)
                                          }
                                          style={{
                                            backgroundColor: colorList.red,
                                            marginRight: 10,
                                          }}
                                          labelStyle={{color: colorList.white}}>
                                          <Icons
                                            name="delete"
                                            color={colorList.white}
                                          />
                                        </Button>
                                        <ShareModalContents
                                          open={
                                            openedShareListId ===
                                            `${ids}${ids2}`
                                          }
                                          openMenu={() =>
                                            handleOpenShareModal(
                                              `${ids}${ids2}`,
                                            )
                                          }
                                          closeMenu={handleCloseShareModal}
                                          data={item}
                                        />
                                      </View>
                                    </View>
                                  )}
                                </TouchableOpacity>
                                {docList.image && (
                                  <ImageView
                                    images={docList.image}
                                    imageIndex={0}
                                    visible={visible.image}
                                    onRequestClose={() =>
                                      setIsVisible(prev => ({
                                        ...prev,
                                        image: false,
                                      }))
                                    }
                                  />
                                )}
                                {docList?.pdf && (
                                  <CustomModal
                                    show={visible.pdf}
                                    close={() =>
                                      setIsVisible(prev => ({
                                        ...prev,
                                        pdf: false,
                                      }))
                                    }>
                                    <SafeAreaView
                                      style={{
                                        flex: 1,
                                        width: Dimensions.get('screen').width,
                                      }}>
                                      <View
                                        style={{
                                          flex: 1,
                                        }}>
                                        <View
                                          style={{
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                            paddingRight: 30,
                                          }}>
                                          <TouchableOpacity
                                            onPress={() =>
                                              setIsVisible(prev => ({
                                                ...prev,
                                                pdf: false,
                                              }))
                                            }>
                                            <Image
                                              source={CloseLargeImage}
                                              style={{
                                                width: 40,
                                                height: 40,
                                                resizeMode: 'contain',
                                              }}
                                            />
                                          </TouchableOpacity>
                                        </View>

                                        <Pdf
                                          trustAllCerts={false}
                                          source={docList?.pdf}
                                          onLoadComplete={(
                                            numberOfPages,
                                            filePath,
                                          ) => {
                                            console.log(
                                              `Number of pages: ${numberOfPages}`,
                                            );
                                          }}
                                          onPageChanged={(
                                            page,
                                            numberOfPages,
                                          ) => {
                                            console.log(
                                              `Current page: ${page}`,
                                            );
                                          }}
                                          onError={error => {
                                            console.log('Errrrrrrrr', error);
                                          }}
                                          style={{
                                            flex: 1,
                                            width:
                                              Dimensions.get('window').width,
                                            height:
                                              Dimensions.get('window').height,
                                          }}
                                        />
                                      </View>
                                    </SafeAreaView>
                                  </CustomModal>
                                )}
                              </Surface>
                            </React.Fragment>
                          );
                        })
                      : null}
                  </Surface>
                );
              })
            ) : (
              <NoDataAvailable />
            )}

            {imageViews && imageViewData?.length && (
              <CustomImageViewer
                visible={imageViews}
                close={() => setImageViews(false)}
                img={imageViewData}
              />
            )}

            {isVideoPlayer && isVideoPlayerUrl && (
              <CustomModal
                show={isVideoPlayer}
                close={() => setIsVideoPlayer(false)}>
                <VideoPlayer
                  visible={isVideoPlayer}
                  hideModal={() => {
                    setIsVideoPlayer(false);
                  }}
                  url={isVideoPlayerUrl?.file}
                />
              </CustomModal>
            )}
          </ScrollView>
          <View style={{height: 70, position: 'absolute', bottom: 5, right: 5}}>
            <View style={styles.MenuListDetailsChiefComplaintsAddBtnContainer}>
              <CustomAddButton onClick={() => setIspoup(true)} />
            </View>
          </View>
          <CustomModal show={isPopup} close={() => setIspoup(false)}>
            <AddFilesPopup
              close={() => setIspoup(false)}
              patientDetails={patientDetails}
              refetch={() => setRefetch(true)}
            />
          </CustomModal>
        </>
      )}
    </View>
  );
};

const filesStyles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 12,
    fontSize: 14,
    color: colorList.dark,
  },
  placeholderStyle: {
    fontSize: 14,
    fontWeight: '400',
  },
  selectedTextStyle: {
    fontSize: 14,
    fontWeight: '400',
    color: colorList.dark,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 50,
    fontSize: 16,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingLeft: 10,
    marginTop: 16,
  },
  dropdownContainerStyle: {
    backgroundColor: colorList.white,
  },
  dropdownItemTextStyle: {
    color: colorList.dark,
  },
});
