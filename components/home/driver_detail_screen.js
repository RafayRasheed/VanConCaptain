import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView, StyleSheet, TouchableOpacity, Image,
  View, Text, StatusBar,
  Linking, Platform, ImageBackground, BackHandler, TextInput,
} from 'react-native';
import { Loader, MyError, Spacer, StatusBarHide, StatusbarH, errorTime, ios, myHeight, myWidth } from '../common';
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
  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']


  const DaysShow = ({ list = [] }) => {
    return (
      <View style={{ width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
        {
          allDays.map((it, i) => {
            const is = list.findIndex(li => li == it) != -1

            return (

              <>
                <View key={i} style={[styles.backItem, {
                  backgroundColor: is ? myColors.primaryT : myColors.divider, width: myWidth(11.82), paddingVertical: myHeight(0.6),
                  paddingHorizontal: myWidth(0), justifyContent: 'center'
                }]}>


                  <Text numberOfLines={1}

                    style={{
                      fontSize: myFontSize.small3,
                      fontFamily: myFonts.bodyBold,
                      color: is ? myColors.background : myColors.text,
                      letterSpacing: myLetSpacing.common,
                      includeFontPadding: false,
                      padding: 0,
                    }}>{it}</Text>

                </View>
                {
                  i != 6 &&
                  <Spacer key={i} paddingEnd={myWidth(1.5)} />
                }
              </>

            )
          }
          )
        }
      </View>
    )
  }
  function changeFav() {

  }


  return (
    <View style={{ flex: 1, backgroundColor: myColors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View
          style={{
            width: '100%', overflow: 'hidden', backgroundColor: myColors.text,
            borderBottomStartRadius: myHeight(50), borderBottomEndRadius: myHeight(50), alignItems: 'center'
          }}>
          <Spacer paddingT={myHeight(2)} />
          <StatusbarH />

          <View style={{ width: '100%', paddingHorizontal: myWidth(5), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={{
              backgroundColor: myColors.primaryT,
              height: myHeight(4.2),
              width: myHeight(4.2),
              borderRadius: myHeight(3),
              alignItems: 'center',
              justifyContent: 'center',
            }}  >
              <Image style={
                {
                  height: myHeight(2),
                  width: myHeight(2),
                  resizeMode: 'contain'
                }
              } source={require('../assets/startup/goL.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                // backgroundColor: myColors.primaryL5,
                // padding: myHeight(1.2),
                // borderRadius: myHeight(5),

              }}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('DriverDetailEdit',

              )}>
              <Image style={{
                height: myHeight(3),
                width: myHeight(3),
                resizeMode: 'contain',
                tintColor: myColors.background,

              }}
                source={require('../assets/home_main/home/edit2.png')} />
            </TouchableOpacity>
          </View>
          {/* image */}
          <View style={{
            borderRadius: myWidth(100), overflow: 'hidden',
            width: myHeight(13),
            height: myHeight(13),
            // backgroundColor: myColors.primaryL5, padding: myHeight(1.3),
            // borderWidth: myWidth(0.1), borderColor: myColors.textL4, 
          }}>
            {
              profile.image ?

                <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={profile.image} />
                :
                <Image source={require('../assets/profile/profile.png')}
                  style={{
                    width: myHeight(13),
                    height: myHeight(13),
                    resizeMode: 'contain',
                    // tintColor: myColors.primaryT
                  }}
                />
            }


          </View>

          <Spacer paddingT={myHeight(1)} />

          <Text style={{
            color: myColors.background, fontSize: myFontSize.medium2, fontFamily: myFonts.heading, paddingHorizontal: myWidth(16),
          }}>{profile.name}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* Star */}
            <Image
              style={{
                width: myHeight(2.3),
                height: myHeight(2.3),
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
                  fontSize: myFontSize.body4,
                  fontFamily: myFonts.heading,
                  color: myColors.background,
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
                    color: myColors.dot,
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
          <Spacer paddingT={myHeight(8)} />

        </View>
        <Spacer paddingT={myHeight(1)} />

        {/* Details */}
        <View style={{ paddingHorizontal: myWidth(4) }}>
          {/* Van Info */}
          <View style={{}}>
            <Text

              style={styles.heading}>Van Info</Text>

            <Spacer paddingT={myHeight(0.8)} />
            <View style={{ width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>

              <View style={styles.backItem}>

                <Text

                  style={{
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>{driver.vehicleName}</Text>

              </View>
              <Spacer paddingEnd={myWidth(2.8)} />

              <View style={styles.backItem}>

                <Text

                  style={{
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>{driver.vehicleModal}</Text>

              </View>
              <Spacer paddingEnd={myWidth(2.8)} />

              <View style={styles.backItem}>

                <Text

                  style={{
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>{driver.vehicleNum}</Text>

              </View>


            </View>
          </View>
          <Spacer paddingT={myHeight(3)} />

          {/* Description */}
          <View>
            <Text

              style={styles.heading}>Description</Text>

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
          <Spacer paddingT={myHeight(2)} />

          {/* Photos */}
          <View>
            <Text

              style={styles.heading}>Photos</Text>
            <Spacer paddingT={myHeight(0.5)} />

            <View style={{
              width: '100%',
              height: myHeight(28),

              borderRadius: myWidth(4),
              overflow: 'hidden',
            }} >
              <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={driver.vehicleImage} />

            </View>

          </View>

          <Spacer paddingT={myHeight(3.5)} />

          {/* Aminities */}
          <View style={{}}>
            <Text

              style={styles.heading}>Amenities</Text>

            <Spacer paddingT={myHeight(0.8)} />
            <View style={{ width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
              {
                driver.ac ?
                  <>
                    <View style={styles.backItem}>


                      <Image style={{
                        width: myHeight(2), height: myHeight(2),
                        resizeMode: 'contain', marginTop: myHeight(0), tintColor: myColors.textL4
                      }}
                        source={require('../assets/home_main/home/ac2.png')} />
                      <Spacer paddingEnd={myWidth(1.5)} />

                      <Text

                        style={{
                          fontSize: myFontSize.body,
                          fontFamily: myFonts.bodyBold,
                          color: myColors.text,
                          letterSpacing: myLetSpacing.common,
                          includeFontPadding: false,
                          padding: 0,
                        }}>Air Conditioned</Text>

                    </View>
                    <Spacer paddingEnd={myWidth(2.8)} />
                  </>

                  : null
              }

              {
                driver.isWifi ?
                  <>
                    <View style={styles.backItem}>

                      <Image style={{
                        width: myHeight(2.3), height: myHeight(2.3),
                        resizeMode: 'contain', marginTop: myHeight(0),
                        tintColor: myColors.textL4
                      }}
                        source={require('../assets/home_main/home/wifi.png')} />
                      <Spacer paddingEnd={myWidth(1.5)} />
                      <Text

                        style={{
                          fontSize: myFontSize.body,
                          fontFamily: myFonts.bodyBold,
                          color: myColors.text,
                          letterSpacing: myLetSpacing.common,
                          includeFontPadding: false,
                          padding: 0,
                        }}>Wifi</Text>
                    </View>
                    <Spacer paddingEnd={myWidth(2.8)} />
                  </>

                  : null
              }

              <View style={styles.backItem}>
                <Image style={{
                  width: myHeight(1.75), height: myHeight(1.75),
                  resizeMode: 'contain', marginTop: -myHeight(0.2), tintColor: myColors.textL4
                }}
                  source={require('../assets/home_main/home/seatSF.png')} />
                <Spacer paddingEnd={myWidth(1.8)} />

                <Text

                  style={{
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>{driver.vehicleSeats}</Text>
              </View>


            </View>
          </View>
          <Spacer paddingT={myHeight(3.5)} />

          {/* Paid */}
          <View style={{}}>
            <Text

              style={styles.heading}>Paid Options</Text>

            <Spacer paddingT={myHeight(0.8)} />
            <View style={{ width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
              {
                driver.packages.map((it, i) => (
                  <>
                    <View key={i} style={[styles.backItem, { paddingHorizontal: 0, width: myWidth(20), justifyContent: 'center', }]}>
                      <Text numberOfLines={1}

                        style={{

                          fontSize: myFontSize.xxSmall,
                          fontFamily: myFonts.bodyBold,
                          color: myColors.text,
                          letterSpacing: myLetSpacing.common,
                          includeFontPadding: false,
                          padding: 0,
                        }}>{it}</Text>
                    </View>
                    <Spacer paddingEnd={myWidth(4)} />

                  </>


                ))
              }
            </View>
          </View>


          <Spacer paddingT={myHeight(3.5)} />
          {/* Daily */}
          <View style={{}}>
            <Text

              style={styles.heading}>Availability</Text>

            <Spacer paddingT={myHeight(1)} />
            <DaysShow list={driver.dailyDays} />
          </View>

          <Spacer paddingT={myHeight(3.5)} />
          {/* Event Book */}
          <View>
            {
              driver.isOneRide ?
                <>
                  <Text

                    style={styles.heading}>Availability for Events</Text>

                  <Spacer paddingT={myHeight(1)} />
                  <DaysShow list={driver.oneRideDays} />
                  <Spacer paddingT={myHeight(2.5)} />

                </>


                : null
            }
          </View>


          {/* Inside Uni */}
          <View>
            {
              driver.isInsideUni ?
                <>


                  <TouchableOpacity activeOpacity={0.7} onPress={() => setInside(!inside)} style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <Text

                      style={styles.heading}>Inside Universities Service</Text>

                    <View style={{ flex: 1 }} />
                    <TouchableOpacity disabled style={{
                    }}>

                      <Image style={{
                        height: myHeight(2.2),
                        width: myHeight(2.2),
                        resizeMode: 'contain',
                        marginTop: myHeight(0.4),
                        tintColor: myColors.offColor,
                        transform: [{ rotate: !inside ? '90deg' : '270deg' }],

                      }} source={require('../assets/home_main/home/go.png')} />
                    </TouchableOpacity>



                  </TouchableOpacity>

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

                      <View key={j} style={{ flexDirection: 'row', paddingVertical: myHeight(0.65) }}>
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

                  <Spacer paddingT={myHeight(1.4)} />
                </>
                : false
            }
          </View>

          {/* Reviews */}
          {
            reviews.length ?
              <View style={{}}>
                <Text

                  style={styles.heading}>Reviews</Text>

                <Spacer paddingT={myHeight(1)} />

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
                      <View key={index} style={{ borderWidth: myHeight(0.1), backgroundColor: myColors.background, elevation: 1, borderColor: myColors.divider, borderRadius: myWidth(2), paddingHorizontal: myWidth(2) }}>
                        <Spacer paddingT={myHeight(0.8)} />


                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {/* <Spacer paddingEnd={myWidth(2)} /> */}
                          <Text style={[styles.textCommon, {
                            flex: 1,
                            fontSize: myFontSize.body3,
                            fontFamily: myFonts.heading,
                            paddingEnd: myWidth(3)
                          }]}>{item.name}</Text>


                          {item.rating &&
                            <Stars num={item.rating} />
                          }

                        </View>
                        <Spacer paddingT={myHeight(0.5)} />
                        <Text style={[styles.textCommon, {
                          fontSize: myFontSize.body,
                          fontFamily: myFonts.body,
                          paddingEnd: myWidth(3),
                          color: myColors.textL4,

                        }]}>{item.review}</Text>

                        <Spacer paddingT={myHeight(1.5)} />

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Text style={[styles.textCommon, {
                            flex: 1,
                            textAlign: 'right',
                            fontSize: myFontSize.xSmall,
                            fontFamily: myFonts.bodyBold,
                            color: myColors.textL4,
                          }]}><Text style={{ fontSize: myFontSize.small3, color: myColors.textL4, fontFamily: myFonts.body, }}>{item.edited ? 'Edited' : ''}</Text>  {item.date} </Text>

                        </View>


                        <Spacer paddingT={myHeight(0.7)} />

                      </View>
                    )
                  }
                  } />

              </View>
              :
              null
          }



          <Spacer paddingT={myHeight(4)} />


        </View>


        {/* Content */}

        <Spacer paddingT={myHeight(1)} />




      </ScrollView>

      {/* <View>

        <View style={{ height: myHeight(0.1), backgroundColor: myColors.dot }} />
        <Spacer paddingT={myHeight(1.5)} />

       <View style={{
          flexDirection: 'row',
          justifyContent: 'center', alignItems: 'center',
        }}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => { Linking.openURL(`tel:${driver.contact}`); }}
            style={{
              paddingVertical: myHeight(1.2),
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: myColors.green2, width: '38%', borderRadius: myWidth(100)
            }}>

            <Text style={[
              styles.textCommon,
              {
                fontSize: myFontSize.body2,
                fontFamily: myFonts.heading,
                color: myColors.background
              }
            ]}>CALL</Text>
          </TouchableOpacity>
          <Spacer paddingEnd={myWidth(3)} />

          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Chat',
            { user2: driver }
          )}
            style={{
              paddingVertical: myHeight(1.2),
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: myColors.greenL, width: '38%', borderRadius: myWidth(100)
            }}>

            <Text style={[
              styles.textCommon,
              {
                fontSize: myFontSize.body2,
                fontFamily: myFonts.heading,
                color: myColors.green
              }
            ]}>CHAT</Text>
          </TouchableOpacity>
        </View>
es
        <Spacer paddingT={myHeight(1.5)} />

      </View> */}





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
  backItem: {
    paddingHorizontal: myWidth(5), paddingVertical: myHeight(0.75), borderRadius: myWidth(100),
    backgroundColor: myColors.background, borderWidth: myHeight(0.1), borderColor: myColors.divider,
    flexDirection: 'row', alignItems: 'center'
  },
  heading: {
    fontSize: myFontSize.body4,
    fontFamily: myFonts.bodyBold,
    color: myColors.textL4,
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
