import React, { memo } from "react";
import { Image, Linking, TouchableOpacity, View } from "react-native";
import { Avatar, List, Surface, Text } from "react-native-paper";
import { CallFillIcon, ProfileAvatar, WhatsAppIcon } from "../../../assets";
import { styles } from "../patientlist.styles";
import { PatientDataProps } from "types/PatientDetailsTypes";
import { checkCountryCode } from "utils/commonUtils";
import { colorList } from "styles/global.styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
interface PatientListProps {
  data: PatientDataProps;
  navigate: () => void;
}
const iconSize = 27;
export const PatientList = memo(({ data, navigate }: PatientListProps) => {
  const openDialer = () =>
    Linking.openURL(
      `tel:+${checkCountryCode(data?.country_code)}${data?.mobile}`
    );

  const openWhatsApp = () => {
    Linking.openURL(
      `whatsapp://send?text=Hai&phone=${checkCountryCode(data?.country_code)}${data?.mobile}`
    );
  };

  return (
    // <Surface style={styles.listContainer} >

    //   <TouchableOpacity style={styles.listImage} onPress={navigate}>
    //     <Image
    //       source={
    //         data.Photo !== '' && data?.Photo !== null
    //           ? { uri: data.Photo }
    //           : ProfileAvatar
    //       }
    //       style={{
    //         resizeMode: 'contain',
    //         width: 55,
    //         height: 55,
    //         borderRadius: 10,
    //       }}
    //     />
    //   </TouchableOpacity>
    //   <TouchableOpacity style={styles.listContent} onPress={navigate}>
    //     <View style={styles.listContentWrapper}>
    //       <Text style={styles.listContentHeading}>{data?.Name?.trim()}</Text>
    //       <Text style={styles.listContentid}>ID : {data?.Patient_Id}</Text>
    //     </View>
    //   </TouchableOpacity>
    //   <View
    //     style={[
    //       styles.listSocial,
    //       data?.phone === '' && { justifyContent: 'center' },
    //     ]}>
    //     {data?.mobile !== '' && (
    //       <TouchableOpacity
    //         onPress={openDialer}>
    //         <Image source={CallFillIcon} />
    //       </TouchableOpacity>
    //     )}
    //     {data?.mobile !== '' && (
    //       <TouchableOpacity
    //         onPress={openWhatsApp}
    //         style={{
    //           marginLeft: 15,
    //         }}>
    //         <Image source={WhatsAppIcon} />
    //       </TouchableOpacity>
    //     )}
    //   </View>
    // </Surface>
    <TouchableOpacity onPress={navigate}>
      <List.Item
        title={
             <Text
              style={{ fontSize: 14, fontWeight: "bold" }}
            >{`${data.Name}`} </Text>
        }
        description={
            <Text style={{ fontSize: 11}}> {`Mobile: ${data.mobile} [ ID : ${data.Patient_Id} ]`}</Text>
        }
        right={() => (
          <View>
            {data?.mobile !== "" ? (
              <View style={{ flexDirection: "row",gap:2 }}>
                <TouchableOpacity onPress={openDialer}>
                  <Icon name="phone" size={iconSize} color={colorList.blue} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={openWhatsApp}
                  style={{
                    marginLeft: 15,
                  }}
                >
                  <Icon name="whatsapp" size={iconSize} color={colorList.socondary} />
                </TouchableOpacity>
              </View>
            ) : (
               <View style={{ flexDirection: "row",gap:2 }}>
                <TouchableOpacity>
                  <Icon name="phone" size={iconSize} color={colorList.Grey1} />
                </TouchableOpacity>
                <TouchableOpacity
                 style={{
                  marginLeft: 15,
                }}
                >
                  <Icon name="whatsapp" size={iconSize} color={colorList.Grey1} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        left={(props) =>
          data.Photo ? (
            <Avatar.Image
              style={{
                marginLeft: 5,
                borderWidth: 0.5,
                borderColor: colorList.Grey1,
              }}
              size={40}
              source={{ uri: data.Photo }}
            />
          ) : (
            <Avatar.Text
              color={colorList.white}
              style={{ marginLeft: 3,backgroundColor: colorList.palette.primary.main }}
              size={40}
              label={data.Name[0]}
            />
          )
        }
      />
    </TouchableOpacity>
  );
});

PatientList.displayName = "PatientList";
