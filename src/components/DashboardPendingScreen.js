import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CommonStyles } from '../common/Styles'
import { COLORS } from '../common/Colors'

export default DashboardPendingScreen = () => {
  return (
    <SafeAreaView style={[styles.container, CommonStyles.screenPadding]}>
      <Text>DashboardPendingScreen</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS
  }
})
