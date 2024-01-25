import React, { useState } from "react";
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Spacer, myHeight, myWidth } from "../../common"
import { myFontSize, myFonts, myLetSpacing } from "../../../ultils/myFonts"
import { myColors } from "../../../ultils/myColors"
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

export const ChangeImageView = ({ onChange, onView, onRemove, onHide }) => {


    return (
        <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#00000040', }} activeOpacity={0.75}
        >
            <TouchableOpacity style={{ flex: 1, }} activeOpacity={0.75} onPress={() => onHide(false)} />
            <Animated.View
                entering={SlideInDown}
                exiting={SlideOutDown}
                style={{
                    backgroundColor: myColors.background,
                    alignItems: 'center', justifyContent: 'center',
                    borderTopStartRadius: myWidth(5), borderTopEndRadius: myWidth(5)
                }}>

                <Spacer paddingT={myHeight(3)} />

                <TouchableOpacity style={{}} activeOpacity={0.75} onPress={() => {
                    onRemove()
                    onHide()
                }}>
                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.bodyBold,
                        fontSize: myFontSize.medium2,

                    }]}> Remove </Text>
                </TouchableOpacity>

                <Spacer paddingT={myHeight(1.5)} />
                <View style={{ height: myHeight(0.1), width: '80%', backgroundColor: myColors.offColor }} />
                <Spacer paddingT={myHeight(1.5)} />

                <TouchableOpacity style={{ overflow: 'hidden' }} activeOpacity={0.75} onPress={() => {
                    onChange()
                    onHide()
                }}>
                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.bodyBold,
                        fontSize: myFontSize.medium2
                    }]}> Change </Text>
                </TouchableOpacity>

                <Spacer paddingT={myHeight(3)} />

            </Animated.View>
        </View>

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
