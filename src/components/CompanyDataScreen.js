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

export default CompanyDataScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  // const routeParams = route?.params?.companyName;
  const isDrawerStatus = useDrawerStatus();
  const [companyName, setcompanyName] = useState(null);
  const [companiesData, setcompaniesData] = useState(['abc']);
  const [mainTitleArray, setMainTitleArray] = useState([]);
  const [dailyTaskTitleArray, setDailyTaskTitleArray] = useState([]);
  const [taskTitlesArray, setTaskTitlesArray] = useState([]);
  const [taskArray, setTaskArray] = useState([]);
  const [roughArr, setRoughArr] = useState([]);

  const getCurrentCompany = async () => {
    try {
      await AsyncStorage.getItem('@currentCompany')
        .then(snap => {
          // console.log("Comany name: ", snap);
          setcompanyName(snap);
          // console.log("Company Name Updated......");
        })
    } catch (e) {
      console.log('Error: ', e)
    }
  }

  const demo = async () => {
    await firestore().collection('Companies').doc(companyName)
      .collection('DailyTask').get().then(dateTitle => {
        // console.log("dateTitle: ", dateTitle.docs);
        const arr = []
        dateTitle.docs.map(dateTitleItem => {
          // arr.push(dateTitleItem);
          arr.push({ 'title': dateTitleItem.id, 'data': dateTitleItem.data() });
          setMainTitleArray(arr);
          // const arr1 = []
          // dateTitleItem.ref.collection('Titles').onSnapshot(titles => {
          //   titles.docs.map(titlesItem => {
          // console.log(arr);
          // arr1.push({ 'title': titlesItem.id, 'data': titlesItem.data() })
          // console.log("Title: ", titlesItem.data());
          // setTaskTitlesArray(arr1);

          // taskTitlesArray.push(titlesItem._data);
          // titlesItem.ref.collection('Tasks').onSnapshot(tasks => {
          //   // console.log("Tasks size:---- ", tasks.size);
          //   let abc = [];
          //   tasks.docs.map(tasksItem => {
          //     // console.log("Tasks:---- ", tasksItem.data());
          //     // taskArray.push(tasksItem._data);
          // })
          // })
          // })
          // console.log("taskTitlesArray: ", taskTitlesArray)
          //   })
        })
      }).then(() => {
        mainTitleArray.map((item, index) => {
          console.log(index);
          demo2(item.title, index)
        })
      })
  }
  // const demo2 = async (value, id) => {
  //   await firestore().collection('Companies').doc(companyName)
  //     .collection('DailyTask').doc(value)
  //     .collection('Titles').get().then(snap => {
  //       const arr = []
  //       // console.log("Snap:----- ", snap.size);
  //       snap.docs.map(titlesItem => {
  //         // console.log("Items:---- ", titlesItem.data());
  //         arr.push({ 'title': titlesItem.id, 'data': titlesItem.data() });
  //       })
  //       setTaskTitlesArray(arr)
  //       // setMainTitleArray({...mainTitleArray})
  //       mainTitleArray.map((item, index) => {
  //         if (index === id) {
  //           // console.log(item);
  //           setMainTitleArray([...mainTitleArray, mainTitleArray[index]])
  //         }
  //       })
  //     })
  // }

  const dataFetching = async () => {
    firestore().collection('Companies').doc(companyName)
      .onSnapshot(companyNameSnap => {
        if (companyNameSnap.exists) {
          // console.log("companyNameSnap: ", companyNameSnap);
          companyNameSnap.ref.collection('DailyTask').onSnapshot(dailyTaskSnap => {
            const dailyTaskSnapArray = [];
            dailyTaskSnap.docs.map((dailyTaskSnapMap) => {
              if (dailyTaskSnapMap.exists) {
                // console.log("dailyTaskSnapMap: ", dailyTaskSnapMap.data());
                dailyTaskSnapMap.ref.collection('Titles').onSnapshot(titlesSnap => {
                  const titlesSnapArray = [];
                  // console.log("titlesSnap: ", titlesSnap.docs.length)
                  titlesSnap.docs.map((titlesSnapMap) => {
                    if (titlesSnapMap.exists) {
                      // console.log("titlesSnapMap: ", titlesSnapMap.data());
                      const tasksSnapArray = []
                      titlesSnapMap.ref.collection('Tasks').onSnapshot(tasksSnap => {
                        // console.log("tasksSnap: ", tasksSnap.docs.length);
                        tasksSnap.docs.map((tasksSnapMap) => {
                          // console.log("tasksSnapMap: ", tasksSnapMap.data());
                          if (tasksSnapMap.exists) {
                            tasksSnapArray.push(tasksSnapMap.data());
                          }
                        })
                        titlesSnapArray.push({ 'info': titlesSnapMap.data(), 'tasks': tasksSnapArray });
                        // console.log("tasksSnapArray: ", tasksSnapArray)
                        console.log("titlesSnapArray: ", titlesSnapArray);
                        // setTaskTitlesArray(titlesSnapArray);
                        // dailyTaskSnapArray.push({})

                      })
                      // console.log("TaskTitlesArray: ", taskTitlesArray.length)
                    }
                  })
                  // console.log("dailyTaskSnapMap: ", dailyTaskSnapMap.data())
                  // console.log("TaskTitlesArray: ", taskTitlesArray)
                })
              }
            })
            // console.log("companyNameSnap: ", companyNameSnap);
            // companyNameSnap.ref.collection('DailyTask').onSnapshot(dailyTaskSnap => {
            //   console.log("dailyTaskSnap: ", dailyTaskSnap.docs[0].data())
            // })
          })
        }
      })
  }

  const dailyTaskFetchers = async () => {
    const dailyTaskArray = []
    await firestore().collection('Companies').doc(companyName)
      .collection('DailyTask').onSnapshot(snap => {

        snap.docs.map(async (item, index) => {

          // console.log("dailyTaskFetchers log -----> ", item.id);
          dailyTaskArray.push(item.data())
          const a = await titlesFetchers(item.id) // function
          // console.log(item.id, " ----> ", a);
          // a.docs.map(items => {
          //   console.log(items.id, " ----> ", items.data());
          // })
        })
        // setDailyTaskTitleArray(dailyTaskArray)
        // console.log("dailyTaskArray: ", dailyTaskArray);
      })
  }

  const titlesFetchers = async (dailyTaskID) => {

    const titlesArray = [];
    // console.log("dailyTaskID: ", dailyTaskID);
    await firestore().collection('Companies').doc(companyName)
      .collection('DailyTask').doc(dailyTaskID)
      .collection('Titles')
      .get()

      // console.log("Data: ", data);
      .then(snap => {
        snap.docs.map(async (item, index) => {
          const happy = await taskFetcher(item.id, dailyTaskID);
          // console.log(item.id, " -> ", happy);
          // console.log("Snap: ", item.data());
          titlesArray.push(item.data())
        })
        // console.log("titlesArray: ", titlesArray);
        // setTaskTitlesArray(titlesArray);
      })
    return titlesArray;
  }

  const taskFetcher = async (titlesID, dailyTaskID) => {
    // console.log("titlesID: ", titlesID);
    const taskArray = [];

    await firestore().collection('Companies').doc(companyName)
      .collection('DailyTask').doc(dailyTaskID)
      .collection('Titles').doc(titlesID)
      .collection('Tasks').get()
      .then(snap => {
        snap.docs.map(async (item, index) => {
          // console.log(item.id, " -> ", item.data());
          taskArray.push({ 'data': item.data() })
        })
        console.log("TaskArray: ----> ", taskArray);
        // setTaskTitlesArray(titlesArray);
      })
    return taskArray;


  }

  useEffect(() => {
    // console.log('getCurr Company');
    getCurrentCompany();
  }, [isDrawerStatus === 'closed'])

  useEffect(() => {
    dailyTaskFetchers()
  }, [companyName !== null])

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
        data={roughArr}
        renderItem={({ item, index }) => {
          console.log("RoughItems Map: ", item);
          // return (
          //   <View>
          //     <Text></Text>
          //   </View>
          // )
        }}
      />

      {/* <FlatList
        // style={{ backgroundColor: COLORS.blue }}
        data={mainTitleArray}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.tasksMainContainer} key={index}>
              <View style={styles.taskDateAndDayContainer}>
                <Image style={styles.radioBTNbig} source={IconLinks.radioButtonUnselected} />
                <View style={styles.dateAndDayContainer}>
                  <Text style={styles.dateAndDayTxt}>{item.title}</Text>
                  <Text style={styles.dateAndDayTxt}>{daysOfWeek[dateObj.getDay(item.createdAt)]}</Text>
                </View>
              </View>

              <View style={styles.tasksSubContainer}>
                <View style={styles.verticalLightLine} />
                <View style={{ marginLeft: RFPercentage(2.6), marginBottom: RFPercentage(1.5) }}>
                  <View>
                    <Text style={{ fontSize: fontSizeChart._12px, color: COLORS.black, marginBottom: 7 }}>Title 01, <Text style={{ color: COLORS.grey }}>01:50 PM</Text></Text>
                  </View>
                  <View>
                    <View style={{ flexDirection: 'row', marginBottom: 7 }}>
                      <Image source={IconLinks.radioButtonUnselected} style={styles.radioBTNsmall} />
                      <Text style={{ fontSize: fontSizeChart._12px, color: COLORS.black }}>Test finish adsdas d d</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 7 }}>
                      <Image source={IconLinks.radioButtonSelected} style={styles.radioBTNsmall} />
                      <Text style={{ fontSize: fontSizeChart._12px, color: COLORS.black, textDecorationLine: 'line-through' }}>White -- 25</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 7 }}>
                      <Image source={IconLinks.radioButtonUnselected} style={styles.radioBTNsmall} />
                      <Text style={{ fontSize: fontSizeChart._12px, color: COLORS.black }}>gray - 40 asdas d ds</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )
        }}
      /> */}
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
