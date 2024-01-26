import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView, StyleSheet, TouchableOpacity, Image,
    View, Text, StatusBar, TextInput, Alert,
    Linking, Platform, ImageBackground, SafeAreaView, FlatList,
} from 'react-native';
import { Loader, MyError, NotiAlertNew, Spacer, StatusbarH, errorTime, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { useDispatch, useSelector } from 'react-redux';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import storage from '@react-native-firebase/storage';
import { ImageUri } from '../common/image_uri';
import { ChangeImageView } from './profile_component/change_image_modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CalenderDate } from './profile_component/calender';
import Collapsible from 'react-native-collapsible';
import firestore from '@react-native-firebase/firestore';
import { setProfile } from '../../redux/profile_reducer';
import { FirebaseUser } from '../functions/firebase';
import { setErrorAlert } from '../../redux/error_reducer';

export const DriverDetailEdit = ({ navigation }) => {
    const disptach = useDispatch()
    const temp = [
        {
            day: 'Mon',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Tue',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Wed',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Thu',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Fri',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Sat',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Sun',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
    ]
    // const [, set] = useState(true)
    const { profile } = useSelector(state => state.profile)

    const [isLoading, setIsLoading] = useState(false)


    const [vehicleName, setVehicleName] = useState(profile.vehicleName ? profile.vehicleName : null)
    const [vehicleModal, setVehicleModal] = useState(profile.vehicleModal ? profile.vehicleModal : null)
    const [description, SetDescription] = useState(profile.description)
    const [vehicleImage, setVehicleImage] = useState(profile.vehicleImage ? profile.vehicleImage : null);

    const [packages, setPackages] = useState(profile.packages ? [...profile.packages] : [])

    const [offer, Setoffer] = useState(profile.deal)
    const [DeliveryFee, SetDeliveryFee] = useState(profile.deliveryCharges ? profile.deliveryCharges.toString() : null)
    const [DeliveryTime, SetDeliveryTime] = useState(profile.delivery)
    const [address, setAddress] = useState(profile.location)
    const [locLink, setLocLink] = useState(profile.locationLink);
    const [MenuImages, setMenuImages] = useState(profile.menu ? profile.menu : [])
    const [timmings, setTimmings] = useState(profile.timmings ? profile.timmings : temp)

    const [imageLoading, setImageLoading] = useState(null)

    const [showTimeModal, setShowTimeModal] = useState(false)
    const [isEditMode, setIsEditMode] = useState(!profile.update)
    const [errorMsg, setErrorMsg] = useState(null)
    const [change, setChange] = useState(null)
    const [showChangeModal, setShowChangeModal] = useState(false)


    function checkPackages() {
        if (packages.length) {
            // if (Delivery) {
            //     if (DeliveryFee) {
            //         if (isNaN(DeliveryFee) || DeliveryFee < 0) {
            //             setErrorMsg('Invalid Delivery Charges')
            //             return false
            //         }
            //     }
            //     else {

            //         setErrorMsg('Please Enter Delivery Charges')
            //         return false
            //     }
            //     if (DeliveryTime) {
            //         if (isNaN(DeliveryTime) || DeliveryTime < 0) {
            //             setErrorMsg('Invalid DeliveryTime')
            //             return false
            //         }
            //     }
            //     else {

            //         setErrorMsg('Please Enter Delivery Time in Minutes')
            //         return false
            //     }
            // }


            return true
        } else {
            setErrorMsg('Please Select Customer Packages')
            return false
        }
    }
    function checkDescription() {
        if (description) {
            if (description.length < 20) {
                setErrorMsg('Enter Description Minimum 20 Characters')
                return false
            }
            return true
        }
        setErrorMsg('Please Add Description')
        return false
    }
    function checkNameAndModal() {
        if (vehicleName) {

            if (vehicleModal) {
                const date = new Date()

                if (!isNaN(vehicleModal) && vehicleModal.length == 4 && (parseInt(vehicleModal) <= parseInt(date.getFullYear()))) {
                    return true
                }
                setErrorMsg('Incorrect Vehicle Modal')
                return false
            }
            setErrorMsg('Please Enter Vehicle Modal')
            return false

        }
        setErrorMsg('Please Add Vehicle Name')
        return false
    }
    function checkTimmings() {
        let s = true
        timmings.map(time => {
            if (time.open && (!time.startTime || !time.endTime)) {
                s = false
            }
        })
        return s
    }
    function checkData() {

        if (!vehicleImage) {
            setErrorMsg('Please Upload Car Image')
            return false
        }

        if (!checkNameAndModal()) {
            return false
        }
        if (!checkDescription()) {
            return false
        }
        if (!checkPackages()) {
            return false
        }
        // if (!address) {

        //     setErrorMsg('Please Enter Resturant Address')
        //     return true
        // }
        // if (!checkTimmings()) {
        //     setErrorMsg('Select Times Of All Day If Open')
        //     return false
        // }

        return true
    }

    function onSave() {
        if (checkData()) {

            setIsLoading(true)
            const newProfile = {
                ...profile,
                description,
                packages,
                vehicleImage,
                vehicleName,
                vehicleModal,
                // menu: MenuImages ? MenuImages : [],
                // location: address ? address : null,
                // locationLink: locLink ? locLink : null,
                // delivery: DeliveryTime ? DeliveryTime : null,
                // deliveryCharges: DeliveryFee ? parseFloat(DeliveryFee) : null,
                // deal: offer ? offer : null,
                // timmings: timmings,
                // rating: profile.rating ? profile.rating : 0,
                // noOfRatings: profile.noOfRatings ? profile.noOfRatings : 0,
                // reviews: profile.reviews ? [...profile.reviews] : [],
                // ratingTotal: profile.ratingTotal ? profile.ratingTotal : 0,
                // update: true,
                // foodCategory: profile.foodCategory ? profile.foodCategory : [],
                // categories: profile.categories ? profile.categories : [],
                // subCategories: profile.subCategories ? profile.subCategories : [],
                // icon: profile.icon ? profile.icon : 'https://firebasestorage.googleapis.com/v0/b/foodapp-edd7e.appspot.com/o/default%2Ficon.png?alt=media&token=575dea1f-76be-4585-8866-963f20ede519',

            }

            // setAddress(JSON.stringify(newProfile))
            FirebaseUser.doc(profile.uid)
                .update(newProfile)
                .then(() => {
                    setIsLoading(false)
                    disptach(setErrorAlert({ Title: "Profile Updated Successfully", Status: 2 }))
                    disptach(setProfile(newProfile))
                    navigation.goBack()



                }).catch(err => {
                    setErrorMsg('Something wrong')
                    console.log('Internal error while Updating a Restaurant')
                });


        }
        //  else {
        //     setIsEditMode(true)
        // }

    }

    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                setIsLoading(false)
                setErrorMsg(null)
            }
                , errorTime)
        }
    }, [errorMsg])

    async function chooseFile() {
        const options = {
            mediaType: 'photo',
            selectionLimit: 1,
        }
        // launchCamera(options, callback => {
        //     if (callback.assets) {
        //         console.log(callback.assets)
        //     }
        //     else if (callback.didCancel) {
        //         console.log('didCancel')
        //     }
        //     else if (callback.errorCode) {
        //         console.log('errorCode')
        //     }

        // });

        launchImageLibrary(options, callback => {
            if (callback.assets) {
                const asset = callback.assets[0]
                const sizeKB = asset.fileSize / 1000000
                console.log(sizeKB)
                const source = asset.uri
                if (sizeKB <= 1) {
                    setImageLoading('vehicle')
                    // setVehicleImage(source);
                    uploadImage(source, 'vehicle')

                }
                else {
                    setErrorMsg(`Maximum Image Size is 1 MB`)
                }
                // console.log(source);
            }
            else if (callback.didCancel) {
                console.log('didCancel')
            }
            else if (callback.errorCode) {
                console.log('errorCode')
            }

        });


    };

    async function chooseFileMenu(i) {
        const options = {
            mediaType: 'photo',
            selectionLimit: 1,
        }
        // launchCamera(options, callback => {
        //     if (callback.assets) {
        //         console.log(callback.assets)
        //     }
        //     else if (callback.didCancel) {
        //         console.log('didCancel')
        //     }
        //     else if (callback.errorCode) {
        //         console.log('errorCode')
        //     }

        // });

        launchImageLibrary(options, callback => {
            if (callback.assets) {
                const asset = callback.assets[0]
                const sizeKB = asset.fileSize / 1000000
                const source = asset.uri
                if (sizeKB <= 1) {
                    if (i != null) {
                        setImageLoading(i + 1)

                        const name = 'menu' + i.toString()
                        uploadImage(source, name, i)


                    } else {
                        setImageLoading('new')

                        const name = 'menu' + MenuImages.length.toString()


                        uploadImage(source, name, i)
                    }



                }
                else {
                    setErrorMsg(`Maximum Image Size is 1 MB`)
                }
                // console.log(source);
            }
            else if (callback.didCancel) {
                console.log('didCancel')
            }
            else if (callback.errorCode) {
                console.log('errorCode')
            }
        });


    };

    const uploadImage = async (uri, name, i) => {
        const path = `images/drivers/${profile.uid}/${name}`
        storage()
            .ref(path)
            .putFile(uri)
            .then((s) => {
                storage().ref(path).getDownloadURL().then((uri) => {
                    if (name == 'vehicle') {

                        setVehicleImage(uri)
                        setImageLoading(null)
                        console.log('uri recieved background', uri)

                    } else {
                        // MenuImagesURI.push(uri)
                        // setMenuImagesURI(MenuImagesURI)
                        // console.log('uri recieved' + name)
                        if (i != null) {
                            let copy = [...MenuImages]
                            copy[i] = uri
                            setMenuImages(copy)

                            console.log('uri recieved ', name, typeof i)

                            setChange(!change)

                        } else {

                            let copy = [...MenuImages]
                            copy.push(uri)
                            setMenuImages(copy)
                            console.log('uri recieved ', name)

                        }
                        setImageLoading(null)

                    }

                }).catch((e) => {
                    setImageLoading(null)
                    setErrorMsg('Something Wrong')

                    console.log('er', e)

                })

            }).catch((e) => {
                setImageLoading(null)
                setErrorMsg('Something Wrong')

                console.log('er', e)

            })

        // try {
        //     await task;
        // } catch (e) {
        //     console.error(e);
        // }

    };

    // For Packages
    const CommonFaciPackage = ({ name }) => {
        const fac = packages.findIndex(it => it == name) != -1
        return (
            <TouchableOpacity activeOpacity={0.75}
                onPress={() => {
                    if (fac) {
                        setPackages(packages.filter(it => it != name))
                    } else {
                        setPackages([name, ...packages])
                    }
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
                                height: myHeight(3.3),
                                width: myHeight(3.3),
                                resizeMode: 'contain',
                                tintColor: myColors.primaryT,
                                marginTop: -myHeight(3.1)
                            }} source={require('../assets/profile/check.png')} />
                        }
                    </View>
                    {/* <Spacer paddingEnd={myWidth(0.3)} /> */}
                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.bodyBold,
                        fontSize: myFontSize.xBody,

                    }]}>{name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
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
                            height: myHeight(3.3),
                            width: myHeight(3.3),
                            resizeMode: 'contain',
                            tintColor: myColors.primaryT,
                            marginTop: -myHeight(3.1)
                        }} source={require('../assets/profile/check.png')} />
                    }
                </View>
                {/* <Spacer paddingEnd={myWidth(0.3)} /> */}
                <Text style={[styles.textCommon,
                {
                    fontFamily: myFonts.bodyBold,
                    fontSize: myFontSize.body3,

                }]}>{name}</Text>
            </View>
        </TouchableOpacity>
    )

    const verifyLink = async () => {
        const text = '2'
        const isValid = text.toString().includes(('https' || 'http') && 'maps')
        //    (https|http)maps
        if (isValid) {
            setLocLink(text)
            return
        } else {

            setErrorMsg('Invalid Url')
        }

        // setLocLink(text);
    };
    function onChangeImage(param) {
        chooseFileMenu(param)
    }
    function onViewImage() {
        navigation.navigate("ImageViewer", { images: [{ uri: vehicleImage }], i: 0 })
    }


    function onPaste() {
        if (locLink) {
            setLocLink(null)
            return
        }
        verifyLink()
    }

    const TimingsCom = ({ i }) => {
        const single = timmings[i]
        return (
            <View key={i} style={{ marginVertical: myHeight(1), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.textCommon,
                {
                    flex: 1,
                    fontFamily: myFonts.body,
                    fontSize: myFontSize.xxBody,
                    color: myColors.text,
                    textAlignVertical: 'center',
                    // marginTop: -myHeight(0.5)

                }]}>{single.day}</Text>


                {
                    single.open &&

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <TouchableOpacity activeOpacity={0.7} onPress={() => {
                            setShowTimeModal({ i, start: true, current: single.startCurrent })
                        }} style={{
                            paddingVertical: myHeight(0.8), paddingHorizontal: myWidth(2),
                            backgroundColor: myColors.offColor7, borderRadius: 7
                        }}>
                            <Text numberOfLines={1} style={[styles.textCommon,
                            {
                                fontFamily: myFonts.bodyBold,
                                fontSize: myFontSize.body,
                                minWidth: myFontSize.body + myWidth(13),
                                textAlign: 'center',
                                color: single.startTime ? myColors.text : myColors.textL4

                            }]}>{single.startTime ? single.startTime : 'SELECT'}</Text>
                        </TouchableOpacity>

                        <Spacer paddingEnd={myWidth(1)} />
                        <Text numberOfLines={1} style={[styles.textCommon,
                        {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.body,

                        }]}>-</Text>
                        <Spacer paddingEnd={myWidth(1)} />

                        <TouchableOpacity activeOpacity={0.7} onPress={() => {
                            setShowTimeModal({ i, start: false, current: single.endCurrent })
                        }} style={{

                            paddingVertical: myHeight(0.8), paddingHorizontal: myWidth(2),
                            backgroundColor: myColors.offColor7, borderRadius: 7
                        }}>
                            <Text numberOfLines={1} style={[styles.textCommon,
                            {
                                fontFamily: myFonts.bodyBold,
                                fontSize: myFontSize.body,
                                minWidth: myFontSize.body + myWidth(13),
                                textAlign: 'center',
                                color: single.endTime ? myColors.text : myColors.textL4

                            }]}>{single.endTime ? single.endTime : 'SELECT'}</Text>
                        </TouchableOpacity>
                    </View>

                }


                <Spacer paddingEnd={myWidth(4)} />

                {/* Button */}
                <TouchableOpacity activeOpacity={0.7}
                    onPress={() => {
                        const copy = [...timmings]
                        copy[i].open = !single.open

                        setTimmings(copy)
                        setChange(!change)


                    }} style={{
                        paddingVertical: myHeight(0.8), paddingHorizontal: myWidth(4),
                        borderRadius: 5,
                        backgroundColor: single.open ? myColors.primaryT : 'red',
                    }}>
                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.body,
                        fontSize: myFontSize.body,
                        color: myColors.background

                    }]}>{single.open ? 'Open' : 'Close'}</Text>

                </TouchableOpacity>


            </View>
        )
    }

    function isFirstTime(isStart) {
        if (isStart) {
            const fil = timmings.filter(time => time.startTime.length > 0)
            return fil.length == 0
        }
        else {
            const fil = timmings.filter(time => time.endTime.length > 0)
            return fil.length == 0
        }

    }

    function checkTime(val, date, content) {
        const isFirst = isFirstTime(content.start)
        let copy = timmings
        if (content.start) {
            if (isFirst) {
                copy = []
                timmings.map(time => {
                    const newDay = {
                        ...time,
                        startTime: val,
                        startCurrent: date,
                    }
                    copy.push(newDay)
                })

            }
            else {

                copy[content.i].startTime = val
                copy[content.i].startCurrent = date
            }

        }
        else {
            if (isFirst) {
                copy = []
                timmings.map(time => {
                    const newDay = {
                        ...time,
                        endTime: val,
                        endCurrent: date,
                    }
                    copy.push(newDay)
                })

            }
            else {
                copy[content.i].endTime = val
                copy[content.i].endCurrent = date
            }
        }
        setTimmings(copy)
        setChange(!change)
    }
    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background }}>
                <StatusbarH />
                {/* Top */}
                <View>
                    <Spacer paddingT={myHeight(1.5)} />
                    <View style={{ paddingEnd: myWidth(4), flexDirection: 'row', alignItems: 'center' }}>
                        {/* Search */}

                        {/* Arrow */}
                        <TouchableOpacity activeOpacity={0.7}
                            onPress={() => navigation.goBack()} style={{ paddingHorizontal: myWidth(4), }}>
                            <Image style={{
                                height: myHeight(2.4),
                                width: myHeight(2.4),
                                resizeMode: 'contain',
                                tintColor: myColors.textL0
                            }} source={require('../assets/home_main/home/back.png')} />
                        </TouchableOpacity>
                        {/* <Spacer paddingEnd={myWidth(2.5)} /> */}
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2
                        }]}>
                            Driver Details
                        </Text>
                    </View>
                    <Spacer paddingT={myHeight(1.5)} />

                    <View style={{ height: myHeight(0.6), backgroundColor: myColors.divider }} />
                </View>
                <KeyboardAwareScrollView
                    // scrollEnabled={isEditMode} 
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: myWidth(4) }} showsVerticalScrollIndicator={false}>


                    <Spacer paddingT={myHeight(1.5)} />
                    {/* Background Image */}
                    <TouchableOpacity disable={imageLoading == 'vehicle'}
                        activeOpacity={0.75} onPress={() => {
                            // if (vehicleImage) {
                            //     setShowChangeModal(true)
                            // }
                            // else {
                            //     chooseFile()
                            // }
                            chooseFile()

                            // onChangeImage()

                        }}
                        style={{
                            height: myHeight(20), justifyContent: 'center', alignItems: 'center',
                            borderRadius: myWidth(4), backgroundColor: myColors.offColor7
                        }}>
                        {
                            imageLoading == 'vehicle' ?
                                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: myColors.offColor7 }} >
                                    <Text style={[styles.textCommon,
                                    {
                                        fontFamily: myFonts.body,
                                        fontSize: myFontSize.body,
                                        textAlign: 'center'

                                    }]}>Loading...</Text>
                                </View>

                                :

                                vehicleImage ?
                                    <ImageUri width={'100%'} height={'100%'} resizeMode='cover' borderRadius={0} uri={vehicleImage} />
                                    :
                                    <View>

                                        <Text style={[styles.textCommon,
                                        {
                                            fontFamily: myFonts.body,
                                            fontSize: myFontSize.body4,

                                        }]}>
                                            Upload Vehicle Image *
                                        </Text>
                                        <Text style={[styles.textCommon,
                                        {
                                            fontFamily: myFonts.body,
                                            fontSize: myFontSize.body,
                                            textAlign: 'center'

                                        }]}>
                                            (maximum size 1 MB)
                                        </Text>
                                    </View>
                        }

                    </TouchableOpacity>


                    <Spacer paddingT={myHeight(2.7)} />
                    {/* Vehicle Details */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Vehicle Details *</Text>
                        <Spacer paddingT={myHeight(1)} />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                borderRadius: myWidth(1.5),
                                flex: 1,
                                paddingVertical: myHeight(0.5),
                                paddingHorizontal: myWidth(3),
                                color: myColors.text,
                                backgroundColor: myColors.offColor7,
                                // borderWidth: 0.7,
                                // borderColor: myColors.primaryT
                            }}>

                                <TextInput placeholder="Vehicle Name Ex HiRoof"
                                    autoCorrect={false}
                                    maxLength={35}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={vehicleName} onChangeText={setVehicleName}
                                    style={{
                                        padding: 0,
                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />

                            </View>
                            <Spacer paddingEnd={myWidth(2)} />
                            <View style={{
                                borderRadius: myWidth(1.5),
                                width: myWidth(20),
                                paddingVertical: myHeight(0.5),
                                paddingHorizontal: myWidth(3),
                                color: myColors.text,
                                backgroundColor: myColors.offColor7,
                                // borderWidth: 0.7,
                                // borderColor: myColors.primaryT
                            }}>

                                <TextInput placeholder="Ex 2020"
                                    autoCorrect={false} maxLength={4}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={vehicleModal} onChangeText={setVehicleModal}
                                    keyboardType='numeric'
                                    style={{

                                        padding: 0,
                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />


                            </View>



                        </View>
                    </View>
                    <Spacer paddingT={myWidth(2.5)} />

                    {/* Description */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Description *</Text>
                        <Spacer paddingT={myHeight(1)} />
                        <TextInput placeholder="About yourself & services"
                            multiline={true}
                            autoCorrect={false}
                            maxLength={100}
                            numberOfLines={2}
                            placeholderTextColor={myColors.offColor}
                            selectionColor={myColors.primary}
                            cursorColor={myColors.primaryT}
                            value={description} onChangeText={SetDescription}
                            style={{
                                height: myFontSize.body * 2 + myHeight(6),
                                textAlignVertical: 'top',
                                borderRadius: myWidth(2),
                                width: '100%',
                                paddingBottom: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(0.8) : myHeight(0.1),
                                paddingTop: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(1.2) : myHeight(0.3),
                                fontSize: myFontSize.body,
                                color: myColors.text,
                                includeFontPadding: false,
                                fontFamily: myFonts.body,
                                paddingHorizontal: myWidth(3),
                                backgroundColor: myColors.offColor7
                            }}
                        />
                    </View>

                    <Spacer paddingT={myHeight(2)} />
                    {/* FAcilities */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Customer Packages *</Text>
                        <Spacer paddingT={myHeight(0.8)} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <CommonFaciPackage name={'Weekly'} />
                            <CommonFaciPackage name={'Monthly'} />
                            <CommonFaciPackage name={'Yearly'} />
                        </View>
                    </View>


                    {/* Delivery Charges & Time */}
                    <Collapsible collapsed={true}>
                        <Spacer paddingT={myHeight(2.7)} />

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.textCommon,
                            {
                                flex: 1,
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.xBody2,

                            }]}>Delivery Charges *</Text>


                            <View style={{
                                flexDirection: 'row',
                                borderRadius: myWidth(2),
                                width: myFontSize.body2 + myWidth(22),
                                paddingVertical: myHeight(0.2),
                                paddingHorizontal: myWidth(3),
                                color: myColors.text,
                                backgroundColor: myColors.offColor7,
                                borderWidth: 0.7,
                                borderColor: myColors.primaryT
                            }}>

                                <TextInput placeholder=""
                                    autoCorrect={false}
                                    placeholderTextColor={myColors.text}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    editable={false}
                                    style={{
                                        width: 0,
                                        padding: 0,
                                        textAlignVertical: 'center',

                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />
                                <TextInput placeholder="Ex 50"
                                    autoCorrect={false}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={DeliveryFee} onChangeText={SetDeliveryFee}
                                    keyboardType='numeric'
                                    style={{
                                        flex: 1,
                                        padding: 0,
                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />

                                <TextInput placeholder=" Rs"
                                    autoCorrect={false}
                                    placeholderTextColor={myColors.text}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    editable={false}
                                    style={{

                                        padding: 0,
                                        textAlignVertical: 'center',

                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />


                            </View>

                        </View>

                        <Spacer paddingT={myHeight(2.7)} />

                        {/* Delivery  Time */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.textCommon,
                            {
                                flex: 1,
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.xBody2,

                            }]}>Delivery Time *</Text>


                            <View style={{
                                flexDirection: 'row',
                                borderRadius: myWidth(2),
                                width: myFontSize.body2 + myWidth(22),
                                paddingVertical: myHeight(0.2),
                                paddingHorizontal: myWidth(3),
                                color: myColors.text,
                                backgroundColor: myColors.offColor7,
                                borderWidth: 0.7,
                                borderColor: myColors.primaryT
                            }}>

                                <TextInput placeholder=""
                                    autoCorrect={false}
                                    placeholderTextColor={myColors.text}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    editable={false}
                                    style={{
                                        width: 0,
                                        padding: 0,
                                        textAlignVertical: 'center',

                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />
                                <TextInput placeholder="Ex 50"
                                    autoCorrect={false}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={DeliveryTime} onChangeText={SetDeliveryTime}
                                    keyboardType='numeric'
                                    style={{
                                        flex: 1,
                                        padding: 0,
                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />

                                <TextInput placeholder=" Min"
                                    autoCorrect={false}
                                    placeholderTextColor={myColors.text}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    editable={false}
                                    style={{

                                        padding: 0,
                                        textAlignVertical: 'center',

                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />

                                {/* <Text style={[styles.textCommon,
                                    {
                                        flex: 1,
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body2,

                                    }]}>Min</Text> */}
                            </View>
                        </View>
                    </Collapsible>


                    <Spacer paddingT={myHeight(2)} />
                    {/* Location */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Location *</Text>
                        <Spacer paddingT={myHeight(1)} />
                        <TextInput placeholder="Type Restaurant Address"
                            multiline={true}
                            autoCorrect={false}
                            numberOfLines={2}
                            placeholderTextColor={myColors.offColor}
                            selectionColor={myColors.primary}
                            cursorColor={myColors.primaryT}
                            value={address} onChangeText={setAddress}
                            style={{
                                height: myFontSize.body * 2 + myHeight(6),
                                textAlignVertical: 'top',
                                borderRadius: myWidth(2),
                                width: '100%',
                                paddingBottom: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(0.8) : myHeight(0.1),
                                paddingTop: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(1.2) : myHeight(0.3),
                                fontSize: myFontSize.body,
                                color: myColors.text,
                                includeFontPadding: false,
                                fontFamily: myFonts.body,
                                paddingHorizontal: myWidth(3),
                                backgroundColor: myColors.offColor7
                            }}
                        />
                    </View>


                    <Spacer paddingT={myHeight(2.5)} />
                    {/* Link */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Map Link</Text>
                        <Spacer paddingT={myHeight(1)} />

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    flexGrow: 1,
                                    paddingVertical: myHeight(1.2), paddingHorizontal: myWidth(3),
                                    backgroundColor: myColors.offColor7, borderRadius: 5
                                }}>
                                <Text numberOfLines={1} style={[styles.textCommon,
                                {
                                    fontFamily: myFonts.bodyBold,
                                    fontSize: myFontSize.body3,
                                    color: locLink ? myColors.text : myColors.textL3

                                }]}>{locLink ? locLink : 'Ex: http://maps.google.com/..'}</Text>
                            </ScrollView>
                            <Spacer paddingEnd={myWidth(4)} />
                            <TouchableOpacity activeOpacity={0.7} onPress={onPaste} style={{
                                paddingVertical: myHeight(1), paddingHorizontal: myWidth(5),
                                backgroundColor: myColors.primaryT, borderRadius: 5
                            }}>
                                <Text style={[styles.textCommon,
                                {
                                    fontFamily: myFonts.body,
                                    fontSize: myFontSize.body3,
                                    color: myColors.background

                                }]}>{locLink ? 'Clear' : 'Paste'}</Text>

                            </TouchableOpacity>
                        </View>
                    </View>


                    <Spacer paddingT={myHeight(2.5)} />
                    {/* Timmings */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Timmings *</Text>
                        <Spacer paddingT={myHeight(1)} />
                        {
                            timmings.map((item, i) =>
                                <TimingsCom key={i} item={item} i={i} />
                            )
                        }
                    </View>


                    <Spacer paddingT={myHeight(2.5)} />
                    {/* Offer Tag */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Offer Tag</Text>
                        <Spacer paddingT={myHeight(1)} />
                        <View style={{
                            borderRadius: myWidth(1.5),
                            width: '100%',
                            paddingVertical: myHeight(0.2),
                            paddingHorizontal: myWidth(3),
                            color: myColors.text,
                            backgroundColor: myColors.offColor7,
                            // borderWidth: 0.7,
                            // borderColor: myColors.primaryT
                        }}>

                            <TextInput placeholder="Ex 30% OFF On Family Pack"
                                autoCorrect={false}
                                maxLength={30}
                                placeholderTextColor={myColors.offColor}
                                selectionColor={myColors.primary}
                                cursorColor={myColors.primaryT}
                                value={offer} onChangeText={Setoffer}
                                style={{
                                    flex: 1,
                                    padding: 0,
                                    backgroundColor: myColors.offColor7,

                                    // textAlign: 'center'
                                }}
                            />

                        </View>
                    </View>


                    <Spacer paddingT={myHeight(2.5)} />

                    {/* Menu Images */}
                    {/* <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Menu Images</Text>
                        <Spacer paddingT={myHeight(1)} />


                        <View style={{ flexDirection: 'row', }}>

                            {
                                MenuImages.map((image, index) =>


                                    <TouchableOpacity key={index} disabled={imageLoading && imageLoading == index + 1}
                                        activeOpacity={0.75} onPress={() => {
                                            chooseFileMenu(index)


                                        }}

                                        style={{
                                            height: myHeight(18), width: myWidth(28), justifyContent: 'center', alignItems: 'center',
                                            borderRadius: myWidth(4), backgroundColor: myColors.offColor7, marginEnd: myWidth(4)
                                        }}>
                                        {
                                            (imageLoading && imageLoading == index + 1) ?
                                                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: myColors.offColor7 }} >
                                                    <Text style={[styles.textCommon,
                                                    {
                                                        fontFamily: myFonts.body,
                                                        fontSize: myFontSize.body,
                                                        textAlign: 'center'

                                                    }]}>Loading...</Text>
                                                </View>
                                                :

                                                <ImageUri width={'100%'} height={'100%'} resizeMode='cover' borderRadius={0} uri={image} />
                                        }



                                    </TouchableOpacity>
                                )
                            }
                            {
                                MenuImages.length < 3 &&
                                <TouchableOpacity disabled={imageLoading && imageLoading == 'new'} activeOpacity={0.75} onPress={() => {
                                    chooseFileMenu(null)

                                }}
                                    style={{
                                        height: myHeight(18), width: myWidth(28), justifyContent: 'center', alignItems: 'center',
                                        borderRadius: myWidth(4), backgroundColor: myColors.offColor7,
                                    }}>



                                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>

                                        {
                                            (imageLoading && imageLoading == 'new') ?
                                                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: myColors.offColor7 }} >
                                                    <Text style={[styles.textCommon,
                                                    {
                                                        fontFamily: myFonts.body,
                                                        fontSize: myFontSize.body,
                                                        textAlign: 'center'

                                                    }]}>Loading...</Text>
                                                </View>
                                                :
                                                <Text style={[styles.textCommon,
                                                {
                                                    fontFamily: myFonts.bodyBold,
                                                    fontSize: myFontSize.body,
                                                    textAlign: 'center'


                                                }]}>
                                                    Upload
                                                </Text>
                                        }

                                    </View>


                                </TouchableOpacity>
                            }


                        </View>
                    </View> */}

                    <Spacer paddingT={myHeight(3)} />



                    {/* {
                        !isEditMode &&
                        <View style={{ height: '100%', width: myWidth(100), position: 'absolute', backgroundColor: '#00000015' }} />
                    } */}
                </KeyboardAwareScrollView>


                <View style={{ backgroundColor: myColors.background, }}>
                    <View style={{ height: 1, backgroundColor: myColors.offColor }} />

                    <Spacer paddingT={myHeight(3)} />

                    <TouchableOpacity onPress={onSave}
                        activeOpacity={0.8}
                        style={{
                            width: myWidth(92), alignSelf: 'center', paddingVertical: myHeight(1.3),
                            borderRadius: myHeight(1.4), alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'row', backgroundColor: myColors.primaryT,
                            // borderWidth: myHeight(0.15), borderColor: myColors.primaryT
                        }}>
                        <Text style={[styles.textCommon, {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.body3,
                            color: myColors.background
                        }]}>Save</Text>
                    </TouchableOpacity>

                    <Spacer paddingT={myHeight(3)} />

                </View>
                {showChangeModal &&

                    <ChangeImageView onChange={onChangeImage} onView={onViewImage} onHide={setShowChangeModal} />
                }
                {
                    showTimeModal &&
                    <CalenderDate show={setShowTimeModal} content={showTimeModal} value={checkTime} />
                }
                {errorMsg && <MyError message={errorMsg} />}

                {isLoading && <Loader />}

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