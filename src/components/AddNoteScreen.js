import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default AddNoteScreen = () => {
  return (
    <SafeAreaView style={[styles.container]}>
      <Text>AddNoteScreen</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : null,
  }
})
