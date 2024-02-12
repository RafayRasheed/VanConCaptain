
import { Image, TouchableOpacity, SafeAreaView, StyleSheet, Text, View, ImageBackground, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Spacer, myHeight, myWidth } from "../../common"
import { myFontSize, myFonts, myLetSpacing } from "../../../ultils/myFonts"
import { myColors } from "../../../ultils/myColors"
import { useDispatch, useSelector } from 'react-redux'
import { addFavoriteRest, removeFavoriteRest } from '../../../redux/favorite_reducer'
import { ImageUri } from '../../common/image_uri'
import database from '@react-native-firebase/database';

export const RequestInfo = ({ item, navigation, code }) => {
    const { profile } = useSelector(state => state.profile)
    const me = item.sendDrivers.find(it => it.did == profile.uid)

    useEffect(() => {
        if (item.unread) {
            console.log('han')
            database()
                .ref(`/requests/${profile.uid}/${item.id}`).update({ unread: false }).then(() => { }).catch((err) => { console.log('error on update unread err') })
        }
    }, [item])
    return (
        <View

            style={{
                backgroundColor: myColors.background, elevation: 5,
                borderRadius: myWidth(1.5), paddingHorizontal: myWidth(3),
                marginBottom: myHeight(1), marginTop: myHeight(1),
                borderBottomWidth: myHeight(0.2), borderColor: myColors.divider
            }}>
            <Spacer paddingT={myHeight(1)} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    style={{
                        width: myHeight(2.3),
                        height: myHeight(2.3),
                        resizeMode: 'contain',
                        tintColor: myColors.primaryT
                    }} source={item.twoWay ? require('../../assets/home_main/home/twoArrow.png') : require('../../assets/home_main/home/oneArrow.png')}
                />

                <Spacer paddingEnd={myWidth(2.4)} />
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>

                    <Text
                        style={[
                            styles.textCommon,
                            {

                                fontSize: myFontSize.body,
                                fontFamily: myFonts.body,
                            },
                        ]}
                    >ID: {item.id} </Text>
                    <Spacer paddingEnd={myWidth(2)} />

                    <Image
                        style={{
                            width: myHeight(2),
                            height: myHeight(2),
                            resizeMode: 'contain',
                            tintColor: myColors.primaryT
                        }} source={require('../../assets/home_main/home/distance.png')}
                    />
                    <Spacer paddingEnd={myWidth(1.2)} />

                    <Text
                        style={[
                            styles.textCommon,
                            {

                                fontSize: myFontSize.xSmall,
                                fontFamily: myFonts.bodyBold,
                            },
                        ]}
                    >{item.distance} </Text>
                </View>

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



            </View>
            <Spacer paddingT={myHeight(1.2)} />

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
                        <Image
                            style={{
                                width: myHeight(2),
                                height: myHeight(2),
                                resizeMode: 'contain',
                                tintColor: myColors.primaryT
                            }} source={require('../../assets/home_main/home/clock.png')}
                        />
                        <Spacer paddingEnd={myWidth(1.3)} />

                        <Text style={[
                            styles.textCommon,
                            {
                                fontSize: myFontSize.xxSmall,
                                fontFamily: myFonts.body,
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
                                    <Image
                                        style={{
                                            width: myHeight(2),
                                            height: myHeight(2),
                                            resizeMode: 'contain',
                                            tintColor: myColors.primaryT
                                        }} source={require('../../assets/home_main/home/clock.png')}
                                    />
                                    <Spacer paddingEnd={myWidth(1.3)} />
                                    <Text style={[
                                        styles.textCommon,
                                        {
                                            fontSize: myFontSize.xxSmall,
                                            fontFamily: myFonts.body,
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
            <Spacer paddingT={myHeight(1.2)} />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Text
                    style={[
                        styles.textCommon,
                        {
                            flex: 1,
                            fontSize: myFontSize.body,
                            fontFamily: myFonts.body,
                            color: item.status == 1 ? 'red' : myColors.text
                        },
                    ]}
                >{item.status == 1 ? 'Not send to any driver yet' : `Send to ${item.sendDrivers.length} drivers yet`}</Text> */}

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

                {
                    code == 2 ?
                        <>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => null}>
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
                            <TouchableOpacity activeOpacity={0.7} onPress={() => null}>
                                <Text
                                    style={[
                                        styles.textCommon,
                                        {
                                            fontSize: myFontSize.body,
                                            fontFamily: myFonts.heading,
                                            color: myColors.primaryT
                                        },
                                    ]}
                                >{'Accept'}</Text>
                            </TouchableOpacity>


                        </>
                        :
                        <Text
                            style={[
                                styles.textCommon,
                                {

                                    fontSize: myFontSize.body,
                                    fontFamily: myFonts.bodyBold,
                                    color: me.status < 0 ? 'red' : myColors.text
                                },
                            ]}
                        >{me.status < 0 ? 'Request Rejected' : `Request Accepted`}</Text>

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
