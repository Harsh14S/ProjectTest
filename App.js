import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import { COLORS } from './src/common/Colors';

export default App = () => {

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} translucent={false} backgroundColor={COLORS.white} />
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </View>
  );
};
