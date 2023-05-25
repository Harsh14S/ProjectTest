import { FlatList, Image, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../common/Colors'
import { CommonStyles, fontSizeChart } from '../common/Styles'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import { IconLinks } from '../common/IconLinks'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { addCompanyData, addNewDailyTaskTitle, addNewTask, addNewTaskTitle } from '../redux/reducers/Reducer'
import { useDispatch, useSelector } from 'react-redux'

const dateObj = new Date();
const currentDate = dateObj.getDate() + ' ' + dateObj.toLocaleString('default', { month: 'short' }) + ', ' + dateObj.getFullYear();

export default AddNoteScreen = ({ navigation }) => {
  const companyReducer = useSelector((state) => state.companyReducer)
  const dispatch = useDispatch();

  const [currentCompany, setCurrentCompany] = useState(null);
  const [titleValue, setTitleValue] = useState(null);
  const [addNewTaskTxt, setAddNewTaskTxt] = useState(null);
  const [focus, setFocus] = useState(false)

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

  const saveDataToCurrentCompany = async () => {
    dispatch(addCompanyData(currentCompany.companyName))
    navigation.goBack();
  }
  const saveDailyTask = async () => {
    dispatch(addNewDailyTaskTitle(currentDate));
  }
  const saveNewTaskTitle = async () => {
    dispatch(addNewTaskTitle(titleValue));
    setTitleValue(null);
  }
  const saveNewAddedTask = async () => {
    dispatch(addNewTask(addNewTaskTxt));
    setAddNewTaskTxt(null)
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
        {
          companyReducer.tasks.length === 0 ? null :
            <FlatList
              data={companyReducer.tasks}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                // console.log("Item: ", item);
                return (
                  <View style={styles.addTaskRowContainer}>
                    <TouchableOpacity style={styles.radioBtnContainer} onPress={() => { }}>
                      <Image source={IconLinks.radioButtonUnselected} style={styles.radioBtnIcon} />
                    </TouchableOpacity>
                    <Text style={styles.taskTxt}>{item.tasksName}</Text>
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
            autoFocus={true}
            // placeholder='add'
            // placeholderTextColor={COLORS.grey}
            onChangeText={(txt) => setAddNewTaskTxt(txt)}
            onBlur={() =>
              addNewTaskTxt === null ?
                console.log("Empty")
                : saveNewAddedTask()
            }
          />
        </View>
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={() => {
        saveNewTaskTitle().then(() => {
          saveDailyTask()
        }).then(() => {
          saveDataToCurrentCompany();
        })
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
