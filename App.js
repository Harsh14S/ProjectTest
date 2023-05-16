import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { DrawerNavigator, StackNavigator } from './src/navigation/MainNavigator';
import { COLORS } from './src/common/Colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default App = () => {
  const asynStorageClear = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage Cleared......')
    } catch (e) {
      // clear error
      console.log('Error: ', e);
    }
  }
  useEffect(() => {
    asynStorageClear();
  }, [])

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} translucent={false} backgroundColor={COLORS.white} />
      <NavigationContainer>
        {/* <DrawerNavigator /> */}
        <StackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
