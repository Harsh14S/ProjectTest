import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { CommonStyles, fontFamilyName, fontSizeChart } from '../common/Styles'
import { COLORS } from '../common/Colors'
import { IconLinks } from '../common/IconLinks'
import { RFPercentage } from 'react-native-responsive-fontsize'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'
import CustomerLoader from '../common/CommonComponents/CustomerLoader';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux'
import { allCompanyData, allCompanyPendingData, currentCompanyData, pendingCompanyData, setCompanyDataFromAsync, updatePendingStatus } from '../redux/reducers/Reducer'

const dateObj = new Date();
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

export default AllCompanyDataScreen = ({ route, navigation }) => {
  const companyReducer = useSelector((state) => state.companyReducer)
  const dispatch = useDispatch();
  const isFocused = useIsFocused()

  function dateInFormat(dt) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    // const date = '29/5/2023';
    // console.log('date before: ', dt);
    const str = dt.split('/');
    // console.log('After Split: ', str);
    const finalDate = str[0] + ' ' + (months[str[1] - 1]) + ', ' + str[2];
    // console.log('Final Date: ', finalDate)
    return finalDate
  }

  const updateTaskStatus = useCallback((task, taskTit, dailyTaskTit, company) => {
    const objData = {
      'companyName': company,
      'dailyTaskName': dailyTaskTit,
      'taskTitleName': taskTit,
      'taskName': task
    }
    dispatch(updatePendingStatus(objData));
    dispatch(allCompanyData());
    dispatch(allCompanyPendingData());
  }, [])

  useEffect(() => {
    dispatch(allCompanyPendingData())

  }, [updateTaskStatus])
  useEffect(() => {
    dispatch(allCompanyData());
    dispatch(allCompanyPendingData())
    // dateInFormat('29/12/2023')
  }, [isFocused]);
  // useEffect(() => {
  //   console.log('allCompanyArr: ', companyReducer.allCompanyArr)
  // }, [companyReducer.allCompanyArr])



  return companyReducer.allCompanyArr !== [] ?
    <View style={[styles.container, CommonStyles.screenPadding]}>
      {/* <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} /> */}
      <View style={styles.headerTitle}>
        <View style={styles.verticalBoldLine} />
        <View style={styles.sos}>
          <Text style={styles.headerTitleTxt}>All Company</Text>
          <TouchableOpacity>
            <Image source={IconLinks.whatsapp} style={styles.whatsappIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        // style={{ backgroundColor: COLORS.blue }}
        // data={companyReducer?.companyArr[1]?.dailyTaskData}
        // data={companyData.dailyTaskData}
        data={companyReducer.allCompanyArr}
        renderItem={({ item, index }) => {
          // console.log("item:--- ", item);
          return (
            <View style={styles.tasksMainContainer} key={index}>
              <View style={styles.taskDateAndDayContainer}>
                <Image style={styles.radioBTNbig} source={IconLinks.radioButtonUnselected} />
                <View style={styles.dateAndDayContainer}>
                  <Text style={styles.dateAndDayTxt}>{dateInFormat(item.dailyTaskName)}</Text>
                  <Text style={styles.dateAndDayTxt}>{daysOfWeek[dateObj.getDay(item.createdAt)]}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.verticalLightLine} />
                <FlatList
                  scrollEnabled={false}
                  data={item.companyData}
                  renderItem={({ item: note, index: noteIndex }) => {
                    // console.log("Note:--- ", note.companyName);
                    // console.log("Note:--- ", JSON.stringify(note));
                    return (
                      <View style={styles.tasksSubContainer}>
                        <View style={{ marginLeft: RFPercentage(1), marginBottom: RFPercentage(1.5) }}>
                          <View>
                            <Text style={{ fontSize: fontSizeChart._10px, color: COLORS.orange, marginBottom: 6, fontFamily: fontFamilyName.montserratMedium }}>{note.companyName}</Text>
                          </View>
                          <FlatList
                            scrollEnabled={false}
                            data={note.companyData}
                            renderItem={({ item: taskTitle, index: taskTitleIndex }) => {
                              // console.log("taskTitle: ", taskTitle.taskTitleName);
                              return (
                                <View style={{ marginBottom: 7 }}>
                                  <Text style={{ fontSize: fontSizeChart._12px, color: COLORS.black, marginBottom: 7, fontFamily: fontFamilyName.montserratMedium }}>{taskTitle.taskTitleName}, <Text style={{ color: COLORS.grey }}>{new Date(taskTitle.createdOn).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text></Text>
                                  <FlatList
                                    scrollEnabled={false}
                                    data={taskTitle.taskData}
                                    renderItem={({ item: task, index: taskIndex }) => {
                                      // console.log("Task: ", task);
                                      return (
                                        <View style={{ flex: 1, flexDirection: 'row', marginBottom: 2, marginLeft: RFPercentage(1.1) }}>
                                          <TouchableOpacity
                                            style={styles.radioBTNContainer}
                                            onPress={() => {
                                              updateTaskStatus(task.taskName, taskTitle.taskTitleName, note.dailyTaskName, note.companyName);
                                              dispatch(pendingCompanyData({ 'companyName': note.companyName, }))
                                            }}
                                          >
                                            <Image source={task.isPending ? IconLinks.radioButtonUnselected : IconLinks.radioButtonSelected} style={styles.radioBTNsmall} />

                                          </TouchableOpacity>
                                          <Text style={[styles.taskNameTxt, { textDecorationLine: task.isPending ? 'none' : 'line-through' }]}>{task.taskName}</Text>
                                        </View>

                                      )
                                    }}
                                  />
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
            </View>
          )
        }}
      />
    </View> : <CustomerLoader indiColor={COLORS.blue} viewStyle={{ backgroundColor: COLORS.white }} />
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
    marginLeft: RFPercentage(1.5),  // 12px
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
  radioBTNContainer: {
    // backgroundColor: COLORS.grey,
    marginRight: RFPercentage(1),  // 8px
  },
  radioBTNsmall: {
    height: RFPercentage(2.5),
    width: RFPercentage(2.5),
    tintColor: COLORS.grey,
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
  taskNameTxt: {
    fontSize: fontSizeChart._12px,
    color: COLORS.black,
    fontFamily: fontFamilyName.montserratNormal
  }
})
