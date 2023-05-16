import { FlatList, Image, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../common/Colors'
import { CommonStyles, fontSizeChart } from '../common/Styles'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import { IconLinks } from '../common/IconLinks'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

let days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const dateObj = new Date();
const currentTime = dateObj.getTime();
const currentDate = dateObj.getDate() + ' ' + dateObj.toLocaleString('default', { month: 'short' }) + ', ' + dateObj.getFullYear();

export default AddNoteScreen = ({ navigation }) => {
  const [currCompany, setcurrCompany] = useState(null);
  const [titleValue, settitleValue] = useState(null);
  const [addNewTaskTxt, setAddNewTaskTxt] = useState(null);
  const [taskArray, setTaskArray] = useState([]);

  const getCurrentCompany = async () => {
    try {
      const currentCompany = await AsyncStorage.getItem('@currentCompany');
      console.log("Get Storage Value NoteScreen: ", currentCompany);
      setcurrCompany(currentCompany);
    } catch (e) {
      // read error
      console.log('Error: ', e);
    }
  }

  const addNewtaskTitleCollection = async () => {
    await firestore().collection('Companies')
      .doc(currCompany)
      .collection('DailyTask')
      .doc(currentDate).set({ title: titleValue, tasks: taskArray, createdAt: new Date() })
      .then(() => {
        console.log('collection Created');
        navigation.goBack()
      })
  }

  const appendArr = () => {
    console.log("ArrAppend: ", taskArray);
    let dump = taskArray;
    dump.push({
      'task': addNewTaskTxt,
      'completeStatus': false,
    });
    setTaskArray(dump);
    setAddNewTaskTxt(null);
    console.log("Arr: ", dump);
  }

  useEffect(() => {
    getCurrentCompany();
  }, [])

  return (
    <View style={[styles.container, CommonStyles.screenPadding]}>
      <TextInput
        placeholder='Add a title to this entry'
        style={styles.txtInputContainer}
        placeholderTextColor={COLORS.grey}
        onChangeText={(txt) => settitleValue(txt)}
      />
      <Text style={styles.taskHeadingTxt}>Task</Text>
      <View style={styles.newTaskContainer}>
        {
          taskArray.length === 0 ? null :
            <FlatList
              data={taskArray}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                // console.log("Item: ", item);
                return (
                  <View style={styles.addTaskRowContainer}>
                    <TouchableOpacity style={styles.radioBtnContainer}>
                      <Image source={IconLinks.radioButtonUnselected} style={styles.radioBtnIcon} />
                    </TouchableOpacity>
                    <Text style={styles.taskTxt}>{item.task}</Text>
                  </View>

                )
              }}
            />}
        <View style={styles.addTaskRowContainer}>
          <TouchableOpacity style={styles.radioBtnContainer}>
            <Image source={IconLinks.radioButtonUnselected} style={styles.radioBtnIcon} />
          </TouchableOpacity>
          {/* <Text style={styles.taskTxt}>Add</Text> */}
          <TextInput
            style={styles.taskTxtInpt}
            value={addNewTaskTxt}
            // placeholder='add'
            // placeholderTextColor={COLORS.grey}
            onChangeText={(txt) => setAddNewTaskTxt(txt)}
            onBlur={() => { addNewTaskTxt === null ? console.log("Please enter some text") : appendArr() }}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={() => {
        // navigation.goBack("", { companyName: 'Company 444' })
        // addTaskTitle();
        taskArray !== [] && titleValue !== null ? addNewtaskTitleCollection() : console.log("Please fill the details");
        // console.log("Upload: ", { titleValue: taskArray, createdAt: new Date() });
      }}>
        <Text style={styles.saveBtnTxt}>Save</Text>
      </TouchableOpacity>
    </View>
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
    // flex: 1,
    // backgroundColor: COLORS.orange,
  },
  addTaskRowContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    // backgroundColor: COLORS.orange,
    marginBottom: RFPercentage(1.2)
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
  taskTxtInpt: {
    flex: 1,
    // height: 30,
    color: COLORS.black,
    fontSize: fontSizeChart._12px,
    fontFamily: 'Montserrat-regular',
    // backgroundColor: COLORS.green,
    paddingVertical: Platform.OS === 'ios' ? RFPercentage(0.5) : 0,
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
