import React, { useEffect, useState } from 'react';
import { SafeAreaView, Alert, ScrollView, StyleSheet, TouchableOpacity, Image, View, Text, FlatList, Modal, UIManager, LayoutAnimation } from 'react-native'
import { MyError, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { Categories, Restaurants, } from './home_data'
import { ResturantH } from './home.component/resturant_hori';
import { Banners } from './home.component/banner';
import { RestaurantInfo } from './home.component/restaurant_info';
import { RestRating } from './rest_rating_screen';
import { getCartLocal, getLogin } from '../functions/storageMMKV';
import { setCart } from '../../redux/cart_reducer';
import { useDispatch, useSelector } from 'react-redux';
import firestore, { Filter } from '@react-native-firebase/firestore';
import { setFavoriteItem, setFavoriteRest } from '../../redux/favorite_reducer';
import { RestaurantInfoSkeleton } from '../common/skeletons';
import { HomeSkeleton } from './home.component/home_skeleton';
import { ImageUri } from '../common/image_uri';
import storage from '@react-native-firebase/storage';
import { setAllItems, setAllRest, setNearby, setRecommend } from '../../redux/data_reducer';
import { setHistoryOrderse, setPendingOrderse, setProgressOrderse } from '../../redux/order_reducer';
import database from '@react-native-firebase/database';
import { deccodeInfo } from '../functions/functions';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { FirebaseUser } from '../functions/firebase';

if (!ios && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}
export const HomeScreen = ({ navigation }) => {
    const name = "Someone";
    const { profile } = useSelector(state => state.profile)

    const [isLoading, setIsLoading] = useState(true)
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


  

    useEffect(() => {

        // const unsubscribe = messaging().onMessage(async remoteMessage => {
        //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        // });

        // return unsubscribe;

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

    async function getToken() {
        // const token = await messaging().getToken();
        // console.log(token)

    }

    // Realtime
    useEffect(() => {
        // database()
        //     .ref(`/orders/${profile.uid}`)
        //     .on('value', snapshot => {
        //         let pending = []
        //         let progress = []
        //         let history = []
        //         snapshot.forEach(documentSnapshot1 => {
        //             const order = documentSnapshot1.val()
        //             if (order.status == -1 || order.status == 100 || order.status == -2) {
        //                 history.push(order)
        //             }
        //             else if (order.status == 0) {
        //                 pending.push(order)
        //             }
        //             else {
        //                 progress.push(order)
        //             }

        //         });
        //         pending.sort((a, b) => b.dateInt - a.dateInt);
        //         progress.sort((a, b) => b.dateInt - a.dateInt);
        //         history.sort((a, b) => b.dateInt - a.dateInt);
        //         dispatch(setPendingOrderse(pending))
        //         dispatch(setHistoryOrderse(history))
        //         dispatch(setProgressOrderse(progress))

        //         console.log('User data: ', pending.length, progress.length, history.length);
        //     });

    }, []);

 
    return (

        <SafeAreaView style={styles.container}>
            <StatusbarH />
            {
                isLoading ? <HomeSkeleton />
                    :
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >

                        <Spacer paddingT={myHeight(1.4)} />
                        <Text style={[styles.textCommon, {
                            fontSize: myFontSize.medium2,
                            fontFamily: myFonts.heading,
                            alignSelf: 'center',

                        }]}>Food<Text style={{ color: myColors.primaryT }}>app</Text></Text>

                        <Spacer paddingT={myHeight(1.5)} />
                        {/* Search */}
                        <TouchableOpacity activeOpacity={0.8} style={{
                            flexDirection: 'row', alignItems: 'center', width: myWidth(85),
                            backgroundColor: myColors.divider, alignSelf: 'center', paddingVertical: myHeight(1.3),
                            borderRadius: myWidth(2.5)

                        }} onPress={() => navigation.navigate('Search')}>
                            <Spacer paddingEnd={myWidth(4)} />
                            <Image style={{
                                height: myHeight(2.2), width: myHeight(2.2), resizeMode: 'contain', tintColor: myColors.offColor
                            }} source={require('../assets/home_main/home/search.png')} />
                            <Spacer paddingEnd={myWidth(3)} />

                            <Text style={[styles.textCommon, {
                                fontSize: myFontSize.body,
                                fontFamily: myFonts.bodyBold,
                                color: myColors.offColor
                            }]}>Search dishes, restaurants</Text>
                        </TouchableOpacity>

                        <Spacer paddingT={myHeight(3)} />

                        {/* Banner */}
                        <Banners />

                        <Spacer paddingT={myHeight(2.5)} />
                        {/* CAtegories*/}
                        <View>
                            {/* Categories & see all*/}
                            <View style={{
                                paddingHorizontal: myWidth(4), alignItems: 'center', flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={[styles.textCommon, {
                                    fontSize: myFontSize.xxBody,
                                    fontFamily: myFonts.bodyBold,
                                }]}>Categories</Text>

                                {/* See all */}
                                {/* <TouchableOpacity style={{
                                    flexDirection: 'row', alignItems: 'center', paddingVertical: myHeight(0.4),
                                    paddingStart: myWidth(2)
                                }} activeOpacity={0.6} onPress={() => navigation.navigate('CategoryFull', { categories })}>

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
                                </TouchableOpacity> */}
                            </View>

                            <Spacer paddingT={myHeight(0.3)} />
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: myWidth(1) }}>

                                {categories.map((item, i) =>

                                    <View key={i} style={{ padding: myHeight(1.4), paddingEnd: myWidth(2) }}>
                                        <TouchableOpacity activeOpacity={0.8} style={{
                                            flexDirection: 'row', alignItems: 'center', borderRadius: myHeight(15),
                                            backgroundColor: myColors.background,
                                            // backgroundColor:myColors.primaryL,  
                                            padding: myHeight(0.8), elevation: 8
                                        }} onPress={() => navigation.navigate('RestaurantAll', { name: item.name, restaurants: Restaurants })}>
                                            <View style={{
                                                height: myHeight(5), width: myHeight(5), borderRadius: myHeight(5),
                                                backgroundColor: '#00000008',
                                                alignItems: 'center', justifyContent: 'center'
                                            }} >
                                                <ImageUri width={myHeight(4.2)} height={myHeight(4.2)} resizeMode='contain' uri={item.image} borderRadius={5000} />
                                                {/* <Image style={{
                                                    height: myHeight(4.2), width: myHeight(4.2),
                                                    resizeMode: 'contain',
                                                }} source={{ uri: item.image }} /> */}

                                            </View>

                                            <Spacer paddingEnd={myWidth(2)} />
                                            <Text
                                                style={[styles.textCommon, {
                                                    fontSize: myFontSize.body2,
                                                    fontFamily: myFonts.heading,
                                                }]}>{item.name}</Text>
                                            <Spacer paddingEnd={myWidth(2.7)} />

                                        </TouchableOpacity>
                                    </View>
                                )}
                            </ScrollView>

                        </View>

                        <Spacer paddingT={myHeight(3)} />
                        {/* New Arrival  Complete*/}
                        <View>
                            {/* New Arrivals*/}
                            <View style={{ paddingHorizontal: myWidth(4), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[styles.textCommon, {
                                    fontSize: myFontSize.xxBody,
                                    fontFamily: myFonts.bodyBold,
                                }]}>New Arrivals</Text>

                                {/* See all */}
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
                            {/* Restuarant */}
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
                        </View>

                        <Spacer paddingT={myHeight(3)} />
                        {/*Nearby Restaurants  Complete*/}
                        <View>
                            {/* Nearby Restaurants*/}
                            <View style={{ paddingHorizontal: myWidth(4), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[styles.textCommon, {
                                    fontSize: myFontSize.xxBody,
                                    fontFamily: myFonts.bodyBold,
                                }]}>Recommended</Text>

                                <TouchableOpacity style={{
                                    flexDirection: 'row', alignItems: 'center', paddingVertical: myHeight(0.4),
                                    paddingStart: myWidth(2)
                                }} activeOpacity={0.6} onPress={() => navigation.navigate('RestaurantAll', { name: 'Recommended', restaurants: Restaurants })}>

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
                            {/* Restuarant */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: myWidth(4) }}>
                                <View style={{
                                    flexDirection: 'row',
                                }}>
                                    {RecommendRestaurant.slice(0, 3).map((item, i) =>
                                        <TouchableOpacity key={i} activeOpacity={0.95}
                                            onPress={() => navigation.navigate('RestaurantDetail', { item })} >
                                            <RestaurantInfo restaurant={item} />
                                        </TouchableOpacity>
                                    )}
                                </View>

                            </ScrollView>
                        </View>


                        <Spacer paddingT={myHeight(4)} />
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