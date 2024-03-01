import React from "react";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { MyError, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { View } from "react-native";


export const RestaurantInfoSkeleton = ({ isFull = true }) => (
    <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item width={isFull ? myWidth(92) : (myHeight(14.5) * 2.95)}
            marginStart={isFull ? myWidth(4) : 0} marginEnd={isFull ? 0 : myWidth(4)} borderWidth={2} borderColor={myColors.divider}
            borderRadius={myWidth(3)} overflow='hidden' paddingBottom={myHeight(1.7)} marginVertical={isFull ? myHeight(1.5) : 0}>

            <SkeletonPlaceholder.Item width={'100%'} height={myHeight(15)} borderRadius={0} />
            <SkeletonPlaceholder.Item paddingHorizontal={myWidth(2)} marginTop={myHeight(1.8)}>
                <SkeletonPlaceholder.Item width={'70%'} height={myHeight(2.2)} borderRadius={100} />
                <SkeletonPlaceholder.Item width={'100%'} height={myHeight(2.2)} marginTop={myHeight(1.2)} borderRadius={100} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
)

export const ItemSkeleton = () => (
    <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" borderWidth={2} borderColor={myColors.divider}
            borderRadius={myWidth(3)} overflow='hidden' marginVertical={myHeight(1.5)} marginHorizontal={myWidth(4)}>
            <SkeletonPlaceholder.Item width={myHeight(10)} height={myHeight(10)} borderRadius={0} />
            <SkeletonPlaceholder.Item marginLeft={myWidth(2.5)} flex={1} justifyContent='space-around'>
                <SkeletonPlaceholder.Item width={'70%'} height={myHeight(2.2)} />
                <SkeletonPlaceholder.Item marginTop={myHeight(1.5)} width={'95%'} height={myHeight(2.2)} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
)



export const CategorySkeleton = () => (

    <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item width={myWidth(25)} height={myHeight(6)} borderRadius={500} marginEnd={myWidth(4)} />
    </SkeletonPlaceholder>
)

export const SpaceBetweenSkeleton = () => (
    <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection='row' justifyContent='space-between' marginHorizontal={myWidth(4)}>
            <View>

                <SkeletonPlaceholder.Item width={myWidth(27)} height={myHeight(2)} marginTop={myHeight(0.3)} borderRadius={0} />
                <SkeletonPlaceholder.Item width={myWidth(42)} height={myHeight(1.25)} marginTop={myHeight(0.9)} borderRadius={500} />
            </View>
            <SkeletonPlaceholder.Item width={myWidth(35)} height={myHeight(4.7)} borderRadius={500} />
        </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
)
