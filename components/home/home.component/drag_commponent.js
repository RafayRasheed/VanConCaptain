import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { myWidth } from '../../common';

export const SwipeableItem = ({ children, onClose, onRight, chat }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const translateXReal = useSharedValue(0);
    const wid = myWidth(100);
    function onClosssse() {
        setTimeout(() => {
            onClose()
        }, 200)
    }
    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {

            ctx.startX = translateX.value;
            ctx.startY = translateY.value;            // console.log('onStart', translateX.value)
        },
        onActive: (event, ctx) => {
            const deltaX = event.translationX;
            const deltaY = event.translationY;

            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                // Vertical swipe
                translateY.value = ctx.startY + deltaY;
            } else {
                // Horizontal swipe
                const traV = deltaX;
                if (chat && traV < 0) {
                    return;
                }
                if (chat && traV > wid / 3) {
                    return;
                }
                translateX.value = ctx.startX + traV;
            }
        },
        onEnd: () => {
            if (Math.abs(translateX.value) > (wid / 4.5)) {
                translateX.value = withTiming(translateXReal.value < 0 ? wid * -1 : wid, { duration: 100 })

                if (chat) {
                    console.log('han')
                    translateX.value = withTiming(0, { duration: 150 })
                    runOnJS(onRight)(chat);

                }
                else {

                    runOnJS(onClosssse)();
                }

            } else {
                // Snap back to original position
                translateX.value = withSpring(0);
            }
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <GestureHandlerRootView style={{}}>

            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[styles.container, animatedStyle]}>
                    {children}
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>

    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent'
    },
});

