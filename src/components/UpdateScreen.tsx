import React from "react";
import { Alert, Image, Linking, TouchableOpacity, View } from "react-native";
import { CustomHeaderDesc } from "./CustomHeaderDesc";
import { colorList } from "styles/global.styles";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

function UpdateScreen() {
  const navigateTo = useNavigation();
  const openPlayStore = () => {
    const packageName = "com.pappyjoe.app"; // Replace with your app's package name
    const url = `https://play.google.com/store/apps/details?id=${packageName}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Unable to open the Play Store.");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: colorList.white,
      }}
    >
      <View
        style={{
          height: "50%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: 25,
        }}
      >
        <Image
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
          }}
          source={require("../assets/UpdateAlert/update-image.png")}
        />
      </View>
      <View
        style={{
          height: "50%",
          display: "flex",
          alignItems: "center",
          paddingVertical: 20,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            paddingVertical: 30,
            alignItems: "center",
            flexDirection: "column",
            gap: 30,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              lineHeight: 26,
              textAlign: "center",
              fontWeight: "700",
              color: colorList.dark,
            }}
          >
            New update
          </Text>

          <Button
            icon={"update"}
            onPress={openPlayStore}
            contentStyle={{
              backgroundColor: colorList.socondary,
              flexDirection: 'row-reverse'
            }}
            labelStyle={{ color: colorList.white }}
            mode="elevated"
          >
            Update
          </Button>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigateTo.goBack();
          }}
        >
          <Text style={{ color: colorList.blue }}>Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default UpdateScreen;
