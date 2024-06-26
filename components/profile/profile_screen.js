import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  StatusBar,
  TextInput,
  Linking,
  Platform,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import {
  MyError,
  Spacer,
  StatusbarH,
  errorTime,
  ios,
  myHeight,
  myWidth,
} from '../common';
import {myColors} from '../../ultils/myColors';
import {myFontSize, myFonts, myLetSpacing} from '../../ultils/myFonts';
import {useDispatch, useSelector} from 'react-redux';
import {deleteCommonStorage, deleteLogin} from '../functions/storageMMKV';
import {deleteProfile} from '../../redux/profile_reducer';
import {FirebaseUser, getDeviceToken} from '../functions/firebase';

import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {ImageUri} from '../common/image_uri';
import {setErrorAlert} from '../../redux/error_reducer';
import {useFocusEffect} from '@react-navigation/native';
import {logoutAPI} from '../common/api';

export const Profile = ({navigation}) => {
  const {profile} = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const [shareModal, setShareModal] = useState(false);
  const [cancelRide, setCancelRide] = useState(false);
  const [cancelRideLoader, SetCancelRideLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        setIsLoading(false);
        setErrorMsg(null);
      }, errorTime);
    }
  }, [errorMsg]);
  const onBackPress = () => {
    if (cancelRide) {
      setCancelRide(false);
      return true;
    }
    if (shareModal) {
      setShareModal(false);
      return true;
    }
    navigation.goBack();

    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [cancelRide, shareModal]),
  );

  const Common = ({
    navigate,
    iconSize,
    icon,
    tind = myColors.primaryT,
    name,
  }) => (
    <View onPress={() => navigation.navigate(navigate)} style={{}}>
      <Spacer paddingT={myHeight(1)} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingStart: myWidth(1.5),
          paddingEnd: myWidth(4),
        }}
        activeOpacity={0.8}
        onPress={() => null}>
        <View style={{width: myHeight(5), paddingStart: myWidth(0.5)}}>
          <Image
            style={{
              height: iconSize,
              width: iconSize,
              resizeMode: 'contain',
              tintColor: myColors.textL4,
            }}
            source={icon}
          />
        </View>

        {/* <Spacer paddingEnd={myWidth(4)} /> */}

        <Text
          numberOfLines={1}
          style={[
            styles.textCommon,
            {
              flex: 1,
              fontSize: myFontSize.xBody2,
              fontFamily: myFonts.bodyBold,
              color: myColors.textL0,
            },
          ]}>
          {name}
        </Text>

        <Image
          style={{
            height: myHeight(1.8),
            width: myHeight(1.8),
            resizeMode: 'contain',
            marginTop: myHeight(0.4),
            tintColor: myColors.orange,
          }}
          source={require('../assets/home_main/home/go.png')}
        />
      </View>
      <Spacer paddingT={myHeight(1)} />
    </View>
  );
  async function onLogout() {
    setIsLoading(true);
    // return;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify({
        token: profile.token,
        deviceToken: await getDeviceToken(),
      }), // Convert the data to JSON string
    };

    fetch(logoutAPI, options)
      .then(response => response.json())
      .then(data => {
        setIsLoading(true);
        const {code, body, message} = data;

        if (code == 1) {
          const removeKeys = [
            'areas',
            'totalUnread',
            'chats',
            'pending',
            'progress',
            'history',
            'allRequest',
            'unread',
          ];
          SetCancelRideLoader(true);
          navigation.replace('AccountNavigator');
          removeKeys.map(key => {
            deleteCommonStorage(key);
          });
          setTimeout(() => {
            dispatch(deleteProfile());
          }, 2000);
          SetCancelRideLoader(false);
        } else {
          setErrorMsg(message);
        }
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch
        setIsLoading(false);

        console.error('Fetch error:', error);
      });

    return;
    FirebaseUser.doc(profile.uid)
      .update({
        deviceToken: null,
      })
      .then(data => {
        navigation.replace('AccountNavigator');
        removeKeys.map(key => {
          deleteCommonStorage(key);
        });
        setTimeout(() => {
          dispatch(deleteProfile());
        }, 2000);
        SetCancelRideLoader(false);

        console.log('Token delete To Firebase Succesfully');
      })
      .catch(err => {
        SetCancelRideLoader(false);

        console.log('Internal error while Updating a Token', err);
      });
  }
  function onCusSupp() {
    Linking.openURL('whatsapp://send?text=&phone=923308246728')
      .then(() => {})
      .catch(e => {
        dispatch(
          setErrorAlert({
            Title: 'Alert!',
            Body: 'Whatsapp Not Installed',
            Status: 0,
          }),
        );
      });
  }
  function shareAPP(plat) {
    Linking.openURL(
      `${plat}${'https://drive.google.com/drive/folders/10LR2rVpEYdve7IGN5Db6SkEAvj6m2fKO?usp=drive_link'}`,
    )
      .then(() => {})
      .catch(e => {
        dispatch(
          setErrorAlert({
            Title: 'Alert!',
            Body: 'App Not Installed',
            Status: 0,
          }),
        );
      });
  }
  return (
    <>
      {/* <StatusBar backgroundColor={orderModal ? '#00000030' : myColors.background} /> */}
      <SafeAreaView style={{flex: 1, backgroundColor: myColors.background}}>
        <View
          style={{
            width: '100%',
            overflow: 'hidden',
            backgroundColor: myColors.text,
            borderBottomStartRadius: myHeight(50),
            borderBottomEndRadius: myHeight(50),
            alignItems: 'center',
          }}>
          <Spacer paddingT={myHeight(2)} />
          <StatusbarH />

          <View style={{width: '100%', paddingHorizontal: myWidth(5)}}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              style={{
                backgroundColor: myColors.primaryT,
                height: myHeight(4.2),
                width: myHeight(4.2),
                borderRadius: myHeight(3),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  height: myHeight(2),
                  width: myHeight(2),
                  resizeMode: 'contain',
                }}
                source={require('../assets/startup/goL.png')}
              />
            </TouchableOpacity>
          </View>
          {/* image */}
          <View
            style={{
              borderRadius: myWidth(100),
              overflow: 'hidden',
              width: myHeight(13),
              height: myHeight(13),
              // backgroundColor: myColors.primaryL5, padding: myHeight(1.3),
              // borderWidth: myWidth(0.1), borderColor: myColors.textL4,
            }}>
            {profile.image ? (
              <ImageUri
                width={'100%'}
                height={'100%'}
                resizeMode="cover"
                uri={profile.image}
              />
            ) : (
              <Image
                source={require('../assets/profile/profile.png')}
                style={{
                  width: myHeight(13),
                  height: myHeight(13),
                  resizeMode: 'contain',
                  // tintColor: myColors.primaryT
                }}
              />
            )}
          </View>
          <Spacer paddingT={myHeight(1)} />

          <Text
            style={{
              color: myColors.background,
              fontSize: myFontSize.medium2,
              fontFamily: myFonts.heading,
              paddingHorizontal: myWidth(16),
            }}>
            {profile.name}
          </Text>
          <Spacer paddingT={myHeight(8.5)} />
        </View>

        {/* <Spacer paddingT={myHeight(2)} />
                <View style={{
                    flexDirection: 'row', paddingHorizontal: myWidth(4),
                    alignItems: 'center',
                }}>

                    <View style={{
                        borderRadius: myWidth(100), overflow: 'hidden',
                        // backgroundColor: myColors.primaryL5, padding: myHeight(1.3),
                        // borderWidth: myWidth(0.1), borderColor: myColors.textL4, 
                    }}>
                        <Image source={require('../assets/profile/profile.png')}
                            style={{
                                width: myHeight(7.5),
                                height: myHeight(7.5),
                                resizeMode: 'contain',
                                // tintColor: myColors.primaryT
                            }}
                        />

                    </View>
                    <Spacer paddingEnd={myWidth(4)} />
                    <Text numberOfLines={1} style={[styles.textCommon, {
                        flex: 1,
                        fontSize: myFontSize.medium,
                        fontFamily: myFonts.heading,
                    }]}>{profile.name}</Text>
                </View> */}

        <Spacer paddingT={myHeight(2.5)} />

        <ScrollView
          bounces={false}
          contentContainerStyle={{paddingHorizontal: myWidth(4), flexGrow: 1}}>
          {/* Profile */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ProfileInfo')}
            style={{}}>
            <Common
              icon={require('../assets/profile/user.png')}
              iconSize={myHeight(2.6)}
              name={'Profile Info'}
            />
          </TouchableOpacity>
          {/* Divider */}
          {/* <View style={{ borderTopWidth: myHeight(0.18), borderColor: myColors.dot, }} /> */}

          {/* Details */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('DriverDetailEdit')}
            style={{}}>
            <Common
              icon={require('../assets/profile/user.png')}
              iconSize={myHeight(2.6)}
              name={'Driver Details'}
            />
          </TouchableOpacity>
          {/* Divider */}
          {/* <View style={{ borderTopWidth: myHeight(0.18), borderColor: myColors.dot, }} /> */}

          {/* Favourites */}
          {/* <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Favourite')}
                        style={{}}>

                        <Common icon={require('../assets/home_main/home/heart.png')} iconSize={myHeight(2.6)}
                            name={'Favourites'} navigate={'Favourite'}
                        />
                    </TouchableOpacity> */}
          {/* Divider */}
          {/* <View style={{ borderTopWidth: myHeight(0.18), borderColor: myColors.dot, }} /> */}

          {/* 
                    <TouchableOpacity activeOpacity={0.7} onPress={() => null}
                        style={{}}>

                        <Common icon={require('../assets/profile/bellF.png')} iconSize={myHeight(2.8)}
                            name={'Notifications'} navigate={'Notification'}
                        />
                    </TouchableOpacity> */}
          {/* Divider */}
          {/* <View style={{ borderTopWidth: myHeight(0.18), borderColor: myColors.dot, }} /> */}

          {/* Customer Support */}
          <TouchableOpacity activeOpacity={0.7} onPress={onCusSupp} style={{}}>
            <Common
              icon={require('../assets/profile/customer.png')}
              iconSize={myHeight(3.2)}
              name={'Customer Support'}
              tind={null}
              navigate={''}
            />
          </TouchableOpacity>
          {/* Divider */}
          {/* <View style={{ borderTopWidth: myHeight(0.18), borderColor: myColors.dot, }} /> */}

          {/* Share App */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShareModal(true)}
            style={{}}>
            <Common
              icon={require('../assets/profile/share.png')}
              iconSize={myHeight(2.8)}
              name={'Share App'}
              navigate={''}
            />
          </TouchableOpacity>
          {/* Divider */}
          {/* <View style={{ borderTopWidth: myHeight(0.18), borderColor: myColors.dot, }} /> */}

          {/* Report a bug */}
          {/* <Common icon={require('../assets/profile/bug.png')} iconSize={myHeight(3)}
                        name={'Report a bug'} navigate={''}
                    /> */}
          {/* Divider */}
          {/* <View style={{ borderTopWidth: myHeight(0.18), borderColor: myColors.dot, }} /> */}
        </ScrollView>

        <TouchableOpacity
          onPress={() => setCancelRide(true)}
          activeOpacity={0.8}
          style={{
            width: myWidth(92),
            alignSelf: 'center',
            paddingVertical: myHeight(1.2),
            borderRadius: myHeight(1.4),
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            backgroundColor: myColors.background,
            borderWidth: myHeight(0.15),
            borderColor: myColors.offColor,
          }}>
          <Text
            style={[
              styles.textCommon,
              {
                fontFamily: myFonts.heading,
                fontSize: myFontSize.body4,
                color: myColors.textrL4,
              },
            ]}>
            Logout
          </Text>
        </TouchableOpacity>
        <Spacer paddingT={myHeight(5)} />

        {errorMsg && <MyError message={errorMsg} />}
      </SafeAreaView>

      {cancelRide && (
        <View
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            backgroundColor: '#00000030',
          }}>
          <TouchableOpacity
            disabled={isLoading}
            onPress={() => {
              if (!cancelRideLoader) {
                setCancelRide(false);
              }
            }}
            style={{flex: 1}}
          />
          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={{
              height: myHeight(30),
              backgroundColor: '#fff',
              borderTopStartRadius: myWidth(4),
              borderTopEndRadius: myWidth(4),
              paddingHorizontal: myWidth(4.5),
              backgroundColor: myColors.background,
              width: '100%',
            }}>
            <Spacer paddingT={myHeight(3)} />

            <Text
              style={[
                styles.textCommon,
                {
                  fontSize: myFontSize.xBody,
                  fontFamily: myFonts.bodyBold,
                  textAlign: 'center',
                },
              ]}>
              Are you sure you want to logout?
            </Text>

            {cancelRideLoader ? (
              <Spacer paddingT={myHeight(4)} />
            ) : (
              <View style={{flex: 1}} />
            )}
            {cancelRideLoader ? (
              <View style={{alignItems: 'center'}}>
                <ActivityIndicator size={24} color={myColors.primaryT} />
              </View>
            ) : (
              <>
                {/* Yes Button */}
                <TouchableOpacity
                  onPress={() => {
                    onLogout();
                  }}
                  disabled={isLoading}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: myColors.primaryT,
                    borderRadius: myWidth(4),
                    paddingVertical: myHeight(1.4),
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={[
                      styles.textCommon,
                      {
                        fontSize: myFontSize.xBody,
                        fontFamily: myFonts.bodyBold,
                        color: myColors.background,
                      },
                    ]}>
                    {isLoading ? 'Loading...' : 'Yes, Logout'}
                  </Text>
                </TouchableOpacity>

                <Spacer paddingT={myHeight(2)} />
                {/* No Keep Ride Button */}
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={() => setCancelRide(false)}
                  activeOpacity={0.8}
                  style={{
                    borderColor: myColors.primaryT,
                    borderRadius: myWidth(4),
                    borderWidth: myHeight(0.2),
                    paddingVertical: myHeight(1.4),
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={[
                      styles.textCommon,
                      {
                        fontSize: myFontSize.xBody,
                        fontFamily: myFonts.bodyBold,
                        color: myColors.primaryT,
                      },
                    ]}>
                    No, Cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}
            <Spacer paddingT={myHeight(3)} />
          </Animated.View>
        </View>
      )}
      {shareModal && (
        <View
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            backgroundColor: '#00000030',
          }}>
          <TouchableOpacity
            style={{flex: 1}}
            activeOpacity={0.8}
            onPress={() => setShareModal(false)}
          />

          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={{
              backgroundColor: myColors.background,
              borderTopStartRadius: myWidth(6),
              borderTopEndRadius: myWidth(6),
              paddingVertical: myHeight(2.5),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingHorizontal: myWidth(6),
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => shareAPP('http://twitter.com/share?text=&url=')}
              style={{alignItems: 'center'}}>
              <Image
                style={{
                  height: myHeight(4.3),
                  width: myHeight(4.3),
                  resizeMode: 'contain',
                }}
                source={require('../assets/profile/twitterX.png')}
              />
              <Spacer paddingT={myHeight(1)} />

              <Text
                numberOfLines={1}
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.xxSmall,
                    fontFamily: myFonts.bodyBold,
                  },
                ]}>
                Twitter X
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                shareAPP('https://www.facebook.com/sharer/sharer.php?u=')
              }
              style={{alignItems: 'center'}}>
              <Image
                style={{
                  height: myHeight(5),
                  width: myHeight(5),
                  resizeMode: 'contain',
                }}
                source={require('../assets/profile/facebook2.png')}
              />
              <Spacer paddingT={myHeight(0.5)} />

              <Text
                numberOfLines={1}
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.xxSmall,
                    fontFamily: myFonts.bodyBold,
                  },
                ]}>
                Facebook
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => shareAPP('whatsapp://send?text=')}
              style={{alignItems: 'center'}}>
              <Image
                style={{
                  height: myHeight(5),
                  width: myHeight(5),
                  resizeMode: 'contain',
                }}
                source={require('../assets/profile/whatsapp.png')}
              />
              <Spacer paddingT={myHeight(0.5)} />

              <Text
                numberOfLines={1}
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.xxSmall,
                    fontFamily: myFonts.bodyBold,
                  },
                ]}>
                Whatsapp
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  //Text
  textCommon: {
    color: myColors.text,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
});
