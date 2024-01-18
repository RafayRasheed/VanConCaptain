import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView, StyleSheet, TouchableOpacity, Image,
    View, Text, StatusBar, TextInput,
    Linking, Platform, ImageBackground, SafeAreaView, Alert,
} from 'react-native';
import { MyError, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { Restaurants } from './home_data';
import { RestaurantInfoFull } from './home.component/restaurant_info_full';
import Lottie from 'lottie-react-native';
import { Filter } from './home.component/filter';
import { useSelector } from 'react-redux';
import { ItemInfo } from './home.component/item_info';
import { FlashList } from '@shopify/flash-list';
import { fromBase64 } from 'js-base64';
const CommonFaci = ({ name, fac, setFAc }) => (
    <TouchableOpacity activeOpacity={0.75}
        onPress={() => {
            setFAc(!fac)
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <View style={{
                height: myHeight(3.5),
                width: myHeight(3.5),
                paddingTop: myHeight(0.75)
            }}>
                <View style={{ width: myHeight(2.2), height: myHeight(2.2), borderWidth: 1.5, borderColor: myColors.textL4 }} />
                {
                    fac &&
                    <Image style={{
                        height: myHeight(3.5),
                        width: myHeight(3.5),
                        resizeMode: 'contain',
                        tintColor: myColors.primaryT,
                        marginTop: -myHeight(3.3)
                    }} source={require('../assets/home_main/home/check2.png')} />
                }
            </View>
            <Spacer paddingEnd={myWidth(1)} />
            <Text style={[styles.textCommon,
            {
                fontFamily: myFonts.bodyBold,
                fontSize: myFontSize.xBody,

            }]}>{name}</Text>
        </View>
    </TouchableOpacity>
)
function containString(contain, thiss) {
    return (contain.toLowerCase().includes(thiss.toLowerCase()))
}

export const Search = ({ navigation }) => {
    // const { location } = useSelector(state => state.location)
    const location = useSelector(state => state.areas.areas)
    const [search, setSearch] = useState(null)
    const [longEnable, setLongEnable] = useState(false)
    const [filterItems, setFilterItems] = useState([])
    const [selectedItem, setSelectedItems] = useState([])
    // const [fullRest, setFullRest] = useState([])
    function onLongPress(item) {

        if (!longEnable) {
            console.log(longEnable, item,)

            setLongEnable(true)
            onSinglePress(item, true)

        }
    }
    function onSinglePress(item, fromLong) {
        if (longEnable || fromLong) {
            const isOnArra = selectedItem.findIndex(it => it.fullName == item.fullName)
            if (isOnArra == -1) {
                setSelectedItems([...selectedItem, item])
            } else {
                setSelectedItems(selectedItem.filter(it => it.fullName != item.fullName))
            }
        }
    }
    const Loader = () => (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{
                marginTop: -myHeight(15),
                alignItems: 'center',
            }}>
                <Lottie
                    autoPlay={true}
                    loop={true}
                    source={require('../assets/lottie/spoonL.json')}
                    style={{
                        height: myHeight(38), width: myHeight(38),
                    }}
                />

                <Text style={[styles.textCommon, {
                    fontSize: myFontSize.body3,
                    color: myColors.textL4,
                    fontFamily: myFonts.bodyBold,
                    marginTop: -myHeight(11)
                }]}>Loading....</Text>
            </View>
        </View>
    )

    useEffect(() => {

        if (search) {
            const newR = location.filter(item => (containString(item.fullName, search)))
            console.log(1, newR.length)
            setFilterItems(newR)
        }

        else {
            console.log(2, location.length)

            setFilterItems(location)

        }




    }, [search, location])


    // useEffect(() => {
    //     if (load) {
    //         setTimeout(() =>
    //             setLoad(false)
    //             , 3000)
    //     }
    // }, [DineIn, TakeAway, Delivery])

    return (

        <>
            <SafeAreaView style={{
                position: 'absolute', height: '100%', width: '100%',
                backgroundColor: myColors.background,
            }}>
                <StatusbarH />
                <Spacer paddingT={myHeight(1)} />
                {/* Top */}
                {/* Search */}
                <View style={{ paddingHorizontal: myWidth(4), flexDirection: 'row', alignItems: 'center' }}>

                    {/* Search */}
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: myWidth(4),
                        paddingVertical: myHeight(0.5),
                        borderRadius: myWidth(2.5),
                        backgroundColor: myColors.offColor7,
                        // marginHorizontal: myWidth(4)
                    }}>
                        {/* Arrow */}
                        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={{}}>
                            <Image style={{
                                height: myHeight(2.3),
                                width: myHeight(2.3),
                                resizeMode: 'contain',
                                tintColor: myColors.textL0
                            }} source={require('../assets/home_main/home/back.png')} />
                        </TouchableOpacity>
                        <Spacer paddingEnd={myWidth(2.5)} />
                        <TextInput placeholder=" Search location"
                            placeholderTextColor={myColors.textL5}
                            autoCorrect={false}
                            selectionColor={myColors.primaryT}
                            style={{
                                flex: 1,
                                textAlignVertical: 'center',
                                paddingVertical: ios ? myHeight(0.6) : myHeight(100) > 600 ? myHeight(0.5) : myHeight(0.1),
                                fontSize: myFontSize.xxSmall,
                                color: myColors.text,
                                includeFontPadding: false,
                                fontFamily: myFonts.bodyBold,
                            }}
                            cursorColor={myColors.primaryT}
                            value={search} onChangeText={setSearch}
                        // value={search} onChangeText={(val) => null}
                        />
                    </View>
                    {/* <Spacer paddingEnd={myWidth(3)} />
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setFilterModal(true)} style={{}}>
                        <Image style={{
                            height: myHeight(4.2),
                            width: myHeight(4.2),
                            resizeMode: 'contain',
                            tintColor: myColors.textL0
                        }} source={require('../assets/home_main/home/filter.png')} />
                    </TouchableOpacity> */}
                </View>
                <Spacer paddingT={myHeight(1.5)} />

                {/* <View style={{ marginHorizontal: myWidth(5), flexDirection: 'row', justifyContent: 'space-between' }}>

                    <CommonFaci name={'Dine In'} fac={DineIn} setFAc={setDineIn} />
                    <CommonFaci name={'Delivery'} fac={Delivery} setFAc={setDelivery} />
                    <CommonFaci name={'Take Away'} fac={TakeAway} setFAc={setTakeAway} />
                </View> */}
                {/* Icon Empty Or Content */}



                <View style={{ flex: 1, }}>
                    {
                        filterItems.length ?

                            <FlashList
                                extraData={[longEnable, selectedItem]}
                                data={filterItems}
                                contentContainerStyle={{ paddingHorizontal: myWidth(4.5) }}
                                keyExtractor={(item, index) => index.toString()}
                                estimatedItemSize={87}
                                ItemSeparatorComponent={() => (
                                    <View style={{ height: myHeight(0.3), backgroundColor: myColors.divider }} />
                                )}
                                renderItem={({ item }) => {
                                    const selItisSlected = selectedItem.findIndex(it => it.fullName == item.fullName) != -1
                                    return (

                                        <TouchableOpacity activeOpacity={0.75} style={{ paddingVertical: myHeight(1), backgroundColor: selItisSlected ? 'red' : myColors.background }} onLongPress={() => { onLongPress(item) }}
                                            onPress={() => onSinglePress(item)}>
                                            <Text style={[styles.textCommon, {
                                                fontFamily: myFonts.bodyBold,
                                                fontSize: myFontSize.xBody,
                                            }]}>{item.fullName}</Text>
                                        </TouchableOpacity>
                                    )
                                }

                                } />
                            :
                            <View>
                                <Text style={[styles.textCommon, {
                                    fontFamily: myFonts.bodyBold,
                                    fontSize: myFontSize.xBody,
                                }]}></Text>
                            </View>
                    }

                </View>



            </SafeAreaView>


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
})