import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { myHeight, myWidth } from './common';
import { RFValue } from 'react-native-responsive-fontsize';

const ITEM_HEIGHT = 100;
const ITEM_MARGIN = 10;

export const MyComponent = () => {
    const wii = myWidth(100)
    const hii = RFValue(180)
    const size1 = wii / 2.5
    const size2 = wii - size1
    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler((event) => {
        const val = event.contentOffset.y
        if (val <= hii) {

            scrollY.value = val;
        }
        else {
            scrollY.value = hii;

        }
    });


    const columnWidth = useAnimatedStyle(() => {
        return {
            width: wii - (size2 * (scrollY.value / hii)),
        };
    });
    const columnHeight = useAnimatedStyle(() => {
        const val = scrollY.value
        console.log((scrollY.value / hii))
        return {
            height: hii,
            width: wii - (size1 * (scrollY.value / hii)),
            top: hii - scrollY.value,
            backgroundColor: 'blue',
            position: 'absolute',
            right: 0,
            zIndex: 10
        };
    });

    // const itemStyle = useAnimatedStyle(() => {
    //     const translateY = interpolate(
    //         scrollY.value,
    //         [0, ITEM_HEIGHT],
    //         [0, -ITEM_HEIGHT],
    //         Extrapolate.CLAMP
    //     );
    //     return {
    //         transform: [{ translateY }],
    //     };
    // });

    return (
        <View style={styles.container}>
            {/* <Animated.View style={[
                {
                    height: myHeight(20),
                    backgroundColor: 'red',

                    position: 'absolute', zIndex: 10
                },
                columnWidth
            ]}>

            </Animated.View> */}
            <Animated.ScrollView
                style={{
                    // height: myHeight(200),
                    // width: myWidth(100),
                    backgroundColor: 'yellow'
                }}
                contentContainerStyle={{ flexGrow: 1, backgroundColor: 'yellow' }}
                onScroll={scrollHandler}
                scrollEventThrottle={16}>
                <View style={{
                    height: myHeight(200),
                    width: myWidth(100),
                    backgroundColor: 'yellow'
                }} />

            </Animated.ScrollView>
            <Animated.View style={[
                {
                    height: hii,
                    backgroundColor: 'red',

                    position: 'absolute', zIndex: 10
                },
                columnWidth
            ]}>

            </Animated.View>
            <Animated.View style={[
                {

                },
                columnHeight
            ]}>

            </Animated.View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    scrollView: {
        backgroundColor: 'yelllow'
    },
    columnContainer: {
        paddingHorizontal: ITEM_MARGIN,
    },
    item: {
        width: '48%', // Adjust this value for different screen sizes
        height: ITEM_HEIGHT,
        backgroundColor: 'gray',
        marginBottom: ITEM_MARGIN,
    },
});

