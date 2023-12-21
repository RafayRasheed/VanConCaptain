import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Image, View, Text, FlatList, Modal, UIManager, LayoutAnimation } from 'react-native'
import { MyError, Spacer, StatusbarH, ios, myHeight, myWidth } from '../../common';
import { myColors } from '../../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../../ultils/myFonts';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { CategorySkeleton, RestaurantInfoSkeleton, SpaceBetweenSkeleton } from '../../common/skeletons';


export const HomeSkeleton = ({ navigation }) => {
    const name = "Someone";

    return (

        <View style={styles.container}>

            <Spacer paddingT={myHeight(3)} />

            {/* Banner */}
            <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={myWidth(90)} height={myHeight(20)} borderRadius={myHeight(5)} alignSelf='center' />
                <SkeletonPlaceholder.Item width={myWidth(13)} height={myHeight(1.5)} marginTop={myHeight(1)} borderRadius={myHeight(5)} alignSelf='center' />
            </SkeletonPlaceholder>

            <Spacer paddingT={myHeight(3.5)} />
            {/* Heading */}
            <SpaceBetweenSkeleton />
            <Spacer paddingT={myHeight(2.5)} />

            {/* CAtegories*/}
            <View style={{
                flexDirection: 'row', paddingHorizontal: myWidth(4)
            }}>
                <CategorySkeleton />
                <CategorySkeleton />
                <CategorySkeleton />
                <CategorySkeleton />
            </View>

            <Spacer paddingT={myHeight(6)} />
            {/* Heading */}
            <SpaceBetweenSkeleton />
            <Spacer paddingT={myHeight(2)} />
            {/* Restuarant */}
            <View style={{
                flexDirection: 'row', paddingHorizontal: myWidth(4)
            }}>
                <RestaurantInfoSkeleton isFull={false} />
                <RestaurantInfoSkeleton isFull={false} />

            </View>

            <Spacer paddingT={myHeight(3)} />
            {/* Heading */}
            <SpaceBetweenSkeleton />
            <Spacer paddingT={myHeight(2)} />
            {/* Restuarant */}
            <View style={{
                flexDirection: 'row', paddingHorizontal: myWidth(4)
            }}>
                <RestaurantInfoSkeleton isFull={false} />
                <RestaurantInfoSkeleton isFull={false} />

            </View>

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

})