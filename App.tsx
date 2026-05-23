import React, { useEffect } from "react";

import { NavigationContainers } from "./src/routes/Navigations";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/config/queryClient";
import { ToastProvider } from "react-native-toast-notifications";
import { Text, View, Appearance, StatusBar, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/redux/store";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { colorList } from "./src/styles/global.styles";
import { appTheme } from "./src/styles/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ModalProvider from "providers/ModalProviders";

function AppContent() {
  const insets = useSafeAreaInsets();
  useEffect(() => Appearance.setColorScheme("light"), []);
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colorList.white}
        translucent={Platform.OS === "android"}
      />
      <QueryClientProvider client={queryClient}>
        <ToastProvider
          placement="top"
          duration={2500}
          animationType="slide-in"
          animationDuration={500}
          swipeEnabled={true}
          offsetTop={insets.top + 8}
          renderType={{
            custom_type: (toast) => {
              return (
                <View
                  style={{
                    padding: 15,
                    backgroundColor: "red",
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: "green" }}>{toast.message}</Text>
                </View>
              );
            },
          }}
        >
          <PaperProvider theme={appTheme}>
            <PersistGate loading={null} persistor={persistor}>
              <ModalProvider>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <NavigationContainers />
                  </GestureHandlerRootView>
              </ModalProvider>
            </PersistGate>
          </PaperProvider>
        </ToastProvider>
      </QueryClientProvider>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}
