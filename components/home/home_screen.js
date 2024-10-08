import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  FlatList,
  Modal,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {
  MyError,
  NotiAlertNew,
  Spacer,
  StatusbarH,
  ios,
  myHeight,
  myWidth,
} from '../common';
import {getAvatarColor, myColors} from '../../ultils/myColors';
import {myFontSize, myFonts, myLetSpacing} from '../../ultils/myFonts';
import {Categories, Restaurants} from './home_data';
import {ResturantH} from './home.component/resturant_hori';
import {Banners} from './home.component/banner';
import {RestaurantInfo} from './home.component/restaurant_info';
import {RestRating} from './rest_rating_screen';
import {
  getCartLocal,
  getLastNotificationId,
  getLogin,
  setLastNotificationId,
  setLogin,
} from '../functions/storageMMKV';
import {setCart} from '../../redux/cart_reducer';
import {useDispatch, useSelector} from 'react-redux';
import firestore, {Filter} from '@react-native-firebase/firestore';
import {setFavoriteItem, setFavoriteRest} from '../../redux/favorite_reducer';
import {RestaurantInfoSkeleton} from '../common/skeletons';
import {HomeSkeleton} from './home.component/home_skeleton';
import {ImageUri} from '../common/image_uri';
import storage from '@react-native-firebase/storage';
import {
  setAllRequest,
  setAllUnread,
  setHistoryOrderse,
  setPendingOrderse,
  setProgressOrderse,
} from '../../redux/order_reducer';
import {
  SetErrorAlertToFunction,
  dataFullData,
  deccodeInfo,
  getAreasLocations,
  getCurrentLocations,
  getDashboardData,
  getDistanceFromRes,
  getProfileFromAPI,
  getProfileFromFirebase,
  statusDate,
  updateProfileToFirebase,
} from '../functions/functions';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {
  FirebaseUser,
  getDeviceToken,
  sendPushNotification,
  updateDeviceTokenToFireBase,
} from '../functions/firebase';
import {NotiAlert} from '../common/noti_Alert';
import Animated, {SlideInUp} from 'react-native-reanimated';
import {setProfile} from '../../redux/profile_reducer';
import {Search} from './locations_screen';
import database from '@react-native-firebase/database';
import {setChats, setTotalUnread} from '../../redux/chat_reducer';
import {DriverInfoFull} from './home.component/driver_info_full';
import {Status} from './home.component/status';
import {CustomToggleButton} from './home.component/toggle';
import {setOnline} from '../../redux/online_reducer';
import storeRedux from '../../redux/store_redux';
import {setErrorAlert} from '../../redux/error_reducer';
import {FlashList} from '@shopify/flash-list';
import {socket, socketURL} from '../common/api';

if (!ios && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
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
export const HomeScreen = ({navigation}) => {
  const name = 'Someone';
  const {profile} = useSelector(state => state.profile);
  const {vehicles} = useSelector(state => state.vehicles);
  const {online} = useSelector(state => state.online);
  const {current, history} = useSelector(state => state.location);
  const [isLoading, setIsLoading] = useState(true);
  const [onlineReq, setOnlineReq] = useState(false);

  const [availableSeats, setAvailableSeats] = useState(profile.availableSeats);
  const [nearbyRestaurant, setNearbyRestaurant] = useState([]);
  const [RecommendRestaurant, setRecommendRestaurant] = useState([]);
  const [startPro, setStartPro] = useState({});

  const {pending, progress} = useSelector(state => state.orders);
  const [pendingNavigate, setPendingNavigate] = useState(null);
  function notificationToSceen(Noti) {
    const Navigate = Noti.data.navigate;

    if (Navigate) {
      const Navigat2 = JSON.parse(Navigate);
      console.log('-101', Navigat2);
      setPendingNavigate(Navigat2);
    }
  }
  const handleSelected = async initialNotification => {
    console.log(
      '------------------initial Noti-------------------',
      initialNotification?.messageId,
    );
    // return
    if (initialNotification !== null) {
      try {
        const lastInitialNotificationId = getLastNotificationId();

        if (lastInitialNotificationId !== null) {
          if (lastInitialNotificationId === initialNotification.messageId) {
            return;
          } else {
            notificationToSceen(initialNotification);
          }
        } else {
          notificationToSceen(initialNotification);
        }

        setLastNotificationId(initialNotification.messageId);
      } catch (e) {
        console.log('-4', e);
        // don't mind, this is a problem only if the current RN instance has been reloaded by a CP mandatory update
      }
    }
  };
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      // Handle the notification press event
      console.log('----------Notification opened in the background:----------');
      notificationToSceen(remoteMessage);
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    if (pendingNavigate && !isLoading) {
      navigation.navigate(pendingNavigate.screen, pendingNavigate.params);
      setPendingNavigate(null);
    }
  }, [pendingNavigate, isLoading]);
  const handleInitialNotification = async () => {
    const initialNotification = messaging()
      .getInitialNotification()
      .then(remoteNotification => handleSelected(remoteNotification))
      .catch(err => {
        console.log(err);
      });
  };

  const dispatch = useDispatch();

  function setOnlineRedux(status) {
    if (!status && onlineReq) {
      dispatch(
        setErrorAlert({
          Title: 'Action Not Perform',
          Body: 'You have vanpool requests in progress finish to get offline',
          Status: 0,
        }),
      );
      return false;
    }
    dispatch(setOnline(status));
    if (status) {
    } else {
      updateOffline();
    }
    return true;
  }

  useEffect(() => {
    // Set up Firebase Cloud Messaging to handle incoming notifications
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Handle the incoming notification
      handleNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);

  const handleNotification = notification => {
    console.log('notification', notification);
    // Extract data from notification

    // const { screenName } = notification.data;

    // // Navigate to the appropriate screen
    // if (screenName) {
    //   navigation.navigate(screenName);
    // }
  };
  useEffect(() => {
    // const socket = io(socketURL);
    if (profile) {
      socket.removeAllListeners();
      console.log(profile);
      socket.connect();
      // Listen for incoming messages
      socket.on('connect', msg => {
        console.log('connect connect connect', msg);
        updateUserIdToSocket();
      });
      socket.emit('getAllChats', {
        userId: profile.uid,
        type: 2,
      });
      socket.on('allChatsListener', data => {
        console.log('allChatsListener', data);
        dispatch(setTotalUnread(data.totalUnreadChats));
        dispatch(setChats(data.allChats));
      });
      // Clean up on component unmount
      return () => {
        socket.disconnect();
        console.log('disconnected disconnected disconnected');
      };
    }
  }, []);
  function sendNotificationToAll() {
    firestore()
      .collection('users')
      .get()
      .then(result => {
        if (!result.empty) {
          const tks = [];
          result.forEach((res, i) => {
            const user = res.data();
            // sendPushNotification('Enjoy the discount', 'Get Rs 150 discount on first ride', 0, user.deviceToken)
            if (user.deviceToken) {
              tks.push(user.deviceToken);
            }
            // catArray.push(cat.data())
          });
          sendPushNotification(
            'Enjoy the discount',
            'Get Rs 150 discount on first ride',
            generateRandomIntegerInRange(0, 2),
            tks,
          );
        } else {
          console.log('empty');

          // setCategories(catArray)
        }
      })
      .catch(er => {
        // Alert.alert(er.toString())

        console.log('Error on Get all Restaurant', er);
      });
  }
  function updateOffline() {
    const reff = `/online/${profile.city}/drivers/${profile.uid}`;

    database()
      .ref(reff)
      .remove()
      .then(() => {
        console.log('updateOffilne Successfullly');
      })
      .catch(er => {
        console.log('Error updateOnline', er);
      });
  }
  function updateOnline() {
    const reff = `/online/${profile.city}/drivers/${profile.uid}`;
    if (online) {
      if (!current) {
        return;
      }
      // const {latitude, longitude} = current
      // const from = history ? history : { latitude: 0, longitude: 0 }
      // const { distance } = getDistanceFromRes(from, current)
      const {actualDate} = dataFullData();

      const data = {
        lastUpdate: actualDate.toString(),
        // distance,
        lastUpdate: actualDate.toString(),
        did: profile.uid,
        // uid: profile.uid,
        // name: profile.name,
        // contact: profile.contact,
        // vehicleName: profile.vehicleName,
        token: profile.deviceToken,
        location: current ? current : {latitude: 0, longitude: 0},
        ...profile,
      };
      database()
        .ref(reff)
        .update(data)
        .then(() => {
          console.log('updateOnline Successfullly', current);
        })
        .catch(er => {
          // Alert.alert(er.toString())

          console.log('Error updateOnline', er);
        });
    }
  }
  useEffect(() => {
    if (current) {
      updateOnline();
    }
  }, [current]);

  useEffect(() => {
    updateOnline();
  }, [online]);

  useEffect(() => {
    // getProfileFromFirebase()
    getProfileFromAPI();
    getCurrentLocations();
    const interval = setInterval(() => {
      const {online} = storeRedux.getState().online;
      if (online) {
        getCurrentLocations();
      }
    }, 40000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Message handled in the foreground:');
      SetErrorAlertToFunction({
        Title: remoteMessage.notification.title,
        Body: remoteMessage.notification.body,
        Status: remoteMessage.data.status,
        Navigate: remoteMessage.data.navigate,
        navigation: navigation,
      });
    });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  async function onDisplayNotification(remoteMessage) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: remoteMessage.messageId.toString(),
      name: 'Orders',
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
  function onSaveAvailSeats() {
    updateProfileToFirebase({availableSeats});
  }
  function updateUserIdToSocket() {
    socket.emit('updateUserData', {
      type: 2,
      name: profile.name,
      userId: profile.uid,
    });
  }

  useEffect(() => {
    if (profile) {
      setAvailableSeats(profile.availableSeats);
    }
    // updateDeviceTokenToFireBase(profile.uid)
    // sendPushNotification('hi', 'bye',2 )
  }, [profile.availableSeats]);
  useEffect(() => {
    if (profile.city) {
      getDashboardData(setIsLoading);

      // const reff = `/online/${profile.city}/drivers/${profile.uid}`;
      // database()
      //   .ref(reff)
      //   .once('value', function (snapshot) {
      //     setOnlineRedux(snapshot.exists());
      //   });

      // getAreasLocations(profile.city);
    }

    // updateDeviceTokenToFireBase(profile.uid)
    // sendPushNotification('hi', 'bye',2 )
  }, [profile.city]);

  // Realtime
  useEffect(() => {
    return;
    const onValueChange = database()
      .ref(`/chats`)
      .on('value', snapshot => {
        if (snapshot.exists()) {
          let Chats = [];
          let totalUnread = 0;
          snapshot.forEach((documentSnapshot1, i) => {
            const key = documentSnapshot1.key.toString();
            if (key.includes(profile.uid)) {
              const val = documentSnapshot1.val();
              if (val.captain && val.user) {
                let messages = {...val.messages};
                let latest = null;
                let unreadmasseges = 0;
                let allMessages = [];
                let allUnreadMessagesToRead = {};
                // messages = Object.keys(messages).sort(function (a, b) { return messages[a].dateInt - messages[b].dateInt })
                Object.keys(messages).map((it, i) => {
                  const mm = messages[it];
                  allMessages.push(mm);
                  if (latest == null || mm.dateInt > latest.dateInt) {
                    latest = mm;
                  }
                  if (mm.senderId != profile.uid && mm.read == false) {
                    unreadmasseges += 1;
                    const s = {};
                    allUnreadMessagesToRead[it] = {...mm, read: true};
                  }
                });
                if (unreadmasseges) {
                  totalUnread += 1;
                }
                const chat = {
                  ...latest,
                  unreadmasseges,
                  chatId: key,
                  user2: val.user,
                  statusTime: statusDate(latest.date, latest.time),
                  allMessages,
                  allUnreadMessagesToRead,
                  colorC: getAvatarColor(val.user.name),
                };
                Chats.push(chat);
              }
            }
          });
          dispatch(
            setChats(
              Chats.sort(function (a, b) {
                return b.dateInt - a.dateInt;
              }),
            ),
          );
          dispatch(setTotalUnread(totalUnread));
        } else {
          dispatch(setChats([]));
          dispatch(setTotalUnread(0));
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/chats`).off('value', onValueChange);
  }, []);

  // Realtime
  useEffect(() => {
    return;
    const onValueChange = database()
      // .ref(`/requests/${profile.uid}`).orderByChild('dateInt')
      .ref(`/requests`)
      .on('value', snapshot => {
        if (snapshot.exists()) {
          let Pending = [];
          let InProgress = [];
          let History = [];
          let all = [];
          const unread = [];
          let onl = false;
          const pool = [];
          snapshot.forEach((documentSnapshot1, i) => {
            const val2 = documentSnapshot1.val();
            Object.entries(val2).forEach(([key, value]) => {
              const val = value;
              const me = val ? val[profile.uid] : false;
              if (val && me) {
                all.push(val);
                if (val.isOnline) {
                  const item = val;
                  const isMissed = item.status >= 3 && item.did != profile.uid;

                  if (val.status == 2 && (me.status == 1 || me.status == 1.5)) {
                    const onlineStatus =
                      me.status == 1.5
                        ? 'Wait for customer response'
                        : 'Pending';
                    const onlineStatusColor = myColors.green;
                    val.onlineStatus = onlineStatus;
                    val.onlineStatusColor = onlineStatusColor;
                    Pending.push(val);
                    if (me.unread) {
                      unread.push({id: val.id, code: 2});
                    }
                  } else if (val.status == 3 && val.did == profile.uid) {
                    const onlineStatus = 'In Progress';
                    const onlineStatusColor = myColors.green;
                    val.onlineStatus = onlineStatus;
                    val.onlineStatusColor = onlineStatusColor;
                    onl = true;
                    pool.push(val);
                    if (me.unread) {
                      unread.push({id: val.id, code: 1});
                    }
                  } else {
                    History.push(val);
                    const onlineStatus =
                      me.status == 1
                        ? isMissed
                          ? 'You Missed'
                          : 'Cancelled'
                        : me.status < 0
                        ? 'Rejected'
                        : `Completed`;
                    const onlineStatusColor =
                      onlineStatus == 'Completed'
                        ? myColors.green
                        : myColors.red;
                    val.onlineStatus = onlineStatus;
                    val.onlineStatusColor = onlineStatusColor;
                    if (me.unread) {
                      unread.push({id: val.id, code: 3});
                    }
                  }
                } else {
                  if (val.status == 2 && me.status == 1) {
                    Pending.push(val);
                    if (me.unread) {
                      unread.push({id: val.id, code: 2});
                    }
                  } else if (val.status == 3 && val.did == profile.uid) {
                    InProgress.push(val);
                    if (me.unread) {
                      unread.push({id: val.id, code: 1});
                    }
                  } else {
                    History.push(val);
                    if (me.unread) {
                      unread.push({id: val.id, code: 3});
                    }
                  }
                }
              }
            });
          });

          setOnlineReq(onl);
          Pending = Pending.sort(function (a, b) {
            return b.dateInt - a.dateInt;
          });
          InProgress = InProgress.sort(function (a, b) {
            return b.dateInt - a.dateInt;
          });
          History = History.sort(function (a, b) {
            return b.dateInt - a.dateInt;
          });

          InProgress = [...pool, ...InProgress];

          console.log('unread', unread);
          // Pending.reverse()
          // InProgress.reverse()
          // History.reverse()
          dispatch(setPendingOrderse(Pending));
          dispatch(setProgressOrderse(InProgress));
          dispatch(setHistoryOrderse(History));
          dispatch(setAllRequest(all));
          dispatch(setAllUnread(unread));
        } else {
          setOnlineReq(false);

          dispatch(setPendingOrderse([]));
          dispatch(setProgressOrderse([]));
          dispatch(setHistoryOrderse([]));
          dispatch(setAllRequest([]));
          dispatch(setAllUnread([]));
          dispatch(setAllRequest([]));
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/requests`).off('value', onValueChange);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusbarH />

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <Spacer paddingT={myHeight(2)} />

        {/* <Text style={[styles.textCommon, {
                            fontSize: myFontSize.medium2,
                            fontFamily: myFonts.heading,
                            alignSelf: 'center',

                        }]}>VanCon<Text style={{ color: myColors.primaryT }}> Captain</Text></Text> */}

        <View
          style={{
            paddingStart: myWidth(6),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            numberOfLines={1}
            style={{
              color: myColors.text,
              fontSize: myFontSize.xBody,
              fontFamily: myFonts.bodyBold,
            }}>
            {Greeting()},{' '}
            <Text style={{color: myColors.primaryT}}>{profile.name}</Text>
          </Text>

          {/* <View style={{
                        flexDirection: 'row', alignItems: 'center', backgroundColor: online ? myColors.greenL : myColors.greenL,
                        paddingHorizontal: myWidth(4),
                        paddingVertical: myHeight(0.7), borderTopStartRadius: myWidth(100), borderBottomStartRadius: myWidth(100)
                    }}>
                        <Text
                            numberOfLines={1}
                            style={[styles.textCommon, {
                                color: myColors.text, fontSize: myFontSize.body2,
                                fontFamily: myFonts.heading
                            }]}>Vanpool</Text>
                        <Spacer paddingEnd={myWidth(3)} />
                        <CustomToggleButton online={online} setOnline={setOnline} />
                    </View> */}
        </View>

        <Spacer paddingT={myHeight(1.5)} />

        {/* Banner */}
        {!isLoading && <Banners />}

        {true ? (
          <>
            {profile.isOnline ? (
              <>
                <Spacer paddingT={myHeight(2.5)} />

                <View
                  style={{
                    paddingStart: myWidth(4),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.textCommon,
                        {
                          color: myColors.text,
                          fontSize: myFontSize.xBody,
                          fontFamily: myFonts.heading,
                        },
                      ]}>
                      Vanpool
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.textCommon,
                        {
                          color: myColors.textL4,
                          fontSize: myFontSize.small2,
                          fontFamily: myFonts.bodyBold,
                        },
                      ]}>
                      When Onilne you get vanpool Rides
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: online
                        ? myColors.greenL
                        : myColors.primaryL6,
                      paddingStart: myWidth(6),
                      paddingVertical: myHeight(1),
                      borderTopStartRadius: myWidth(100),
                      borderBottomStartRadius: myWidth(100),
                    }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.textCommon,
                        {
                          color: myColors.text,
                          fontSize: myFontSize.body3,
                          fontFamily: myFonts.heading,
                        },
                      ]}>
                      {online ? 'Online' : 'Offline'}
                    </Text>
                    <Spacer paddingEnd={myWidth(5)} />
                    <CustomToggleButton
                      online={online}
                      setOnline={setOnlineRedux}
                    />
                    <Spacer paddingEnd={myWidth(3)} />
                  </View>
                </View>
              </>
            ) : null}
            <Spacer paddingT={myHeight(2.5)} />

            <View style={{paddingHorizontal: myWidth(4)}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.heading}>Your Services</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('DriverDetailEdit')}
                  activeOpacity={0.8}
                  style={{
                    // width: myWidth(40),
                    alignSelf: 'center',
                    paddingHorizontal: myWidth(4),
                    paddingVertical: myHeight(0.8),
                    borderRadius: myHeight(0.8),
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    backgroundColor: myColors.background,
                    borderWidth: myHeight(0.15),
                    borderColor: myColors.primaryT,
                  }}>
                  <Text
                    style={[
                      styles.textCommon,
                      {
                        fontFamily: myFonts.heading,
                        fontSize: myFontSize.xxSmall,
                        color: myColors.primaryT,
                      },
                    ]}>
                    Add Service
                  </Text>
                </TouchableOpacity>
              </View>
              <Spacer paddingT={myHeight(1.5)} />

              <FlashList
                data={vehicles}
                keyExtractor={it => it.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                estimatedItemSize={200}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate('DriverDetail', {id: item.id})
                      }>
                      <DriverInfoFull navigation={navigation} driver={item} />
                    </TouchableOpacity>
                  );
                }}
              />

              {/* <Text style={styles.heading}>Settings</Text>
                            <Spacer paddingT={myHeight(1)} /> */}

              {/* 
               <Spacer paddingT={myHeight(2.5)} />
              <View
                style={{
                  paddingHorizontal: myWidth(3),
                  width: '100%',
                  paddingVertical: myHeight(1),
                  borderRadius: myWidth(2),
                  backgroundColor: '#F4EDFF',
                  borderWidth: myHeight(0.1),
                  borderColor: myColors.dot,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: myFontSize.body2,
                      fontFamily: myFonts.heading,
                      color: myColors.offColor,
                      letterSpacing: myLetSpacing.common,
                      includeFontPadding: false,
                      padding: 0,
                    }}>
                    Set Available Seats
                  </Text>
                  {availableSeats != profile.availableSeats ? (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={onSaveAvailSeats}>
                      <Text
                        style={{
                          fontSize: myFontSize.body2,
                          fontFamily: myFonts.heading,
                          color: myColors.primaryT,
                          letterSpacing: myLetSpacing.common,
                          includeFontPadding: false,
                          padding: 0,
                        }}>
                        Save
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                <Spacer paddingT={myHeight(2)} />

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (availableSeats != 0) {
                        setAvailableSeats(availableSeats - 1);
                      }
                    }}
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: myColors.primaryT,
                      height: myHeight(3),
                      width: myHeight(3),
                      borderRadius: myHeight(3),
                      marginTop: myHeight(3),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{
                        height: myHeight(1.5),
                        width: myHeight(1.5),
                        resizeMode: 'contain',
                        transform: [{rotate: '270deg'}],
                      }}
                      source={require('../assets/startup/goL.png')}
                    />
                  </TouchableOpacity>

                  <View
                    style={{
                      width: myWidth(20),
                      marginHorizontal: myWidth(3),
                      borderBottomWidth: myHeight(0.2),
                      borderColor: myColors.primaryT,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: myFontSize.body4,
                        fontFamily: myFonts.heading,
                        color: myColors.text,
                        letterSpacing: myLetSpacing.common,
                        includeFontPadding: false,
                        padding: 0,
                      }}>
                      {availableSeats}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (profile.vehicleSeats > availableSeats) {
                        console.log('h');
                        // return
                        setAvailableSeats(availableSeats + 1);
                      }
                    }}
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: myColors.primaryT,
                      height: myHeight(3),
                      width: myHeight(3),
                      borderRadius: myHeight(3),
                      marginTop: myHeight(3),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{
                        height: myHeight(1.5),
                        width: myHeight(1.5),
                        resizeMode: 'contain',
                        marginTop: -myHeight(0.2),
                        transform: [{rotate: '90deg'}],
                      }}
                      source={require('../assets/startup/goL.png')}
                    />
                  </TouchableOpacity>
                </View>
                <Spacer paddingT={myHeight(2)} />
              </View> */}
            </View>
          </>
        ) : (
          <View style={{width: '100%', alignItems: 'center'}}>
            <Spacer paddingT={myHeight(3)} />

            <Text
              style={[
                styles.textCommon,
                {
                  color: myColors.text,
                  fontSize: myFontSize.body,
                  fontFamily: myFonts.bodyBold,
                },
              ]}>
              Click on Apply & fill the form to get rides
            </Text>
            <Spacer paddingT={myHeight(1.5)} />

            <TouchableOpacity
              onPress={() => navigation.navigate('DriverDetailEdit')}
              activeOpacity={0.8}
              style={{
                width: myWidth(50),
                alignSelf: 'center',
                paddingVertical: myHeight(1.2),
                borderRadius: myHeight(0.8),
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                backgroundColor: myColors.primary,
                // borderWidth: myHeight(0.15), borderColor: myColors.primaryT
              }}>
              <Text
                style={[
                  styles.textCommon,
                  {
                    fontFamily: myFonts.heading,
                    fontSize: myFontSize.body,
                    color: myColors.background,
                  },
                ]}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <Spacer paddingT={myHeight(2.5)} />

        {/* <View style={{ width: '100%', alignItems: 'center' }}>

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
                </View> */}

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

        <Spacer paddingT={progress.length ? myHeight(25) : 0} />
      </ScrollView>

      {progress.length ? (
        <>
          <Status notifications={progress} />
        </>
      ) : null}

      {isLoading && <HomeSkeleton />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: myColors.background,
  },

  heading: {
    fontSize: myFontSize.medium0,
    fontFamily: myFonts.heading,
    color: myColors.text,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
  //Text
  textCommon: {
    color: myColors.text,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
});
