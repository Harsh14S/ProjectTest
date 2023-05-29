import { Alert, FlatList, Image, Modal, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../common/Colors'
import { IconLinks } from '../common/IconLinks'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { fontSizeChart } from '../common/Styles'
import firestore from '@react-native-firebase/firestore';
import CustomerLoader from '../common/CommonComponents/CustomerLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import { createNewCompany, deleteCompany, setCompanyDataFromAsync } from '../redux/reducers/Reducer'
// import { createNewCompany, initialData } from '../redux/reducers/Reducer.js'


const CustomDrawerContent = ({ navigation }) => {
  const companyReducer = useSelector((state) => state.companyReducer)
  const dispatch = useDispatch();

  const isDrawerStatus = useDrawerStatus();
  const [addCompanyNew, setAddCompanyNew] = useState(false);
  const [companyNameText, setcompanyNameText] = useState(null);

  const asynStorageClear = async () => {
    try {
      await AsyncStorage.clear();
      // await AsyncStorage.removeItem('@allCompanyData');
      console.log('AsyncStorage Cleared......')
    } catch (e) {
      // clear error
      console.log('Error: ', e);
    }
  }

  const getAsyncStorageData = async () => {
    try {
      await AsyncStorage.getItem('@allCompanyData').then(snap => {
        const objData = JSON.parse(snap);
        dispatch(setCompanyDataFromAsync(objData));
        // console.log("companyReducer Data: ", companyReducer.companyArr.length)
      })
    } catch (e) {
      setAddCompanyNew(true);
      // console.log('Error in getAsyncStorageData: ', e);
      console.log('Add a company');
    }
  }

  const setCurrentScreen = async (value) => {
    // console.log("setCurrentScreen Value", value);
    try {
      await AsyncStorage.setItem('@currentCompany', JSON.stringify(value))
        .then(() => {
          navigation.navigate('CompanyDataScreen')
        })
    } catch (e) {
      console.log('Error: ', e);
    }
  }

  const checkEmpty = () => {
    if (companyNameText === null) {
      console.log("Please Enter Something");
    } else {
      // addNewCompany(companyNameText);
      dispatch(createNewCompany(companyNameText));
      setcompanyNameText(null);
      setAddCompanyNew(false);
    }
  }

  useEffect(() => {
    // getCompany();
    navigation.openDrawer();
    // getAsyncStorageData();
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDrawerStatus === 'open' ? 'light-content' : 'dark-content'} backgroundColor={isDrawerStatus === 'open' ? COLORS.blue : COLORS.white} translucent />
      <View style={styles.upperContainer}>
        <TouchableOpacity
          style={styles.backButton}
          disabled={companyReducer.companyArr.length === 0 ? true : false}
          onPress={() => navigation.closeDrawer()}>
          <Image source={IconLinks.leftAngle} style={styles.backButtonIcon} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headingContainer}>
          <Image source={IconLinks.bookmark} style={styles.headingIcon} />
          <Text style={styles.headingText}>My Diary</Text>
        </View>
      </View>
      <View style={styles.lowerContainer}>
        {
          addCompanyNew ? <View style={styles.inputContainer}>
            <TextInput
              value={companyNameText}
              placeholder='Enter company name'
              style={styles.textInput}
              onChangeText={(txt) => setcompanyNameText(txt)}
              autoCapitalize={'sentences'}
              maxLength={30}
              autoFocus={true}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={() => {
              checkEmpty();
            }}>
              <Text style={styles.saveText}>SAVE</Text>
            </TouchableOpacity>

          </View> : null
        }
        {
          companyReducer.companyArr.length !== 0 ?
            <FlatList
              data={companyReducer.companyArr}
              renderItem={({ item, index }) => {
                // console.log(item)
                return (
                  <View>
                    <TouchableOpacity style={styles.companyBtn} onPress={() => {
                      // console.log("CompanyName: ", item);
                      // setCurrentScreen(item.companyName)
                      setCurrentScreen(item)
                    }}
                      onLongPress={() => {
                        Alert.alert('Delete?', 'Are you sure you want to delete?', [
                          { text: 'Cancel' },
                          {
                            text: 'Ok', onPress: () => dispatch(deleteCompany(item.companyName))
                          }
                        ])

                      }}
                    >
                      <Text style={styles.companyBtnText}>{item.companyName}</Text>
                      {
                        !item.isPending ?
                          <Image source={IconLinks.tickMark} style={styles.greenTickMark} /> : null
                      }
                    </TouchableOpacity>
                    <View style={styles.dividerLine} />
                  </View>
                )
              }}
              showsVerticalScrollIndicator={false}
            /> :
            // <CustomerLoader indiColor={COLORS.blue} />
            <View style={{ backgroundColor: COLORS.white, flex: 1, marginRight: RFPercentage(2.9), justifyContent: 'center', alignItems: 'center' }}><Text>Empty</Text></View>
        }
        <View style={styles.bottomBtnsContainer}>
          <TouchableOpacity style={styles.addDataBtn} onPress={() => { setAddCompanyNew(true) }}>
            <Image style={styles.addDataIcon} source={IconLinks.plus} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.allCompanyDataBtn} onPress={() => {
            // dispatch(createNewCompany('Abcd'))
            // asynStorageClear();
            navigation.navigate('AllCompanyDrawer')
          }}>
            <Text style={styles.allCompanyDataText}>All Company Data</Text>
          </TouchableOpacity>
          {/* <Modal visible={true} transparent={true} style={{ flex: 1 }}>
            <View style={{ backgroundColor: COLORS.transparentBlack, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: COLORS.white, width: '70%', height: '25%', borderRadius: RFPercentage(2.5) }}></View>
            </View>
          </Modal> */}

        </View>
      </View>
    </View>
  )
}

export default CustomDrawerContent

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperContainer: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: RFPercentage(2.9),
    paddingTop: RFPercentage(8),  // 72px
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RFPercentage(3),
  },
  backButtonIcon: {
    width: RFPercentage(2),
    height: RFPercentage(2),
    tintColor: COLORS.white
  },
  backButtonText: {
    color: COLORS.white,
    fontFamily: 'Montserrat-Regular',
    fontSize: fontSizeChart._12px,
    marginLeft: RFPercentage(0.2)
  },
  headingContainer: {
    flexDirection: 'row',
    marginTop: RFPercentage(5),
    marginBottom: RFPercentage(3.7),
    alignItems: 'center',
  },
  headingIcon: {
    height: RFPercentage(4.5),
    width: RFPercentage(4.5),
  },
  headingText: {
    marginLeft: RFPercentage(1.5),
    fontSize: fontSizeChart._24px,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.white
  },
  lowerContainer: {
    flex: 1,
    // backgroundColor: COLORS.orange,
    marginLeft: RFPercentage(2.9),
    paddingTop: RFPercentage(1),
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: RFPercentage(1)
  },
  textInput: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    padding: RFPercentage(2),
    borderWidth: 0.5,
    borderRadius: RFPercentage(1),
    borderColor: COLORS.blue,
    marginTop: RFPercentage(1)
  },
  saveBtn: {
    paddingHorizontal: RFPercentage(2.5),
  },
  saveText: {
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.blue,

  },

  companyBtnText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: fontSizeChart._16px,
    color: COLORS.black,
  },
  greenTickMark: {
    height: RFPercentage(2.5),
    width: RFPercentage(2.5),
    tintColor: COLORS.green,
    marginRight: RFPercentage(2.6)
  },
  companyBtn: {
    width: '100%',
    flexDirection: 'row',
    // backgroundColor: COLORS.orange,
    paddingVertical: RFPercentage(2.1),
    // paddingVertical: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dividerLine: {
    borderWidth: 0.5,
    borderColor: COLORS.grey,
  },
  bottomBtnsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingLeft: RFPercentage(2.9),
    marginBottom: RFPercentage(5),
    zIndex: 2,
  },
  addDataBtn: {
    borderRadius: RFPercentage(100),
    backgroundColor: COLORS.blue,
  },
  addDataIcon: {
    height: RFPercentage(3.1),
    width: RFPercentage(3.1),
    tintColor: COLORS.white,
    margin: RFPercentage(2.2)
  },
  allCompanyDataBtn: {
    flex: 1,
    marginLeft: RFPercentage(2.8),
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: RFPercentage(100),
    borderBottomLeftRadius: RFPercentage(100),
    paddingVertical: RFPercentage(2.1),  // 17px
  },
  allCompanyDataText: {
    color: COLORS.white,
    fontSize: fontSizeChart._18px,
    fontFamily: 'Montserrat-Bold',
  },
})
