import React, { useLayoutEffect } from "react";
import { Text, SafeAreaView, View, Image, StatusBar, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Spacer, StatusbarH, bottomTab, ios, myHeight, myWidth, storage } from "../common";
import { myColors } from "../../ultils/myColors";
import { myFontSize, myFonts, myLetSpacing } from "../../ultils/myFonts";
import { ActivityScreen } from "../activity/activity_screen";
import { HomeNavigator } from "./home_navigator";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { CartNavigator } from "../cart/cart_navigator";
import { createStackNavigator } from "@react-navigation/stack"
import { deleteLogin } from "../functions/storageMMKV";
import { useSelector } from "react-redux";
import { ProfileNavigator } from "../profile/profile_navigator";
import { OrderScreen } from "../orders/orders_screen";

const Tab = createBottomTabNavigator()

const Icons = {
    HOME: {
        image: require('../assets/home_main/home/navigator/home.png'),
        style: { width: myWidth(6.5), height: myHeight(2.68) }
    },
    RIDES: {
        // image: require('../assets/home_main/home/navigator/van.png'),
        // style: { width: myHeight(4.4), height: myHeight(4.4) }
        image: require('../assets/home_main/home/navigator/van2.png'),
        style: { width: myHeight(3.4), height: myHeight(3.4) }
    },
    HOT: {
        image: require('../assets/home_main/home/navigator/fire.png'),
        style: { width: myHeight(3.8), height: myHeight(3.8) }
    },

    // WALLET: require('../assets/home_main/navigator/wallet.png'),
    ALERT: {
        image: require('../assets/home_main/home/navigator/bell.png'),
        style: { width: myHeight(2.8), height: myHeight(2.8) }
    },
    PROFILE: {
        image: require('../assets/home_main/home/navigator/account.png'),
        style: { width: myWidth(6.2), height: myHeight(2.68) }
    },
}


const screenOptions = ({ navigator, route }) => {
    const { cart } = useSelector(state => state.cart)
    const { progress } = useSelector(state => state.orders)

    const name = route.name
    return {
        headerShown: false,
        tabBarStyle: bottomTab,
        tabBarLabelStyle: {
            display: name == 'HOT' ? 'none' : 'flex',
            fontSize: myFontSize.xSmall,
            fontFamily: myFonts.bodyBold,
            letterSpacing: myLetSpacing.common,
            paddingTop: myHeight(1),
        },
        tabBarActiveTintColor: myColors.primaryT,
        tabBarInactiveTintColor: myColors.text,
        // tabBarShowLabel:name=='HOT'?true:false,
        tabBarIcon: ({ color }) => {
            if (name == 'HOT') {
                return (
                    <View style={{
                        padding: myHeight(2), backgroundColor: color == myColors.primaryT ? myColors.primaryL3 : myColors.primaryL5, borderWidth: myHeight(0.1), borderColor: myColors.offColor7,
                        borderRadius: myHeight(10), elevation: 3,
                        marginTop: -myHeight(7.5)
                    }}>
                        <Image style={[Icons[name].style, { resizeMode: 'contain', }]}
                            source={Icons[name].image} />
                    </View>
                )
            }
            if (name == 'ALERT') {
                return (
                    <View>
                        <Image style={[Icons[name].style, { tintColor: color, resizeMode: 'contain', }]}
                            source={Icons[name].image} />
                        {
                            cart.length ?
                                <View style={{
                                    position: 'absolute', top: -myHeight(0.6), right: -myHeight(1.4), backgroundColor: myColors.red, borderRadius: 100,
                                    paddingVertical: myHeight(0.35), paddingHorizontal: myHeight(1)
                                }}>
                                    <Text style={[styles.textCommon, { fontSize: myFontSize.tiny, fontFamily: myFonts.bodyBold, color: myColors.background }]}>{cart.length}</Text>
                                </View>
                                : null
                        }
                    </View>
                )
            }
            if (name == 'RIDES') {
                return (
                    <View>
                        <Image style={[Icons[name].style, { tintColor: color, resizeMode: 'contain', }]}
                            source={Icons[name].image} />
                        {
                            progress?.length ?
                                <View style={{
                                    position: 'absolute', top: -myHeight(0.6), right: -myHeight(1.4), backgroundColor: myColors.red, borderRadius: 100,
                                    paddingVertical: myHeight(0.35), paddingHorizontal: myHeight(1)
                                }}>
                                    <Text style={[styles.textCommon, { fontSize: myFontSize.tiny, fontFamily: myFonts.bodyBold, color: myColors.background }]}>{progress.length}</Text>
                                </View>
                                : null
                        }
                    </View>
                )
            }
            return (
                <Image style={[Icons[name].style, { tintColor: color, resizeMode: 'contain', }]}
                    source={Icons[name].image} />
            )
        },
    }
}

const Xr = ({ navigation }) => (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: myColors.background }}>
        <StatusbarH />
        <Spacer paddingT={myHeight(2)} />
        <Text onPress={() => {
            const isNotDelete = deleteLogin()
            console.log(isNotDelete)
            if (isNotDelete) {
                console('Error on delete user from signout mmkv')
            } else {
                navigation.navigate('AccountNavigator')
            }
        }} style={{ color: 'black' }}>Sign Out</Text>
    </SafeAreaView>
)


export const HomeBottomNavigator = ({ route, navigation }) => {
    // useLayoutEffect(() => {
    //     StatusBar.setTranslucent(false)
    //     StatusBar.setBackgroundColor(myColors.background)
    // }, [route, navigation])
    return (

        <>
            <Tab.Navigator
                tabBarActiveTintColor={myColors.primary}
                headerShown={false}
                screenOptions={screenOptions}
                tabBarShowLabel={false}
                initialRouteName="HOME"
            >
                <Tab.Screen name="HOME" component={HomeNavigator} />
                <Tab.Screen name="RIDES" component={OrderScreen} />
                {/* <Tab.Screen name="HOT" component={OrderScreen} /> */}
                <Tab.Screen name="ALERT" component={CartNavigator} />
                <Tab.Screen name="PROFILE" component={ProfileNavigator} />

            </Tab.Navigator>
        </>


    )
}

const styles = StyleSheet.create({
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    }
})
