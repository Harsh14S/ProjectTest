import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CommonStyles, fontSizeChart } from '../common/Styles'
import { COLORS } from '../common/Colors'
import { IconLinks } from '../common/IconLinks'
import { RFPercentage } from 'react-native-responsive-fontsize'
import firestore, { firebase } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'
import CustomerLoader from '../common/CommonComponents/CustomerLoader';
import { useDrawerStatus } from '@react-navigation/drawer';

const dateObj = new Date();
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

let arr1 = [];
let arr2 = [];

export default CompanyDataScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const isDrawerStatus = useDrawerStatus();
  const [companyName, setcompanyName] = useState(null);
  const [mainTitleArray, setMainTitleArray] = useState([]);
  const [dailyTaskTitleArray, setDailyTaskTitleArray] = useState([]);
  const [dailySubTaskTitleArray, setDailySubTaskTitleArray] = useState([]);
  const [snap2, setSnap2] = useState([])

  const getCurrentCompany = async () => {
    try {
      await AsyncStorage.getItem('@currentCompany')
        .then(snap => {
          // console.log("Comany name: ", snap);
          setcompanyName(snap)
          dailyTaskFetchers(snap)
          // console.log("Company Name Updated......");
        })
    } catch (e) {
      console.log('Error: ', e)
    }
  }

  const setCurrentScreen = async (value) => {
    try {
      await AsyncStorage.setItem('@currentCompany', value)
        .then(() => {
          console.log("currentCompany is successfully set ");
        })
    } catch (e) {
      console.log('Error: ', e);
    }
  }

  const dailyTaskFetchers = async (currentCompany) => {
    const dailyTaskArray = []
    await firestore().collection('Companies').doc(currentCompany)
      .collection('DailyTask').get()
      // .onSnapshot(snap => {
      .then(snap => {
        // console.log(snap.docs, 'Snap......');
        // setSnap2(snap)
        snap.docs.map(async (item, index) => {
          // console.log("dailyTaskFetchers log -----> ", item.id);
          // setMainTitleArray([]);
          await titlesFetchers(item.id).then(
            sn => {
              // console.log("Data of ", item.id, ": ", JSON.stringify(sn));
              dailyTaskArray.push({ 'data': sn, 'title': item.id })
              setMainTitleArray(dailyTaskArray);// function
            }
          )
        })
      })
  }


  const titlesFetchers = async (dailyTaskID) => {
    const titlesArray = [];
    // console.log("dailyTaskID: ", dailyTaskID);
    await firestore().collection('Companies').doc(companyName)
      .collection('DailyTask').doc(dailyTaskID)
      .collection('Titles').get()
      // console.log("Data: ", data);
      .then(snap => {
        let titlesSubArray = [];
        snap.docs.map(async (item, index) => {
          // console.log(item.id, " -> ", happy);
          // console.log("Snap: ", item.data());
          setDailyTaskTitleArray([])
          await taskFetcher(item.id, dailyTaskID).then(
            sn => {
              // console.log(item.id, ' -> ', sn);
              titlesArray.push({ 'data': sn, 'title': item.id })
              // console.log('Title Array', JSON.stringify(titlesArray));
              // if (snap.size === index + 1) {
              // }
              setDailyTaskTitleArray(titlesArray);
              // titlesSubArray = titlesArray;
            }
          )
          // titlesSubArray.push(titlesArray);
          // console.log(item.id, " -> ", happy)
          // setTaskTitlesArray(titlesArray);
          // console.log(item.id, ' ------> ', JSON.stringify(titlesArray));
          if (snap.size === index + 1) {
            // console.log(' ------> ', JSON.stringify(titlesArray));
            // dailyTaskTitleArray.push(titlesSubArray)
            // arr1.push(titlesSubArray);
            setDailySubTaskTitleArray(titlesArray)
          }
        })
        // console.log(' ------> ', JSON.stringify(dailySubTaskTitleArray));
        // return
      })
    // console.log("dailyTaskTitleArray: ", JSON.stringify(arr1));
    return dailyTaskTitleArray;
  }

  const taskFetcher = async (titlesID, dailyTaskID) => {
    // console.log(titlesID, ' && ', dailyTaskID);
    const taskArray = [];

    await firestore().collection('Companies').doc(companyName)
      .collection('DailyTask').doc(dailyTaskID)
      .collection('Titles').doc(titlesID)
      .collection('Tasks').get()
      .then(snap => {
        snap.docs.map(async (item, index) => {
          taskArray.push({ 'data': item.data(), 'title': item.id })
          // console.log(" taskArray ", taskArray);
          // arr3 = taskArray;
        })
        // setTaskTitlesArray(titlesArray);
      })
    // console.log("TaskArray: ----> ", taskArray);
    return taskArray;
  }

  useEffect(() => {
    // console.log('getCurr Company');
    getCurrentCompany();
  }, [isDrawerStatus === 'closed'])

  return companyName ?
    <View style={[styles.container, CommonStyles.screenPadding]}>
      {/* <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} /> */}
      <View style={styles.headerTitle}>
        <View style={styles.verticalBoldLine} />
        <View style={styles.sos}>
          <Text style={styles.headerTitleTxt}>{companyName}</Text>
          <TouchableOpacity>
            <Image source={IconLinks.whatsapp} style={styles.whatsappIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        // style={{ backgroundColor: COLORS.blue }}
        data={mainTitleArray}
        renderItem={({ item, index }) => {
          // console.log("item:--- ", JSON.stringify(item));
          return (
            <View style={styles.tasksMainContainer} key={index}>
              <View style={styles.taskDateAndDayContainer}>
                <Image style={styles.radioBTNbig} source={IconLinks.radioButtonUnselected} />
                <View style={styles.dateAndDayContainer}>
                  <Text style={styles.dateAndDayTxt}>{item.title}</Text>
                  <Text style={styles.dateAndDayTxt}>{daysOfWeek[dateObj.getDay(item.createdAt)]}</Text>
                </View>
              </View>
              <FlatList
                scrollEnabled={false}
                data={item.data}
                renderItem={({ item: note, index: noteIndex }) => {
                  // console.log("Note:--- ", JSON.stringify(note));
                  return (
                    <View style={styles.tasksSubContainer}>
                      <View style={styles.verticalLightLine} />
                      <View style={{ marginLeft: RFPercentage(2.6), marginBottom: RFPercentage(1.5) }}>
                        <View>
                          <Text style={{ fontSize: fontSizeChart._12px, color: COLORS.black, marginBottom: 7 }}>{note.title}, <Text style={{ color: COLORS.grey }}>01:50 PM</Text></Text>
                        </View>
                        <FlatList
                          scrollEnabled={false}
                          data={note.data}
                          renderItem={({ item: task, index: taskIndex }) => {
                            // console.log("Task: ", task);
                            return (
                              <View style={{ flexDirection: 'row', marginBottom: 7 }}>
                                <Image source={IconLinks.radioButtonUnselected} style={styles.radioBTNsmall} />
                                <Text style={{ fontSize: fontSizeChart._12px, color: COLORS.black }}>{task.data.taskName}</Text>
                              </View>
                            )
                          }}
                        />
                      </View>
                    </View>
                  )
                }}
              />
            </View>
          )
        }}
      />
    </View> : <CustomerLoader indiColor={COLORS.blue} />
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  emptyScreen: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyScreenTxt: {
    fontSize: fontSizeChart._24px,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.grey
  },
  headerTitle: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: RFPercentage(3.7),  // 30px
  },
  headerTitleTxt: {
    fontSize: fontSizeChart._18px,
    fontWeight: '700',
    color: COLORS.black,
  },
  whatsappIcon: {
    height: RFPercentage(3.7),
    width: RFPercentage(3.7)
  },
  verticalLightLine: {
    backgroundColor: COLORS.grey,
    borderRadius: RFPercentage(100),
    paddingHorizontal: RFPercentage(0.1),  // 2px
  },
  verticalBoldLine: {
    backgroundColor: COLORS.blue,
    borderRadius: RFPercentage(100),
    paddingHorizontal: RFPercentage(0.2),  // 2px
  },
  sos: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: RFPercentage(1),  // 8px
  },
  tasksMainContainer: {
    flex: 1,
    // backgroundColor: COLORS.orange,
    marginBottom: RFPercentage(1),
  },
  taskDateAndDayContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 12,
  },
  radioBTNsmall: {
    height: RFPercentage(2.5),
    width: RFPercentage(2.5),
    tintColor: COLORS.grey,
    marginRight: RFPercentage(1),  // 8px
  },
  radioBTNbig: {
    height: RFPercentage(3.4),
    width: RFPercentage(3.4),
    tintColor: COLORS.grey,
    marginRight: RFPercentage(1),  // 8px
  },
  dateAndDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  dateAndDayTxt: {
    fontSize: fontSizeChart._14px,
    color: COLORS.grey
  },
  tasksSubContainer: {
    flexDirection: 'row',
    marginLeft: RFPercentage(1.6),
  },
})
