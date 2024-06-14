import React, {useEffect} from 'react';

import {NavigationContainers} from './src/routes/Navigations';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {ToastProvider} from 'react-native-toast-notifications';
import {Text, View} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/redux/store';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider, MD3LightTheme as DefaultTheme} from 'react-native-paper';
import {colorList} from './src/styles/global.styles';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Appearance} from 'react-native';

export default function App() {
  useEffect(() => Appearance.setColorScheme('light'), []);
  const queryClient = new QueryClient();

  const theme = {
    ...DefaultTheme,
    myOwnProperty: true,
    roundness: 4,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
      onSurface: colorList.dark,
      outlineVariant: colorList.Grey4,
    },
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastProvider
            placement="top"
            duration={2500}
            animationType="slide-in"
            animationDuration={500}
            swipeEnabled={true}
            offsetTop={15}
            renderType={{
              custom_type: toast => {
                return (
                  <View
                    style={{
                      padding: 15,
                      backgroundColor: 'red',
                      borderRadius: 12,
                    }}>
                    <Text style={{color: 'green'}}>{toast.message}</Text>
                  </View>
                );
              },
            }}>
            <QueryClientProvider client={queryClient}>
              <SafeAreaProvider>
                <GestureHandlerRootView>
                  <NavigationContainers />
                </GestureHandlerRootView>
              </SafeAreaProvider>
            </QueryClientProvider>
          </ToastProvider>
        </PersistGate>
      </PaperProvider>
    </Provider>
  );
}
