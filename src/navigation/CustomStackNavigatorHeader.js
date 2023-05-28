import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { COLORS } from '../common/Colors'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { CommonStyles, fontSizeChart } from '../common/Styles'
import { IconLinks } from '../common/IconLinks'
import { StackActions } from '@react-navigation/native'

export const CustomStackNavigatorHeader = ({ title, leftButton, rightButton, navigation }) => {
    return (
        <View style={[CommonStyles.headerStyle, styles.container]}>
            <TouchableOpacity style={styles.backBtnContainer} onPress={() => { navigation.dispatch(StackActions.replace('home')) }}>
                <Image style={styles.backBtnIcon} source={IconLinks.leftAngle} />
                <Text style={styles.backBtnTxt}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.titleTxt}>{title}</Text>
            <TouchableOpacity style={styles.rightBtnContainer}>
                <Image style={styles.binIcon} source={IconLinks.bin} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // width: '50%',
        paddingHorizontal: RFPercentage(2),
    },
    backBtnContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backBtnIcon: {
        height: RFPercentage(1.7),
        width: RFPercentage(1.7),
    },
    backBtnTxt: {
        fontFamily: 'Poppins-Regular',
        fontSize: fontSizeChart._12px,
        color: COLORS.black,
    },
    titleTxt: {
        flex: 8,
        textAlign: 'center',
        fontSize: fontSizeChart._16px,
        fontFamily: 'Montserrat-SemiBold',
        color: COLORS.black,
    },
    rightBtnContainer: {
        flex: 1,
        alignItems: 'flex-end'
    },
    binIcon: {
        height: RFPercentage(2.2),
        width: RFPercentage(2.2),
    }
})
