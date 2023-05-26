import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { DrawerNavigator, StackNavigator } from './src/navigation/MainNavigator';
import { COLORS } from './src/common/Colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from './src/redux/store'
import { Provider } from 'react-redux';

export default App = () => {
  // const asynStorageClear = async () => {

  useEffect(() => {
    // asynStorageClear();
    // getAsyncStorageData();
  }, [])

  return (
    <Provider store={store}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <StatusBar barStyle={'dark-content'} translucent={false} backgroundColor={COLORS.white} />
        <NavigationContainer>
          {/* <DrawerNavigator /> */}
          <StackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};
