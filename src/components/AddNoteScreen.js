import { FlatList, Image, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../common/Colors'
import { CommonStyles, fontSizeChart } from '../common/Styles'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import { IconLinks } from '../common/IconLinks'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
// import { addCompanyData, addNewDailyTaskTitle, addNewTask, addNewTaskTitle } from '../redux/reducers/Reducer'
import { useDispatch, useSelector } from 'react-redux'
import { StackActions } from '@react-navigation/native'
import { addDailyTask } from '../redux/reducers/Reducer'

// const regEx = /^\s*$/;
const regEx = /^(|\s*)$/; // detects empty string and only blank texts

const dateObj = new Date();
const currentDate = dateObj.getDate() + ' ' + dateObj.toLocaleString('default', { month: 'short' }) + ', ' + dateObj.getFullYear();
const localDate = '25/5/2023';
// const localDate = dateObj.toLocaleDateString();

export default AddNoteScreen = ({ navigation }) => {
  const companyReducer = useSelector((state) => state.companyReducer)
  const dispatch = useDispatch();

  const [currentCompany, setCurrentCompany] = useState(null);
  const [titleValue, setTitleValue] = useState(null);
  const [addNewTaskTxt, setAddNewTaskTxt] = useState(null);
  const [addNewTask, setAddNewTask] = useState(false);
  const [taskArr, setTaskArr] = useState([])
  const [editTaskTxt, setEditTaskTxt] = useState(null);
  const [editTaskIndex, setEditTaskIndex] = useState(null);

  const getCurrentCompany = async () => {
    try {
      const currentCompany = await AsyncStorage.getItem('@currentCompany');
      // console.log("Current Company: ", JSON.parse(currentCompany));
      const objData = JSON.parse(currentCompany)
      setCurrentCompany(objData);
      // dispatch(addCompanyData(objData.companyName))
    } catch (e) {
      console.log('Error: ', e);
    }
  }

  const sendDataToRedux = (title, arr) => {
    const obj = {
      'companyName': currentCompany.companyName,
      'dailyTaskName': localDate,
      'taskTitleName': title,
      'taskData': arr
    }
    dispatch(addDailyTask(obj))
    navigation.dispatch(StackActions.replace('home'));
  }

  const saveNewAddedTask = () => {
    if (addNewTaskTxt === null) {
      console.log("Empty")
    } else {
      setTaskArr([...taskArr, addNewTaskTxt])
      // dispatch(addNewTask(addNewTaskTxt));
      setAddNewTaskTxt(null)
      setAddNewTask(false)
    }
  }
  function checkOnlyBlankSpaces(inputString) {
    if (regEx.test(inputString)) {
      console.log("Blank Spaces or empty")
      return true;
    } else {
      // console.log("input ")
      return false;
    }
  }
  const saveEditedText = (txt, ind) => {
    console.log("Text: ", taskArr[ind]);
    taskArr[ind] = txt;
    console.log('Task Array: ', taskArr)
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
        onChangeText={(txt) => setTitleValue(txt)}
        autoFocus={true}
      />
      <Text style={styles.taskHeadingTxt}>Task</Text>
      <View style={styles.newTaskContainer}>

        {taskArr.length !== 0 ?
          <FlatList
            data={taskArr}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              // console.log("Item: ", item);
              return (
                <View style={[styles.addTaskRowContainer, { borderWidth: editTaskIndex === index ? 1 : 0, borderColor: COLORS.grey }]}>
                  <TouchableOpacity style={styles.radioBtnContainer} onPress={() => {
                    setEditTaskIndex(index);
                    setEditTaskTxt(item)
                  }}>
                    <Image source={IconLinks.radioButtonUnselected} style={styles.radioBtnIcon} />
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.taskTxtInpt]}
                    editable={editTaskIndex === index ? true : false}
                    value={editTaskIndex === index ? editTaskTxt : item}
                    autoFocus={true}
                    // placeholder='add'
                    // placeholderTextColor={COLORS.grey}
                    onChangeText={(txt) => setEditTaskTxt(txt)}
                    onSubmitEditing={() => {
                      console.log(checkOnlyBlankSpaces(editTaskTxt))
                      if (!checkOnlyBlankSpaces(editTaskTxt)) {
                        saveEditedText(editTaskTxt, index)
                        setEditTaskIndex(null)
                        setEditTaskTxt(null)
                      } else {
                        console.log("Only Blank Spaces are not allowed")
                      }
                    }}
                  />
                </View>

              )
            }}
          /> : null}
        <View style={styles.addTaskRowContainer}>
          <TouchableOpacity style={styles.radioBtnContainer}
            // disabled={editTaskIndex !== null ? false : true}
            disabled={editTaskIndex === null ? false : true}
            onPress={() => setAddNewTask(true)}>
            <Image source={IconLinks.radioButtonUnselected} style={styles.radioBtnIcon} />
          </TouchableOpacity>
          {/* <Text style={styles.taskTxt}>Add</Text> */}
          {addNewTask ?
            <TextInput
              style={styles.taskTxtInpt}
              value={addNewTaskTxt}
              autoFocus={true}
              editable={editTaskIndex !== null ? false : true}
              // placeholder='add'
              // placeholderTextColor={COLORS.grey}
              onChangeText={(txt) => setAddNewTaskTxt(txt)}
              onSubmitEditing={() => saveNewAddedTask()}
            /> : null}
        </View>
      </View>
      <TouchableOpacity
        disabled={checkOnlyBlankSpaces(titleValue) || taskArr.length === 0 ? true : false}
        style={styles.saveBtn}
        onPress={() => {
          sendDataToRedux(titleValue, taskArr);
          // console.log(typeof(localDate))
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
    marginBottom: RFPercentage(0.5)
  },
  radioBtnContainer: {
    marginRight: RFPercentage(0.8),  // 6px

  },
  radioBtnIcon: {
    height: RFPercentage(3),  // 24px
    width: RFPercentage(3),  // 24px
    tintColor: COLORS.grey,
  },

  taskTxtInpt: {
    flex: 1,
    // height: 30,
    color: COLORS.black,
    fontSize: fontSizeChart._12px,
    fontFamily: 'Montserrat-regular',
    // backgroundColor: COLORS.green,
    paddingVertical: Platform.OS === 'ios' ? RFPercentage(0.5) : 0.1,
    // marginTop: RFPercentage(0.1)
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
