import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const isIOS = Platform.OS === 'ios';

export default CustomerLoader = ({ indiColor, sizeAndroid, viewStyle, ...props }) => {
    return (
        <View style={[styles.container, viewStyle]}>
            <ActivityIndicator size={isIOS ? 'large' : (sizeAndroid ? sizeAndroid : 'large')} color={indiColor} {...props} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'red',
        justifyContent: 'center',
    }
})
