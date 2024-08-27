import {
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {myColors} from '../../ultils/myColors';
import {MyError, Spacer, StatusbarH, ios, myHeight, myWidth} from '../common';
import {myFontSize, myFonts, myLetSpacing} from '../../ultils/myFonts';
import database from '@react-native-firebase/database';
import {
  containString,
  dataFullData,
  verificationCode,
} from '../functions/functions';
import {useDispatch, useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {setErrorAlert} from '../../redux/error_reducer';
import {RFValue} from 'react-native-responsive-fontsize';
import {ImageUri} from '../common/image_uri';
import {socket} from '../common/api';

export const ChatList = ({navigation, route}) => {
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState(null);

  const {chats, totalUnread} = useSelector(state => state.chats);
  const [chatssss, setChatssss] = useState(null);

  const {profile} = useSelector(state => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {}, []);
  useEffect(() => {
    if (search) {
      setChatssss(chats.filter(it => containString(it.userName, search)));
      // setChats(chats.filter())
    } else {
      setChatssss(chats);
    }
  }, [search, chats]);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: myColors.background}}>
        <StatusbarH />
        <View style={{paddingTop: myHeight(2)}}>
          <View
            style={{
              paddingHorizontal: myWidth(4),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* Search */}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: myWidth(4),
                borderRadius: myWidth(10),
                backgroundColor: myColors.primaryL3,
                // marginHorizontal: myWidth(4
              }}>
              <TextInput
                placeholder="Search"
                placeholderTextColor={myColors.textL0}
                autoCorrect={false}
                selectionColor={myColors.text}
                style={{
                  flex: 1,
                  textAlignVertical: 'center',
                  paddingVertical: myHeight(0.7),
                  fontSize: myFontSize.body2,
                  color: myColors.text,
                  includeFontPadding: false,
                  fontFamily: myFonts.bodyBold,
                }}
                cursorColor={myColors.primaryT}
                value={search}
                onChangeText={setSearch}
                // value={search} onChangeText={(val) => null}
              />
              <Image
                style={{
                  width: myHeight(2.2),
                  height: myHeight(2.2),
                  resizeMode: 'contain',
                  tintColor: myColors.textL,
                }}
                source={require('../assets/home_main/home/search.png')}
              />
            </View>
          </View>
          <Spacer paddingT={myHeight(1.7)} />

          <View style={{paddingHorizontal: myWidth(4)}}>
            <Text
              style={[
                styles.textCommon,
                {
                  fontSize: myFontSize.large,
                  fontFamily: myFonts.body,
                },
              ]}>
              {'Messages'}
            </Text>
            {totalUnread ? (
              <Text
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.body,
                    color: myColors.textL4,
                  },
                ]}>
                {' '}
                {`You have ${totalUnread} new messages`}
              </Text>
            ) : null}
          </View>

          <Spacer paddingT={myHeight(1)} />

          {/* Divider */}
          {/* <View style={{
                        borderTopWidth: myHeight(0.18),
                        borderColor: myColors.divider, width: '100%'
                    }} /> */}
        </View>

        {/* Chats */}
        <FlashList
          data={chatssss}
          ItemSeparatorComponent={() => (
            <View
              style={{
                borderTopWidth: myHeight(0.08),
                borderColor: myColors.offColor,
                width: '100%',
              }}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          estimatedItemSize={200}
          renderItem={({item}) => {
            console.log('item123124234234', item);
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  paddingVertical: myHeight(1.2),
                  width: '100%',
                  paddingHorizontal: myWidth(4),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  //   return;
                  navigation.navigate('Chat', {user2: item});
                }}>
                <View
                  style={{
                    borderRadius: myHeight(100),
                    height: myHeight(7),
                    width: myHeight(7),
                    borderColor: myColors.offColor7,
                    borderWidth: 1,
                    backgroundColor: item.colorC,
                    overflow: 'hidden',
                    marginTop: myHeight(0.2),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {item.userImage ? (
                    <ImageUri
                      uri={item.userImage}
                      height={'100%'}
                      width={'100%'}
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      style={{
                        width: myHeight(3.6),
                        height: myHeight(3.6),
                        resizeMode: 'contain',
                        tintColor: myColors.background,
                      }}
                      source={require('../assets/home_main/home/user.png')}
                    />
                  )}
                </View>
                <Spacer paddingEnd={myWidth(2.4)} />
                <View style={{flex: 1}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.textCommon,
                        {
                          flex: 1,
                          fontSize: myFontSize.xxBody,
                          fontFamily: myFonts.bodyBold,
                        },
                      ]}>
                      {item.userName}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.textCommon,
                        {
                          fontSize: myFontSize.xxSmall,
                          fontFamily: myFonts.body,
                        },
                      ]}>
                      {item.lastMessage.statusTime}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.textCommon,
                        {
                          flex: 1,
                          fontSize: myFontSize.body2,
                          fontFamily:
                            item.senderId != profile.uid && item.totalUnread
                              ? myFonts.bodyBold
                              : myFonts.body,
                        },
                      ]}>
                      {item.senderId == profile.uid ? 'You: ' : ''}
                      {item.lastMessage.message}
                    </Text>
                    {item.totalUnread ? (
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.textCommon,
                          {
                            fontSize: myFontSize.small3,
                            fontFamily: myFonts.body,
                            color: myColors.background,
                            // padding: myHeight(0.5),
                            minWidth: RFValue(22),
                            minHeight: RFValue(22),
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            borderRadius: 5000,
                            backgroundColor: myColors.primaryT,
                          },
                        ]}>
                        {item.totalUnread > 9 ? '9+' : item.totalUnread}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
        {/* Bottom */}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  textCommon: {
    color: myColors.text,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
});
