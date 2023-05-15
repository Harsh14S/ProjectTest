import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '../common/Colors'
import { CommonStyles, fontSizeChart } from '../common/Styles'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { IconLinks } from '../common/IconLinks'

export default AddNoteScreen = () => {
  return (
    <SafeAreaView style={[styles.container, CommonStyles.screenPadding]}>
      <TextInput
        placeholder='Add a title to this entry'
        style={styles.txtInputContainer}
        placeholderTextColor={COLORS.grey}
      />
      <Text style={styles.taskHeadingTxt}>Task</Text>
      <View style={styles.newTaskContainer}>
        <View style={styles.addTaskRowContainer}>
          <TouchableOpacity style={styles.radioBtnContainer}>
            <Image source={IconLinks.radioButtonUnselected} style={styles.radioBtnIcon} />
          </TouchableOpacity>
          <Text style={styles.taskTxt}>Add</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveBtnTxt}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // alignItems: "center"
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : null,
  },
  txtInputContainer: {
    width: '100%',
    fontFamily: 'Montserrat-Medium',
    fontSize: fontSizeChart._20px,
    marginBottom: RFPercentage(5),
  },
  taskHeadingTxt: {
    width: '100%',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: fontSizeChart._14px,
    color: COLORS.black,
    marginBottom: RFPercentage(1.5),
    marginBottom: 10,
  },
  newTaskContainer: {
    flex: 1,
    // backgroundColor: COLORS.white,
  },
  addTaskRowContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    // backgroundColor: COLORS.blue,
  },
  radioBtnContainer: {
    marginRight: RFPercentage(0.8),  // 6px

  },
  radioBtnIcon: {
    height: RFPercentage(3),  // 24px
    width: RFPercentage(3),  // 24px


    tintColor: COLORS.grey,
  },
  taskTxt: {
    flex: 1,
    color: COLORS.black,
    fontSize: fontSizeChart._12px,
    fontFamily: 'Montserrat-regular',
    // backgroundColor: COLORS.green,
  },
  saveBtn: {
    width: '100%',
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFPercentage(100),
    paddingVertical: RFPercentage(2.1), // 17px
    bottom: 0,
    position: 'absolute',
    marginBottom: RFPercentage(5),  // 40px
    alignSelf: "center",
  },
  saveBtnTxt: {
    color: COLORS.white,
    fontSize: fontSizeChart._18px,
    fontFamily: 'Montserrat-Bold',
  }
})
