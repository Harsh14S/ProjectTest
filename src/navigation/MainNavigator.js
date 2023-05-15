import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import AddNoteScreen from '../components/AddNoteScreen';
import DashboardPendingScreen from '../components/DashboardPendingScreen';
import { IconLinks } from '../common/IconLinks';
import { RFPercentage } from "react-native-responsive-fontsize";
import { COLORS } from '../common/Colors';
import CustomDrawerContent from './CustomDrawerContent';
import { getHeaderTitle } from '@react-navigation/elements';
import { CustomStackNavigatorHeader } from './CustomStackNavigatorHeader';
import { CommonStyles } from '../common/Styles';
import CompanyDataScreen from '../components/CompanyDataScreen';
import AllCompanyData from '../components/AllCompanyData';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      // initialRouteName=''
      screenOptions={{
        // headerShown: false,
      }}
    >
      <Stack.Screen name='home' component={DrawerNavigator} options={{
        headerShown: false
      }} />
      <Stack.Screen name="addNote" component={AddNoteScreen} options={{
        header: ({ navigation, route, options }) => {
          const title = getHeaderTitle(options, route.name);

          return (
            <CustomStackNavigatorHeader title={title} navigation={navigation} />
          );
        },
      }} />
      <Stack.Screen name="AllCompanyData" component={AllCompanyData} />
    </Stack.Navigator>
  )
}

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      defaultStatus='open'
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { width: '100%' },
        headerTitle: '',
        header: ({ navigation, route, options }) => {
          return <SafeAreaView style={CommonStyles.headerStyle}>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: RFPercentage(2.2) }}>
              <Image source={IconLinks.menuBars} style={{ height: RFPercentage(2.7), width: RFPercentage(2.7), }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: RFPercentage(2.2) }}>
              <Image source={IconLinks.search} style={{ height: RFPercentage(2.7), width: RFPercentage(2.7) }} />
            </TouchableOpacity>
          </SafeAreaView>;
        }
      }}
    >
      <Drawer.Screen name="AllDrawer" component={BottomTabNavigator} />
    </Drawer.Navigator>
  )
}



export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="CompanyDataScreen" component={CompanyDataScreen} options={{
        title: 'All'
      }} />
      <Tab.Screen name="Pending" component={DashboardPendingScreen} />
      {/* <Tab.Screen name="addNote" component={StackNavigator} /> */}
    </Tab.Navigator>
  )
}
