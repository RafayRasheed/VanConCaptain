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
            <StatusbarH />
            <Spacer paddingT={myHeight(2.8)} />

            <SkeletonPlaceholder>

                <SkeletonPlaceholder.Item marginStart={myWidth(4)} width={myWidth(50)} height={myHeight(2.2)} borderRadius={0} />
            </SkeletonPlaceholder>

            <Spacer paddingT={myHeight(2.2)} />

            {/* Banner */}
            <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={myWidth(92)} height={myWidth(49)} borderRadius={myHeight(1)} alignSelf='center' />
                {/* <SkeletonPlaceholder.Item width={myWidth(13)} height={myHeight(1.5)} marginTop={myHeight(1)} borderRadius={myHeight(1)} alignSelf='center' /> */}
            </SkeletonPlaceholder>



            <Spacer paddingT={myHeight(3)} />
            {/* Heading */}
            <SpaceBetweenSkeleton />

            <Spacer paddingT={myHeight(3.5)} />

            <SkeletonPlaceholder>

                <SkeletonPlaceholder.Item marginStart={myWidth(4)} width={myWidth(30)} height={myHeight(2.8)} borderRadius={myHeight(100)} />
            </SkeletonPlaceholder>
            <Spacer paddingT={myHeight(0.5)} />

            {/* Restuarant */}
            <View style={{
                flexDirection: 'row',
            }}>
                <RestaurantInfoSkeleton isFull={true} />

            </View>

            <Spacer paddingT={myHeight(2.5)} />

            {/* Restuarant */}
            <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={myWidth(90)} height={myHeight(17)} borderRadius={myHeight(1)} alignSelf='center' />
                {/* <SkeletonPlaceholder.Item width={myWidth(13)} height={myHeight(1.5)} marginTop={myHeight(1)} borderRadius={myHeight(1)} alignSelf='center' /> */}
            </SkeletonPlaceholder>

        </View>
    )
}






const styles = StyleSheet.create({
    container: {
        backgroundColor: myColors.background,
        position: 'absolute',
        height: '100%',
        width: '100%', zIndex: 50505050,
    },


    //Text
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

})