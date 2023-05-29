import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import { COLORS } from '../common/Colors';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { IconLinks } from '../common/IconLinks';
import { fontSizeChart } from '../common/Styles';

export default CustomTabBar = ({ state, descriptors, navigation, route }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.navTabs}>
            <Text
              style={[
                { color: isFocused ? COLORS.blue : COLORS.blueInactive },
                styles.labelTxt,
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        style={styles.newBtn}
        onPress={() => navigation.navigate('addNote', {})}>
        <Image style={styles.btnImage} source={IconLinks.plusRound} />
        <Text style={styles.newBtnTxt}>New</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    justifyContent: 'space-evenly',
    borderColor: COLORS.blue,
    borderTopWidth: RFPercentage(0.2), // 2px
  },
  navTabs: {
    paddingVertical: RFPercentage(1), // 9px
    alignItems: 'center',
    marginHorizontal: RFPercentage(1),
    marginVertical: RFPercentage(2.7), // 22px
    borderRadius: RFPercentage(100),
    paddingHorizontal: RFPercentage(1.7), //14px
    // backgroundColor: COLORS.green,
  },
  labelTxt: {
    fontSize: RFPercentage(2.2), // 18px
    fontWeight: '700',
  },
  newBtn: {
    paddingVertical: RFPercentage(1), // 9px
    alignItems: 'center',
    marginHorizontal: RFPercentage(1),
    marginVertical: RFPercentage(2.7), // 22px
    borderRadius: RFPercentage(100),
    paddingHorizontal: RFPercentage(1.7), //14px
    flexDirection: 'row',
    backgroundColor: COLORS.blue,
  },
  newBtnTxt: {
    fontSize: fontSizeChart._14px,
    fontWeight: '700',
    color: COLORS.white,
  },
  btnImage: {
    marginRight: RFPercentage(2.6), // 20px
    width: RFPercentage(2.2),
    height: RFPercentage(2.2),
    tintColor: COLORS.white,
  },
});
