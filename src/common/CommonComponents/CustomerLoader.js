import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const isIOS = Platform.OS === 'ios';

export default CustomerLoader = ({ indiColor, sizeAndroid, ...props }) => {
    return (
        <View style={styles.container}>
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
