import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { API_URL } from "../../../../utils/constants";
import { CustomLoaderRound } from "../../../../components/CustomLoaderRound";
import {
  Dimensions,
  ScrollView,
  View,
  Alert,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Divider, FAB, Surface, Text } from "react-native-paper";
import { NoDataAvailable } from "../../../../components/NoDataAvailable";
import RNFS from "react-native-fs";
import { CustomModal } from "../../../../components/CustomModal";
import lodash from "lodash";
import { colorList } from "../../../../styles/global.styles";
import { CustomAddButton } from "../../../../components/CustomAddButton";
import { styles } from "../../appoinmentDetails.styles";
import { AddFilesPopup } from "./AddFiles";
import moment from "moment";
import { CustomImageViewer } from "./ImageViewer";
import { axiosInstance as axios } from "../../../../config/axios.config.custom";
import { VideoPlayer } from "./VideoPlayer";
import FileContentCard from "./FileContentCard";
import { ExtentionTypes, allFileTypes } from "./fileExtentionTypes";
import { StoreTypes } from "redux/reducer";
import { useSelector } from "react-redux";
type ShowFileViewerType = { type: ExtentionTypes | null; url: string };
export const MenuListDetailsFileList = () => {
  const [isLoading, setLoading] = useState(false);
  const [isPopup, setIspoup] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [fileList, setFileList] = useState(null);
  const [showFileViewer, setShowFileViewer] = useState<ShowFileViewerType>();
  const patientDetails = useSelector(
    (state: StoreTypes) => state.patientDetails
  );
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
  const handleDelete = () => {
    getFileListApi();
  };

  const allFiles = useMemo(() => {
    if (fileList && Object.entries(fileList)?.length) {
      return Object.entries(fileList) || [];
    }
    return [];
  }, [fileList, refetch]);

  const handleShowFileViewer = useCallback(
    async (params: ShowFileViewerType) => {
      setShowFileViewer(params);
    },
    [showFileViewer]
  );

  const onRefresh = useCallback(() => {
    getFileListApi();
  }, []);

  useEffect(() => {
    getFileListApi();
    setTimeout(() => {
      setRefetch(false);
    }, 1000);
  }, [refetch]);

  return (
    <View style={{ flex: 1, borderRadius: 10 }}>
      <>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
          style={{maxHeight: Dimensions.get("screen").height }}
        >
          {allFiles.map(([key, val], ids: number) => {
            return (
              <Surface
                key={ids}
                style={{
                  // backgroundColor: colorList.white,
                  borderRadius: 8,
                  padding: 10,
                  margin: 2,
                  marginBottom: 45,
                  gap: 15,
                }}
              >
                <View style={{ marginVertical: 5 }}>
                  <Text variant="titleMedium" style={{ color: colorList.dark }}>
                    {moment(key).format("DD-MM-YYYY")}
                  </Text>
                  <Divider style={{ marginVertical: 10 }} />
                </View>
                {val?.map((item: any, index: number) => {
                  return (
                    <View key={`fileCardId${index}`}>
                      <FileContentCard
                        handleDelete={handleDelete}
                        keyId={`${ids}${index}`}
                        fileData={item}
                        handleShowFileViewer={handleShowFileViewer}
                      />
                    </View>
                  );
                })}
              </Surface>
            );
          })}
          {allFiles.length == 0 && !isLoading && <NoDataAvailable />}
          <CustomImageViewer
            visible={showFileViewer?.type == allFileTypes.image}
            close={() => setShowFileViewer({ type: null, url: "" })}
            img={[{ uri: showFileViewer?.url }]}
          />
          <CustomModal
            show={showFileViewer?.type == allFileTypes.video}
            close={() => setShowFileViewer({ type: null, url: "" })}
          >
            {showFileViewer?.type == allFileTypes.video && (
              <VideoPlayer
                visible={showFileViewer?.type == allFileTypes.video}
                hideModal={() => {
                  setShowFileViewer({ type: null, url: "" });
                }}
                url={showFileViewer.url}
              />
            )}
          </CustomModal>
        </ScrollView>

        {/* <View style={{ height: 70, position: "absolute", bottom: 5, right: 5 }}>
          <View style={styles.MenuListDetailsChiefComplaintsAddBtnContainer}>
            <CustomAddButton onClick={() => setIspoup(true)} />
          </View>
        </View> */}
        <FAB
          mode="flat"
          style={filesStyles.fab}
          color={colorList.white}
          icon="plus"
          onPress={() => {
            setIspoup(true);
          }}
        />
        <CustomModal show={isPopup} close={() => setIspoup(false)}>
          <AddFilesPopup
            close={() => setIspoup(false)}
            patientDetails={patientDetails}
            refetch={() => setRefetch(true)}
          />
        </CustomModal>
      </>
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
    fontSize: 12,
    color: colorList.dark,
  },
  placeholderStyle: {
    fontSize: 12,
    fontWeight: "400",
  },
  selectedTextStyle: {
    fontSize: 12,
    fontWeight: "400",
    color: colorList.dark,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 50,
    fontSize: 14,
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
  fab: {
    position: "absolute",
    marginHorizontal: 16,
    marginBottom: 10,
    right: 0,
    bottom: 0,
    backgroundColor: colorList.socondary,
  },
});
