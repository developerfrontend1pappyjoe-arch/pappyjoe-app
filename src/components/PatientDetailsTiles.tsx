import React, { memo, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../screens/AppoinmentsDetailsScreen/appoinmentDetails.styles";
import { ProfileAvatar } from "../assets";
import { PhoneNumberContainer } from "../screens/AppoinmentsDetailsScreen/components/PhoneNumberTiles";
import { CustomImageViewer } from "../screens/AppoinmentsDetailsScreen/components/files/ImageViewer";
import { CustomContentLoader } from "./CustomContentLoader";
import { checkCountryCode } from "utils/commonUtils";
import IonIcon from "react-native-vector-icons/Ionicons";
import { colorList } from "styles/global.styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationList } from "routes/NavigationList";
import { useSelector } from "react-redux";

interface PatientDetailsTileProps {
  patientId: string;
  isLoading?: boolean;
}

interface ImageObject {
  uri: string | undefined;
}

export const PatientDetailsTiles = memo(
  ({ isLoading=false }: PatientDetailsTileProps) => {
    // console.log("😇 ===> ", patientId);
    const navigation = useNavigation();
    const [imageViews, setImageViews] = useState(false);
    const [imageViewData, setImageViewData] = useState<ImageObject[]>([]);
    // const [patientDetails, setPatientDetails] =
    //   useState<PatientDataProps | null>(null);
    // const [isLoading, setLoading] = useState<boolean>(false);
    const route = useRoute();
    const handleNavigate = () => {
      navigation.navigate(NavigationList.billing as never);
    };
 
    const patientDetails = useSelector((state: any) => state.patientDetails);
    const openDialer = () => {
      Linking.openURL(
        `tel:+${checkCountryCode(patientDetails?.country_code)}${patientDetails?.mobile}`
      );
    };

    const openWhatsApp = () =>
      Linking.openURL(
        `whatsapp://send?text=Hai&phone=${checkCountryCode(patientDetails?.country_code)}${patientDetails?.mobile}`
      );

    if (isLoading) return <View style={{padding:4}}><CustomContentLoader tWidth={"50%"} pHeight={15} /></View>;
    else
      return (
        <View style={styles.patientDetailsContainer}>
          <View>
            {route.name != NavigationList.billing && (
              <TouchableOpacity
                onPress={handleNavigate}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  backgroundColor: colorList.socondary,
                  padding: 4,
                  borderRadius: 5,
                }}
              >
                <IonIcon name="receipt" color={colorList.white} size={17} />
              </TouchableOpacity>
            )}
            <View style={styles.profileSection}>
              <TouchableOpacity
                style={{ marginRight: 8 }}
                onPress={() => {
                  // console.log("clicked----------------------------------------");

                  patientDetails?.Photo !== ""
                    ? (setImageViewData([{ uri: patientDetails?.Photo }]),
                      setImageViews(true))
                    : Alert.alert("No Image Found");
                }}
              >
                <Image
                  source={
                    patientDetails?.Photo
                      ? { uri: patientDetails?.Photo }
                      : ProfileAvatar
                  }
                  style={styles.profileImage}
                />
              </TouchableOpacity>
              <View>
                <View style={styles.profileNameFilnoWrapper}>
                  <Text style={styles.profileNameText}>
                    {patientDetails?.Name || "N.A"}
                  </Text>
                  {patientDetails?.File_No && (
                    <View style={styles.profileFileNoContainer}>
                      <Text style={styles.profileFileNo}>File No.</Text>
                      <Text style={styles.profileFileNo}>
                        {patientDetails?.File_No || "N.A"}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.patientIdContainer}>
                  <Text style={styles.profilePatientIdLabel}>Patient Id :</Text>
                  <Text style={styles.profilePatientId}>
                    {`${
                      patientDetails?.patient_code
                        ? patientDetails?.patient_code
                        : patientDetails?.Patient_Id
                    }  ${
                      patientDetails?.gender !== "undefined"
                        ? `/ ${patientDetails?.gender} `
                        : ""
                    }  ${patientDetails?.age ? `/ ${patientDetails?.age}` : ""}`}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.hrLine} />
            <PhoneNumberContainer
              label="Primary No."
              number={patientDetails?.mobile}
              onPress={openDialer}
              whatsapp
              whatsAppAction={openWhatsApp}
            />
            {patientDetails?.phone !== "" && (
              <View>
                <View style={styles.hrLine} />
                <PhoneNumberContainer
                  label="Secondary No."
                  number={patientDetails?.phone}
                  onPress={openDialer}
                />
              </View>
            )}
          </View>

          {imageViews && imageViewData?.length && (
            <CustomImageViewer
              visible={imageViews}
              close={() => setImageViews(false)}
              img={imageViewData}
            />
          )}
        </View>
      );
  }
);

PatientDetailsTiles.displayName = "PatientDetailsTiles";
