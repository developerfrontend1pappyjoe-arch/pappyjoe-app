import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { Menu } from 'react-native-paper';
import { colorList } from 'styles/global.styles';
import ShareEmail from 'react-native-email';
const btnSize = 22;
function ShareComponent({toAddress="",content}:{toAddress:string,content:string}) {
    const [open, setOpen] = React.useState<boolean>(false);
    const onCloseMenu  = ()=>{
        setOpen(false)
    }

    const onOpenMenu = () => {
        setOpen(true)
    }

    const handleEmail = () => {
        ShareEmail(toAddress, {
          subject: "Invoice",
          body: content,
          checkCanOpen: false,
        }).catch(console.error);
      };

  return (
    <View>
       <Menu
                  visible={open}
                  onDismiss={onCloseMenu}
                  anchor={
                    <TouchableOpacity
                      onPress={onOpenMenu}
                    >
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
                        <Icon
                          name="email"
                          size={btnSize}
                          color={colorList.blue}
                        />
                        <Text>Email</Text>
                      </View>
                    }
                  />
                  <Menu.Item
                    onPress={() => {}}
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
                    onPress={() => {}}
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
  )
}

export default ShareComponent


