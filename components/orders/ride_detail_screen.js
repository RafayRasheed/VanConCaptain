import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Alert, TextInput, TouchableOpacity, View, SafeAreaView, Image, Text, ScrollView, StatusBar, Easing, Linking } from 'react-native';
import { Loader, MyError, Spacer, StatusbarH, errorTime, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFonts, myLetSpacing, myFontSize } from '../../ultils/myFonts';
import firestore, { Filter } from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import { ImageUri } from '../common/image_uri';
import { FlashList } from '@shopify/flash-list';
import { useSelector } from 'react-redux';



export const RideDetails = ({ navigation, route }) => {
    const req = route.params.item
    const code2 = route.params.code
    const [code, setCode] = useState(code2)
    const { profile } = useSelector(state => state.profile)
    const [errorMsg, setErrorMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [sendDrivers, setSendDrivers] = useState([])
    const [statusMessages, setStatusMessages] = useState(null)

    const { allRequest } = useSelector(State => State.orders)
    const [item, setRequest] = useState(null)
    const item2 = item

    // const driver = item?.sendDrivers[0]

    useEffect(() => {
        if (allRequest.length) {

            setRequest(allRequest.find(it => it.id == req.id))
        }
    }, [allRequest])
    useEffect(() => {
        if (item) {

            const me = item[profile.uid]

            if (item.status == 2 && me.status == 1) {
                setCode(2)
            }
            else if (item.status == 3 && item.did == profile.uid) {

                setCode(1)
            }
            else {
                setCode(3)
            }

            const isMissed = item.status >= 3 && item.did != profile.uid

            const statusMessages = code == 1 ? 'Active' : code == 2 ? 'Pending' : me.status == 1 ? isMissed ? 'You Missed' : 'Cancelled' :
                me.status < 0 ? 'Rejected' : `Completed`

            setStatusMessages(statusMessages)
            // const ind = item.sendDrivers.findIndex(it => item[it.did].status >= 2)
            // if(ind!=-1){
            //     driver.push(item[item.sendDrivers[ind].did])
            // }
            let driver = []

            let dri = null
            item.sendDrivers?.map((it, i) => {
                const d = item[it.did]
                console.log('sefsegfsfsfsefsfse', d)
                if (d.status >= 2) {
                    dri = d
                }
                else {
                    driver.push(d)
                }
            })
            if (dri) {
                driver = [dri, ...driver]
            }
            console.log(driver.length)
            setSendDrivers(driver)
        }
    }, [item, code])
    useEffect(() => {

        if (errorMsg) {
            setTimeout(() => {
                setIsLoading(false)
                setErrorMsg(null)
            }
                , errorTime)
        }
    }, [errorMsg])

    if (!item) {
        return
    }
    const CommonItem = ({ text, text2, items = [], color = null }) => {
        return (
            <View style={{}}>
                <Text style={styles.heading}>{text}</Text>
                <View style={{ marginHorizontal: myWidth(2) }}>

                    {
                        text2 ?
                            <Text style={styles.tesxH}>{text2}</Text>
                            : null
                    }

                    <Spacer paddingT={myHeight(1)} />

                    {
                        items.map((item, i) => {
                            if (item == null) {
                                return
                            }
                            return (

                                <View key={i} style={styles.backItem}>

                                    <Text

                                        style={{
                                            fontSize: myFontSize.body,
                                            fontFamily: myFonts.bodyBold,
                                            color: color ? color : myColors.text,
                                            letterSpacing: myLetSpacing.common,
                                            includeFontPadding: false,
                                            padding: 0,
                                        }}>{item}</Text>
                                </View>
                            )
                        })
                    }

                </View>
                <Spacer paddingT={myHeight(2.5)} />
            </View>
        )
    }
    const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // const driver = item?.sendDrivers[0]
    const DaysShow = ({ list = [] }) => {
        return (
            <View style={{ width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
                {
                    allDays.map((it, i) => {
                        const is = list.findIndex(li => li == it) != -1

                        return (

                            <>
                                <View key={i} style={[styles.backItem2, {
                                    backgroundColor: is ? myColors.primaryT : myColors.divider, width: myWidth(11), paddingVertical: myHeight(0.6),
                                    paddingHorizontal: myWidth(0), justifyContent: 'center'
                                }]}>


                                    <Text numberOfLines={1}

                                        style={{
                                            fontSize: myFontSize.small3,
                                            fontFamily: myFonts.bodyBold,
                                            color: is ? myColors.background : myColors.text,
                                            letterSpacing: myLetSpacing.common,
                                            includeFontPadding: false,
                                            padding: 0,
                                        }}>{it}</Text>

                                </View>
                                {
                                    i != 6 &&
                                    <Spacer key={i} paddingEnd={myWidth(1.5)} />
                                }
                            </>

                        )
                    }
                    )
                }
            </View>
        )
    }

    return (
        <>
            {/* <StatusBar backgroundColor={orderModal ? '#00000030' : myColors.background} /> */}
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: myColors.background,
            }}>
                <StatusbarH />
                {/* Top  */}
                <Spacer paddingT={myHeight(1.2)} />

                <View style={{
                    flexDirection: 'row', paddingHorizontal: myWidth(4),
                    alignItems: 'center'
                }}>
                    {/* Back */}

                    <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={{
                        backgroundColor: myColors.primaryT,
                        height: myHeight(4),
                        width: myHeight(4),
                        borderRadius: myHeight(3),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}  >
                        <Image style={
                            {
                                height: myHeight(2),
                                width: myHeight(2),
                                resizeMode: 'contain'
                            }
                        } source={require('../assets/startup/goL.png')} />
                    </TouchableOpacity>
                    <Spacer paddingEnd={myWidth(5)} />


                    <Text numberOfLines={1} style={[styles.textCommon, {
                        flex: 1,
                        fontFamily: myFonts.bodyBold, fontSize: myFontSize.xBody2
                    }]}>Request Details</Text>

                </View>
                <Spacer paddingT={myHeight(1.8)} />

                {/* Content */}
                <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{
                    backgroundColor: myColors.background, flexGrow: 1, paddingHorizontal: myWidth(4)
                }}>
                    <Spacer paddingT={myHeight(1)} />
                    <CommonItem text={'Ride ID'} text2={'The ride id of the request.'}
                        items={[item.id]} />

                    <CommonItem text={'Status'} text2={'The status of the request.'}
                        // items={[statusMessages]} color={(item.status < 0 || (code == 3 && item[profile.uid].status == 1)) ? myColors.red : myColors.green} />
                        items={[statusMessages]} color={(code == 3 && (item[profile.uid].status < 0 || (item[profile.uid].status == 1 && isMissed))) ? myColors.red : myColors.green} />


                    <CommonItem text={'Pickup'} text2={'Pickup location and timing.'}
                        items={[item.pickup.name, item.pickupTime.time]} />

                    <CommonItem text={'Dropoff'} text2={'Dropoff location and timing.'}
                        items={[item.dropoff.name, item.twoWay ? item.dropoffTime.time : null]} />



                    <CommonItem text={'Seats'} text2={'Amount of seats booked.'}
                        items={[item.seats]} />



                    <CommonItem text={'Billing & Offer'} text2={'The billing & offer of the request by customer.'}
                        items={[item.packages, `${item.offer} Rs`]} />


                    <View style={{}}>
                        <Text style={styles.heading}>{'Ride Days'}</Text>
                        <View style={{ marginHorizontal: myWidth(2) }}>
                            <Text style={styles.tesxH}>The ride days of the request</Text>
                            <Spacer paddingT={myHeight(0.8)} />



                            <DaysShow list={item.selectedDays} />

                        </View>
                    </View>
                    <Spacer paddingT={myHeight(2.8)} />
                    <CommonItem text={'Distance Traveled '} text2={'The distance traveled from the pickup to dropoff'}
                        items={[item.distance]} />

                    {item.instruction ?
                        <CommonItem text={'Instruction '} items={[item.instruction]} />
                        :

                        null
                    }


                    {/* <Spacer paddingT={myHeight(2.6)} /> */}
                    <Text style={{
                        fontSize: myFontSize.body4,
                        fontFamily: myFonts.bodyBold,
                        color: myColors.text,
                        letterSpacing: myLetSpacing.common,
                        includeFontPadding: false,
                        padding: 0,
                    }}>{'Customer'}</Text>
                    <View style={{
                        backgroundColor: myColors.background,
                        // flexDirection: 'row', alignItems: 'center',
                        paddingHorizontal: myWidth(3), borderRadius: myWidth(2),
                        marginVertical: myHeight(1),
                        borderWidth: myHeight(0.1), borderColor: myColors.dot
                    }}>

                        <Spacer paddingT={myHeight(1.5)} />


                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                            <Text numberOfLines={1}
                                style={{
                                    flex: 1,

                                    fontSize: myFontSize.body2,
                                    fontFamily: myFonts.heading,
                                }}>{item.name}</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>

                                <TouchableOpacity activeOpacity={0.85} style={{
                                    padding: myHeight(0.8), backgroundColor: myColors.primaryT,
                                    elevation: 1,
                                    borderRadius: myWidth(1.5),

                                }}
                                    onPress={() => { Linking.openURL(`tel:${item.contact}`); }}
                                >
                                    <Image source={require('../assets/home_main/home/phone.png')}
                                        style={{
                                            width: myHeight(1.8),
                                            height: myHeight(1.8),
                                            resizeMode: 'contain',
                                            tintColor: myColors.background
                                        }}
                                    />

                                </TouchableOpacity>
                                <Spacer paddingEnd={myWidth(2.5)} />

                                <TouchableOpacity activeOpacity={0.85} style={{
                                    padding: myHeight(0.8), backgroundColor: myColors.primaryT,
                                    elevation: 1,
                                    borderRadius: myWidth(1.5),
                                }}
                                    onPress={() => {
                                        navigation.navigate('Chat',
                                            { user2: { name: item.name, uid: item.uid } }
                                        )
                                    }}
                                >
                                    <Image source={require('../assets/home_main/home/navigator/chat2.png')}
                                        style={{
                                            width: myHeight(1.8),
                                            height: myHeight(1.8),
                                            resizeMode: 'contain',
                                            tintColor: myColors.background
                                        }}
                                    />
                                </TouchableOpacity>

                            </View>
                        </View>




                        <Spacer paddingT={myHeight(1.5)} />

                    </View>
                    <Spacer paddingT={myHeight(1.5)} />

                </ScrollView>




            </SafeAreaView>

            {isLoading && <Loader />}
            {errorMsg && <MyError message={errorMsg} />}



        </>
    )
}


const styles = StyleSheet.create({
    //Text
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

    backItem: {
        paddingHorizontal: myWidth(4), width: '100%',
        paddingVertical: myHeight(1), borderRadius: myWidth(2),
        backgroundColor: myColors.primaryL6,
        borderWidth: myHeight(0.1), borderColor: myColors.dot,
        flexDirection: 'row', alignItems: 'center', marginVertical: myHeight(0.5)
    },
    heading: {
        fontSize: myFontSize.body4,
        fontFamily: myFonts.bodyBold,
        color: myColors.textL4,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
    backItem2: {
        paddingHorizontal: myWidth(5), paddingVertical: myHeight(0.75), borderRadius: myWidth(100),
        backgroundColor: myColors.background, borderWidth: myHeight(0.1), borderColor: myColors.divider,
        flexDirection: 'row', alignItems: 'center'
    },
    tesxH: {
        fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.bodyBold,
        color: myColors.textL4,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
})