import { ActivityIndicator, Alert, BackHandler, Image, ImageBackground, Keyboard, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { myColors } from '../../ultils/myColors'
import { MyError, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common'
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts'
import database from '@react-native-firebase/database';
import { dataFullData, statusDate, verificationCode } from '../functions/functions'
import { useDispatch, useSelector } from 'react-redux'
import { FlashList } from '@shopify/flash-list'
import { setErrorAlert } from '../../redux/error_reducer'
import { RFValue } from 'react-native-responsive-fontsize'
import firestore from '@react-native-firebase/firestore';
import { sendPushNotification } from '../functions/firebase'
import { SwipeableItem } from './home.component/drag_commponent'
import Swipeable from 'react-native-swipeable';
import Collapsible from 'react-native-collapsible'
import Clipboard from '@react-native-community/clipboard';
import { ImageUri } from '../common/image_uri'



export const Chat = ({ navigation, route }) => {
    const [message, setMessage] = useState(null)
    const scrollRef = useRef(null)

    const [focus, setFocus] = useState(false)
    const [fromTouch, setFromTouch] = useState(false)
    const [firstTime, setFirstTime] = useState(true)
    const [showUnread, setShowUnread] = useState(0)
    const [loader, setLoader] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)
    const [showScrollToLast, setShowScrollToLast] = useState(false)
    const [colorC, setColorC] = useState(myColors.red)
    const { user2 } = route.params
    const { profile } = useSelector(state => state.profile)
    const { chats } = useSelector(state => state.chats)
    const chatId = user2.uid + profile.uid
    const [chatss, setChatss] = useState([])
    const [customer, setCustomer] = useState(null)
    const [customerImage, setCustomerImage] = useState(user2.image)
    const [focusId, setFocusId] = useState(null)

    const textInputRef = useRef(null);

    const [reply, setReply] = useState(null)
    const handleSwipeRelease = (item) => {
        textInputRef?.current.focus();

        setReply(item)
    };
    // useEffect(() => {
    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //         console.log(1)
    //         if (TextInput.State.currentlyFocusedInput()) {

    //             TextInput.State.blurTextInput(TextInput.State.currentlyFocusedInput());
    //             return true;
    //         }
    //         return false;
    //     });

    //     return () => {
    //         // Clean up event listener when component unmounts
    //         backHandler.remove();
    //     };
    // }, [textInputRef]);
    const dispatch = useDispatch()

    const MyMessage = ({ item }) => {

        return (
            <View style={{
                width: myWidth(100), marginVertical: myHeight(0.7), paddingHorizontal: myWidth(2),
                backgroundColor: item.msgId == focusId ? myColors.primaryL3 : 'transparent', alignSelf: 'flex-end'
            }}>
                <Swipeable
                    onLeftActionRelease={() => handleSwipeRelease(item)}
                    leftButtonWidth={0} rightButtonWidth={0}
                    leftActionActivationDistance={myWidth(20)}
                    leftButtons={[<TouchableOpacity />]} >

                    <View style={{
                        borderRadius: myWidth(2.5), borderBottomRightRadius: 0,
                        paddingTop: myHeight(0.7),
                        paddingEnd: myWidth(1),
                        paddingStart: myWidth(1),
                        backgroundColor: myColors.primary, maxWidth: myWidth(80),
                        alignSelf: 'flex-end',
                        // borderWidth: myHeight(0.1),
                        // borderColor: myColors.primaryT,
                    }}>
                        {
                            item.reply ?
                                <>
                                    <ReplyCom reply={item.reply} type={1} />
                                    <Spacer paddingT={myHeight(0.7)} />

                                </>
                                : null
                        }
                        < TouchableOpacity activeOpacity={0.9} style={{
                            paddingStart: myWidth(0.5), paddingEnd: myWidth(2)
                        }} onLongPress={() => {
                            Clipboard.setString(item.message)
                            ToastAndroid.show('Message Copied', ToastAndroid.SHORT)
                        }}>

                            <Text style={[styles.textCommon, {
                                fontSize: myFontSize.body,
                                fontFamily: myFonts.bodyBold,
                                color: myColors.background,
                            }]}>{item.message}</Text>

                            <Spacer paddingT={myHeight(0.2)} />
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Image style={{
                                    height: myHeight(1.5),
                                    tintColor: item.read ? myColors.background : myColors.offColor2,
                                    width: myHeight(1.5),
                                    resizeMode: "contain",
                                }} source={require('../assets/home_main/home/checkF.png')} />
                                <Spacer paddingEnd={myWidth(0.8)} />

                                <Text style={[styles.textCommon, {
                                    textAlign: 'right',
                                    fontSize: myFontSize.small3,
                                    fontFamily: myFonts.bodyBold,
                                    color: myColors.background
                                }]}>{item.time}</Text>
                            </View>

                            <Spacer paddingT={myHeight(0.5)} />
                        </TouchableOpacity>

                    </View>
                </Swipeable>
            </View>
        )
    }
    const OtherMessage = ({ item }) => {
        return (
            <View style={{
                width: myWidth(100), paddingHorizontal: myWidth(2),
                backgroundColor: item.msgId == focusId ? myColors.primaryL3 : 'transparent',
                marginVertical: myHeight(0.7)
            }}>
                <Swipeable
                    onLeftActionRelease={() => handleSwipeRelease(item)}
                    leftButtonWidth={0} rightButtonWidth={0}
                    leftActionActivationDistance={myWidth(20)}
                    leftButtons={[<TouchableOpacity />]} >
                    <View style={{ flexDirection: 'row', }}>
                        <View
                            style={{
                                maxWidth: myWidth(80),
                                borderRadius: myWidth(2.5), borderBottomLeftRadius: 0,
                                paddingStart: myWidth(1),
                                paddingEnd: myWidth(1),

                                paddingTop: myHeight(0.6),
                                borderWidth: myHeight(0.1),
                                borderColor: myColors.offColor,
                                alignSelf: 'flex-start', backgroundColor: '#f1f1f1'
                            }}>
                            {
                                item.reply ?
                                    <>
                                        <ReplyCom reply={item.reply} type={2} />
                                        <Spacer paddingT={myHeight(0.7)} />

                                    </>
                                    : null
                            }
                            <TouchableOpacity activeOpacity={0.5} style={{
                                paddingStart: myWidth(1.5), paddingEnd: myWidth(1)
                            }} onLongPress={() => {
                                Clipboard.setString(item.message)
                                ToastAndroid.show('Message Copied', ToastAndroid.SHORT)
                            }}>

                                <Text style={[styles.textCommon, {
                                    fontSize: myFontSize.body,
                                    fontFamily: myFonts.bodyBold,
                                }]}>{item.message}</Text>
                                <Spacer paddingT={myHeight(0.1)} />

                                <Text style={[styles.textCommon, {
                                    textAlign: 'right',
                                    fontSize: myFontSize.small3,
                                    fontFamily: myFonts.bodyBold,
                                }]}>{item.time}</Text>
                            </TouchableOpacity>

                            <Spacer paddingT={myHeight(0.3)} />
                        </View>
                    </View>
                </Swipeable >
            </View >


        )
    }
    const ReplyCom = ({ reply, type = 0 }) => {
        const isMe = reply.senderId == profile.uid
        return (
            <TouchableOpacity activeOpacity={0.8}
                onPress={() => {
                    const inde = chatss.findIndex(it => it.msgId == reply.msgId)
                    scrollToIndex(inde != 0 ? inde - 1 : inde)
                    setFocusId(reply.msgId)
                }} style={{
                    width: type ? myWidth(78) : '100%',
                    borderRadius: myWidth(2),
                    overflow: 'hidden',
                    borderStartWidth: myWidth(1),
                    borderColor: isMe ? myColors.green : myColors.textL4,
                    backgroundColor: myColors.primaryL6,
                    paddingVertical: myHeight(0.4),
                    paddingHorizontal: myWidth(1.5)
                }}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <Text style={[styles.textCommon, {
                        flex: 1,
                        fontSize: myFontSize.xxSmall,
                        fontFamily: myFonts.heading,
                        color: isMe ? myColors.green : myColors.textL4
                    }]}>{isMe ? 'You' : user2.name}</Text>

                    {
                        type == 0 ?

                            <TouchableOpacity activeOpacity={0.7}
                                onPress={() => {
                                    setReply(null)

                                }} style={{
                                    position: 'absolute',
                                    zIndex: 10,
                                    top: 0,
                                    right: 0,
                                    paddingHorizontal: myWidth(1),
                                    paddingVertical: myHeight(0.5),
                                }} >
                                {


                                    <Image style={{
                                        height: myHeight(1.1),
                                        width: myHeight(1.1),
                                        resizeMode: 'contain',
                                        tintColor: myColors.text,


                                    }} source={require('../assets/account/close.png')} />

                                }
                            </TouchableOpacity>

                            : null
                    }
                </View>
                <Spacer paddingT={myHeight(0.4)} />

                <Text numberOfLines={3} style={[styles.textCommon, {

                    fontSize: myFontSize.small2,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.textL4
                }]}>{reply.message}</Text>
                <Spacer paddingT={myHeight(0.4)} />

            </TouchableOpacity>
        )
    }

    function scrollToIndex(i) {
        scrollRef?.current?.scrollToIndex({
            animated: true,
            index: i,
        });
    }
    useEffect(() => {
        firestore().collection('users').doc(user2.uid).get().then((data) => {
            const captain = data.data()
            console.log(captain)

            setCustomer(captain)
            setCustomerImage(captain.image)

        }).catch((err) => { console.log('error on inside message', err) })


    }, [])



    function scrollToBottom() {
        setFromTouch(false)
        setShowScrollToLast(false)
        scrollRef?.current?.scrollToOffset({ animated: true, offset: 0 })
        // scrollRef?.current?.scrollToIndex({
        //     animated: true,
        //     index: 0,
        // });
    }

    function handleScrollView(event) {
        const posY = event.nativeEvent.contentOffset.y
        // console.log(posY)
        if (fromTouch && (posY >= 10) != showScrollToLast) {

            setShowScrollToLast(posY >= 10)
        }

    }
    useEffect(() => {
        if (!showScrollToLast) {
            setUnreadCount(0)
        }
    }, [showScrollToLast])
    useEffect(() => {
        const myChat = chats.filter(it => it.chatId == chatId)
        if (myChat.length) {
            setColorC(myChat[0].colorC)

            //     setChatss()
            let lastDate = null
            const data = []
            let allMsg = [...myChat[0].allMessages]
            allMsg = allMsg.sort(function (a, b) { return a.dateInt - b.dateInt })

            // return
            let alreadyUnread = false
            let initaiIndex = 0
            allMsg.map((msg, i) => {
                if (msg.date != lastDate) {
                    lastDate = msg.date
                    data.push(statusDate(msg.date))

                }


                if ((msg.senderId != profile.uid && msg.read == false && !alreadyUnread)) {

                    if (firstTime || showScrollToLast || showUnread) {

                        console.log('AAAHIUAHSUI')
                        setShowUnread(data.length)
                        data.push('new messages')
                        alreadyUnread = true
                    }


                } else if (showUnread != 0 && !alreadyUnread && showUnread == data.length) {
                    if (firstTime || showScrollToLast || showUnread) {
                        console.log('BBBBBBBBBBB')

                        setShowUnread(data.length)
                        data.push('new messages')
                        alreadyUnread = true
                    }
                } else {

                }
                data.push(msg)

                // if (i == snapshot.numChildren() - 1) {
                // console.log(chatss.length != 0, chatss.length, data.length)
                // if (chatss.length != 0) {
                //     console.log(unreadCount)
                //     const s = unreadCount + 1
                //     setUnreadCount(s)
                // }

                // }

            });
            setChatss(data.reverse())
            setFirstTime(false)
            const allUnread = myChat[0].allUnreadMessagesToRead
            const unreadleangth = Object.keys(allUnread).length
            if (showScrollToLast && unreadCount == 0 && unreadleangth) {
                setUnreadCount(1)
            }

            setTimeout(() => {
                setLoader(false)
            }, 250)
            if (data.length != chatss.length && unreadleangth) {
                console.log('unread to read work')
                database()
                    .ref(`/chats/${chatId}/messages`).update(allUnread).then(() => { })
                    .catch((er) => { console.log('error on send message444', er) })

            }
        } else {
            setLoader(false)
        }


    }, [chats])


    useEffect(() => {

        if (focusId) {
            setTimeout(() => {
                setFocusId(null)
            }, 2000)
        }
    }, [focusId])
    function onSendMsg() {

        if (message === null) {

            dispatch(setErrorAlert({ Title: 'Text field is empty', Status: 0 }))
            return
        }
        const { actualDate, dateInt, date } = dataFullData()
        const msgId = dateInt.toString() + verificationCode().toString().slice(0, 3)
        const dddT = actualDate.toLocaleTimeString()
        const fSpace = dddT.split(' ')
        const fDot = fSpace[0].split(':')


        function formatAMPM(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }

        const timeFor = formatAMPM(actualDate)
        const mssss = {

            date: actualDate.toLocaleDateString(),
            dateInt,
            time: timeFor,
            msgId,
            read: false,
            reply,
            // senderId: user2.uid,
            // recieverId: profile.uid,
            senderId: profile.uid,
            recieverId: user2.uid,
            message: message,

        }
        setReply(null)
        setMessage(null)
        // Keyboard.dismiss()
        function updateMor(captain) {
            const token = captain.deviceToken
            const otherUpdates = {

                user: {
                    uid: captain.uid, name: captain.name, image: customerImage
                },
                captain: {
                    uid: profile.uid, name: profile.name, image: profile.image
                }
            }

            database()
                .ref(`/chats/${chatId}`).update(otherUpdates).then(() => { })
                .catch((er) => { console.log('error on send message333', er) })
            const navigate = { screen: 'Chat', params: { user2: { name: profile.name, uid: profile.uid } } }

            sendPushNotification(profile.name, message, 2, [token], navigate)
        }

        const isNew = chatss.length == 0
        database()
            .ref(`/chats/${chatId}`).child('messages').child(msgId)
            .update(mssss)
            .then(() => {
                if (customer) {
                    updateMor(customer)
                }
                else {

                    firestore().collection('users').doc(user2.uid).get().then((data) => {
                        const captain = data.data()
                        updateMor(captain)
                        setCustomer(captain)

                    }).catch((err) => { console.log('error on inside message', err) })
                }


                // database().ref(`/chats/${chatId}`).child('lastUpdate')
                //     .update({ dateInt, date, time: timeFor }).then(() => {
                //         console.log('dg')
                //     })
                //     .catch((err) => { console.log('error on send message22', err) })
            })
            .catch((err) => { console.log('error on send message', err) })

    }


    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background, }}>
                <StatusbarH />

                {/* Back & Others */}
                <View style={{ paddingBottom: myHeight(0) }}>
                    <View style={{
                        elevation: 0, shadowColor: '#000',
                        shadowOffset: { width: 0, height: 3 }, paddingVertical: myHeight(0.8),
                        shadowOpacity: 0.2, backgroundColor: myColors.background,
                        shadowRadius: 2, flexDirection: 'row', alignItems: 'center'
                    }}>
                        {/* Back */}
                        {/* <TouchableOpacity style={{
                            height: myHeight(5),
                            width: myHeight(7),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                            onPress={() => navigation.goBack()} activeOpacity={0.7}>
                            <Image style={{
                                height: myHeight(2.5),
                                width: myHeight(2.5),
                                resizeMode: "contain",
                                tintColor: myColors.text
                            }} source={require('../assets/home_main/home/back.png')} />
                        </TouchableOpacity> */}
                        <Spacer paddingEnd={myWidth(4)} />

                        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={{
                            backgroundColor: myColors.primaryT,
                            padding: myHeight(0.9),
                            borderRadius: myHeight(3),
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                        }}  >
                            <Image style={
                                {
                                    height: myHeight(1.75),
                                    width: myHeight(1.75),
                                    resizeMode: 'contain'
                                }
                            } source={require('../assets/startup/goL.png')} />
                        </TouchableOpacity>

                        <Spacer paddingEnd={myWidth(4)} />
                        <View style={{
                            borderRadius: myHeight(100),
                            height: myHeight(4.2), width: myHeight(4.2),
                            borderColor: myColors.offColor7, borderWidth: 1,
                            backgroundColor: colorC,
                            overflow: 'hidden',
                            marginTop: myHeight(0.2), justifyContent: 'center', alignItems: 'center'
                        }}>
                            {
                                customerImage ?

                                    <ImageUri uri={customerImage} height={'100%'} width={'100%'} resizeMode='cover' />
                                    :
                                    <Image
                                        style={{
                                            width: myHeight(2),
                                            height: myHeight(2),
                                            resizeMode: 'contain',
                                            tintColor: myColors.background
                                        }}
                                        source={require('../assets/home_main/home/user.png')}
                                    />
                            }
                        </View>
                        <Spacer paddingEnd={myWidth(2.4)} />
                        {/* Name & Last seen */}
                        <View>
                            <Text style={[styles.textCommon, {
                                fontSize: myFontSize.xBody2,
                                fontFamily: myFonts.heading,
                            }]}>{user2.name ? user2.name : 'Someone'}</Text>
                            {/* <Text style={[styles.textCommon, {
                            fontSize: myFontSize.body,
                            fontFamily: myFonts.body,
                        }]}>Last seen {'12:09'}</Text> */}
                        </View>
                    </View>

                    <Spacer paddingT={myHeight(0.5)} />
                    {/* Divider */}
                    <View style={{
                        borderTopWidth: myHeight(0.08),
                        borderColor: myColors.offColor2, width: '100%'
                    }} />
                </View>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'always'} bounces={false}
                    showsVerticalScrollIndicator={false} contentContainerStyle={{ flex: 1 }}>
                    {/* Chats */}
                    <ImageBackground style={{ flex: 1 }} source={require('../assets/home_main/home/cb3.jpg')}>

                        <FlashList
                            keyboardShouldPersistTaps={'always'}
                            ref={scrollRef}
                            onScrollBeginDrag={() => {
                                setFromTouch(true)
                            }}
                            showsVerticalScrollIndicator={false}
                            onScrollEndDrag={() => {
                            }}
                            onScroll={handleScrollView}
                            extraData={focusId}
                            data={chatss}
                            inverted
                            contentContainerStyle={{
                                flex: 1, paddingHorizontal: myWidth(2),
                                justifyContent: 'flex-end', paddingVertical: myHeight(0.5)
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            estimatedItemSize={200}

                            renderItem={({ item }) => {
                                if (typeof item == 'string') {
                                    return (

                                        <View style={{
                                            backgroundColor: myColors.offColor5, borderRadius: 1000,
                                            alignSelf: 'center', marginVertical: myHeight(1.5), borderWidth: 1, borderColor: myColors.offColor2,
                                            paddingVertical: myHeight(0.3), paddingHorizontal: myWidth(5)
                                        }}>
                                            <Text style={[styles.textCommon, {
                                                fontSize: myFontSize.xxSmall,
                                                fontFamily: myFonts.bodyBold,
                                            }]}>{item}</Text>
                                        </View>
                                    )

                                }
                                if (item.senderId == profile.uid) {
                                    return (
                                        <MyMessage item={item} />
                                    )
                                } else {

                                    return (
                                        <OtherMessage item={item} />
                                    )
                                }

                            }

                            } />
                        {
                            loader ?
                                <View style={{
                                    height: '100%', width: '100%', position: 'absolute',
                                    backgroundColor: myColors.background, justifyContent: 'center', alignItems: 'center'
                                }}>

                                    <ActivityIndicator size={myHeight(10)} />
                                </View>
                                : null
                        }

                        {/* Bottom */}

                        {/* <View style={{ height: myHeight(0.2), backgroundColor: myColors.offColor5, marginHorizontal: myWidth(0) }} /> */}

                        <View style={{ backgroundColor: 'transparent', paddingHorizontal: myWidth(3) }}>

                            {
                                showScrollToLast ?
                                    <View style={{
                                        position: 'absolute', zIndex: 100,
                                        right: myWidth(5), top: - myHeight(7)
                                    }}>

                                        {unreadCount ?
                                            <View style={{

                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                position: 'absolute', zIndex: 100,
                                                right: myWidth(0.5), top: myHeight(0.3),
                                            }}>
                                                <Text style={[styles.textCommon, {
                                                    fontSize: myFontSize.small3,
                                                    fontFamily: myFonts.body,
                                                    color: myColors.background,
                                                    // padding: myHeight(0.5),
                                                    width: RFValue(9),
                                                    height: RFValue(9),
                                                    textAlign: 'center',
                                                    textAlignVertical: 'center',
                                                    borderRadius: 5000,
                                                    backgroundColor: myColors.primaryT
                                                }]}>{''}</Text>
                                            </View>
                                            : null
                                        }


                                        <TouchableOpacity style={{
                                            height: myHeight(5.2),
                                            width: myHeight(5.2),
                                            borderRadius: myHeight(7),
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: myColors.offColor7
                                        }}
                                            onPress={() => scrollToBottom()} activeOpacity={0.7}>
                                            <Image style={{
                                                height: myHeight(2.3),
                                                width: myHeight(2.3),
                                                resizeMode: "contain",
                                                tintColor: myColors.text,
                                                transform: [{ rotate: '270deg' }]
                                            }} source={require('../assets/home_main/home/back.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    : null
                            }
                            <Spacer paddingT={myHeight(1)} />



                            {/*Input &&  Send But*/}
                            <View style={{ flexDirection: 'row', }}>
                                {/* Input Container */}


                                <View style={{

                                    flex: 1,
                                    borderRadius: myHeight(1.3),
                                    paddingHorizontal: myWidth(1.5),
                                    borderWidth: myHeight(0.1),
                                    borderColor: focus ? myColors.primaryT : myColors.textL4,
                                    backgroundColor: myColors.background,

                                }}>

                                    <Collapsible collapsed={reply ? false : true}>
                                        <Spacer paddingT={myHeight(0.7)} />

                                        {
                                            reply ?
                                                <>
                                                    <ReplyCom reply={reply} />

                                                </>
                                                : null
                                        }


                                        {/* <Spacer paddingT={myHeight(0.2)} /> */}
                                    </Collapsible>

                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>

                                        <TextInput placeholder="Start typing here ...."
                                            multiline
                                            ref={textInputRef}
                                            // autoFocus={false}
                                            placeholderTextColor={myColors.offColor}
                                            selectionColor={myColors.primaryT}
                                            cursorColor={myColors.primaryT}
                                            value={message} onChangeText={setMessage}
                                            onFocus={() => setFocus(true)}
                                            onEndEditing={() => setFocus(false)}
                                            style={{
                                                flex: 1,
                                                textAlignVertical: 'center',
                                                paddingVertical: myHeight(100) > 600 ? myHeight(0.8) : myHeight(0),
                                                fontSize: myFontSize.body,
                                                color: myColors.text,
                                                includeFontPadding: false,
                                                fontFamily: myFonts.bodyBold,
                                            }}
                                        />
                                    </View>

                                </View>



                                <Spacer paddingEnd={myWidth(2)} />
                                {/* Send Button */}
                                <View style={{ alignSelf: 'flex-end' }}>
                                    <TouchableOpacity style={{
                                        paddingVertical: myHeight(1.4),
                                        paddingHorizontal: myWidth(6),
                                        backgroundColor: myColors.textL0,
                                        borderRadius: myWidth(2)
                                    }}
                                        onPress={onSendMsg} activeOpacity={0.85}>
                                        <Image style={{
                                            height: myHeight(2.6),
                                            width: myHeight(2.6),
                                            resizeMode: "contain",
                                        }} source={require('../assets/home_main/home/send.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Spacer paddingT={myHeight(1.5)} />
                        </View>
                    </ImageBackground>

                </KeyboardAwareScrollView>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

})