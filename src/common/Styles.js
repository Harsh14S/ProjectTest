import { Platform, StatusBar, StyleSheet } from "react-native";
import { COLORS } from "./Colors";
import { RFPercentage } from "react-native-responsive-fontsize";

const isIOS = Platform.OS === 'ios';
const statusBarHeight = StatusBar.currentHeight;

export const CommonStyles = StyleSheet.create({
  topPadding: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : null,
  },
  screenPadding: {
    paddingHorizontal: RFPercentage(2.9), // 24px
  },
  headerStyle: {
    width: '100%',
    // height: RFPercentage(8.1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingTop: RFPercentage(7.3), // 60px
    paddingBottom: RFPercentage(3.5), // 29px
  }
})


export const fontSizeChart = {
  _24px: RFPercentage(2.6),
  _20px: RFPercentage(2),
  _18px: RFPercentage(2.2),
  _16px: RFPercentage(1.9),
  _14px: RFPercentage(1.7),
  _12px: RFPercentage(1.5),
  _10px: RFPercentage(1.3),
}

export const fontFamilyName = {
  'montserratMedium': 'Montserrat-Medium',
  'montserratSemiBold': 'Montserrat-SemiBold',
  'montserratBold': 'Montserrat-Bold',
  'montserratNormal': 'Montserrat-Medium',
}

