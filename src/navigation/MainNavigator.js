import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardAllScreen from '../components/DashboardAllScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import AddNoteScreen from '../components/AddNoteScreen';
import DashboardPendingScreen from '../components/DashboardPendingScreen';
import { IconLinks } from '../common/IconLinks';
import { RFPercentage } from "react-native-responsive-fontsize";
import { COLORS } from '../common/Colors';
import CustomDrawerContent from './CustomDrawerContent';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { width: '100%' },
        headerTitle: '',
        header: ({ navigation, route, options }) => {
          return <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.white }}>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: RFPercentage(2.2), marginTop: RFPercentage(2), marginBottom: RFPercentage(3.4) }}>
              <Image source={IconLinks.menuBars} style={{ height: RFPercentage(2.7), width: RFPercentage(2.7), }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: RFPercentage(2.2), marginTop: RFPercentage(2), marginBottom: RFPercentage(3.4) }}>

              <Image source={IconLinks.search} style={{ height: RFPercentage(2.7), width: RFPercentage(2.7) }} />
            </TouchableOpacity>
          </SafeAreaView>;
        }
      }}
    >
      <Drawer.Screen name="AllDrawer" component={BottomTabNavigator} />
      <Drawer.Screen name="addNote" component={AddNoteScreen} />
    </Drawer.Navigator>
  )
}

const StackNavigator = () => {
  return (
    <Stack.Navigator
      // initialRouteName=''
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='home' component={DrawerNavigator} />
    </Stack.Navigator>
  )
}


const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="All" component={DashboardAllScreen} />
      <Tab.Screen name="Pending" component={DashboardPendingScreen} />
    </Tab.Navigator>
  )
}
