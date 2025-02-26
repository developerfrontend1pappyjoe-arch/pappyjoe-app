import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { Menu } from "react-native-paper";
import { colorList } from "styles/global.styles";
import ShareEmail from "react-native-email";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
const btnSize = 22;
function ShareComponent({
  content = "",
  subject = "",
}: {
  content: string;
  subject?: string;
}) {
  const toast = useToast();
  const patientDetails =
    useSelector((state: any) => state.patientDetails) || null;
  const [open, setOpen] = React.useState<boolean>(false);
  const onCloseMenu = () => {
    setOpen(false);
  };

  const onOpenMenu = () => {
    setOpen(true);
  };

  const handleTelegram = () => {
    try {
      if (patientDetails?.mobile !== "") {
        Linking.openURL(
          `tg://msg?text=${content}&to=${(patientDetails?.country_code || "") + (patientDetails?.mobile || "")}`
        );
      } else {
        toast.show("The patient does not have an mobile number !", {
          type: "warning",
        });
      }
    } catch (err) {
      toast.show("Unable to send the message on WhatsApp.", {
        type: "error",
      });
    }
  };

  const handleWhatsapp = () => {
    try {
      if (patientDetails?.mobile !== "") {
        Linking.openURL(
          `whatsapp://send?text=${content}&phone=${
            patientDetails?.country_code || "+91"
          }${patientDetails?.mobile}`
        );
      } else {
        toast.show("The patient does not have an mobile number !", {
          type: "warning",
        });
      }
    } catch (err) {
      toast.show("Unable to send the message on WhatsApp.", {
        type: "error",
      });
    }
  };

  const handleEmail = () => {
    if (Boolean(patientDetails?.email)) {
      ShareEmail(patientDetails?.email, {
        subject,
        body: content,
        checkCanOpen: false,
      }).catch(console.error);
    } else {
      toast.show("The patient does not have an email !", {
        type: "warning",
      });
    }
  };

  return (
    <View>
      <Menu
        visible={open}
        onDismiss={onCloseMenu}
        anchor={
          <TouchableOpacity onPress={onOpenMenu}>
            <Icon
              name="share-variant"
              size={btnSize}
              color={colorList.primary}
            />
          </TouchableOpacity>
        }
      >
        <Menu.Item
          onPress={handleEmail}
          title={
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icon name="email" size={btnSize} color={colorList.blue} />
              <Text>Email</Text>
            </View>
          }
        />
        <Menu.Item
          onPress={handleWhatsapp}
          title={
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icon
                name="whatsapp"
                size={btnSize}
                color={colorList.socondary}
              />
              <Text>Whatsapp</Text>
            </View>
          }
        />
        <Menu.Item
          onPress={handleTelegram}
          title={
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <FontAwesomeIcon
                name="telegram"
                size={btnSize}
                color={colorList.primary}
              />
              <Text>Telegram</Text>
            </View>
          }
        />
      </Menu>
    </View>
  );
}

export default ShareComponent;
