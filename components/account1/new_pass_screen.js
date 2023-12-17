import React, { useEffect, useState } from "react";
import { StyleSheet, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { errorTime, ios, Loader, MyError, myHeight, myWidth, Spacer } from "../common";
import { myFontSize, myFonts } from "../../ultils/myFonts";
import { myColors } from "../../ultils/myColors";
import { deccodeInfo, encodeInfo } from "../functions/functions";
import firestore from '@react-native-firebase/firestore';
import { FirebaseUser } from "../functions/firebase";


export const NewPass = ({ navigation, route }) => {
    const [newPass, setNewPass] = useState()
    const [conPass, setConPass] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [hidePass, setHidePass] = useState(true);
    const [hideConPass, setHideConPass] = useState(true);
    const { profile } = route.params



    function showError(message) {
        setIsLoading(false)
        setErrorMessage(message)
    }
    useEffect(() => {
        if (errorMessage) {
            setTimeout(() => {
                setErrorMessage(null)
            }, errorTime)
        }
    }, [errorMessage])

    function goToDone() {
        setIsLoading(false)
        navigation.replace('DonePass')
    }

    function changePassword() {
        setIsLoading(true)
        FirebaseUser.doc(profile.uid)
            .update({
                password: encodeInfo(newPass),
            })
            .then(() => {
                goToDone()
            }).catch(err => {
                showError('Something wrong')
                console.log('Internal error while Updating a Password')
            });
    }
    function verifyNewPass() {
        if (newPass) {
            if (newPass.length > 5) {
                const reg = /(?=.*[a-zA-Z])(?=.*\d)/
                if (reg.test(newPass)) {
                    if (newPass != deccodeInfo(profile.password)) {
                        return true
                    }
                    showError('Use different password with the previous')
                    return false
                }
                showError('Password must contain letter and a number')
                return false
            }
            showError('Password must be at least 6 character')
            return false
        }
        showError('Please Enter a Password')
        return false
    }
    function verifyConPass() {
        if (conPass) {
            if (conPass == newPass) {
                return true
            }
            showError('Password Do Not Match')
            return false
        }
        showError('Please a Password Again')
        return false
    }


    function onReset() {
        if (verifyNewPass() && verifyConPass()) {
            changePassword()
        }

    }

    return (
        <>
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', }} style={styles.container}>

                <View style={{ paddingHorizontal: myWidth(6.4) }}>
                    <Spacer paddingT={myHeight(4)} />

                    {/* T ForgetPass */}
                    <Text style={styles.textForget}>Change New Password</Text>
                    <Text style={[styles.textLight, { fontSize: myFontSize.body }]}>Enter a different password with the previous</Text>

                    <Spacer paddingT={myHeight(5)} />
                    {/* New Pass */}
                    <View >
                        <Text style={[styles.heading, { color: newPass ? myColors.textL4 : myColors.text }]}>New Password</Text>
                        <View style={styles.containerInput}>

                            <TextInput placeholder="New Password"
                                placeholderTextColor={myColors.textL4}
                                secureTextEntry={hidePass}
                                style={styles.input} cursorColor={myColors.primary}
                                value={newPass} onChangeText={setNewPass}
                                autoCapitalize="none"

                            />
                            <TouchableOpacity activeOpacity={0.6} onPress={() => setHidePass(!hidePass)}>
                                <Image style={styles.imageEye}
                                    source={hidePass ? require('../assets/account/eyeC.png') : require('../assets/account/eyeO.png')} />
                            </TouchableOpacity>
                        </View>

                    </View>

                    <Spacer paddingT={myHeight(1)} />
                    {/* Con Pass */}
                    <View >
                        <Text style={[styles.heading, { color: conPass ? myColors.textL4 : myColors.text }]}>Confirm Password</Text>
                        <View style={styles.containerInput}>

                            <TextInput placeholder="Confirm Password"
                                secureTextEntry={hideConPass}
                                placeholderTextColor={myColors.textL4}
                                style={styles.input} cursorColor={myColors.primary}
                                value={conPass} onChangeText={setConPass}
                                autoCapitalize="none"

                            />
                            <TouchableOpacity activeOpacity={0.6} onPress={() => setHideConPass(!hideConPass)}>
                                <Image style={styles.imageEye}
                                    source={hideConPass ? require('../assets/account/eyeC.png') : require('../assets/account/eyeO.png')} />
                            </TouchableOpacity>
                        </View>

                    </View>



                </View>
                <View style={{ alignItems: 'center' }}>
                    {/* Button Submit */}
                    <TouchableOpacity onPress={onReset} activeOpacity={0.8}
                        style={styles.button}>
                        <Text style={styles.textReg}>Reset Password</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
            {isLoading && <Loader />}
            {errorMessage && <MyError message={errorMessage} />}
        </>
    )
}

const styles = StyleSheet.create({
    heading: {
        paddingStart: myWidth(0.7), paddingVertical: myHeight(0.8),
        fontFamily: myFonts.heading,
        fontSize: myFontSize.body,
    },
    container: {
        flex: 1, backgroundColor: myColors.background,
        paddingVertical: myHeight(8.6)
    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: myWidth(2.5),
        paddingHorizontal: myWidth(2),
        borderWidth: myHeight(0.12),
        borderColor: myColors.textL4,
        backgroundColor: myColors.background,
    },
    input: {
        flex: 1,
        textAlignVertical: 'center',
        paddingVertical: ios ? myHeight(1) : myHeight(100) > 600 ? myHeight(0.8) : myHeight(0.2),
        fontSize: myFontSize.body,
        color: myColors.text,
        includeFontPadding: false,
        fontFamily: myFonts.bodyBold,
    },
    textForget: {
        fontFamily: myFonts.heading, fontSize: myFontSize.large, color: myColors.text,
        paddingVertical: myHeight(0)
    },
    textLight: {
        fontFamily: myFonts.bodyBold, color: myColors.textL4, fontSize: myFontSize.medium
    },
    textLight2: {
        fontFamily: myFonts.bodyBold, color: myColors.textL4, fontSize: myFontSize.body,
        paddingStart: myWidth(3.3)
    },
    textSign: {
        fontFamily: myFonts.heading, color: myColors.textL, fontSize: myFontSize.body,
    },
    textReg: {
        color: myColors.background, fontFamily: myFonts.headingBold,
        fontSize: myFontSize.body
    },
    button: {
        height: myHeight(6.1), width: myWidth(86),
        borderRadius: myHeight(1.47), alignItems: 'center',
        justifyContent: 'center', flexDirection: 'row',
        backgroundColor: myColors.primary
    },
    imageEye: {
        height: myHeight(2.8),
        width: myHeight(2.8),
        paddingHorizontal: myWidth(4),
        resizeMode: 'contain',
        tintColor: myColors.primaryT

    }
})

const styles2 = (verifyPass) => StyleSheet.create({
    textReg: {
        color: verifyPass ? myColors.background : myColors.textL4, fontFamily: myFonts.headingBold,
        fontSize: myFontSize.body
    },
    button: {
        height: myHeight(6.1), width: myWidth(86),
        borderRadius: myHeight(1.47), alignItems: 'center',
        justifyContent: 'center', flexDirection: 'row',
        backgroundColor: verifyPass ? myColors.primary : myColors.offColor3
    }
})