import {
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Spacer, myHeight, myWidth} from '../../common';
import {myFontSize, myFonts, myLetSpacing} from '../../../ultils/myFonts';
import {myColors} from '../../../ultils/myColors';
import {useDispatch, useSelector} from 'react-redux';
import {ImageUri} from '../../common/image_uri';
export const DriverInfoFull = ({driver, navigation}) => {
  const dispatch = useDispatch();

  return (
    <View style={{paddingVertical: myHeight(1.5)}}>
      <View style={styles.container}>
        {/* Image & Others*/}

        <View
          style={{
            height: myHeight(16),
            width: '100%',
            // resizeMode: 'cover',
            // borderRadius: myWidth(2.5),
            borderTopRightRadius: myWidth(3.5),
            borderTopLeftRadius: myWidth(3.5),
            overflow: 'hidden',
          }}>
          <ImageUri
            width={'100%'}
            height={'100%'}
            resizeMode="cover"
            uri={driver.vehicleImage}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              top: myHeight(0.8),
            }}>
            <View style={{flex: 1}}>
              <View
                style={{
                  backgroundColor:
                    driver.status == 1 && driver.active
                      ? myColors.primaryT
                      : myColors.red,
                  paddingHorizontal: myWidth(3.5),
                  //   minWidth: myWidth(20),
                  borderTopEndRadius: myWidth(1.5),
                  paddingVertical: myHeight(0.5),
                  borderBottomEndRadius: myWidth(1.5),
                  alignSelf: 'flex-start',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={[styles.textRating, {color: myColors.background}]}>
                    {driver.status == 1 && driver.active
                      ? 'Active'
                      : driver.status == 2
                      ? 'Pending'
                      : driver.status == 3
                      ? 'Rejected'
                      : 'Inactive'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Heart */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('DriverDetailEdit', {id: driver.id})
              }
              style={styles.containerHeart}>
              <Image
                style={styles.imageHeart}
                source={require('../../assets/home_main/home/edit2.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Spacer paddingT={myHeight(0.5)} />

        {/* Detals */}
        <View style={{paddingHorizontal: myWidth(5)}}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: myFontSize.xBody,
              fontFamily: myFonts.heading,
              color: myColors.text,
              letterSpacing: myLetSpacing.common,
              includeFontPadding: false,
              padding: 0,
            }}>
            {driver.vehicleName}
          </Text>
          <Spacer paddingT={myHeight(0.5)} />

          <View
            style={{height: myHeight(0.15), backgroundColor: myColors.offColor}}
          />

          <Spacer paddingT={myHeight(1)} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{
                  width: myHeight(1.65),
                  height: myHeight(1.65),
                  resizeMode: 'contain',
                  marginTop: -myHeight(0.2),
                  tintColor: myColors.textL0,
                }}
                source={require('../../assets/home_main/home/seatSF.png')}
              />
              <Spacer paddingEnd={myWidth(1)} />

              <Text
                style={{
                  fontSize: myFontSize.xxSmall,
                  fontFamily: myFonts.bodyBold,
                  color: myColors.text,
                  letterSpacing: myLetSpacing.common,
                  includeFontPadding: false,
                  padding: 0,
                }}>
                {driver.vehicleSeats} Seats
              </Text>
              {/* <Spacer paddingEnd={myWidth(3.5)} /> */}
            </View>

            {driver.ac ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{
                    width: myHeight(2),
                    height: myHeight(2),
                    resizeMode: 'contain',
                    marginTop: myHeight(0),
                    tintColor: myColors.textL0,
                  }}
                  source={require('../../assets/home_main/home/ac2.png')}
                />
                <Spacer paddingEnd={myWidth(1.5)} />

                <Text
                  style={{
                    fontSize: myFontSize.xxSmall,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  Air Conditioned
                </Text>
                {/* <Spacer paddingEnd={myWidth(3)} /> */}
              </View>
            ) : null}

            {driver.isWifi ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{
                    width: myHeight(2.3),
                    height: myHeight(2.3),
                    resizeMode: 'contain',
                    marginTop: myHeight(0),
                    tintColor: myColors.textL0,
                  }}
                  source={require('../../assets/home_main/home/wifi.png')}
                />
                <Spacer paddingEnd={myWidth(1.5)} />
                <Text
                  style={{
                    fontSize: myFontSize.xxSmall,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  Wifi
                </Text>
                {/* <Spacer paddingEnd={myWidth(3)} /> */}
              </View>
            ) : null}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={styles.imageStar}
                source={require('../../assets/home_main/home/star.png')}
              />
              <Spacer paddingEnd={myWidth(1.6)} />
              <Text style={styles.textRating}>
                {driver.rating}{' '}
                <Text style={{color: myColors.textL4}}>
                  ({driver.noOfRatings})
                </Text>
              </Text>
            </View>
          </View>

          <Spacer paddingT={myHeight(1)} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: myWidth(92),
    backgroundColor: myColors.background,
    overflow: 'hidden',
    borderRadius: myWidth(3.5),
    elevation: 1,
    alignSelf: 'center',
  },

  containerIcon: {
    borderWidth: myHeight(0.1),
    borderColor: myColors.primaryT,
    borderRadius: myHeight(10),
    // position: 'absolute',
    // zIndex: 12,
    marginStart: myWidth(4),
    alignSelf: 'flex-start',
    marginTop: -myHeight(3.5),
  },
  containerVeri: {
    position: 'absolute',
    zIndex: 2,
    right: myWidth(0.7),
    bottom: -myHeight(0.1),
    backgroundColor: myColors.darkBlue,
    padding: myHeight(0.085),
    borderRadius: myHeight(2),
  },
  containerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: myWidth(2.5),
    paddingVertical: myHeight(0.1),
    borderRadius: myWidth(1.5),
  },
  containerHeart: {
    alignSelf: 'flex-end',
    backgroundColor: myColors.background,
    padding: myHeight(0.8),
    borderRadius: myWidth(5),
    marginVertical: myHeight(0.5),
    marginHorizontal: myWidth(2),
  },
  containerImageEffect: {
    height: myHeight(13),
    top: 0,
    width: myWidth(52),
    zIndex: 0,
    position: 'absolute',
    backgroundColor: '#00000020',
  },

  //Text
  textName: {
    flex: 1,
    fontSize: myFontSize.xBody,
    fontFamily: myFonts.heading,
    color: myColors.text,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
  textrestaurants: {
    fontSize: myFontSize.small3,
    fontFamily: myFonts.bodyBold,
    color: myColors.textL4,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
  textDelivery_Time: {
    // flex: 1,
    fontSize: myFontSize.xxSmall,
    fontFamily: myFonts.bodyBold,
    color: myColors.text,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
  textRating: {
    // flex: 1,
    fontSize: myFontSize.xxSmall,
    fontFamily: myFonts.body,
    color: myColors.textL4,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
  textDeal: {
    fontSize: myFontSize.body3,
    fontFamily: myFonts.bodyBold,
    color: myColors.background,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },

  //Images
  imageRes: {
    height: myHeight(15),
    width: '100%',
    resizeMode: 'cover',
    // borderTopRightRadius: myWidth(2.5),
    // borderTopLeftRadius: myWidth(2.5),
  },
  imageDelivery: {
    height: myHeight(2.6),
    width: myHeight(2.6),
    resizeMode: 'contain',
  },
  imageTime: {
    height: myHeight(2),
    width: myHeight(2),
    resizeMode: 'contain',
  },
  imageIcon: {
    height: myHeight(7),
    width: myHeight(7),
    borderRadius: myHeight(4),
    resizeMode: 'contain',
    borderWidth: myHeight(0.2),
    borderColor: myColors.background,
    overflow: 'hidden',
  },
  imageVeri: {
    height: myHeight(1.2),
    width: myHeight(1.2),
    resizeMode: 'contain',
  },
  imageStar: {
    height: myHeight(1.85),
    width: myHeight(1.85),
    marginTop: -myHeight(0.2),
    tintColor: myColors.star,
    resizeMode: 'contain',
  },
  imageHeart: {
    height: myHeight(2.3),
    width: myHeight(2.3),
    resizeMode: 'contain',
    margin: myHeight(0.3),
    tintColor: myColors.text,
  },
  imageLoc: {
    width: myHeight(2.2),
    height: myHeight(2.2),
    resizeMode: 'contain',
    marginTop: myHeight(0.2),
  },
});
