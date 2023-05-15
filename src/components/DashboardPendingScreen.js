import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CommonStyles } from '../common/Styles'
import { COLORS } from '../common/Colors'

export default DashboardPendingScreen = () => {
  return (
    <View style={[styles.container, CommonStyles.screenPadding]}>
      <Text>DashboardPendingScreen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS
  }
})
