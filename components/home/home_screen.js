import React, { useEffect, useState } from 'react';
import { SafeAreaView, Alert, ScrollView, StyleSheet, TouchableOpacity, Image, View, Text, FlatList, Modal, UIManager, LayoutAnimation } from 'react-native'
import { MyError, NotiAlertNew, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { Categories, Restaurants, } from './home_data'
import { ResturantH } from './home.component/resturant_hori';
import { Banners } from './home.component/banner';
import { RestaurantInfo } from './home.component/restaurant_info';
import { RestRating } from './rest_rating_screen';
import { getCartLocal, getLogin, setLogin } from '../functions/storageMMKV';
import { setCart } from '../../redux/cart_reducer';
import { useDispatch, useSelector } from 'react-redux';
import firestore, { Filter } from '@react-native-firebase/firestore';
import { setFavoriteItem, setFavoriteRest } from '../../redux/favorite_reducer';
import { RestaurantInfoSkeleton } from '../common/skeletons';
import { HomeSkeleton } from './home.component/home_skeleton';
import { ImageUri } from '../common/image_uri';
import storage from '@react-native-firebase/storage';
import { setAllItems, setAllRest, setNearby, setRecommend } from '../../redux/data_reducer';
import { setAllRequest, setAllUnread, setHistoryOrderse, setPendingOrderse, setProgressOrderse } from '../../redux/order_reducer';
import { SetErrorAlertToFunction, deccodeInfo, getAreasLocations, getCurrentLocations, statusDate } from '../functions/functions';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { FirebaseUser, getDeviceToken, sendPushNotification, updateDeviceTokenToFireBase } from '../functions/firebase';
import { NotiAlert } from '../common/noti_Alert';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { setProfile } from '../../redux/profile_reducer';
import { Search } from './locations_screen';
import database from '@react-native-firebase/database';
import { setChats, setTotalUnread } from '../../redux/chat_reducer';
import { DriverInfoFull } from './home.component/driver_info_full';

if (!ios && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}
function Greeting() {
    let greet = '';
    const myDate = new Date();
    const hrs = myDate.getHours();
    if (hrs >= 5 && hrs < 12) greet = 'Good Morning';
    else if (hrs >= 12 && hrs < 16) greet = 'Good Afternoon';
    else if (hrs >= 16 && hrs < 20) greet = 'Good Evening';
    else if (hrs >= 20 && hrs < 24) greet = 'Good Night';
    else if (hrs >= 0 && hrs < 5) greet = 'Mid Night Owl...';
    return greet;
}
export const HomeScreen = ({ navigation }) => {
    const name = "Someone";
    const { profile } = useSelector(state => state.profile)

    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [nearbyRestaurant, setNearbyRestaurant] = useState([])
    const [RecommendRestaurant, setRecommendRestaurant] = useState([])
    const [startPro, setStartPro] = useState({})



    const dispatch = useDispatch()



    function getAllRestuarant() {
        firestore().collection('restaurants')
            .where('update', '==', true)
            .where('city', '==', profile.city)
            .get().then((result) => {
                if (!result.empty) {
                    let rest = []
                    let items = []

                    result.forEach((res, i) => {
                        const restaurant = res.data()
                        rest.push(restaurant)
                        restaurant.foodCategory.map((subCat, ind) => {
                            subCat.items?.map((item, i) => {
                                items.push(item)
                            })

                        })
                        // catArray.push(cat.data())

                    })

                    dispatch(setAllRest(rest))

                }
                else {

                    console.log('empty')


                    // setCategories(catArray)
                }
            }).catch((er) => {
                // Alert.alert(er.toString())

                console.log('Error on Get all Restaurant', er)
            })
    }


    function sendNotificationToAll() {
        firestore().collection('users').get()
            .then((result) => {
                if (!result.empty) {

                    const tks = []
                    result.forEach((res, i) => {
                        const user = res.data()
                        // sendPushNotification('Enjoy the discount', 'Get Rs 150 discount on first ride', 0, user.deviceToken)
                        if (user.deviceToken) {

                            tks.push(user.deviceToken)
                        }
                        // catArray.push(cat.data())

                    })
                    sendPushNotification('Enjoy the discount', 'Get Rs 150 discount on first ride', generateRandomIntegerInRange(0, 2), tks)



                }
                else {

                    console.log('empty')


                    // setCategories(catArray)
                }
            }).catch((er) => {
                // Alert.alert(er.toString())

                console.log('Error on Get all Restaurant', er)
            })
    }

    useEffect(() => {
        const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
            console.log('Message handled in the foreground:');
            SetErrorAlertToFunction({
                Title: remoteMessage.notification.title,
                Body: remoteMessage.notification.body,
                Status: remoteMessage.data.status
            })
        });

        return () => {
            unsubscribeOnMessage();
        };
    }, []);

    async function onDisplayNotification(remoteMessage) {
        // Request permissions (required for iOS)
        await notifee.requestPermission()

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: remoteMessage.messageId.toString(),
            name: 'Orders'
        });


        // Display a notification
        await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
                channelId,
                // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
            },
        });
    }
    function generateRandomIntegerInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function getProfileFromFirebase() {
        FirebaseUser.doc(profile.uid).get().then((documentSnapshot) => {
            const prf = documentSnapshot.data()
            dispatch(setProfile(prf))


        }).catch(err => {
            console.log('Internal error while  getProfileFrom', err)
        });
    }
    useEffect(() => {
        getProfileFromFirebase()


    }, [])
    useEffect(() => {
        if (profile.city) {
            getAreasLocations(profile.city)
        }

        // updateDeviceTokenToFireBase(profile.uid)
        // sendPushNotification('hi', 'bye',2 )

        // getCurrentLocations()
        // const interval = setInterval(() => {
        //     getCurrentLocations()

        // }, 120000);
        // return () => clearInterval(interval);

    }, [profile.city])

    // Realtime
    useEffect(() => {
        const onValueChange = database()
            .ref(`/chats`)
            .on('value', snapshot => {
                if (snapshot.exists()) {
                    let Chats = []
                    let totalUnread = 0
                    snapshot.forEach((documentSnapshot1, i) => {
                        const key = documentSnapshot1.key.toString()
                        if (key.includes(profile.uid)) {
                            const val = documentSnapshot1.val()
                            if (val.captain && val.user) {

                                let messages = { ...val.messages }
                                let latest = null
                                let unreadmasseges = 0
                                let allMessages = []
                                let allUnreadMessagesToRead = {}
                                // messages = Object.keys(messages).sort(function (a, b) { return messages[a].dateInt - messages[b].dateInt })
                                Object.keys(messages).map((it, i) => {
                                    const mm = messages[it]
                                    allMessages.push(mm)
                                    if (latest == null || mm.dateInt > latest.dateInt) {
                                        latest = mm
                                    }
                                    if (mm.senderId != profile.uid && mm.read == false) {
                                        unreadmasseges += 1
                                        const s = {}
                                        allUnreadMessagesToRead[it] = { ...mm, read: true }

                                    }
                                })
                                if (unreadmasseges) {

                                    totalUnread += 1
                                }
                                const chat = {
                                    ...latest, unreadmasseges, chatId: key,
                                    user2: val.user,
                                    statusTime: statusDate(latest.date, latest.time),
                                    allMessages, allUnreadMessagesToRead
                                }
                                Chats.push(chat)
                            }
                        }

                    });
                    dispatch(setChats(Chats.sort(function (a, b) { return b.dateInt - a.dateInt })))
                    dispatch(setTotalUnread(totalUnread))
                } else {
                    dispatch(setChats([]))
                    dispatch(setTotalUnread(0))
                }
            });

        // Stop listening for updates when no longer required
        return () => database().ref(`/chats`).off('value', onValueChange);
    }, []);

    // Realtime
    useEffect(() => {
        const onValueChange = database()
            .ref(`/requests/${profile.uid}`).orderByChild('dateInt')
            .on('value', snapshot => {
                if (snapshot.exists()) {
                    let Pending = []
                    let InProgress = []
                    let History = []
                    let all = []
                    const unread = []

                    snapshot.forEach((documentSnapshot1, i) => {
                        const val = documentSnapshot1.val()
                        all.push(val)
                        if (val.status == 1 || val.status == 2) {
                            Pending.push(val)
                            if (val.unread) {
                                unread.push({ id: val.id, code: 2 })
                            }
                        }
                        else if (val.status == 3) {

                            InProgress.push(val)
                            if (val.unread) {
                                unread.push({ id: val.id, code: 1 })
                            }
                        }
                        else {
                            History.push(val)
                            if (val.unread) {
                                unread.push({ id: val.id, code: 3 })
                            }
                        }


                    });
                    console.log('unread', unread)
                    Pending.reverse()
                    InProgress.reverse()
                    History.reverse()
                    dispatch(setPendingOrderse(Pending))
                    dispatch(setProgressOrderse(InProgress))
                    dispatch(setHistoryOrderse(History))
                    dispatch(setAllRequest(all))
                    dispatch(setAllUnread(unread))

                } else {
                    dispatch(setPendingOrderse([]))
                    dispatch(setProgressOrderse([]))
                    dispatch(setHistoryOrderse([]))
                    dispatch(setAllRequest([]))
                    dispatch(setAllUnread([]))
                    dispatch(setAllRequest([]))


                }
            });

        // Stop listening for updates when no longer required
        return () => database().ref(`/requests/${profile.uid}`).off('value', onValueChange);
    }, []);
    return (

        <SafeAreaView style={styles.container}>
            <StatusbarH />
            {
                isLoading ? <HomeSkeleton />
                    :
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >

                        <Spacer paddingT={myHeight(2)} />
                        {/* <Text style={[styles.textCommon, {
                            fontSize: myFontSize.medium2,
                            fontFamily: myFonts.heading,
                            alignSelf: 'center',

                        }]}>VanCon<Text style={{ color: myColors.primaryT }}> Captain</Text></Text> */}

                        <View style={{ paddingHorizontal: myWidth(6) }}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: myColors.text, fontSize: myFontSize.xBody,
                                    fontFamily: myFonts.bodyBold
                                }}>

                                {Greeting()}, <Text style={{ color: myColors.primaryT }}>{profile.name}</Text>
                            </Text>
                        </View>

                        <Spacer paddingT={myHeight(1.5)} />

                        {/* Banner */}
                        <Banners />



                        <Spacer paddingT={myHeight(3)} />

                        {
                            profile.ready ? <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('DriverDetail', { driver: profile })}>

                                <DriverInfoFull navigation={navigation} driver={profile} />
                            </TouchableOpacity> :
                                <View style={{ width: '100%', alignItems: 'center' }}>

                                    <Text style={[styles.textCommon,
                                    {
                                        color: myColors.text, fontSize: myFontSize.body,
                                        fontFamily: myFonts.bodyBold
                                    }]
                                    }>Click on Apply & fill the form to get rides</Text>
                                    <Spacer paddingT={myHeight(1.5)} />

                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('DriverDetailEdit',

                                        )}
                                        activeOpacity={0.8}
                                        style={{
                                            width: myWidth(50), alignSelf: 'center', paddingVertical: myHeight(1.2),
                                            borderRadius: myHeight(0.8), alignItems: 'center', justifyContent: 'center',
                                            flexDirection: 'row', backgroundColor: myColors.primary,
                                            // borderWidth: myHeight(0.15), borderColor: myColors.primaryT
                                        }}>
                                        <Text style={[styles.textCommon, {
                                            fontFamily: myFonts.heading,
                                            fontSize: myFontSize.body,
                                            color: myColors.background
                                        }]}>Apply</Text>
                                    </TouchableOpacity>
                                </View>

                        }
                        <Spacer paddingT={myHeight(20)} />

                        <View style={{ width: '100%', alignItems: 'center' }}>

                            <Text style={[styles.textCommon,
                            {
                                color: myColors.text, fontSize: myFontSize.body,
                                fontFamily: myFonts.bodyBold
                            }]
                            }>Test Notification</Text>
                            <Spacer paddingT={myHeight(1.5)} />

                            <TouchableOpacity onPress={sendNotificationToAll}
                                activeOpacity={0.8}
                                style={{
                                    width: myWidth(50), alignSelf: 'center', paddingVertical: myHeight(1.2),
                                    borderRadius: myHeight(0.8), alignItems: 'center', justifyContent: 'center',
                                    flexDirection: 'row', backgroundColor: myColors.primary,
                                    // borderWidth: myHeight(0.15), borderColor: myColors.primaryT
                                }}>
                                <Text style={[styles.textCommon, {
                                    fontFamily: myFonts.heading,
                                    fontSize: myFontSize.body,
                                    color: myColors.background
                                }]}>Send</Text>
                            </TouchableOpacity>
                        </View>
                        {/* New Arrival  Complete*/}
                        {/* <View>
                            <View style={{ paddingHorizontal: myWidth(4), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[styles.textCommon, {
                                    fontSize: myFontSize.xxBody,
                                    fontFamily: myFonts.bodyBold,
                                }]}>New Arrivals</Text>

                                <TouchableOpacity style={{
                                    flexDirection: 'row', alignItems: 'center', paddingVertical: myHeight(0.4),
                                    paddingStart: myWidth(2)
                                }} activeOpacity={0.6} onPress={() => navigation.navigate('RestaurantAll', { name: 'New Arrivals' })}>

                                    <Text
                                        style={[styles.textCommon, {
                                            fontSize: myFontSize.body2,
                                            fontFamily: myFonts.bodyBold,
                                            color: myColors.primaryT
                                        }]}>See All</Text>
                                    <Image style={{
                                        height: myHeight(1.5), width: myHeight(1.5), marginStart: myWidth(1),
                                        resizeMode: 'contain', tintColor: myColors.primaryT
                                    }} source={require('../assets/home_main/home/go.png')} />
                                </TouchableOpacity>
                            </View>

                            <Spacer paddingT={myHeight(1.3)} />
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: myWidth(4) }}>
                                <View style={{
                                    flexDirection: 'row',
                                }}>
                                    {nearbyRestaurant.slice(0, 3).map((item, i) =>
                                        <TouchableOpacity key={i} activeOpacity={0.95}
                                            onPress={() => navigation.navigate('RestaurantDetail', { item })} >
                                            <RestaurantInfo restaurant={item} />
                                        </TouchableOpacity>
                                    )}
                                </View>

                            </ScrollView>
                        </View> */}


                        {/* <Spacer paddingT={myHeight(3)} /> */}
                    </ScrollView>

            }


        </SafeAreaView>
    )
}






const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: myColors.background
    },


    //Text
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

})