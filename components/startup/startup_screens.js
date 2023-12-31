import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Spacer, StatusbarH, myHeight, myWidth, storage } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';

const startupData = [
    {
        title: 'Nearby restaurants',
        des: 'You dont have to go far to find a good restaurant, we provided all the restaurants that is near you',
        image: require('../assets/startup/maps.png'),
        style: { width: myWidth(70), height: myWidth(70) * 0.6, marginBottom: myHeight(5) },
    },
    {
        title: 'Select Favorites Menu',
        des: 'Now eat well, dont leave the house,You can choose your favorite food only with one click',
        image: require('../assets/startup/order.png'),
        style: { width: myWidth(60), height: myWidth(60), marginBottom: myHeight(2) },
    },
    {
        title: 'Good food, Cheap price',
        des: 'You can eat at expensive restaurants with affordable price',
        image: require('../assets/startup/food.png'),
        style: { width: myWidth(60), height: myWidth(60), marginBottom: myHeight(3) },
    },



]

export const StartupScreen = ({ navigation }) => {
    const [i, setI] = useState(0)
    const dotArr = []
    const lenStartup = startupData.length
    const width = myWidth(100)
    const [ref, setRef] = useState(null);
    const [posX, setPosX] = useState([]);
    const [scrollTouch, setScrollTouch] = useState(false)
    // const [isScrollLas, setIsScrollLas] = useState(false)
    // const [getStart, setGetStart] = useState(false)

    // Loop for dots
    for (let j = 0; j < lenStartup; j++) {
        dotArr.push(<View key={j} style={[styles.containerDot, { backgroundColor: j == i ? myColors.primary : myColors.dot, }]} />)
    }

    function handleScroll(event) {
        if (scrollTouch) {
            const a = (event.nativeEvent.contentOffset.x) / width
            var getDecimal = a.toString().split(".")[1];
            if (getDecimal) {
                if (getDecimal[0] < 3 || getDecimal[0] > 7) {
                    const r = Math.round(a)
                    console.log(r)
                    setI(r)
                    // const pos = posX[r]
                    // if (pos != undefined) {
                    // }
                }
            }
        }
    }

    function onForward() {
        console.log(pos)
        setScrollTouch(false)
        // const pos = posX[i + 1]
        const pos = myWidth(100) * (i + 1)
        setI(i + 1)
        ref.scrollTo({
            x: pos,
            y: 0,
            animated: true,
        });
    }

    function onBack() {
        setScrollTouch(false)

        setI(i - 1)
        // const pos = posX[i - 1]
        const pos = myWidth(100) * (i - 1)

        ref.scrollTo({
            x: pos,
            y: 0,
            animated: true,
        });
    }

    // function scrollToLast() {
    //     const pos = posX[lenStartup - 1]
    //     if (pos) {
    //         setIsScrollLas(true)
    //         ref.scrollTo({
    //             x: pos,
    //             y: 0,
    //             animated: true,
    //         });
    //         setTimeout(() => setI(lenStartup - 1), 100);

    //     }
    // }

    useEffect(() => {
        if (i == lenStartup - 1) {
            const timer = setTimeout(() => {
                getReady()
            }, 1500)
            return () => clearTimeout(timer);
        }

    }, [i])

    function getReady() {
        storage.set('isFirstTime', true)
        navigation.replace('AccountNavigator')
    }


    return (
        <SafeAreaView style={styles.container}>
            {/* Top --> Skip */}
            <StatusbarH />
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={styles.containerTopSkip}>

                    {i < lenStartup - 1 &&
                        <TouchableOpacity activeOpacity={0.6} onPress={getReady} style={styles.containerSkip}>
                            <Text style={styles.textSkip}>Skip</Text>
                            <Spacer paddingEnd={myWidth(1)} />
                            <Image style={styles.imageGo} source={require('../assets/startup/go.png')} />
                            <Image style={[styles.imageGo, { marginStart: -myWidth(1) }]} source={require('../assets/startup/go.png')} />
                        </TouchableOpacity>
                    }
                </View>


                {/* Mid */}
                <View>
                    <ScrollView
                        horizontal
                        onTouchStart={() => setScrollTouch(true)}
                        onScroll={handleScroll}
                        overScrollMode='never'
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ alignItems: 'flex-end' }}
                        pagingEnabled
                        scrollEventThrottle={10}
                        ref={ref => setRef(ref)}
                    >
                        {
                            startupData.map((item, i) =>
                                <View key={i} style={{
                                    width: myWidth(100),
                                }}>
                                    <View
                                        onLayout={(event) => {
                                            const layout = event.nativeEvent.layout;
                                            // posX[i] = layout.x;
                                            // setPosX(posX);
                                            // console.log(posX)
                                        }}
                                        style={styles.containerMid} key={i}>
                                        {/* <Image /> */}
                                        <Image style={[styles.imageMid, item.style]} source={item.image} />
                                        {/* <Spacer paddingT={myHeight(0.8)} /> */}
                                        <Text style={styles.textTitle}> {item.title}</Text>
                                        <Spacer paddingT={myHeight(1.5)} />
                                    </View>
                                    <Text style={styles.textDes}>{item.des}</Text>
                                    <Spacer paddingT={myHeight(12.5)} />
                                    {/* <View style={{ flex: 1 }} /> */}
                                </View>
                            )
                        }

                    </ScrollView>
                </View>

                {/* Bottom * => Start Button & Change*/}
                <View style={styles.containerBottom}>

                    {/* {!getStart? */}
                    <View style={styles.containerChange}>

                        {/* Arrow Left */}
                        <View style={{ width: myHeight(3) }}>
                            {i > 0 &&
                                <TouchableOpacity style={styles.containerGoLR} activeOpacity={0.6} onPress={() => { if (i > 0) { onBack() } }} >
                                    <Image style={styles.imageGoLR} source={require('../assets/startup/goL.png')} />
                                </TouchableOpacity>
                            }
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            {dotArr}
                        </View>

                        {/* Arrow Right */}
                        <View style={{ width: myHeight(3) }}>
                            {i < lenStartup - 1 &&
                                <TouchableOpacity style={styles.containerGoLR} activeOpacity={0.6} onPress={() => { if (i < lenStartup - 1) { onForward() } }} >
                                    <Image style={styles.imageGoLR} source={require('../assets/startup/goR.png')} />
                                </TouchableOpacity>

                            }
                        </View>
                    </View>
                    {/* :
                    <TouchableOpacity activeOpacity={0.6} onPress={onContinue} style={styles.containerStart}>
                        <Text style={styles.textStart}>Get Started</Text>
                    </TouchableOpacity> */}
                    <Spacer paddingT={myHeight(8)} />

                </View>
            </View>

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        backgroundColor: myColors.background,
        // justifyContent: 'space-between'
    },

    containerMid: {
        width: myWidth(100),
        alignItems: 'center',
    },
    containerCross: {
        width: myHeight(1.7),
        height: myHeight(1.7),
        borderRadius: myHeight(0.85),
        marginTop: 3,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: myColors.textL,
    },
    containerTopSkip: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingEnd: myWidth(5),
        height: myHeight(6.2),
    },
    containerSkip: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: myHeight(1)
    },
    containerBottom: {
        width: myWidth(100),


        // backgroundColor: 'red'
        // flex:1,
        // height: myHeight(10),
        // position: 'absolute',
        // zIndex: 1,
    },
    containerChange: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: myWidth(12.7),
    },

    containerDot: {
        width: myHeight(1.5),
        height: myHeight(1.5),
        borderRadius: myHeight(1),
        marginHorizontal: myWidth(1.2),
    },
    containerStart: {
        backgroundColor: myColors.primaryT,
        paddingVertical: myHeight(1),
        borderRadius: myHeight(3),
        width: myWidth(42),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    containerGoLR: {
        backgroundColor: myColors.primaryT,
        padding: myHeight(1.4),
        borderRadius: myHeight(3),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },


    //Text
    textSkip: {
        fontSize: myFontSize.body3,
        fontFamily: myFonts.body,
        color: myColors.primaryT,
        includeFontPadding: false,
        padding: 0,

    },
    textTitle: {
        fontSize: myFontSize.medium2,
        fontFamily: myFonts.heading,
        color: myColors.text,
        includeFontPadding: false,
        padding: 0,

    },
    textDes: {
        fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.body,
        color: myColors.text,
        textAlign: 'center',
        paddingHorizontal: myWidth(8),
        includeFontPadding: false,
        padding: 0,

    },
    textStart: {
        fontSize: myFontSize.xBody,
        fontFamily: myFonts.bodyBold,
        color: myColors.background,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },




    //Image
    imageMid: {
        resizeMode: 'cover',
        // backgroundColor: 'blue',


    },
    imageGo: {
        width: myHeight(1.6),
        height: myHeight(1.6),
        resizeMode: 'contain',
        tintColor: myColors.primaryT
    },
    imageGoLR: {
        height: myHeight(1.75),
        width: myHeight(1.75),
        resizeMode: 'contain',
    },
    imageArrow: {
        height: myHeight(5),
        width: myWidth(5),
        resizeMode: 'contain',
    },
})