
import { Image, TouchableOpacity, SafeAreaView, StyleSheet, Text, View, ImageBackground, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Spacer, myHeight, myWidth } from "../../common"
import { myFontSize, myFonts, myLetSpacing } from "../../../ultils/myFonts"
import { myColors } from "../../../ultils/myColors"
import { useDispatch, useSelector } from 'react-redux'
import { addFavoriteRest, removeFavoriteRest } from '../../../redux/favorite_reducer'
import { ImageUri } from '../../common/image_uri'
import database from '@react-native-firebase/database';
import { FirebaseUser, sendPushNotification } from '../../functions/firebase'
import { setErrorAlert } from '../../../redux/error_reducer'
import firestore from '@react-native-firebase/firestore';
import { updateProfileToFirebase } from '../../functions/functions'

export const RequestInfo = ({ item, navigation, code }) => {
    const { profile } = useSelector(state => state.profile)
    const me = item[profile.uid]
    const [load, setLoad] = useState(false)

    const isMissed = item.status >= 3 && item.did != profile.uid
    const dispatch = useDispatch()
    useEffect(() => {
        if (me.unread) {
            setTimeout(() => {

                database()
                    .ref(`/requests/${item.uid}/${item.id}/${profile.uid}`).update({ unread: false }).
                    then(() => { console.log('To Unread successfully') })
                    .catch((err) => { console.log('error on update unread err') })
            }, 3000)
        }
    }, [item])
    function onAccept() {



        if (profile.availableSeats < item.seats) {
            dispatch(setErrorAlert({ Title: 'Seats Not Available', Body: null, Status: 0 }))
            return
        }
        setLoad(false)


        const update = { did: profile.uid, driverName: profile.name, driverContact: profile.contact, status: 3 }
        update[profile.uid] = { ...item[profile.uid], status: 2, unread: true }

        // console.log(update)
        // return
        database()
            .ref(`/requests/${item.uid}/${item.id}`).update({ ...update, unread: true })
            .then(() => {
                console.log('To accept user successfully')
                dispatch(setErrorAlert({ Title: 'Request Accepted Successfully', Body: null, Status: 2 }))
                setLoad(false)
                firestore().collection('users').doc(item.uid).get().then((data) => {
                    const captain = data.data()
                    const token = captain.deviceToken

                    const seats = profile.availableSeats - item.seats
                    updateProfileToFirebase({ availableSeats: seats < 0 ? 0 : seats })
                    // FirebaseUser.doc(profile.uid)
                    //     .update({  })
                    //     .then(() => {

                    //         console.log('To accept me successfully')

                    //     }).catch(err => {

                    //         console.log('Internal error while Updating a Restaurant', err)
                    //     });


                    const navigate = { screen: 'RIDES', params: { index: 0 } }


                    sendPushNotification('Request Accepted', `Your request is accepted by ${profile.name}`, 2, [token], navigate)
                }).catch((err) => { console.log(err) })

            })
            .catch((err) => {
                console.log('error on accept unread err', err)
                setLoad(false)

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
                    const navigate = { screen: 'RIDES', params: { index: 2 } }

                    sendPushNotification('Request Rejected', `Your request is rejected by ${profile.name}`, 0, [token], navigate)


                }).catch((err) => { console.log(err) })

                console.log('To Unread successfully')
            })
            .catch((err) => {
                setLoad(false)

                console.log('error on update unread err')
            })
        // let drivers = item.sendDrivers
        // const ind = item.sendDrivers.findIndex(it => it.did == profile.uid)
        // drivers[ind].status = -1
        // const update = { sendDrivers: drivers }
        // console.log(item.uid)


        return
        database()
            .ref(`/requests/${item.uid}/${item.id}`).update(update)
            .then(() => {
                console.log('To reject user successfully')

                database()
                    .ref(`/requests/${profile.uid}/${item.id}`).update({ ...update, status: -1 })
                    .then(() => {
                        console.log('To reject successfully')
                        dispatch(setErrorAlert({ Title: 'Request Rejected Successfully', Body: null, Status: 2 }))
                        setLoad(false)

                        firestore().collection('users').doc(item.uid).get().then((data) => {
                            const captain = data.data()
                            const token = captain.deviceToken

                            sendPushNotification('Request Rejected', `Your request ${item.id} is rejected by ${profile.name}`, 0, [token])
                        }).catch((err) => { console.log(err) })

                    })
                    .catch((err) => {
                        console.log('error on accept unread err', err)
                        setLoad(false)

                    })
            })
            .catch((err) => {
                console.log('error on accept unread err', err)
                setLoad(false)

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

                    const seats = profile.availableSeats + item.seats

                    updateProfileToFirebase({ availableSeats: profile.vehicleSeats > seats ? seats : profile.availableSeats })
                    const navigate = { screen: 'RIDES', params: { index: 2 } }

                    sendPushNotification('Ride Ended', `Your ride is ended`, 2, [token], navigate)
                }).catch((err) => { console.log(err) })
            })
            .catch((err) => {
                console.log('error on accept unread err', err)
                setLoad(false)

            })
        return
        let drivers = item.sendDrivers
        const ind = item.sendDrivers.findIndex(it => it.did == profile.uid)
        drivers[ind].status = 5
        const update = { sendDrivers: drivers, did: profile.uid, driverName: profile.name, driverContact: profile.contact, status: 5 }
        console.log(item.uid)

        database()
            .ref(`/requests/${item.uid}/${item.id}`).update({ ...update, unread: true })
            .then(() => {
                console.log('To accept user successfully')

                database()
                    .ref(`/requests/${profile.uid}/${item.id}`).update(update)
                    .then(() => {
                        console.log('To accept successfully')
                        dispatch(setErrorAlert({ Title: 'Ride Ended Successfully', Body: null, Status: 2 }))
                        setLoad(false)
                        firestore().collection('users').doc(item.uid).get().then((data) => {
                            const captain = data.data()
                            const token = captain.deviceToken

                            sendPushNotification('Ride End', `Your ride ${item.id} is ended by ${profile.name}`, 2, [token])
                        }).catch((err) => { console.log(err) })

                        const seats = profile.availableSeats + item.seats
                        FirebaseUser.doc(profile.uid)
                            .update({ availableSeats: seats > profile.availableSeats ? profile.availableSeats : seats })
                            .then(() => {

                                console.log('To accept me successfully')

                            }).catch(err => {

                                console.log('Internal error while Updating a Restaurant', err)
                            });

                    })
                    .catch((err) => {
                        console.log('error on accept unread err', err)
                        setLoad(false)

                    })
            })
            .catch((err) => {
                console.log('error on accept unread err', err)
                setLoad(false)

            })

    }

    if (!me) {
        return null
    }
    return (
        <View

            style={{
                backgroundColor: myColors.background, elevation: 5,
                borderRadius: myWidth(1.5), paddingHorizontal: myWidth(3),
                marginBottom: myHeight(1), marginTop: myHeight(4),
                borderWidth: myHeight(0.1), borderColor: me.unread ? myColors.green : myColors.divider
            }}>

            <View style={{
                paddingVertical: myHeight(0.6), paddingHorizontal: myWidth(4),
                marginTop: -myHeight(2),
                backgroundColor: myColors.text, alignSelf: 'center',
                borderRadius: myWidth(100), flexDirection: 'row', alignItems: 'center'
            }}>
                <Image
                    style={{
                        width: myHeight(2),
                        height: myHeight(2),
                        resizeMode: 'contain',
                        tintColor: myColors.divider
                    }} source={item.twoWay ? require('../../assets/home_main/home/twoArrow.png') : require('../../assets/home_main/home/oneArrow.png')}
                />

                <Spacer paddingEnd={myWidth(2.2)} />
                <Text
                    style={[
                        styles.textCommon,
                        {

                            fontSize: myFontSize.xxSmall,
                            fontFamily: myFonts.body,
                            color: myColors.background
                        },
                    ]}
                >ID: {item.id} </Text>
            </View>
            <Spacer paddingT={myHeight(1)} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>


                    <Spacer paddingEnd={myWidth(0.3)} />

                    <Image
                        style={{

                            width: myHeight(2),
                            height: myHeight(2),
                            resizeMode: 'contain',
                            tintColor: myColors.primaryT
                        }}
                        source={require('../../assets/home_main/home/profile.png')}
                    />
                    <Spacer paddingEnd={myWidth(2.5)} />
                    <Text
                        style={[
                            styles.textCommon,
                            {
                                flex: 1,
                                fontSize: myFontSize.body2,
                                fontFamily: myFonts.bodyBold,
                            },
                        ]}
                    >{item.name}
                    </Text>

                </View>
                {
                    code == 3 ? null
                        :
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity activeOpacity={0.85} style={{
                                padding: myHeight(0.8), backgroundColor: myColors.background,
                                elevation: 3,
                                borderRadius: 100
                            }}
                                onPress={() => { Linking.openURL(`tel:${item.contact}`); }}
                            >
                                <Image source={require('../../assets/home_main/home/phone.png')}
                                    style={{
                                        width: myHeight(1.8),
                                        height: myHeight(1.8),
                                        resizeMode: 'contain',
                                        tintColor: myColors.text
                                    }}
                                />

                            </TouchableOpacity>
                            <Spacer paddingEnd={myWidth(3.5)} />

                            <TouchableOpacity activeOpacity={0.85} style={{
                                padding: myHeight(0.8), backgroundColor: myColors.background,
                                elevation: 3,
                                borderRadius: 100
                            }}
                                onPress={() => {
                                    navigation.navigate('Chat',
                                        { user2: item }
                                    )
                                }}
                            >
                                <Image source={require('../../assets/home_main/home/navigator/chat2.png')}
                                    style={{
                                        width: myHeight(1.8),
                                        height: myHeight(1.8),
                                        resizeMode: 'contain',
                                        tintColor: myColors.text
                                    }}
                                />
                            </TouchableOpacity>
                        </View>

                }
            </View>

            <Spacer paddingT={myHeight(1.7)} />

            <View style={{ flexDirection: 'row' }}>
                {/* Circles & Line*/}
                <View
                    style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: myHeight(0.5),
                        marginBottom: 0
                    }}
                >
                    <View
                        style={{
                            height: myHeight(2),
                            width: myHeight(2),
                            borderRadius: myHeight(3),
                            borderWidth: myHeight(0.07),
                            borderColor: myColors.primaryT,
                            backgroundColor: myColors.background,
                        }}
                    />
                    <View
                        style={{
                            flex: 1,
                            width: myWidth(0.5),
                            backgroundColor: myColors.primaryT,
                            marginVertical: myHeight(0.4),
                        }}
                    />
                    <View
                        style={{
                            height: myHeight(2),
                            width: myHeight(2),
                            borderRadius: myHeight(3),
                            backgroundColor: myColors.primaryT,
                        }}
                    />
                </View>

                <Spacer paddingEnd={myWidth(3)} />
                {/* Text Pick & Desti */}
                <View style={{ flex: 1 }}>
                    {/* Pick */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={[
                                styles.textCommon,
                                {
                                    flex: 1,
                                    fontSize: myFontSize.xxSmall,
                                    fontFamily: myFonts.bodyBold,
                                },
                            ]}
                        >
                            PickUp</Text>
                        {/* <Image
                            style={{
                                width: myHeight(2),
                                height: myHeight(2),
                                resizeMode: 'contain',
                                tintColor: myColors.textL4
                            }} source={require('../../assets/home_main/home/clock.png')}
                        /> */}
                        <Spacer paddingEnd={myWidth(1.3)} />

                        <Text style={[
                            styles.textCommon,
                            {
                                fontSize: myFontSize.xSmall,
                                fontFamily: myFonts.bodyBold,
                                color: myColors.textL4
                            },
                        ]}>{item.pickupTime.time}
                        </Text>
                    </View>
                    <Text numberOfLines={2}
                        style={[
                            styles.textCommon,
                            {
                                fontSize: myFontSize.small,
                                fontFamily: myFonts.body,
                            },
                        ]}
                    >{item.pickup.name}</Text>

                    <Spacer paddingT={myHeight(1.3)} />

                    {/* Destination */}
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <Text
                                style={[
                                    styles.textCommon,
                                    {
                                        flex: 1,
                                        fontSize: myFontSize.xxSmall,
                                        fontFamily: myFonts.bodyBold,
                                    },
                                ]}
                            >
                                DropOff
                            </Text>



                            {
                                item.twoWay &&
                                <>
                                    {/* <Image
                                        style={{
                                            width: myHeight(2),
                                            height: myHeight(2),
                                            resizeMode: 'contain',
                                            tintColor: myColors.textL4
                                        }} source={require('../../assets/home_main/home/clock.png')}
                                    /> */}
                                    <Spacer paddingEnd={myWidth(1.3)} />
                                    <Text style={[
                                        styles.textCommon,
                                        {
                                            fontSize: myFontSize.xSmall,
                                            fontFamily: myFonts.bodyBold,
                                            color: myColors.textL4
                                        },
                                    ]}>{item.dropoffTime.time}
                                    </Text>
                                </>

                            }
                        </View>

                        <Text
                            numberOfLines={2}
                            style={[
                                styles.textCommon,
                                {
                                    fontSize: myFontSize.small,
                                    fontFamily: myFonts.body,
                                },
                            ]}
                        >{item.dropoff.name} </Text>
                    </View>
                </View>
            </View>
            <Spacer paddingT={myHeight(1.6)} />

            <View style={{ height: myHeight(0.15), backgroundColor: myColors.dot }} />


            <Spacer paddingT={myHeight(0.7)} />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Image
                    style={{

                        width: myHeight(1.6),
                        height: myHeight(1.6),
                        resizeMode: 'contain',
                        tintColor: myColors.text
                    }}
                    source={require('../../assets/home_main/home/seatSF.png')}
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
                >{item.seats}
                </Text>
                <Spacer paddingEnd={myWidth(3)} />

                <View style={{ height: '100%', width: myHeight(0.25), backgroundColor: myColors.dot }} />
                <Spacer paddingEnd={myWidth(3)} />

                <Image
                    style={{
                        width: myHeight(2),
                        height: myHeight(2),
                        resizeMode: 'contain',
                        tintColor: myColors.text
                    }} source={require('../../assets/home_main/home/distance.png')}
                />
                <Spacer paddingEnd={myWidth(1.8)} />

                <Text
                    style={[
                        styles.textCommon,
                        {
                            flex: 1,
                            fontSize: myFontSize.xxSmall,
                            fontFamily: myFonts.body,
                        },
                    ]}
                >{item.distance} </Text>

                {
                    load ?
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

                            {
                                code == 2 ?
                                    <>
                                        <TouchableOpacity activeOpacity={0.7} onPress={() => onReject()}>
                                            <Text
                                                style={[
                                                    styles.textCommon,
                                                    {
                                                        fontSize: myFontSize.body,
                                                        fontFamily: myFonts.heading,
                                                        color: myColors.red
                                                    },
                                                ]}
                                            >{'Reject'}</Text>
                                        </TouchableOpacity>
                                        <Spacer paddingEnd={myWidth(4)} />
                                        <TouchableOpacity activeOpacity={0.7} onPress={() => onAccept()}>
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
                                        </TouchableOpacity>


                                    </>
                                    :

                                    <>
                                        {

                                            code == 1 ?
                                                <>

                                                    {/* <Text
                                                        style={[
                                                            styles.textCommon,
                                                            {

                                                                fontSize: myFontSize.xxSmall,
                                                                fontFamily: myFonts.bodyBold,
                                                                color: myColors.text
                                                            },
                                                        ]}
                                                    >Accepted</Text>
                                                    <Spacer paddingEnd={myWidth(6)} /> */}
                                                    <TouchableOpacity activeOpacity={0.7} onPress={() => onEnd()}>
                                                        <Text
                                                            style={[
                                                                styles.textCommon,
                                                                {
                                                                    fontSize: myFontSize.body,
                                                                    fontFamily: myFonts.heading,
                                                                    color: myColors.red
                                                                },
                                                            ]}
                                                        >{'End Now'}</Text>
                                                    </TouchableOpacity>
                                                </>

                                                :
                                                <>
                                                    {
                                                        me.status == 1 ?
                                                            <Text
                                                                style={[
                                                                    styles.textCommon,
                                                                    {

                                                                        fontSize: myFontSize.body,
                                                                        fontFamily: myFonts.bodyBold,
                                                                        color: 'red'
                                                                    },
                                                                ]}
                                                            >{isMissed ? 'You Missed' : 'Cancelled'}</Text>
                                                            :
                                                            <Text
                                                                style={[
                                                                    styles.textCommon,
                                                                    {

                                                                        fontSize: myFontSize.body,
                                                                        fontFamily: myFonts.bodyBold,
                                                                        color: me.status < 0 ? 'red' : myColors.green
                                                                    },
                                                                ]}
                                                            >{me.status < 0 ? 'Rejected' : `Completed`}</Text>
                                                    }
                                                </>
                                        }

                                    </>

                            }
                        </>
                }
            </View>


            <Spacer paddingT={myHeight(1.5)} />
        </View>
    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: myColors.background,
    },

    //Text
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
});
