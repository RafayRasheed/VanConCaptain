import { useEffect, useRef, useState } from "react"
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { myFontSize, myFonts, myLetSpacing } from "../../ultils/myFonts"
import { myColors } from "../../ultils/myColors"
import { MyError, Spacer, ios, myHeight, myWidth, printWithPlat } from "../common"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
// import Flag from './account.component/Email_select';
import firestore from '@react-native-firebase/firestore';
import { FirebaseUser } from "../functions/firebase"


export const SignIn = ({ navigation }) => {
    const ref = useRef()
    const [email, setEmail] = useState(null)
    const [password, setPass] = useState(null)
    const [verifyLog, setVerifyLog] = useState(false)
    const [hidePass, setHidePass] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        if (errorMessage) {
            setTimeout(() => {
                setErrorMessage(null)
            }, 2000)
        }
    }, [errorMessage])

    useEffect(() => {
        if (verifyLog) {
            navigation.replace('HomeBottomNavigator')

        }
    }, [verifyLog])

    const onLogin = () => {
        if (verifyEmail() && verifyPass()) {
            setVerifyLog(true)
            onLoginFirebase()
        }
        else {
            setVerifyLog(false)
        }
    }


    function verifyEmail() {
        if (email) {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if (reg.test(email)) {
                return true
            }
            setErrorMessage('Please Enter a Valid Email')
            return false
        }
        setErrorMessage('Please Enter a Email')
        return false
    }
    function verifyPass() {
        if (password) {
            return true
        }
        setErrorMessage('Please Enter a Password')
        return false
    }

    // useEffect(() => {
    //     if (verifyEmail() && verifyPass()) {
    //         setVerifyLog(true)
    //     }
    //     else {
    //         setVerifyLog(false)
    //     }
    // }, [Email, password])

    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.selectionColor = 'red';
    function onLoginFirebase() {
        FirebaseUser.doc('ABD').set({
            name: 'matg'
        }).then((res) => console.log('y')).catch((err) => console.log(err))
    }
    return (
        <SafeAreaView style={styles.container}>
            {errorMessage && <MyError message={errorMessage} />}
            <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
                {/* Content */}
                <View>
                    <View style={styles.containerContent}>
                        <Spacer paddingT={myHeight(6.5)} />
                        {/* Text Portion */}
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.textSignIn}>Sign In</Text>
                            <Spacer paddingT={myHeight(0.75)} />
                            <Text style={styles.textWelcome}>Welcome back! Please enter your details</Text>
                        </View>

                        <Spacer paddingT={myHeight(4.4)} />
                        {/* Input Portion */}
                        <View>
                            {/* Email Portion */}
                            <View style={styles.containerInputPortion}>
                                <Image style={styles.imageInput} source={require('../assets/account/iEmail.png')} />
                                <Spacer paddingEnd={myWidth(2.5)} />
                                <TextInput placeholder=" Email Address"
                                    autoCapitalize='none'
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primaryT}
                                    style={styles.containerInput} cursorColor={myColors.primaryT}
                                    value={email} onChangeText={setEmail}
                                    autoCorrect={false} />
                            </View>
                            <Spacer paddingT={myHeight(2)} />

                            {/* Password Portion */}
                            <View style={styles.containerInputPortion}>
                                <Image style={styles.imageInput} source={require('../assets/account/iPass.png')} />
                                <Spacer paddingEnd={myWidth(1.8)} />
                                <TextInput placeholder="Password"
                                    secureTextEntry={hidePass}
                                    password={true}
                                    autoCorrect={false}
                                    textContentType='password'
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primaryT}
                                    style={styles.containerInput} cursorColor={myColors.primaryT}
                                    value={password} onChangeText={setPass}
                                />
                                <TouchableOpacity activeOpacity={0.6} onPress={() => setHidePass(!hidePass)}>
                                    <Image style={styles.imageEye}
                                        source={hidePass ? require('../assets/account/eyeC.png') : require('../assets/account/eyeO.png')} />
                                </TouchableOpacity>
                            </View>
                            {/* <Spacer paddingT={myHe ight(0.5)} /> */}

                            <TouchableOpacity style={{ alignSelf: 'flex-end', paddingEnd: myWidth(1), paddingVertical: myHeight(0.7) }}
                                onPress={() => navigation.navigate('ForgotPassword')} activeOpacity={0.6} >
                                <Spacer paddingT={myHeight(0.5)} />
                                <Text style={styles.textForgot}>Forgot Password?</Text>
                                <Spacer paddingT={myHeight(1)} />

                            </TouchableOpacity>
                        </View>
                        <Spacer paddingT={myHeight(2.6)} />

                        {/* Sign Button */}
                        <TouchableOpacity activeOpacity={0.6} onPress={onLogin} style={styles.containerSign}
                            onLongPress={() => navigation.replace('HomeBottomNavigator')}>
                            <Text style={styles.textSignInBu}>Sign in</Text>
                        </TouchableOpacity>
                    </View>

                    <Spacer paddingT={myHeight(4.3)} />

                    {/* Or sign with */}
                    <View style={styles.containerOrSignWith}>
                        <View style={styles.containerLine} />
                        <Text style={styles.textSignWith}>Or sign in with</Text>
                        <View style={styles.containerLine} />
                    </View>
                    <Spacer paddingT={myHeight(4.3)} />

                    {/* Social Portion */}
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        {/* Google Button */}
                        <TouchableOpacity activeOpacity={0.6} onPress={() => null}
                            style={styles.containerSocial}>

                            <Image style={styles.imageSocial} source={require('../assets/account/google.png')} />
                        </TouchableOpacity>
                        {/* Facebook Button */}
                        <Spacer paddingEnd={myWidth(4.4)} />

                        <TouchableOpacity activeOpacity={0.6} onPress={() => null}
                            style={styles.containerSocial}>

                            <Image style={styles.imageSocial} source={require('../assets/account/facebook.png')} />
                        </TouchableOpacity>
                        <Spacer paddingEnd={myWidth(4.4)} />
                        {/* Apple Button */}
                        <TouchableOpacity activeOpacity={0.6} onPress={() => null}
                            style={styles.containerSocial}>
                            <Image style={styles.imageSocial} source={require('../assets/account/apple.png')} />
                        </TouchableOpacity>
                    </View>
                    <Spacer paddingT={myHeight(3.3)} />

                    {/* Dont have an Acc*/}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.textDontHaveAcc}>Don't have an account? </Text>

                        <TouchableOpacity activeOpacity={0.6}
                            onPress={() => {
                                navigation.navigate('SignUp')
                                setErrorMessage(null)
                            }}>
                            <Spacer paddingT={myHeight(1)} />

                            <Text style={styles.textSignUp}>Sign Up!</Text>
                            <Spacer paddingT={myHeight(1)} />

                        </TouchableOpacity>
                    </View>

                    {/* <Spacer paddingT={myHeight(20)} /> */}
                </View>

                {/* Terms & Policy */}
                <View style={styles.containerTermCond}>
                    {/* First line */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.replace('StartupNavigator')}>
                            <Spacer paddingT={myHeight(1)} />
                            <Text style={styles.textTermCondColor}>Terms & Conditions </Text>
                        </TouchableOpacity>

                        <Text style={styles.textTermCond}>and </Text>

                        <TouchableOpacity activeOpacity={0.6} onPress={() => null}>
                            <Spacer paddingT={myHeight(1)} />
                            <Text style={styles.textTermCondColor}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Second Line */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                        <Text style={styles.textTermCond}>Copyrights 2023 </Text>

                        <TouchableOpacity activeOpacity={0.6} onPress={() => null}>
                            <Text style={styles.textTermCondColor}>M-Rides Inc</Text>
                            <Spacer paddingT={myHeight(0.7)} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: myColors.background
    },
    containerContent: {
        // flex: 1,
        // justifyContent: 'space-around',
        paddingHorizontal: myWidth(10),

    },
    containerInputPortion: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: myHeight(1.47),
        paddingHorizontal: myWidth(2.5),
        borderWidth: myHeight(0.1),
        borderColor: myColors.primary,
        backgroundColor: myColors.background,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,

    },
    containerInput: {
        flex: 1,
        textAlignVertical: 'center',
        paddingVertical: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(0.8) : myHeight(0.1),
        fontSize: myFontSize.body,
        color: myColors.text,
        includeFontPadding: false,
        fontFamily: myFonts.bodyBold,
        textAlignVertical: 'center',
        paddingHorizontal: 0,
    },
    containerSign: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: myColors.primaryT,
        paddingVertical: myHeight(1.2),
        borderRadius: myWidth(2.2),
    },
    containerOrSignWith: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
        paddingHorizontal: myWidth(4.6),
    },
    containerLine: {
        flex: 1,
        borderTopWidth: myHeight(0.15),
        borderColor: myColors.dot,
    },
    containerSocial: {
        paddingHorizontal: myWidth(4.18),
        paddingVertical: myHeight(0.6),
        borderRadius: myWidth(1),
        borderWidth: myHeight(0.09),
        borderColor: myColors.primaryT,
    },

    containerTermCond: {
        justifyContent: 'center',
        alignItems: 'center',
    },



    //Text
    textTermCond: {
        fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.bodyBold,
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

    textTermCondColor: {
        fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.bodyBold,
        color: myColors.primaryT,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },
    textForgot: {
        fontSize: myFontSize.body2,
        fontFamily: myFonts.body,
        color: myColors.textL4,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },
    textSignIn: {
        fontSize: myFontSize.xMedium,
        fontFamily: myFonts.bodyBold,
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },
    textWelcome: {
        fontSize: myFontSize.body,
        fontFamily: myFonts.bodyBold,
        color: myColors.offColor,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },
    textSignInBu: {
        fontSize: myFontSize.body2,
        fontFamily: myFonts.headingBold,
        color: myColors.background,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },
    textSignWith: {
        fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.heading,
        color: myColors.text,
        paddingHorizontal: myWidth(2.3),
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },
    textDontHaveAcc: {
        fontSize: myFontSize.body,
        fontFamily: myFonts.body,
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

    textSignUp: {
        fontSize: myFontSize.body,
        fontFamily: myFonts.heading,
        color: myColors.primaryT,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },



    //Image 
    imageInput: {
        height: myHeight(2.2),
        width: myHeight(2.2),
        resizeMode: 'contain',

        tintColor: myColors.primaryT

    },
    imageSocial: {
        height: myHeight(3.76),
        width: myHeight(3.76),
        resizeMode: 'contain',
    },
    imageEye: {
        height: myHeight(2.5),
        width: myHeight(2.5),
        resizeMode: 'contain',
        tintColor: myColors.primaryT

    }


})