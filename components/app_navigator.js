import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StartupNavigator } from "./startup/startup_navigator"
import { HomeBottomNavigator } from "./home/home_bottom_navigator"
import { AccountNavigator } from "./account/account_navigation"
import { ImageViewer } from "./common/image_viewer"
import { AccountNavigator2 } from "./account1/acc_stack"
import { storage } from "./common"
import { createStackNavigator } from "@react-navigation/stack"
import { containFirstTime, containLogin, getLogin } from "./functions/storageMMKV"
import { ItemDetails } from "./home/item_detail_screen"
import { Search } from "./home/locations_screen"
import { ItemSearch } from "./home/item_search_screen"
import { RestaurantMoreDetails } from "./home/rest_more_info_screen"
import { ProfileInfo } from "./profile/profile_info"
import { Favourite } from "./profile/favourite_screen"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setProfile } from "../redux/profile_reducer"
import { Checkout } from "./cart/checkout"
// import { OrderDetails } from "./orders/ride_detail_screen"
import { navigationRef } from "./RootNavigation"
import NavigationService from "./NavigationService"
import { Chat } from "./home/chat_screen"
import { DriverDetailEdit } from "./profile/driver_details_edit"
import { DriverDetail } from "./home/driver_detail_screen"
import { RideDetails } from "./orders/ride_detail_screen"

const AppTAB = createStackNavigator()

export const AppNavigator = () => {
    // const dispatch = useDispatch()
    // useEffect(() => {
    //     if (containLogin()) {
    //         const profile = getLogin()
    //         dispatch(setProfile(profile))
    //     }
    // }, [])
    return (
        <NavigationContainer ref={(re) => NavigationService.setTopLevelNavigator(re)}>
            <AppTAB.Navigator
                initialRouteName="StartupScreen"
                // initialRouteName={containFirstTime() ? containLogin() ? 'HomeBottomNavigator' : "AccountNavigator" : "StartupScreen"}
                screenOptions={{
                    animation: 'fade',
                    headerShown: false
                }}
            >
                <AppTAB.Screen component={StartupNavigator} name="StartupNavigator" />
                <AppTAB.Screen component={AccountNavigator2} name="AccountNavigator" />
                <AppTAB.Screen component={HomeBottomNavigator} name="HomeBottomNavigator" />
                <AppTAB.Screen component={ImageViewer} name="ImageViewer" />

                {/* Home */}
                <AppTAB.Screen component={RestaurantMoreDetails} name="RestaurantMoreDetails" />
                <AppTAB.Screen component={ItemDetails} name="ItemDetails" />
                <AppTAB.Screen component={ItemSearch} name="ItemSearch" />
                <AppTAB.Screen component={Chat} name="Chat" />
                <AppTAB.Screen component={DriverDetail} name="DriverDetail" />


                {/* PROFILE */}
                <AppTAB.Screen component={ProfileInfo} name="ProfileInfo" />
                <AppTAB.Screen component={Favourite} name="Favourite" />
                <AppTAB.Screen component={Checkout} name="Checkout" />
                <AppTAB.Screen component={RideDetails} name="RideDetails" />
                <AppTAB.Screen component={DriverDetailEdit} name="DriverDetailEdit" />


            </AppTAB.Navigator>
        </NavigationContainer>
    )
}