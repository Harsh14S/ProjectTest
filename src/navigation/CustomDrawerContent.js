import { FlatList, Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../common/Colors'
import { IconLinks } from '../common/IconLinks'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { fontSizeChart } from '../common/Styles'
const arr = new Array(6);
const CustomDrawerContent = () => {
  const [addCompany, setAddCompany] = useState(true);
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={COLORS.blue} />
      <View style={styles.upperContainer}>
        <TouchableOpacity style={styles.backButton}>
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
          addCompany ? <View style={styles.inputContainer}>
            <TextInput
              placeholder='Enter company name'
              style={styles.textInput}
            />
            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveText}>SAVE</Text>
            </TouchableOpacity>

          </View> : null
        }
        <FlatList
          data={arr}
          renderItem={({ item, index }) => {
            return (
              <View>
                <TouchableOpacity style={styles.companyBtn}>
                  <Text style={styles.companyBtnText}>Company {index + 1}</Text>
                  {
                    index === 4 ?
                      <Image source={IconLinks.tickMark} style={styles.greenTickMark} /> : null
                  }
                </TouchableOpacity>
                <View style={styles.dividerLine} />
              </View>
            )
          }}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.bottomBtnsContainer}>
          <TouchableOpacity style={styles.addDataBtn}>
            <Image style={styles.addDataIcon} source={IconLinks.plus} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.allCompanyDataBtn}>
            <Text style={styles.allCompanyDataText}>All Company Data</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  )
}

export default CustomDrawerContent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.blue,
  },
  upperContainer: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: RFPercentage(2.9),
    paddingTop: Platform.OS === 'ios' ? RFPercentage(8) : null,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RFPercentage(3),
    // marginBottom: RFPercentage(5),
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
    alignItems: 'center'
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
    fontFamily: 'Montserrat-Regular',
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
