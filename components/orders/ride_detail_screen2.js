import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Alert, TextInput, TouchableOpacity, View, SafeAreaView, Image, Text, ScrollView, StatusBar, Easing, Linking } from 'react-native';
import { Loader, MyError, Spacer, StatusbarH, errorTime, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFonts, myLetSpacing, myFontSize } from '../../ultils/myFonts';
import firestore, { Filter } from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import { ImageUri } from '../common/image_uri';
import { FlashList } from '@shopify/flash-list';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorAlert } from '../../redux/error_reducer';
import { sendPushNotification } from '../functions/firebase';
import { getDistanceFromRes } from '../functions/functions';



export const RideDetails2 = ({ navigation, route }) => {
    const req = route.params.item
    const code2 = route.params.code
    const { profile } = useSelector(state => state.profile)
    const [errorMsg, setErrorMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [sendDrivers, setSendDrivers] = useState([])
    const [statusMessages, setStatusMessages] = useState(null)
    const [isMissed, setIsMissed] = useState(null)

    const [load, setLoad] = useState(false)
    const [load2, setLoad2] = useState(false)
    const [distance, setDistance] = useState(false)
    const [code, setCode] = useState(code2)
    const { current } = useSelector(state => state.location)

    const { allRequest } = useSelector(State => State.orders)
    const [item, setRequest] = useState(null)
    const [me, setMe] = useState(null)
    const item2 = item
    // const driver = item?.sendDrivers[0]
    const dispatch = useDispatch()
    useEffect(() => {
        if (allRequest.length) {

            setRequest(allRequest.find(it => it.id == req.id))
        }
    }, [allRequest])


    useEffect(() => {
        if (current && item && code != 3) {
            const from = current ? current : { latitude: 0, longitude: 0 }
            const to = item.location ? item.location : { latitude: 0, longitude: 0 }
            const { distance, string } = getDistanceFromRes(from, to, true)
            setDistance(string)
            console.log('updated Distance', string)
        }
        else {
            setDistance(null)
        }
    }, [current, item])
    useEffect(() => {
        if (item) {

            const me = item[profile.uid]
            setMe(me)

            if (item.status == 2 && (me.status == 1 || me.status == 1.5)) {
                setCode(2)
            }
            else if (item.status == 3 && item.did == profile.uid) {
                setCode(1)

            }
            else {
                setCode(3)

            }

            const isMissed = item.status >= 3 && item.did != profile.uid
            setIsMissed(isMissed)
            const statusMessages = code == 1 ? 'In Progress' : code == 2 ? me.status == 1.5 ? 'Wait for customer response' : 'Pending' : me.status == 1 ? isMissed ? 'You Missed' : 'Cancelled' :
                me.status < 0 ? 'Rejected' : `Completed`


            // const ss = (code == 3 && (me.status < 0 || (me.status == 1 && isMissed)))
            // console.log('ppppp', ss)

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

    if (!item || !me) {
        return
    }

    function onAcceptSpecific() {
        setLoad2(true)


        const dr = me

        const update = { did: dr.did, driverName: dr.name, driverContact: dr.contact, status: 3 }
        update[dr.did] = { ...dr, status: 2, unread: true }


        database()
            .ref(`/requests/${item.uid}/${item.id}`).update({ ...update, unread: true })
            .then(() => {
                console.log('To accept user successfully')
                dispatch(setErrorAlert({ Title: 'Request Accepted Successfully', Body: null, Status: 2 }))
                const navigate = { screen: 'RIDES', params: { index: 0 } }

                sendPushNotification('Ride Accepted', `Vanpool ride is accepted by ${profile.name}`, 2, [item.token], navigate)
                setLoad2(false)
                setCode(1)


            })
            .catch((err) => {
                setLoad2(false)

                console.log('error on accept unread err', err)

            })

    }
    function onRejectSpecific() {
        // return
        setLoad(true)
        const update = { status: -1 }
        update[me.did] = { ...me, status: -1, unread: true }


        database()
            .ref(`/requests/${item.uid}/${item.id}`).update({ ...update, unread: true })
            .then(() => {
                console.log('To accept user successfully')
                dispatch(setErrorAlert({ Title: 'Request Rejected Successfully', Body: null, Status: 2 }))
                const navigate = { screen: 'RIDES', params: { index: 0 } }

                sendPushNotification('Ride Rejected', `Vanpool ride is rejected by ${profile.name}`, 0, [item.token], navigate)
                setLoad(false)
                navigation.goBack()

            })
            .catch((err) => {
                setLoad(false)

                console.log('error on accept unread err', err)

            })

    }
    function onAccept() {

        setLoad2(true)

        const update = {}

        update[profile.uid] = { ...item[profile.uid], status: 1.5, }

        // console.log(update)
        // return
        database()
            .ref(`/requests/${item.uid}/${item.id}`).update({ ...update, unread: true })
            .then(() => {
                console.log('To accept user successfully')
                dispatch(setErrorAlert({ Title: 'Request Accepted Successfully', Body: "Wait for customer's conformation", Status: 2 }))
                setLoad2(false)
                firestore().collection('users').doc(item.uid).get().then((data) => {
                    const captain = data.data()
                    const token = captain.deviceToken
                    const navigate = { screen: 'RIDES', params: { index: 0 } }

                    sendPushNotification('Vanpool Request Accepted', `Your vanpool request is accepted by ${profile.name}, awaiting for your response`, 2, [token], navigate)
                }).catch((err) => { console.log(err) })

            })
            .catch((err) => {
                console.log('error on accept unread err', err)
                setLoad2(false)

            })



    }
    function onReject() {
        setLoad(true)
        database()
            .ref(`/requests/${item.uid}/${item.id}/${profile.uid}`).update({ status: -1 }).
            then(() => {
                setLoad(false)
                firestore().collection('users').doc(item.uid).get().then((data) => {
                    const captain = data.data()
                    const token = captain.deviceToken

                    const navigate = { screen: 'RIDES', params: { index: 0 } }


                    sendPushNotification('Vanpool Request Rejected', `Your vanpool request is rejected by ${profile.name}`, 0, [token], navigate)
                    navigation.goBack()
                }).catch((err) => { console.log(err) })


                console.log('To Unread successfully')
            })
            .catch((err) => {
                setLoad(false)

                console.log('error on update unread err')
            })



    }
    function onEnd() {

        setLoad(true)
        database()
            .ref(`/requests/${item.uid}/${item.id}`).update({ status: 5, unread: true })
            .then(() => {
                setLoad(false)
                firestore().collection('users').doc(item.uid).get().then((data) => {
                    const captain = data.data()
                    const token = captain.deviceToken
                    navigation.goBack()
                    const navigate = { screen: 'RIDES', params: { index: 2 } }

                    sendPushNotification('Vanpool Ride Is Ended', `Your vanpool ride is ended`, 2, [token], navigate)
                }).catch((err) => { console.log(err) })
            })
            .catch((err) => {
                console.log('error on accept unread err', err)
                setLoad(false)

            })

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


                            {
                                distance ?
                                    <>
                                        <Image
                                            style={{
                                                width: myHeight(2.5),
                                                height: myHeight(2.5),
                                                resizeMode: 'contain',
                                                tintColor: myColors.primaryT
                                            }} source={require('../assets/home_main/home/distance.png')}
                                        />
                                        <Spacer paddingEnd={myWidth(1.8)} />

                                        <Text
                                            style={[
                                                styles.textCommon,
                                                {

                                                    fontSize: myFontSize.body,
                                                    fontFamily: myFonts.body,
                                                },
                                            ]}
                                        >{distance} Away</Text>
                                        <Spacer paddingEnd={myWidth(2.5)} />
                                    </>
                                    : null
                            }


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
                    <Spacer paddingT={myHeight(2)} />
                    <CommonItem text={'Ride ID'} text2={'The ride id of the request.'}
                        items={[item.id]} />

                    <CommonItem text={'Status'} text2={'The status of the request.'}
                        items={[item.onlineStatus]} color={item.onlineStatusColor} />
                    {/* items={[statusMessages]} color={(code == 3 && (me.status < 0 || (me.status == 1 && isMissed))) ? myColors.red : myColors.green} /> */}
                    <CommonItem text={'Offer'} text2={'The offer of the request by customer.'}
                        items={[`${item.offer} Rs`]} />


                    <CommonItem text={'Date'} text2={'The date of the request.'}
                        items={[`${item.date}`]} />


                    <CommonItem text={'Pickup'} text2={'Pickup location and timing.'}
                        items={[item.pickup.name, item.pickupTime?.time]} />

                    <CommonItem text={'Dropoff'} text2={'Dropoff location and timing.'}
                        items={[item.dropoff.name, item.twoWay ? item.dropoffTime?.time : null]} />



                    <CommonItem text={'Seats'} text2={'Amount of seats booked.'}
                        items={[item.seats]} />



                    <CommonItem text={'Distance Traveled '} text2={'The distance traveled from the pickup to dropoff'}
                        items={[item.distance]} />

                    {item.instruction ?
                        <CommonItem text={'Instruction '} items={[item.instruction]} />
                        :

                        null
                    }



                    <Spacer paddingT={myHeight(1.5)} />

                </ScrollView>

                {
                    (code == 2 && me.status == 1) ?
                        <>
                            <Spacer paddingT={myHeight(1.5)} />

                            <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                if (item.isSpecific) {
                                    onAcceptSpecific()
                                    return
                                }
                                onAccept()
                            }

                            }
                                style={{
                                    width: myWidth(92), alignSelf: 'center', paddingVertical: myHeight(1.2),
                                    borderRadius: myHeight(1.4), alignItems: 'center', justifyContent: 'center',
                                    flexDirection: 'row', backgroundColor: myColors.background,
                                    borderWidth: myHeight(0.15), borderColor: myColors.green, marginTop: myHeight(1)
                                }}>
                                <>
                                    {
                                        load2 ?
                                            <Text
                                                style={[
                                                    styles.textCommon,
                                                    {

                                                        fontSize: myFontSize.body,
                                                        fontFamily: myFonts.bodyBold,
                                                        color: myColors.green
                                                    },
                                                ]}
                                            >Loading...</Text>
                                            :
                                            <>

                                                <View >
                                                    <Text
                                                        style={[
                                                            styles.textCommon,
                                                            {
                                                                fontSize: myFontSize.body,
                                                                fontFamily: myFonts.heading,
                                                                color: myColors.green
                                                            },
                                                        ]}
                                                    >{'Accept'}</Text>
                                                </View>


                                                {/* <Spacer paddingEnd={myWidth(3)} /> */}


                                            </>
                                    }
                                </>

                            </TouchableOpacity>
                            <Spacer paddingT={myHeight(0.5)} />

                        </>
                        : null


                }

                {
                    (code != 3 && me.status >= 0) ?
                        <>
                            {
                                me.status == 1.5 ?
                                    <>

                                        <View style={{ marginHorizontal: myWidth(4) }}>
                                            <Text
                                                style={[
                                                    styles.textCommon,
                                                    {
                                                        fontSize: myFontSize.body,
                                                        fontFamily: myFonts.heading,
                                                        color: myColors.green
                                                    },
                                                ]}
                                            >{'Wait for customer response'}</Text>
                                        </View>

                                        {/* <Spacer paddingT={myHeight(0.5)} /> */}



                                    </>
                                    : null
                            }
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                if (code == 1) {
                                    onEnd()
                                } else {
                                    if (item.isSpecific && me.status == 1) {
                                        onRejectSpecific()
                                        return
                                    }

                                    onReject()
                                }
                            }

                            }
                                style={{
                                    width: myWidth(92), alignSelf: 'center', paddingVertical: myHeight(1.2),
                                    borderRadius: myHeight(1.4), alignItems: 'center', justifyContent: 'center',
                                    flexDirection: 'row', backgroundColor: myColors.background,
                                    borderWidth: myHeight(0.15), borderColor: myColors.red, marginVertical: myHeight(1)
                                }}>
                                <>
                                    {
                                        load ?
                                            <Text
                                                style={[
                                                    styles.textCommon,
                                                    {

                                                        fontSize: myFontSize.body,
                                                        fontFamily: myFonts.bodyBold,
                                                        color: myColors.red
                                                    },
                                                ]}
                                            >Loading...</Text>
                                            :
                                            <>

                                                <View >
                                                    <Text
                                                        style={[
                                                            styles.textCommon,
                                                            {
                                                                fontSize: myFontSize.body,
                                                                fontFamily: myFonts.heading,
                                                                color: myColors.red
                                                            },
                                                        ]}
                                                    >{code == 1 ? 'End Now' : me.status == 1 ? 'Reject' : 'Cancel Ride'}</Text>
                                                </View>


                                                {/* <Spacer paddingEnd={myWidth(3)} /> */}


                                            </>
                                    }
                                </>

                            </TouchableOpacity>
                        </>
                        : null


                }



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
    tesxH: {
        fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.bodyBold,
        color: myColors.textL4,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
})