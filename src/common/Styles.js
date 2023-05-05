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
  }
})

export const fontSizeChart = {
  _24px: RFPercentage(2.6),
  _18px: RFPercentage(2.2),
  _16px: RFPercentage(1.9),
  _14px: RFPercentage(1.7),
  _12px: RFPercentage(1.5),
}

