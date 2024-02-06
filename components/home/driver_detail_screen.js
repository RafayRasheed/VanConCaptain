import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView, StyleSheet, TouchableOpacity, Image,
  View, Text, StatusBar,
  Linking, Platform, ImageBackground, BackHandler, TextInput,
} from 'react-native';
import { Loader, MyError, Spacer, StatusBarHide, errorTime, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { ItemInfo } from './home.component/item_info';
import { useDispatch, useSelector } from 'react-redux';
import { addFavoriteRest, removeFavoriteRest } from '../../redux/favorite_reducer';
import { useFocusEffect } from '@react-navigation/native';
import { ImageUri } from '../common/image_uri';
import { dataFullData, deccodeInfo, getAllRestuarant } from '../functions/functions';
import Collapsible from 'react-native-collapsible';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { Stars } from './home.component/star';
import firestore from '@react-native-firebase/firestore';
import { all } from 'axios';
import { setErrorAlert } from '../../redux/error_reducer';

export const DriverDetail = ({ navigation, route }) => {
  const backScreen = route.params.backScreen
  const { profile } = useSelector(state => state.profile)

  const [driver, setDriver] = useState(profile);
  const [inside, setInside] = useState(false);
  const [starI, setStarI] = useState(undefined)
  const [review, setReview] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reviews, setReviews] = useState(driver.reviews)
  const [myReview, setMyRewiew] = useState()

  const dispatch = useDispatch()
  //Back Functions
  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        setIsLoading(false)
        setErrorMsg(null)
      }
        , errorTime)
    }
  }, [errorMsg])



  useEffect(() => {
    setDriver(profile)
  }, [profile])
  const onBackPress = () => {

    if (backScreen) {
      // navigation.navigate(backScreen, route.params.params)
      navigation.goBack()
      return true
    }

    return false
  };
  useFocusEffect(
    React.useCallback(() => {

      BackHandler.addEventListener(
        'hardwareBackPress', onBackPress
      );
      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress', onBackPress
        );
    }, [backScreen])
  );


  function back() {
    if (backScreen) {
      navigation.navigate(backScreen, route.params.params)
      return
    }
    navigation.goBack()
  }



  function changeFav() {

  }


  return (
    <View style={{ flex: 1, backgroundColor: myColors.background }}>

      <View style={{
        width: '100%',
        height: myHeight(28),

        borderBottomLeftRadius: myWidth(4),
        borderBottomRightRadius: myWidth(4),
        overflow: 'hidden',
      }} >
        <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={driver.vehicleImage} />

        {/* Back */}
        <TouchableOpacity
          style={{
            backgroundColor: myColors.background,
            padding: myHeight(1),
            borderRadius: myHeight(5),
            position: 'absolute',
            top: StatusBar.currentHeight + myHeight(0.6),
            left: myWidth(4),
          }}
          activeOpacity={0.8}
          onPress={back}>
          <Image
            style={{
              width: myHeight(2.6),
              height: myHeight(2.6),
              resizeMode: 'contain',
            }}
            source={require('../assets/home_main/home/back.png')}
          />
        </TouchableOpacity>

        <View style={{
          backgroundColor: 'transparent',
          position: 'absolute',
          top: StatusBar.currentHeight + myHeight(0.6),
          right: myWidth(4),
          flexDirection: 'row'
        }}>

          {/* Search */}
          {/* <TouchableOpacity
            style={{
              backgroundColor: myColors.background,
              padding: myHeight(1),
              borderRadius: myHeight(5),

            }}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ItemSearch', { items: allItems, driver })}>
            <Image
              style={{
                width: myHeight(2.6),
                height: myHeight(2.6),
                resizeMode: 'contain',
              }}
              source={require('../assets/home_main/home/search.png')}
            />
          </TouchableOpacity> */}

        </View>

      </View>

      {/* Content */}
      {/* Restuarant Info */}
      <TouchableOpacity disabled activeOpacity={0.96} onPress={() => navigation.navigate('RestaurantMoreDetails', { driver: driver })}
        style={{
          // height:'100%',
          //    position:'absolute', left:0,
          backgroundColor: myColors.background,
          marginTop: -myHeight(5.5),
          borderRadius: myHeight(3),
          borderTopStartRadius: myHeight(3),
          borderTopEndRadius: myHeight(3),
          marginHorizontal: myWidth(3.5),
          elevation: 10,
          paddingHorizontal: myWidth(4),

          //    backgroundColor:'#ffffff30'
        }}>
        {/* Icon */}
        <View
          style={{
            width: myHeight(6.5),
            height: myHeight(6.5),
            borderRadius: myHeight(6),
            borderWidth: myHeight(0.15),
            marginTop: -myHeight(3),
            borderColor: myColors.primaryT,
            alignSelf: 'center',
            overflow: 'hidden',
            backgroundColor: myColors.background

          }}>
          <Image style={{
            width: '100%', height: '100%',
            resizeMode: 'contain', marginTop: myHeight(0.0), tintColor: myColors.text
          }}
            source={require('../assets/home_main/home/driver.png')} />
          {/* <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={driver.vehicleImage} borderRadius={5000} /> */}
        </View>


        {/* Heart */}
        <TouchableOpacity
          style={{
            backgroundColor: myColors.background,
            padding: myHeight(2.5),
            paddingTop: myHeight(1.5),
            borderRadius: myHeight(5),
            top: myHeight(0),
            right: myWidth(0),
            position: 'absolute'
          }}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('DriverDetailEdit',

          )}>
          <Image style={{
            height: myHeight(2.7),
            width: myHeight(2.7),
            resizeMode: 'contain',
            tintColor: myColors.text,

          }}
            source={require('../assets/home_main/home/edit.png')} />
        </TouchableOpacity>
        <Spacer paddingT={myHeight(0.3)} />
        {/* name */}
        <Text
          numberOfLines={2}
          style={[
            styles.textCommon,
            {
              textAlign: 'center',
              fontSize: myFontSize.medium0,
              fontFamily: myFonts.heading,
            },
          ]}>
          {driver.name}
        </Text>
        <Spacer paddingT={myHeight(1)} />

        {/* Rating & Rate Us */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{
            width: myHeight(2.6), height: myHeight(2.6),
            marginLeft: -myWidth(0.5), marginTop: -myHeight(0.2),
            resizeMode: 'contain', tintColor: myColors.primaryT
          }}
            source={require('../assets/home_main/home/navigator/van2.png')} />
          <Spacer paddingEnd={myWidth(0.8)} />

          {/* Name */}
          <Text numberOfLines={1}
            style={{
              flex: 1,
              fontSize: myFontSize.xBody,
              color: myColors.text, fontFamily: myFonts.heading
            }}>{driver.vehicleName} <Text style={{
              fontSize: myFontSize.body4,
              color: myColors.text, fontFamily: myFonts.body
            }}>({driver.vehicleModal})</Text></Text>



          <Spacer paddingEnd={myWidth(1.5)} />

          <Image style={{
            width: myHeight(3.5), height: myHeight(3.5),
            resizeMode: 'contain', marginTop: myHeight(0.5), tintColor: myColors.primaryT
          }}
            source={require('../assets/home_main/home/ac.png')} />
          <Spacer paddingEnd={myWidth(2.5)} />

          <Text

            style={{
              fontSize: myFontSize.xBody,
              fontFamily: myFonts.heading,
              color: myColors.text,
              letterSpacing: myLetSpacing.common,
              includeFontPadding: false,
              padding: 0,
            }}>{driver.ac ? 'AC' : 'Non AC'}</Text>
          <Spacer paddingEnd={myWidth(2.5)} />

          <Image style={{
            width: myHeight(2.8), height: myHeight(2.8),
            resizeMode: 'contain', marginTop: myHeight(0),
            tintColor: driver.isWifi ? myColors.primaryT : myColors.offColor
          }}
            source={driver.isWifi ? require('../assets/home_main/home/wifi.png') : require('../assets/home_main/home/wifiO.png')} />

        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          {/* Rating */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* Star */}
            <Image
              style={{
                width: myHeight(2.1),
                height: myHeight(2.1),
                resizeMode: 'contain',
                // tintColor: myColors.primaryT
              }}
              source={require('../assets/home_main/home/star.png')}
            />
            <Spacer paddingEnd={myWidth(1.4)} />
            {/* Rating */}
            <Text
              numberOfLines={2}
              style={[
                styles.textCommon,
                {
                  fontSize: myFontSize.body2,
                  fontFamily: myFonts.heading,
                  color: myColors.text,
                },
              ]}>
              {`${driver.rating} `}
            </Text>
            {/* Rate us */}
            <TouchableOpacity disabled activeOpacity={1} onPress={() => null}>
              <Text
                numberOfLines={2}
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.body2,
                    fontFamily: myFonts.heading,
                    color: myColors.textL4,
                  },
                ]}>
                {`(${driver.noOfRatings})`}
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={{ paddingHorizontal: myWidth(2) }} activeOpacity={1} onPress={() => setRatinModal(true)}>
              <Text
                numberOfLines={2}
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.xBody,
                    fontFamily: myFonts.heading,
                    color: myColors.primaryT,
                  },
                ]}> {myReview ? 'Edit Rating' : 'Rate'} </Text>
            </TouchableOpacity> */}
          </View>

          {/*more */}
          {/* <TouchableOpacity activeOpacity={0.8} onPress={() => null}> 
            </TouchableOpacity>
            */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <Image style={{
              width: myHeight(2), height: myHeight(2),
              resizeMode: 'contain', marginTop: myHeight(0.0), tintColor: myColors.primaryT
            }}
              source={require('../assets/home_main/home/seatSF.png')} />
            <Spacer paddingEnd={myWidth(1.5)} />

            <Text

              style={{
                fontSize: myFontSize.body3,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>{driver.vehicleSeats} Seater</Text>
            <Spacer paddingEnd={myWidth(1.5)} />
          </View>
        </View>


        <Spacer paddingT={myHeight(1.5)} />
      </TouchableOpacity>


      <Spacer paddingT={myHeight(1)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacer paddingT={myHeight(1)} />

        {/*Phone &  Chat */}
        <View style={{
          flexDirection: 'row',
          borderTopWidth: myWidth(0.2), borderWidth: myWidth(0.2),
          borderColor: myColors.textL, marginHorizontal: myWidth(4),
          borderRadius: myWidth(50)
        }}>
          {/* Phone */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => { Linking.openURL(`tel:${driver.contact}`); }}
            style={{
              width: '50%', flexDirection: 'row', paddingVertical: myHeight(1.2),
              alignItems: 'center', justifyContent: 'center', borderEndWidth: myWidth(0.2),
              borderColor: myColors.textL,
            }}>
            <Image source={require('../assets/home_main/home/phone.png')}
              style={{
                width: myHeight(2.28),
                height: myHeight(2.28),
                resizeMode: 'contain',
                tintColor: myColors.primaryT
              }}
            />
            <Spacer paddingEnd={myWidth(3)} />
            <Text style={[
              styles.textCommon,
              {
                fontSize: myFontSize.body2,
                fontFamily: myFonts.heading,
                color: myColors.text
              }
            ]}>CALL</Text>
          </TouchableOpacity>

          {/* Chat */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Chat',
            { user2: driver }
          )}
            style={{
              width: '50%', flexDirection: 'row', paddingVertical: myHeight(1.2),
              alignItems: 'center', justifyContent: 'center'
            }}>
            <Image source={require('../assets/home_main/home/navigator/chat2.png')}
              style={{
                width: myHeight(2.38),
                height: myHeight(2.38),
                resizeMode: 'contain',
                tintColor: myColors.primaryT
              }}
            />
            <Spacer paddingEnd={myWidth(3)} />
            <Text style={[
              styles.textCommon,
              {
                fontSize: myFontSize.body2,
                fontFamily: myFonts.heading,
                color: myColors.text
              }
            ]}>CHAT</Text>
          </TouchableOpacity>
        </View>

        <Spacer paddingT={myHeight(1.5)} />

        {/* Details */}
        <View style={{ paddingHorizontal: myWidth(4) }}>
          {/* Description */}
          <View>
            <Text

              style={{
                fontSize: myFontSize.body4,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>Description</Text>

            <Text

              style={{
                fontSize: myFontSize.body,
                fontFamily: myFonts.body,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>{driver.description}</Text>
          </View>

          <Spacer paddingT={myHeight(1.5)} />

          {/* Paid */}
          <View style={{}}>
            <Text

              style={{
                fontSize: myFontSize.body4,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>Paid Options</Text>

            <Spacer paddingT={myHeight(0.4)} />
            <View style={{ width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
              {
                driver.packages.map((it, i) => (

                  <Text numberOfLines={1}

                    style={{

                      fontSize: myFontSize.body3,
                      fontFamily: myFonts.bodyBold,
                      color: myColors.primaryT,
                      letterSpacing: myLetSpacing.common,
                      includeFontPadding: false,
                      padding: 0,
                    }}>{`● ${it}     `}</Text>
                ))
              }
            </View>
          </View>


          <Spacer paddingT={myHeight(1.5)} />
          {/* Daily */}
          <View style={{}}>
            <Text

              style={{
                fontSize: myFontSize.body4,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>Pick & Drop Days</Text>

            <Spacer paddingT={myHeight(0.5)} />
            <View style={{ width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
              {
                driver.oneRideDays.map((it, i) => (


                  <Text key={i}
                    style={{

                      fontSize: myFontSize.body3,
                      fontFamily: myFonts.bodyBold,
                      color: myColors.primaryT,
                      letterSpacing: myLetSpacing.common,
                      includeFontPadding: false,
                      padding: 0,
                    }}>{`● ${it}    `}</Text>

                ))
              }
            </View>

          </View>

          <Spacer paddingT={myHeight(1.5)} />
          {/* Event Book */}
          <View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: myFontSize.body4,
                  fontFamily: myFonts.bodyBold,
                  color: myColors.text,
                  letterSpacing: myLetSpacing.common,
                  includeFontPadding: false,
                  padding: 0,
                }}>{driver.isOneRide ? 'Event Booking Days' : 'Event Booking Service'}</Text>
              {
                !driver.isOneRide ?
                  <Text
                    style={{

                      fontSize: myFontSize.body4,
                      fontFamily: myFonts.body,
                      color: myColors.red,
                      letterSpacing: myLetSpacing.common,
                      includeFontPadding: false,
                      padding: 0,
                    }}>Not Availabe</Text>
                  : null
              }

            </View>

            <Spacer paddingT={myHeight(0.5)} />
            {
              driver.isOneRide ?
                (<View style={{ width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
                  {
                    driver.oneRideDays.map((it, i) => (


                      <Text key={i}
                        style={{

                          fontSize: myFontSize.body3,
                          fontFamily: myFonts.bodyBold,
                          color: myColors.primaryT,
                          letterSpacing: myLetSpacing.common,
                          includeFontPadding: false,
                          padding: 0,
                        }}>{`● ${it}    `}</Text>

                    ))
                  }
                </View>)
                : null
            }
          </View>


          <Spacer paddingT={myHeight(1.2)} />
          {/* Inside Uni */}
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: myFontSize.body4,
                  fontFamily: myFonts.bodyBold,
                  color: myColors.text,
                  letterSpacing: myLetSpacing.common,
                  includeFontPadding: false,
                  padding: 0,
                }}>{driver.isInsideUni ? 'Inside Universities Service' : 'Inside Universities Service'}</Text>

              {
                !driver.isInsideUni ?
                  <Text
                    style={{

                      fontSize: myFontSize.body4,
                      fontFamily: myFonts.body,
                      color: myColors.red,
                      letterSpacing: myLetSpacing.common,
                      includeFontPadding: false,
                      padding: 0,
                    }}>Not Availabe</Text>
                  :
                  <TouchableOpacity style={{
                  }} activeOpacity={0.7} onPress={() => setInside(!inside)}>

                    <Image style={{
                      height: myHeight(2.5),
                      width: myHeight(2.5),
                      resizeMode: 'contain',
                      marginTop: myHeight(0.4),
                      tintColor: myColors.primaryT,
                      transform: [{ rotate: !inside ? '90deg' : '270deg' }],

                    }} source={require('../assets/home_main/home/go.png')} />
                  </TouchableOpacity>
              }


            </View>

            <Collapsible style={{ paddingHorizontal: myWidth(1) }} collapsed={!inside}>
              <Spacer paddingT={myHeight(0.5)} />

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{

                    fontSize: myFontSize.body,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>{`Estimate Charges: ${driver.departCharges} Rs`}</Text>
              </View>
              {driver.insideUniversities.map((it, j) => (

                <View style={{ flexDirection: 'row', paddingVertical: myHeight(0.65) }}>
                  <Text style={[styles.textCommon, {
                    width: myWidth(0.2) + myFontSize.body * 2,
                    fontFamily: myFonts.bodyBold,
                    fontSize: myFontSize.body,
                  }]}>  {j + 1}.</Text>
                  <TouchableOpacity disabled activeOpacity={0.75} style={{
                    backgroundColor: myColors.background,
                    flex: 1,
                    paddingEnd: myWidth(2),

                  }}
                    onPress={() => null}>
                    <Text numberOfLines={2} style={[styles.textCommon, {
                      // flex: 1,
                      fontFamily: myFonts.bodyBold,
                      fontSize: myFontSize.body,
                    }]}>{it}</Text>
                  </TouchableOpacity>
                  <Spacer paddingEnd={myWidth(2)} />

                </View>
              ))}
            </Collapsible>

          </View>
          <Spacer paddingT={myHeight(1.2)} />

          {/* Reviews */}
          <View style={{}}>
            <Text numberOfLines={2} style={[styles.textCommon, {
              width: '100%',
              fontSize: myFontSize.xxBody,
              fontFamily: myFonts.bodyBold,
              paddingEnd: myWidth(3),
              textAlign: 'center',
            }]}>Reviews</Text>
            {/* <Spacer paddingT={myHeight(0.5)} /> */}

            <FlashList
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              data={reviews}

              contentContainerStyle={{ flexGrow: 1 }}
              ItemSeparatorComponent={() =>
                <View style={{ borderTopWidth: myHeight(0.08), borderColor: myColors.offColor, width: "100%" }} />
              }
              estimatedItemSize={myHeight(10)}
              renderItem={({ item, index }) => {
                // const item = data

                return (
                  <View key={index}>
                    <Spacer paddingT={myHeight(1.5)} />


                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {/* <Spacer paddingEnd={myWidth(2)} /> */}
                      <Text style={[styles.textCommon, {
                        fontSize: myFontSize.body3,
                        fontFamily: myFonts.heading,
                        paddingEnd: myWidth(3)
                      }]}>{item.name}</Text>

                      <Text style={[styles.textCommon, {
                        flex: 1,
                        // textAlign: 'right',
                        fontSize: myFontSize.body,
                        fontFamily: myFonts.body,
                      }]}>{item.date}  <Text style={{ fontSize: myFontSize.body, color: myColors.textL4 }}>{item.edited ? 'Edited' : ''}</Text> </Text>
                      {item.rating &&
                        <Stars num={item.rating} />
                      }

                    </View>
                    <Spacer paddingT={myHeight(0.5)} />
                    <Text style={[styles.textCommon, {
                      fontSize: myFontSize.body,
                      fontFamily: myFonts.body,
                      paddingEnd: myWidth(3)
                    }]}>{item.review}</Text>

                    <Spacer paddingT={myHeight(1.8)} />

                  </View>
                )
              }
              } />

          </View>



          <Spacer paddingT={myHeight(4)} />


        </View>
      </ScrollView>








      {isLoading && <Loader />}
      {errorMsg && <MyError message={errorMsg} />}
    </View>
  );
};

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
  star: {
    width: myHeight(4.2),
    height: myHeight(4.2),
    marginEnd: myWidth(0.5),
    resizeMode: 'contain',
  }
});
