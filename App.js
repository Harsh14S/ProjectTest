import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { DrawerNavigator, StackNavigator } from './src/navigation/MainNavigator';
import { COLORS } from './src/common/Colors';

export default App = () => {

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} translucent={false} backgroundColor={COLORS.white} />
      <NavigationContainer>
        {/* <DrawerNavigator /> */}
        <StackNavigator />
      </NavigationContainer>
    </View>
  );
};
