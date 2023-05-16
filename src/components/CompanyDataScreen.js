import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CommonStyles, fontSizeChart } from '../common/Styles'
import { COLORS } from '../common/Colors'
import { IconLinks } from '../common/IconLinks'
import { RFPercentage } from 'react-native-responsive-fontsize'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'
import CustomerLoader from '../common/CommonComponents/CustomerLoader';
import { useDrawerStatus } from '@react-navigation/drawer';

export default CompanyDataScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  // const routeParams = route?.params?.companyName;
  const isDrawerStatus = useDrawerStatus();
  const [companyName, setcompanyName] = useState(null);
  const [companiesData, setcompaniesData] = useState(null);

  const getCurrentCompany = async () => {
    try {
      const currentCompany = await AsyncStorage.getItem('@currentCompany');
      setcompanyName(currentCompany);
    } catch (e) {
      console.log('Error: ', e)
    }
  }


  useEffect(() => {
    // console.log('getCurr Company');
    getCurrentCompany();
  }, [isDrawerStatus === 'closed'])

  const fireStoreData = async () => {
    try {
      await firestore().collection('Companies').onSnapshot(snap => {
        // console.log("Snap: ", snap.docs);
        snap.docs.map((item, index) => console.log("Item: ", item))
      })
      // const size = (await firestore().collection('Companies')
      //   .doc(companyName).collection('DailyTask').get());
      // console.log("Size: ", size.docs())

      // await firestore().collection('Companies')
      // .doc(companyName).collection('DailyTask').get().then(snap => {
      // console.log("Snap: ", snap.docs);
      // snap.forEach((item) => {
      //   console.log("Item: ", item);
      // })
      // })
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  useEffect(() => {
    fireStoreData();
  }, [getCurrentCompany])


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
      {/* <FlatList
        data={}
      /> */}
      {/* <View style={styles.tasksMainContainer}>
        <View style={styles.taskDateAndDayContainer}>
          <Image style={styles.radioBTNbig} source={IconLinks.radioButtonUnselected} />
          <View style={styles.dateAndDayContainer}>
            <Text style={styles.dateAndDayTxt}>12 Jan, 2023</Text>
            <Text style={styles.dateAndDayTxt}>Wed</Text>
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
      </View> */}
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
