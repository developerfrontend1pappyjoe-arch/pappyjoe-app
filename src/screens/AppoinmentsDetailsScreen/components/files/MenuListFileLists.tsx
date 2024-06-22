import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { API_URL } from "../../../../utils/constants";
import { CustomLoaderRound } from "../../../../components/CustomLoaderRound";
import { Dimensions, ScrollView, View, Alert, StyleSheet } from "react-native";
import { Button, Card, Divider, Icon, Surface, Text } from "react-native-paper";
import { NoDataAvailable } from "../../../../components/NoDataAvailable";
import Icons from "react-native-vector-icons/MaterialIcons";
import ImageView from "react-native-image-viewing";
import Pdf from "react-native-pdf";
import RNFS from "react-native-fs";
import { CustomModal } from "../../../../components/CustomModal";
import lodash from "lodash";
import { colorList } from "../../../../styles/global.styles";
import { CustomAddButton } from "../../../../components/CustomAddButton";
import { styles } from "../../appoinmentDetails.styles";
import { AddFilesPopup } from "./AddFiles";
import { CloseLargeImage } from "../../../../assets";
import { ShareModalContents } from "./ShareModalContents";
import moment from "moment";
import { CustomImageViewer } from "./ImageViewer";
import { axiosInstance as axios } from "../../../../config/axios.config.custom";
import { VideoPlayer } from "./VideoPlayer";
import FileContentCard from "./FileContentCard";
import { ExtentionTypes,allFileTypes } from "./fileExtentionTypes";
type ShowFileViewerType = { type: ExtentionTypes | null; url: string };
export const MenuListDetailsFileList = ({ patientDetails }: any) => {
  const [isLoading, setLoading] = useState(false);
  const [isPopup, setIspoup] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [fileList, setFileList] = useState(null);
  const [imageViews, setImageViews] = useState(false);
  const [imageViewData, setImageViewData] = useState([]);
  const [showFileViewer, setShowFileViewer] = useState<ShowFileViewerType>();
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
  const getFileListApi = async () => {
    setLoading(true);
    try {
      axios
        .get(`${API_URL.fileslist}?patient_id=${patientDetails?.id}`)
        .then((res) => {
          // console.log('Files Data ===> 2223333', res?.data?.data);
          setLoading(false);
          if (
            res?.data?.data?.length &&
            lodash.isEqual(res?.data?.data, [[]])
          ) {
            setFileList(null);
          } else {
            const data = res?.data?.data;
            const sortedData = data.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
            const groupedData = sortedData.reduce((acc, curr) => {
              if (!acc[curr.date]) {
                acc[curr.date] = [];
              }
              acc[curr.date].push(curr);
              return acc;
            }, {});
            // console.log('Finals ===> ', groupedData);

            setFileList(groupedData);
          }
        })
        .catch((err) => {
          // console.log('Error for geting files ', err);
        });
    } catch (error) {
      console.error("Err in getFileList Details....", error);
      setFileList(null);
    }
  };

  const allFiles = useMemo(() => {
    if (fileList && Object.entries(fileList)?.length) {
      return Object.entries(fileList) || [];
    }
    return [];
  }, [fileList]);

  const handleShowFileViewer = useCallback(
    (params: ShowFileViewerType) => {
      console.log(params);
      
      setShowFileViewer(params);
    },[showFileViewer]);

  useEffect(() => {
    getFileListApi();
    setTimeout(() => {
      setRefetch(false);
    }, 1000);
  }, [refetch]);
  return (
    <View style={{ flex: 1, borderRadius: 10 }}>
      {isLoading ? (
        <CustomLoaderRound />
      ) : (
        <>
          <ScrollView
            style={{
              maxHeight: Dimensions.get("screen").height * 0.55,
            }}
          >
            {allFiles.map(([key, val], ids: number) => {
              return (
                <Surface
                  key={ids}
                  style={{
                    backgroundColor: colorList.white,
                    borderRadius: 8,
                    padding: 10,
                    margin: 2,
                    marginBottom: 10,
                    gap: 15,
                  }}
                >
                  <View style={{ marginVertical: 5 }}>
                    <Text
                      variant="titleMedium"
                      style={{ color: colorList.dark }}
                    >
                      {moment(key).format("DD-MM-YYYY")}
                    </Text>
                    <Divider style={{ marginVertical: 10 }} />
                  </View>
                  {val?.map((item: any, index: number) => {
                    return (
                      <FileContentCard
                        key={`${ids}${index}`}
                        keyId={`${ids}${index}`}
                        fileData={item}
                        handleShowFileViewer={handleShowFileViewer}
                      />
                    );
                  })}
                </Surface>
              );
            })}
            {allFiles.length == 0 && <NoDataAvailable />}
              <CustomImageViewer
                visible={showFileViewer?.type == allFileTypes.image}
                close={() => setShowFileViewer({type:null,url:""})}
                img={[{uri:showFileViewer?.url}]}
              />
              <CustomModal
                show={showFileViewer?.type == allFileTypes.video}
                close={() => setShowFileViewer({type:null,url:""})}
              >
               {showFileViewer?.type == allFileTypes.video && <VideoPlayer
                  visible={showFileViewer?.type == allFileTypes.video}
                  hideModal={() => {setShowFileViewer({type:null,url:""});}}
                  url={showFileViewer.url}
                />}
              </CustomModal>
          </ScrollView>

          <View
            style={{ height: 70, position: "absolute", bottom: 5, right: 5 }}
          >
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
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 12,
    fontSize: 14,
    color: colorList.dark,
  },
  placeholderStyle: {
    fontSize: 14,
    fontWeight: "400",
  },
  selectedTextStyle: {
    fontSize: 14,
    fontWeight: "400",
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
