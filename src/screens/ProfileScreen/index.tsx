import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
// import {CustomHeader} from '../../components/CustomHeader';
import { ArrowRightLgIcon, LogOutIcon } from "../../assets";
import { styles } from "./profile.styles";
import { API_URL } from "../../utils/constants";
import { useQuery } from "@tanstack/react-query";
import { CustomLoaderRound } from "../../components/CustomLoaderRound";
import { NavigationList } from "../../routes/NavigationList";
import { useDispatch, useSelector } from "react-redux";
import { removeLoginDetails } from "../../redux/actions";
import { axiosInstance as axios } from "../../config/axios.config.custom";
import { Avatar, Button, Card, Divider, IconButton } from "react-native-paper";
import { StoreTypes } from "redux/reducer";
import { useModal } from "hooks";
import Icon from "react-native-vector-icons/MaterialIcons";
import { colorList } from "styles/global.styles";
const ClinicList = () => {
  const [open, setOpen] = useState<boolean>(true);
  const getClinicList = async (params: any) => {
    try {
      const res = await axios.get(API_URL.clinicList);
      return res;
    } catch (error) {
      console.error("Errors ====> get Clinic List", error);
      throw error;
    }
  };
  const loginData = useSelector((state: StoreTypes) => state.loginData);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["clinicLists"],
    queryFn: getClinicList,
  });

  const getNameLetters = (name: string) => {
    if (name && name.length > 0) {
      name;
      return `${name[0]?.toUpperCase()}`;
    }
    return "";
  };

  useEffect(() => {
    console.log(loginData);
  }, [loginData]);

  return (
    <View style={styles.clinickContainer}>
      <Card.Title
        title={loginData?.userdetails?.name || ""}
        subtitle={loginData?.userdetails?.email || ""}
        leftStyle={{ padding: 0, margin: 0, marginLeft: 0 }}
        left={(props) =>
          loginData?.userdetails?.photo ? (
            <Avatar.Image
              {...props}
              size={52}
              source={{
                uri: loginData?.userdetails?.photo,
              }}
            />
          ) : (
            <Avatar.Text
              size={52}
              label={getNameLetters(loginData?.userdetails?.name)}
            />
          )
        }
        style={{
          margin: 0, // You can adjust the margin as needed
          padding: 0, // Adjust the padding as needed
        }}
      />
      <View style={styles.hrLine} />
      <TouchableOpacity
        onPress={() => {
          setOpen((prev) => !prev);
        }}
        style={styles.clicnicHeadContainer}
      >
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={styles.clinicHeading}>My Clinics</Text>
        </View>
        {/* <IconButton icon="down"/> */}
        <IconButton icon={open ? "chevron-up" : "chevron-down"} size={20} />
      </TouchableOpacity>
      {open && (
        <ScrollView
          style={{
            maxHeight:
              data?.data?.data?.length > 5
                ? Dimensions.get("screen").height * 0.5
                : Dimensions.get("screen").height * 0.25,
          }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading || isFetching ? (
            <CustomLoaderRound />
          ) : (
            data?.data?.data?.map((item: any) => {
              return (
                <View key={item?.Unique_Id}>
                  <TouchableOpacity
                    style={styles.clinicLabelTextContaine}
                    onPress={() => Alert.alert("Coming Soon")}
                  >
                    <View>
                      <Text style={styles.clinicLabel}>
                        {item?.Clinic_Name || "N.A"}
                      </Text>
                      <Text style={styles.clinicText}>
                        {`ID : ${item?.Unique_Id || "N.A"}`}
                      </Text>
                    </View>
                    {/* <Image source={ArrowRightSmIcon} /> */}
                  </TouchableOpacity>
                  <Divider />
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* <TouchableOpacity
        style={styles.addMoreClicnicBtnContainer}
        onPress={() => Alert.alert('Comming Soon')}>
        <Text style={styles.addMoreClicnicBtn}>+ Add More Clinics</Text>
      </TouchableOpacity> */}
    </View>
  );
};
interface FeatureListTypes {
  id: number;
  label: string;
  icon: any;
  iconColor:string;
  navigate: any;
}

const ProfileFeatersList = ({ navigation }: any) => {
  const handleLogout = async () => {
    navigation();
  };

  const list: FeatureListTypes[] = [
    {
      id: 5,
      label: "Log Out",
      icon: "logout",
      iconColor:colorList.palette.error.main,
      navigate: handleLogout,
    },
  ];

  return (
    <ScrollView>
      {list?.map((item) => {
        return (
          <TouchableOpacity
            key={item?.id}
            style={styles.profMainContainer}
            onPress={() =>
              item.navigate ? item.navigate() : Alert.alert("Coming Soon")
            }
          >
            <View style={styles.profIconLabelContainer}>
              {/* <View style={styles.profIconContainer}>
                <Image source={item?.icon} style={styles.profFeatureIcon} />
              </View> */}
              <Text style={styles.profFeaturelabel}>{item?.label}</Text>
            </View>
            <Icon
              name={item.icon}
              color={item.iconColor}
              size={20}
            />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export const ProfileScreen = ({ navigation }: any) => {
  const { CustomModal } = useModal();
  const [open, setOpen] = useState<boolean>(false);
  const logoutNavigation = () => {
    setOpen(true)
  };

  const dispatch = useDispatch();
  const logouts = () => {
    navigation.navigate(NavigationList.welcome);
    setTimeout(()=>{
      dispatch(removeLoginDetails());
    },500)
  };
  const handleClose = () => setOpen(false);
  return (
    <View style={{ flex: 1 }}>
      <CustomModal
        handleCloseModal={handleClose}
        open={open}
        title={
          <Text
            style={{ fontWeight: "600", fontSize: 17, paddingHorizontal: 5 }}
          >
            Logout !
          </Text>
        }
      >
        <View
          style={{
            padding: 10,
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text>Are you sure you want to log out?</Text>
          <Text>
           
          </Text>
        </View>
        <View
          style={{
            padding: 10,
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 7,
          }}
        >
          <Button compact textColor={colorList.palette.success.main} onPress={handleClose}>
            No
          </Button>
          <Button compact textColor={colorList.palette.error.main} onPress={logouts}>
            Yes
          </Button>
        </View>
      </CustomModal>
      <ScrollView style={{ marginBottom: 10 }}>
        {/* <CustomHeader headerText="My Profile" /> */}
        <View style={styles.container}>
          <ClinicList />
          <ProfileFeatersList navigation={logoutNavigation} />
        </View>
      </ScrollView>
    </View>
  );
};

const data = {
  Authorization_Bearer:
    "eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.eyJjbGluaWNfaWQiOiI5OTIzMjc1OSIsInVzZXJfaWQiOiI0MDU5NjgiLCJzcGVjaWFsaXphdGlvbiI6IjMifQ.wF9NQE9QS-l8PHBLP2tB76tvWLGR9hG8rjcWqkn775A",
  clinic_details: { clinic_exist: "Yes", clinic_name: "HARVEST CLINICS INDIA" },
  roles: {
    admin: "1",
    appointments: "1",
    clinic: "1",
    doctor: "1",
    emr: "1",
    patient: "1",
  },
  userdetails: {
    email: "naj.geeth@gmail.com",
    mobile: "9037059997",
    name: "Najiya S Muhammed",
    photo: "",
    user_id: "405968",
  },
};
