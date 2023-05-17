import { FlatList, Image, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../common/Colors'
import { CommonStyles, fontSizeChart } from '../common/Styles'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import { IconLinks } from '../common/IconLinks'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const dateObj = new Date();
const currentTime = dateObj.getTime();
const currentDate = 11 + ' ' + dateObj.toLocaleString('default', { month: 'short' }) + ', ' + dateObj.getFullYear();

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

  const checkIfCurrentDayExists = async () => {
    await firestore().collection('Companies').doc(currCompany)
      .collection('DailyTask').doc(currentDate)
      .onSnapshot(snap => {
        // console.log("DailyTask: ", snap._data);
        if (snap.exists) {
          // console.log("DailyTask Already Exists");
          checkIfCurrentTaskExists();
        }
        else {
          console.log("New DailyTask Created");
          // console.log("DailyTask Path: ", snap.ref.path);
          snap.ref.set({ 'title': currentDate, 'createdAt': currentTime })
            .then(() => {
              // console.log("Data Added successfully");
              checkIfCurrentTaskExists();
            })
        }
      })
  }

  const checkIfCurrentTaskExists = async () => {
    await firestore().collection('Companies').doc(currCompany)
      .collection('DailyTask').doc(currentDate)
      .collection('Titles').doc(titleValue)
      .onSnapshot(snap => {
        // console.log("Title exists: ", snap.id);
        if (snap.exists) {
          // console.log("Title Already Exists");
          checkIfCurrentSubTaskExists(taskArray);
        }
        else {
          console.log("New Title Created");
          // console.log("Title Path: ", snap.ref.path);
          snap.ref.set({ 'title': titleValue, 'createdAt': currentTime })
            .then(() => {
              // console.log("Data Added successfully");
              checkIfCurrentSubTaskExists(taskArray);
            })
        }
      })
  }

  const checkIfCurrentSubTaskExists = async (value) => {
    // console.log("TaskArray: ", value);
    await value.map((item, index) => {
      console.log("TaskArray: ", index);
      firestore().collection('Companies').doc(currCompany)
        .collection('DailyTask').doc(currentDate)
        .collection('Titles').doc(titleValue)
        .collection('Tasks').doc(item)
        .onSnapshot(snap => {
          console.log("Task exists: ", snap.exists);
          if (snap.exists) {
            console.log("Task Already Exists");
          }
          else {
            console.log("New Task Created");
            // console.log("Title Path: ", snap.ref.path);
            snap.ref.set({ 'taskName': item, 'createdAt': currentTime, completeStatus: false })
              .then(() => {
                console.log("Data Added successfully");
              })
          }
        })
    })
    navigation.goBack();
  }

  const appendArr = () => {
    // console.log("ArrAppend: ", taskArray);
    let dump = taskArray;
    dump.push(addNewTaskTxt);
    setTaskArray(dump);
    setAddNewTaskTxt(null);
    // console.log("Arr: ", dump);
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
                    <Text style={styles.taskTxt}>{item}</Text>
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

        taskArray !== [] && titleValue !== null ?
          // checkIfTaskExists()
          checkIfCurrentDayExists()
          // console.log({ title: titleValue, tasks: taskArray, createdAt: currentTime })
          : console.log("Please fill the details");

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
