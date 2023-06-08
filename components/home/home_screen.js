import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Image, View, Text, FlatList, Modal, UIManager, LayoutAnimation } from 'react-native'
import { MyError, Spacer, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { Categories, Restaurants, bookNow, category, dailySpecial, nearDrivers, notifications, rewards } from './home_data'
import { ResturantH } from './home.component/resturant_hori';
import { Banners } from './home.component/banner';

if (!ios && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}
export const HomeScreen = ({ navigation }) => {
    const name = "Someone";
    
    // re.turn (<Test />)
    return (
        
        <SafeAreaView style={styles.container}>

            <ScrollView contentContainerStyle={{flexGrow:1}} showsVerticalScrollIndicator={false} >

                <Spacer paddingT={myHeight(1.4)} />
                <Text style={[styles.textCommon,{
                        fontSize: myFontSize.medium2,
                        fontFamily: myFonts.heading, 
                        alignSelf:'center',

                    }]}>Food<Text style={{color:myColors.primaryT}}>app</Text></Text>

                <Spacer paddingT={myHeight(0.8)} />

                {/* Morning */}
                <View style={{ paddingHorizontal: myWidth(3) }}>
                    <Text style={[styles.textCommon,{
                        fontSize: myFontSize.body2,
                        fontFamily: myFonts.bodyBold, 

                    }]}>{`Good Morning ${name}!`}</Text>
                </View>

                <Spacer paddingT={myHeight(1.5)} />
                
                {/* Search */}
                <TouchableOpacity activeOpacity={0.8} style={{
                    flexDirection:'row', alignItems:'center', width:myWidth(85),
                    backgroundColor:myColors.divider, alignSelf:'center', paddingVertical:myHeight(1.3),
                    borderRadius:myWidth(2.5)
                    }}>
                    <Spacer paddingEnd={myWidth(4)}/>
                    <Image style={{
                        height: myHeight(2.2), width: myHeight(2.2), resizeMode: 'contain', tintColor:myColors.offColor
                    }} source={require('../assets/home_main/home/search.png')} />
                    <Spacer paddingEnd={myWidth(3)}/>

                    <Text style={[styles.textCommon,{
                        fontSize: myFontSize.body,
                        fontFamily: myFonts.bodyBold, 
                        color:myColors.offColor
                    }]}>Search dishes, restaurants</Text>
                </TouchableOpacity>
        
                <Spacer paddingT={myHeight(3)} />
                {/* Banner */}
                <Banners/>
                <Spacer paddingT={myHeight(2.5)} />
                {/* CAtegories*/}
                <View>
                    {/* Categories & see all*/}
                    <View style={{ paddingHorizontal: myWidth(3), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.textCommon,{
                            fontSize: myFontSize.xxBody,
                            fontFamily: myFonts.bodyBold, 
                        }]}>Categories</Text>
                        
                        {/* See all */}
                        <TouchableOpacity style={{
                            flexDirection:'row', alignItems:'center', paddingVertical: myHeight(0.4), 
                            paddingStart: myWidth(2) 
                            }} activeOpacity={0.6} onPress={() => null}>

                            <Text 
                                style={[styles.textCommon,{
                                fontSize: myFontSize.body2,
                                fontFamily: myFonts.bodyBold,
                                color:myColors.primaryT 
                            }]}>See All</Text>
                             <Image style={{
                                height: myHeight(1.5), width: myHeight(1.5), marginStart:myWidth(1),
                                resizeMode: 'contain', tintColor:myColors.primaryT
                            }} source={require('../assets/home_main/home/go.png')} />
                        </TouchableOpacity>
                    </View>

                    <Spacer paddingT={myHeight(1.5)} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: myWidth(3) }}>

                        {Categories.map((item, i)=>
                        
                        <View key={i} style={{paddingBottom:myHeight(1.4),}}>
                            <TouchableOpacity style={{
                                flexDirection:'row', alignItems:'center', borderRadius:myHeight(15),
                                // backgroundColor:myColors.background,
                                backgroundColor:myColors.primaryL,  
                                padding:myHeight(0.8), elevation:8
                                }}>
                                <View style={{
                                        height: myHeight(5), width: myHeight(5),borderRadius:myHeight(5),
                                        // backgroundColor:'#00000010'
                                        backgroundColor:myColors.background, 
                                        alignItems:'center',justifyContent:'center'
                                    }} >
                                    <Image style={{
                                        height: myHeight(3.2), width: myHeight(3.2),
                                        resizeMode: 'contain',
                                    }} source={require('../assets/home_main/home/category/fast.png')} />
                                </View>

                                <Spacer paddingEnd={myWidth(3)}/>
                                <Text 
                                    style={[styles.textCommon,{
                                    fontSize: myFontSize.body2,
                                    fontFamily: myFonts.heading,
                                }]}>Fast Food</Text>
                                <Spacer paddingEnd={myWidth(2.7)}/>

                            </TouchableOpacity>
                        </View>
                        )}
                    </ScrollView>
                 
                </View>

                <Spacer paddingT={myHeight(2)} />
                {/* New Arrival  Complete*/}
                <View>
                    {/* New Arrivals*/}
                    <View style={{ paddingHorizontal: myWidth(3), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.textCommon,{
                            fontSize: myFontSize.xBody,
                            fontFamily: myFonts.bodyBold, 
                        }]}>New Arrivals</Text>
                        
                        {/* See all */}
                        <TouchableOpacity style={{
                            flexDirection:'row', alignItems:'center', paddingVertical: myHeight(0.4), 
                            paddingStart: myWidth(2) 
                            }} activeOpacity={0.6} onPress={() => null}>

                            <Text 
                                style={[styles.textCommon,{
                                fontSize: myFontSize.body2,
                                fontFamily: myFonts.bodyBold,
                                color:myColors.primaryT 
                            }]}>See All</Text>
                             <Image style={{
                                height: myHeight(1.5), width: myHeight(1.5), marginStart:myWidth(1),
                                resizeMode: 'contain', tintColor:myColors.primaryT
                            }} source={require('../assets/home_main/home/go.png')} />
                        </TouchableOpacity>
                    </View>

                    <Spacer paddingT={myHeight(1)} />
                    {/* Restuarant */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: myWidth(3) }}>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            {Restaurants.map((item, i) =>
                                <TouchableOpacity key={i} activeOpacity={0.95}  
                                onPress={() => navigation.navigate('RestaurantDetail', { item })} >
                                    <ResturantH item={item}/>
                                </TouchableOpacity>
                            )}
                        </View>

                    </ScrollView>
                </View>

                <Spacer paddingT={myHeight(1.5)} />
                {/*Nearby Restaurants  Complete*/}
                <View>
                    {/* Nearby Restaurants*/}
                    <View style={{ paddingHorizontal: myWidth(3), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.textCommon,{
                            fontFamily: myFonts.bodyBold, 
                            fontSize: myFontSize.xBody,
                        }]}>Nearby Restaurants</Text>
                        
                        <TouchableOpacity style={{
                            flexDirection:'row', alignItems:'center', paddingVertical: myHeight(0.4), 
                            paddingStart: myWidth(2) 
                            }} activeOpacity={0.6} onPress={() => null}>

                            <Text 
                                style={[styles.textCommon,{
                                fontSize: myFontSize.body2,
                                fontFamily: myFonts.bodyBold,
                                color:myColors.primaryT 
                            }]}>See All</Text>
                             <Image style={{
                                height: myHeight(1.5), width: myHeight(1.5), marginStart:myWidth(1),
                                resizeMode: 'contain', tintColor:myColors.primaryT
                            }} source={require('../assets/home_main/home/go.png')} />
                        </TouchableOpacity>
                    </View>

                    <Spacer paddingT={myHeight(1)} />
                    {/* Restuarant */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: myWidth(3) }}>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            {Restaurants.map((item, i) =>
                                <TouchableOpacity key={i} activeOpacity={0.95} 
                                onPress={() => navigation.navigate('RestaurantDetail', { item })} >
                                    <ResturantH item={item}/>
                                </TouchableOpacity>
                            )}
                        </View>

                    </ScrollView>
                </View>
                

            </ScrollView>

        </SafeAreaView>
    )
}






const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: myColors.background
    },


    //Text
    textCommon:{
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

})