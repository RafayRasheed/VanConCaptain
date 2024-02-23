import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, withTiming, Easing, interpolate, useAnimatedStyle, Extrapolation } from 'react-native-reanimated';
import { myHeight, myWidth } from '../../common';
import { myColors } from '../../../ultils/myColors';

export const CustomToggleButton = ({ online, setOnline }) => {
    const toggleValue = useSharedValue(0);
    const size = myHeight(2.5)
    const widt = size + myWidth(6)
    const toggle = () => {
        setOnline(!online)
        toggleValue.value = toggleValue.value === 0 ? 1 : 0;
    };
    const animatedStyle = useAnimatedStyle(() => ({
        width: size, // Adjust width and height according to your toggle button handle size
        height: size,
        borderRadius: size, // Half of the height to make it round
        position: 'absolute',
        transform: [{ translateX: interpolate(toggleValue.value, [0, 1], [0, widt - (size)], Extrapolation.EXTEND) }]

    }));

    return (
        <TouchableOpacity onPress={toggle}>
            <View
                style={{
                    width: widt, // Adjust width and height according to your needs
                    height: size * 0.8,
                    marginEnd: 0,
                    borderRadius: 20, // Ha-lf of the height to make it round
                    backgroundColor: online ? myColors.primaryL2 : myColors.dot,
                    justifyContent: 'center',
                    // borderWidth:myHeight(0.1),
                    // borderColor: online ? myColors.green : myColors.dot,

                }}>
                <Animated.View
                    style={[animatedStyle, {
                        backgroundColor: online ? myColors.primaryT : myColors.textL,
                    }]}>

                </Animated.View>
            </View>
        </TouchableOpacity >
    );
};

