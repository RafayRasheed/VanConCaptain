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
  Alert,
  Linking,
  Platform,
  ImageBackground,
  SafeAreaView,
  FlatList,
  BackHandler,
} from 'react-native';
import {
  Loader,
  MyError,
  NotiAlertNew,
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

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import storage from '@react-native-firebase/storage';
import {ImageUri} from '../common/image_uri';
import {ChangeImageView} from './profile_component/change_image_modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CalenderDate} from './profile_component/calender';
import Collapsible from 'react-native-collapsible';
import firestore from '@react-native-firebase/firestore';
import {setProfile} from '../../redux/profile_reducer';
import {FirebaseUser} from '../functions/firebase';
import {setErrorAlert} from '../../redux/error_reducer';
import {Search} from '../home/locations_screen';
import {useFocusEffect} from '@react-navigation/native';
import Animated, {BounceIn} from 'react-native-reanimated';
import {addUpdateVehicle} from '../common/api';
const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const teset = {
  name: 'rafay',
  email: 'rafayrasheed777.rr@gmail.com',
  uid: '81741117-bafa-48eb-865e-24b4e4704e78',
  city: 'Karachi',
  data: {},
  image:
    'http://172.16.1.232:3000/images/drivers/driver-81741117-bafa-48eb-865e-24b4e4704e78-1719383017816-345837145.jpeg',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI4MTc0MTExNy1iYWZhLTQ4ZWItODY1ZS0yNGI0ZTQ3MDRlNzgiLCJpYXQiOjE3MTkzOTc1NTB9.W__-fF-u9bi7P3VxNl8TgKOiwNBQ_LoNeGpe9TxImtA',
  isUpdate: false,
  description: 'Dqvwf dd f dq wf fq hnt d fw eg qf wf wf fw ',
  packages: ['Weekly', 'Daily'],
  vehicleImage: null,
  vehicleName: 'S ecwx',
  vehicleModal: '2010',
  vehicleNum: 'S sxwxwxwc',
  vehicleSeats: '5040',
  availableSeats: '5040',
  licence: '704040401818184',
  contact: '50404048481',
  dailyDays: ['Thu', 'Tue', 'Mon'],
  routes: [
    {id: 59, time: '5AM - 9AM', show: false, locations: [Array]},
    {id: 912, time: '9AM - 12PM', show: false, locations: [Array]},
  ],
  allRoutes: [
    {
      longitude: 67.3034311,
      id: '202402150623248000792313',
      name: 'Bahria Town - Precinct 11',
      latitude: 25.0214515,
    },
    {
      longitude: 67.3034311,
      id: '202402150623248000792313',
      name: 'Bahria Town - Precinct 11',
      latitude: 25.0214515,
    },
    {
      longitude: 67.3107974,
      id: '202402150623247800884583',
      name: 'Bahria Town - Precinct 1',
      latitude: 24.9930676,
    },
    {
      longitude: 67.0693895,
      id: '202402150623398460625909',
      name: 'Bahadurabad',
      latitude: 24.8824515,
    },
  ],
  isOneRide: true,
  oneRideDays: ['Wed', 'Thu', 'Tue', 'Mon'],
  isInsideUni: true,
  insideUniversities: ['NED University'],
  departCharges: '84',
  ac: true,
  isWifi: false,
  ready: true,
  isOnline: true,
  lastUpdate: '10-06-2024 2:28 PM',
  date: '10-06-2024',
  time: '2:28 PM',
  id: '36cdbe3f-09ef-4d46-a8a5-8e9cad30936a',
  deleted: false,
  dateInt: 20240610092846150,
};
export const DriverDetailEdit = ({navigation}) => {
  const disptach = useDispatch();
  const TimeAndLoc = [
    {id: 59, time: '5AM - 9AM', locations: [], show: false},
    {id: 912, time: '9AM - 12PM', locations: [], show: false},
    {id: 1215, time: '12PM - 3PM', locations: [], show: false},
    {id: 1518, time: '3PM - 6PM', locations: [], show: false},
    {id: 1824, time: '6PM - 12AM', locations: [], show: false},
  ];
  const temp = [
    {
      day: 'Mon',
      open: true,
      startTime: '',
      startCurrent: null,
      endTime: '',
      endCurrent: null,
    },
    {
      day: 'Tue',
      open: true,
      startTime: '',
      startCurrent: null,
      endTime: '',
      endCurrent: null,
    },
    {
      day: 'Wed',
      open: true,
      startTime: '',
      startCurrent: null,
      endTime: '',
      endCurrent: null,
    },
    {
      day: 'Thu',
      open: true,
      startTime: '',
      startCurrent: null,
      endTime: '',
      endCurrent: null,
    },
    {
      day: 'Fri',
      open: true,
      startTime: '',
      startCurrent: null,
      endTime: '',
      endCurrent: null,
    },
    {
      day: 'Sat',
      open: true,
      startTime: '',
      startCurrent: null,
      endTime: '',
      endCurrent: null,
    },
    {
      day: 'Sun',
      open: true,
      startTime: '',
      startCurrent: null,
      endTime: '',
      endCurrent: null,
    },
  ];
  // const [, set] = useState(true)
  const {profile} = useSelector(state => state.profile);
  const {vehicles} = useSelector(state => state.vehicles);
  const extractVehicle = vehicles.find(it => it.id == route.params.id);
  const vehicle = extractVehicle ? extractVehicle : {};

  const [isLoading, setIsLoading] = useState(false);

  const [vehicleName, setVehicleName] = useState(
    vehicle.vehicleName ? vehicle.vehicleName : null,
  );
  const [vehicleModal, setVehicleModal] = useState(
    vehicle.vehicleModal ? vehicle.vehicleModal : null,
  );
  const [description, SetDescription] = useState(vehicle.description);
  const [vehicleImage, setVehicleImage] = useState(
    vehicle.vehicleImage ? vehicle.vehicleImage : null,
  );
  // const [vehicleImage, setVehicleImage] = useState(null);
  const [vehicleNum, setVehicleNum] = useState(vehicle.vehicleNum);
  const [vehicleSeats, setVehicleSeats] = useState(vehicle.vehicleSeats);
  const [name, setName] = useState(vehicle.name);

  const [contact, setContact] = useState(vehicle.contact);
  const [licence, setLicence] = useState(vehicle.licence);

  const [packages, setPackages] = useState(
    vehicle.packages ? [...vehicle.packages] : [],
  );
  const [dailyDays, setDailyDays] = useState(
    vehicle.dailyDays ? [...vehicle.dailyDays] : [],
  );
  const [isOneRide, setOneRide] = useState(
    vehicle.isOneRide ? vehicle.isOneRide : false,
  );
  const [oneRideDays, setOneRideDays] = useState(
    vehicle.oneRideDays ? [...vehicle.oneRideDays] : [],
  );
  const [ac, setAc] = useState(vehicle.ac ? vehicle.ac : false);
  const [isWifi, setIsWifi] = useState(vehicle.isWifi ? vehicle.isWifi : false);

  const [isOnline, setIsOnline] = useState(
    vehicle.isOnline ? vehicle.isOnline : false,
  );

  const [isInsideUni, setIsInsideUni] = useState(
    vehicle.isInsideUni ? vehicle.isInsideUni : false,
  );
  const [insideShift, setInsideShift] = useState(
    vehicle.insideShift ? vehicle.insideShift : ['Morning', 'Evening'],
  );
  const [insideUniversities, setInsideUniversities] = useState(
    vehicle.insideUniversities ? [...vehicle.insideUniversities] : [],
  );
  const [allUnies, setAllUnies] = useState([]);

  const [departCharges, SetDepartCharges] = useState(
    vehicle.departCharges ? vehicle.departCharges : null,
  );
  const [DeliveryFee, SetDeliveryFee] = useState(
    vehicle.deliveryCharges ? vehicle.deliveryCharges.toString() : null,
  );
  const [DeliveryTime, SetDeliveryTime] = useState(vehicle.delivery);
  const [locLink, setLocLink] = useState(vehicle.locationLink);
  const [MenuImages, setMenuImages] = useState(
    vehicle.menu ? vehicle.menu : [],
  );
  const [timmings, setTimmings] = useState(
    vehicle.timmings ? vehicle.timmings : temp,
  );

  const [imageLoading, setImageLoading] = useState(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [change, setChange] = useState(null);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedItem, setSelectedItems] = useState(
    vehicle.routes ? getInitialRoutes() : [...TimeAndLoc],
  );
  const [showLoc, setShowLoc] = useState(false);
  const [warning, setWarning] = useState(false);

  const onBackPress = () => {
    if (warning) {
      setWarning(false);
      return true;
    }
    if (showLoc) {
      setShowLoc(false);
      return true;
    }
    if (showTimeModal) {
      setShowTimeModal(false);
      return true;
    }
    setWarning(true);

    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [warning, showLoc, showTimeModal]),
  );

  function getInitialRoutes() {
    if (vehicle.routes.length == TimeAndLoc.length) {
      return [...vehicle.routes];
    }
    const FullArr = TimeAndLoc;
    vehicle.routes.map(it => {
      const index = TimeAndLoc.findIndex(it2 => it2.id == it.id);
      FullArr[index] = {...it};
    });

    return FullArr;
  }
  useEffect(() => {
    firestore()
      .collection('universities')
      .doc(vehicle.city)
      .get()
      .then(result => {
        if (result.exists) {
          const uniii = result.data();
          let AllUnies = [];
          for (const [key, value] of Object.entries(uniii)) {
            AllUnies.push(value);
          }
          setAllUnies(AllUnies);
        }
      })
      .catch(ERR => {
        console.log('ERROR ON getAreasLocations', ERR);
      });
  }, []);
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

      return true;
    } else {
      setErrorMsg('Please Select Customer Packages');
      return false;
    }
  }
  function checkDescription() {
    if (description) {
      if (description.length < 20) {
        setErrorMsg('Enter Description Minimum 20 Characters');
        return false;
      }
      return true;
    }
    setErrorMsg('Please Add Description');
    return false;
  }
  function checkNameAndModal() {
    if (vehicleName) {
      if (vehicleModal) {
        const date = new Date();

        if (
          !isNaN(vehicleModal) &&
          vehicleModal.length == 4 &&
          parseInt(vehicleModal) <= parseInt(date.getFullYear())
        ) {
          return true;
        }
        setErrorMsg('Incorrect Modal Year');
        return false;
      }
      setErrorMsg('Please Enter Modal Year');
      return false;
    }
    setErrorMsg('Please Add Brand Name');
    return false;
  }
  function checkNumAndModal() {
    if (vehicleNum) {
      if (vehicleSeats) {
        return true;
      }
      setErrorMsg('Please Enter Seats');
      return false;
    }
    setErrorMsg('Please Add Number Plate');
    return false;
  }
  function checkNumber() {
    if (contact) {
      if (contact.length == 11) {
        if (licence) {
          if (licence.length == 15) {
            return true;
          }
          setErrorMsg('Invalid Licence Number');
          return false;
        }
        setErrorMsg('Invalid Licence Number');
        return false;
      }
      setErrorMsg('Invalid Contact Number');
      return false;
    }
    setErrorMsg('Please Add Contact Number');
    return false;
  }
  function checkTimmings() {
    let s = true;
    timmings.map(time => {
      if (time.open && (!time.startTime || !time.endTime)) {
        s = false;
      }
    });
    return s;
  }
  function checkRoutes() {
    // return true
    if (selectedItem.filter(it => it.locations.length != 0).length) {
      return true;
    }
    setErrorMsg('Please Add at Least 1 Route');
    return false;
  }
  function checkDepartCharges() {
    if (departCharges) {
      if (isNaN(departCharges) || departCharges < 0) {
        setErrorMsg('Invalid Depart Charges');
        return false;
      }
      return true;
    }
    setErrorMsg('Please Enter Depart Charges');
    return false;
  }
  function checkData() {
    // if (!vehicleImage) {
    //   setErrorMsg('Please Upload Van Photo');
    //   return false;
    // }

    if (!checkNameAndModal()) {
      return false;
    }
    if (!checkNumAndModal()) {
      return false;
    }
    if (!checkDescription()) {
      return false;
    }
    if (!checkNumber()) {
      return false;
    }
    if (!checkPackages()) {
      return false;
    }

    if (!dailyDays.length) {
      setErrorMsg('Please Select Your Ride Days');
      return false;
    }

    if (!checkRoutes()) {
      return false;
    }
    if (isInsideUni && !insideUniversities.length) {
      setErrorMsg('Please Select At Least One Univesity');
      return false;
    }
    if (isInsideUni && !checkDepartCharges()) {
      return false;
    }
    if (isOneRide && !oneRideDays.length) {
      setErrorMsg('Please Select One Time Ride Days');
      return false;
    }

    return true;
  }
  function formatRoutes() {
    const routes = [];
    let allRoutes = [];

    selectedItem.filter(it => {
      if (it.locations.length != 0) {
        routes.push({...it, show: false});
        allRoutes = [...allRoutes, ...it.locations];
      }
    });
    return {routes, allRoutes};
  }
  function onSave() {
    if (checkData()) {
      setIsLoading(true);
      const {routes, allRoutes} = formatRoutes();
      let newProfile = {
        ...vehicle,
        uid: profile.uid,
        isUpdate: vehicle.ready ? true : false,
        description,
        packages,
        vehicleImage,
        vehicleName,
        vehicleModal,
        vehicleNum,
        vehicleSeats,
        availableSeats: vehicle.availableSeats
          ? vehicle.availableSeats
          : vehicleSeats,
        licence,
        contact,
        dailyDays,
        routes,
        allRoutes,
        isOneRide,
        oneRideDays,
        isInsideUni,
        insideUniversities,
        departCharges,
        ac,
        isWifi,
        ready: true,
        isOnline,
      };

      console.log('newUpdate', JSON.stringify(newProfile));
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: JSON.stringify(newProfile), // Convert the data to JSON string
      };

      fetch(addUpdateVehicle, options)
        .then(response => response.json())
        .then(data => {
          console.log('dattyia', data);
          // Work with the JSON data
          const {code, body, message} = data;

          if (code == 1) {
            const vehicleNew = data.body.vehicle;
            disptach(
              setErrorAlert({Title: 'Profile Updated Successfully', Status: 2}),
            );
            disptach(setProfile({...vehicle, ...vehicleNew}));
            navigation.goBack();
          } else {
            setErrorMsg(message);
          }
          setIsLoading(false);
        })
        .catch(error => {
          // Handle any errors that occurred during the fetch
          setIsLoading(false);

          console.error('Fetch error:', error);
        });

      // if (!vehicle.ready) {
      //   newProfile = {
      //     ...newProfile,
      //     rating: 0,
      //     noOfRatings: 0,
      //     reviews: [],
      //     ratingTotal: 0,
      //   };
      // }

      // setAddress(JSON.stringify(newProfile))
      // FirebaseUser.doc(vehicle.uid)
      //   .update(newProfile)
      //   .then(() => {
      //     setIsLoading(false);
      //     disptach(
      //       setErrorAlert({Title: 'Profile Updated Successfully', Status: 2}),
      //     );
      //     disptach(setProfile(newProfile));
      //     navigation.goBack();
      //   })
      //   .catch(err => {
      //     setErrorMsg('Something wrong');
      //     console.log('Internal error while Updating a Restaurant');
      //   });
    }
    //  else {
    //     setIsEditMode(true)
    // }
  }

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        setIsLoading(false);
        setErrorMsg(null);
      }, errorTime);
    }
  }, [errorMsg]);

  async function chooseFile() {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,

      quality: 0.5,
      multiple: true,

      maxWidth: 1500, // Set the maximum width to 800 pixels
      maxHeight: 1500,
      includeBase64: true,
    };
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
        const asset = callback.assets[0];
        const sizeKB = asset.fileSize / 1000000;
        console.log(sizeKB);
        const source = asset.uri;
        if (sizeKB <= 1) {
          setImageLoading('vehicle');
          // setVehicleImage(source);
          uploadImage(source, 'vehicle');
        } else {
          setErrorMsg(`Maximum Image Size is 1 MB`);
        }
        // console.log(source);
      } else if (callback.didCancel) {
        console.log('didCancel');
      } else if (callback.errorCode) {
        console.log('errorCode');
      }
    });
  }

  async function chooseFileMenu(i) {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,

      quality: 0.5,
      multiple: true,

      maxWidth: 1500, // Set the maximum width to 800 pixels
      maxHeight: 1500,
      includeBase64: true,
    };
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
        const asset = callback.assets[0];
        const sizeKB = asset.fileSize / 1000000;
        const source = asset.uri;
        if (sizeKB <= 1) {
          if (i != null) {
            setImageLoading(i + 1);

            const name = 'menu' + i.toString();
            uploadImage(source, name, i);
          } else {
            setImageLoading('new');

            const name = 'menu' + MenuImages.length.toString();

            uploadImage(source, name, i);
          }
        } else {
          setErrorMsg(`Maximum Image Size is 1 MB`);
        }
        // console.log(source);
      } else if (callback.didCancel) {
        console.log('didCancel');
      } else if (callback.errorCode) {
        console.log('errorCode');
      }
    });
  }

  const uploadImage = async (uri, name, i) => {
    const path = `images/drivers/${profile.uid}/${name}`;
    storage()
      .ref(path)
      .putFile(uri)
      .then(s => {
        storage()
          .ref(path)
          .getDownloadURL()
          .then(uri => {
            if (name == 'vehicle') {
              setVehicleImage(uri);
              setImageLoading(null);
              console.log('uri recieved background', uri);
            } else {
              // MenuImagesURI.push(uri)
              // setMenuImagesURI(MenuImagesURI)
              // console.log('uri recieved' + name)
              if (i != null) {
                let copy = [...MenuImages];
                copy[i] = uri;
                setMenuImages(copy);

                console.log('uri recieved ', name, typeof i);

                setChange(!change);
              } else {
                let copy = [...MenuImages];
                copy.push(uri);
                setMenuImages(copy);
                console.log('uri recieved ', name);
              }
              setImageLoading(null);
            }
          })
          .catch(e => {
            setImageLoading(null);
            setErrorMsg('Something Wrong');

            console.log('er', e);
          });
      })
      .catch(e => {
        setImageLoading(null);
        setErrorMsg('Something Wrong');

        console.log('er', e);
      });

    // try {
    //     await task;
    // } catch (e) {
    //     console.error(e);
    // }
  };
  const DaysShow = ({list = [], setList}) => {
    return (
      <View
        style={{
          width: '100%',
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {allDays.map((it, i) => {
          const is = list.findIndex(li => li == it) != -1;

          return (
            <>
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                onPress={() =>
                  setList(is ? list.filter(it2 => it2 != it) : [it, ...list])
                }
                style={[
                  styles.backItem,
                  {
                    backgroundColor: is ? myColors.primaryT : myColors.divider,
                    width: myWidth(11.82),
                    paddingVertical: myHeight(0.6),
                    paddingHorizontal: myWidth(0),
                    justifyContent: 'center',
                  },
                ]}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: myFontSize.small3,
                    fontFamily: myFonts.bodyBold,
                    color: is ? myColors.background : myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  {it}
                </Text>
              </TouchableOpacity>
              {i != 6 && <Spacer key={i} paddingEnd={myWidth(1.5)} />}
            </>
          );
        })}
      </View>
    );
  };

  const YesNo = ({fav, setFac}) => {
    return (
      <View
        style={{
          width: '100%',
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFac(true)}
          style={[
            styles.backItem,
            {
              backgroundColor: fav ? myColors.primaryT : myColors.divider,
              paddingVertical: myHeight(0.6),
              width: myWidth(18),
              paddingHorizontal: myWidth(0),
              justifyContent: 'center',
            },
          ]}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: myFontSize.body,
              fontFamily: myFonts.bodyBold,
              color: fav ? myColors.background : myColors.text,
              letterSpacing: myLetSpacing.common,
              includeFontPadding: false,
              padding: 0,
            }}>
            Yes
          </Text>
        </TouchableOpacity>
        <Spacer paddingEnd={myWidth(2.5)} />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFac(false)}
          style={[
            styles.backItem,
            {
              backgroundColor: !fav ? myColors.primaryT : myColors.background,
              paddingVertical: myHeight(0.6),
              width: myWidth(18),
              paddingHorizontal: myWidth(0),
              justifyContent: 'center',
            },
          ]}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: myFontSize.body,
              fontFamily: myFonts.bodyBold,
              color: !fav ? myColors.background : myColors.text,
              letterSpacing: myLetSpacing.common,
              includeFontPadding: false,
              padding: 0,
            }}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const CommonFaciUnies = ({name, small = false}) => {
    const fac = insideUniversities.findIndex(it => it == name) != -1;
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => {
          if (fac) {
            setInsideUniversities(insideUniversities.filter(it => it != name));
          } else {
            setInsideUniversities([name, ...insideUniversities]);
          }
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: myHeight(3.5),
              width: myHeight(3.5),
              paddingTop: myHeight(0.75),
            }}>
            <View
              style={{
                width: myHeight(2),
                height: myHeight(2),
                borderWidth: 1.5,
                borderColor: myColors.textL4,
              }}
            />
            {fac && (
              <Image
                style={{
                  height: myHeight(3),
                  width: myHeight(3),
                  resizeMode: 'contain',
                  tintColor: myColors.primaryT,
                  marginTop: -myHeight(2.8),
                }}
                source={require('../assets/profile/check.png')}
              />
            )}
          </View>
          {/* <Spacer paddingEnd={myWidth(0.3)} /> */}
          <Text
            style={[
              styles.textCommon,
              {
                fontFamily: myFonts.bodyBold,
                fontSize: small ? myFontSize.body : myFontSize.xBody,
              },
            ]}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  // For Packages
  const CommonFaciPackage = ({name}) => {
    const fac = packages.findIndex(it => it == name) != -1;
    return (
      <TouchableOpacity
        style={[
          styles.backItem,
          {
            backgroundColor: fac ? myColors.primaryT : myColors.divider,
            width: myWidth(21),
            paddingHorizontal: 0,
            justifyContent: 'center',
          },
        ]}
        activeOpacity={0.75}
        onPress={() => {
          if (fac) {
            setPackages(packages.filter(it => it != name));
          } else {
            setPackages([name, ...packages]);
          }
        }}>
        <Text
          style={{
            fontSize: myFontSize.xSmall,
            fontFamily: myFonts.bodyBold,
            color: fac ? myColors.background : myColors.text,
            letterSpacing: myLetSpacing.common,
            includeFontPadding: false,
            padding: 0,
          }}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };
  // For Days

  const CommonFaciDays = ({name, setDailyDays, dailyDays}) => {
    const isAll = dailyDays.length == 7;
    const fac =
      name == 'All' && isAll
        ? true
        : dailyDays.findIndex(it => it == name) != -1 && !isAll;
    return (
      <TouchableOpacity
        disabled={isAll && name != 'All'}
        activeOpacity={0.75}
        onPress={() => {
          if (name == 'All') {
            setDailyDays(isAll ? [] : allDays);
          } else {
            setDailyDays(
              fac ? dailyDays.filter(it => it != name) : [name, ...dailyDays],
            );
          }
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: myWidth(23),
            alignItems: 'center',
          }}>
          <View
            style={{
              height: myHeight(3.5),
              width: myHeight(3.5),
              paddingTop: myHeight(0.75),
            }}>
            <View
              style={{
                width: myHeight(2.2),
                height: myHeight(2.2),
                borderWidth: 1.5,
                borderColor: myColors.textL4,
              }}
            />
            {fac && (
              <Image
                style={{
                  height: myHeight(3.3),
                  width: myHeight(3.3),
                  resizeMode: 'contain',
                  tintColor: myColors.primaryT,
                  marginTop: -myHeight(3.1),
                }}
                source={require('../assets/profile/check.png')}
              />
            )}
          </View>
          {/* <Spacer paddingEnd={myWidth(0.3)} /> */}
          <Text
            style={[
              styles.textCommon,
              {
                fontFamily: myFonts.bodyBold,
                fontSize: myFontSize.xBody,
                color:
                  isAll && name != 'All' ? myColors.offColor : myColors.text,
              },
            ]}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const CommonFaci = ({name, fac, setFAc}) => (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => {
        setFAc(!fac);
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            height: myHeight(3.5),
            width: myHeight(3.5),
            paddingTop: myHeight(0.75),
          }}>
          <View
            style={{
              width: myHeight(2.3),
              height: myHeight(2.3),
              borderWidth: 1.5,
              borderColor: myColors.textL4,
            }}
          />
          {fac && (
            <Image
              style={{
                height: myHeight(3.3),
                width: myHeight(3.3),
                resizeMode: 'contain',
                tintColor: myColors.primaryT,
                marginTop: -myHeight(3.1),
              }}
              source={require('../assets/profile/check.png')}
            />
          )}
        </View>
        {/* <Spacer paddingEnd={myWidth(0.3)} /> */}
        <Text
          style={[
            styles.textCommon,
            {
              fontFamily: myFonts.bodyBold,
              fontSize: myFontSize.body3,
            },
          ]}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
  const CommonFaci2 = ({name, fac, setFAc, ImageSize = 0, ImageSrc = null}) => (
    <TouchableOpacity
      style={[
        styles.backItem,
        {backgroundColor: fac ? myColors.primaryT : myColors.background},
      ]}
      activeOpacity={0.75}
      onPress={() => {
        setFAc(!fac);
      }}>
      {ImageSrc ? (
        <>
          <Image
            style={{
              width: ImageSize,
              height: ImageSize,
              resizeMode: 'contain',
              marginTop: myHeight(0),
              tintColor: fac ? myColors.background : myColors.textL4,
            }}
            source={ImageSrc}
          />

          <Spacer paddingEnd={myWidth(1.5)} />
        </>
      ) : null}

      <Text
        style={{
          fontSize: myFontSize.body,
          fontFamily: myFonts.bodyBold,
          color: fac ? myColors.background : myColors.text,
          letterSpacing: myLetSpacing.common,
          includeFontPadding: false,
          padding: 0,
        }}>
        {name}
      </Text>
    </TouchableOpacity>
  );

  const verifyLink = async () => {
    const text = '2';
    const isValid = text.toString().includes(('https' || 'http') && 'maps');
    //    (https|http)maps
    if (isValid) {
      setLocLink(text);
      return;
    } else {
      setErrorMsg('Invalid Url');
    }

    // setLocLink(text);
  };
  function onChangeImage(param) {
    chooseFileMenu(param);
  }
  function onViewImage() {
    navigation.navigate('ImageViewer', {images: [{uri: vehicleImage}], i: 0});
  }

  function onPaste() {
    if (locLink) {
      setLocLink(null);
      return;
    }
    verifyLink();
  }

  const TimingsCom = ({i}) => {
    const single = timmings[i];
    return (
      <View
        key={i}
        style={{
          marginVertical: myHeight(1),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={[
            styles.textCommon,
            {
              flex: 1,
              fontFamily: myFonts.body,
              fontSize: myFontSize.xxBody,
              color: myColors.text,
              textAlignVertical: 'center',
              // marginTop: -myHeight(0.5)
            },
          ]}>
          {single.day}
        </Text>

        {single.open && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShowTimeModal({
                  i,
                  start: true,
                  current: single.startCurrent,
                });
              }}
              style={{
                paddingVertical: myHeight(0.8),
                paddingHorizontal: myWidth(2),
                backgroundColor: myColors.offColor7,
                borderRadius: 7,
              }}>
              <Text
                numberOfLines={1}
                style={[
                  styles.textCommon,
                  {
                    fontFamily: myFonts.bodyBold,
                    fontSize: myFontSize.body,
                    minWidth: myFontSize.body + myWidth(13),
                    textAlign: 'center',
                    color: single.startTime ? myColors.text : myColors.textL4,
                  },
                ]}>
                {single.startTime ? single.startTime : 'SELECT'}
              </Text>
            </TouchableOpacity>

            <Spacer paddingEnd={myWidth(1)} />
            <Text
              numberOfLines={1}
              style={[
                styles.textCommon,
                {
                  fontFamily: myFonts.bodyBold,
                  fontSize: myFontSize.body,
                },
              ]}>
              -
            </Text>
            <Spacer paddingEnd={myWidth(1)} />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShowTimeModal({i, start: false, current: single.endCurrent});
              }}
              style={{
                paddingVertical: myHeight(0.8),
                paddingHorizontal: myWidth(2),
                backgroundColor: myColors.offColor7,
                borderRadius: 7,
              }}>
              <Text
                numberOfLines={1}
                style={[
                  styles.textCommon,
                  {
                    fontFamily: myFonts.bodyBold,
                    fontSize: myFontSize.body,
                    minWidth: myFontSize.body + myWidth(13),
                    textAlign: 'center',
                    color: single.endTime ? myColors.text : myColors.textL4,
                  },
                ]}>
                {single.endTime ? single.endTime : 'SELECT'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Spacer paddingEnd={myWidth(4)} />

        {/* Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            const copy = [...timmings];
            copy[i].open = !single.open;

            setTimmings(copy);
            setChange(!change);
          }}
          style={{
            paddingVertical: myHeight(0.8),
            paddingHorizontal: myWidth(4),
            borderRadius: 5,
            backgroundColor: single.open ? myColors.primaryT : 'red',
          }}>
          <Text
            style={[
              styles.textCommon,
              {
                fontFamily: myFonts.body,
                fontSize: myFontSize.body,
                color: myColors.background,
              },
            ]}>
            {single.open ? 'Open' : 'Close'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  function isFirstTime(isStart) {
    if (isStart) {
      const fil = timmings.filter(time => time.startTime.length > 0);
      return fil.length == 0;
    } else {
      const fil = timmings.filter(time => time.endTime.length > 0);
      return fil.length == 0;
    }
  }

  function checkTime(val, date, content) {
    const isFirst = isFirstTime(content.start);
    let copy = timmings;
    if (content.start) {
      if (isFirst) {
        copy = [];
        timmings.map(time => {
          const newDay = {
            ...time,
            startTime: val,
            startCurrent: date,
          };
          copy.push(newDay);
        });
      } else {
        copy[content.i].startTime = val;
        copy[content.i].startCurrent = date;
      }
    } else {
      if (isFirst) {
        copy = [];
        timmings.map(time => {
          const newDay = {
            ...time,
            endTime: val,
            endCurrent: date,
          };
          copy.push(newDay);
        });
      } else {
        copy[content.i].endTime = val;
        copy[content.i].endCurrent = date;
      }
    }
    setTimmings(copy);
    setChange(!change);
  }

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: myColors.background}}>
        <StatusbarH />
        {/* Top */}
        <View>
          <Spacer paddingT={myHeight(1.55)} />
          <View
            style={{
              paddingHorizontal: myWidth(4),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* Search */}

            {/* Arrow */}
            <TouchableOpacity
              onPress={() => onBackPress()}
              activeOpacity={0.7}
              style={{
                backgroundColor: myColors.primaryT,
                height: myHeight(4),
                width: myHeight(4),
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
            <Spacer paddingEnd={myWidth(5.5)} />
            <Text
              style={[
                styles.textCommon,
                {
                  fontFamily: myFonts.heading,
                  fontSize: myFontSize.xBody2,
                },
              ]}>
              Driver Details
            </Text>
          </View>
          <Spacer paddingT={myHeight(1.3)} />

          <View
            style={{height: myHeight(0.2), backgroundColor: myColors.divider}}
          />
        </View>
        <KeyboardAwareScrollView
          // scrollEnabled={isEditMode}
          contentContainerStyle={{flexGrow: 1, paddingHorizontal: myWidth(4)}}
          showsVerticalScrollIndicator={false}>
          <Spacer paddingT={myHeight(2)} />
          {/* Background Image */}
          <TouchableOpacity
            disable={imageLoading == 'vehicle'}
            activeOpacity={0.75}
            onPress={() => {
              // if (vehicleImage) {
              //     setShowChangeModal(true)
              // }
              // else {
              //     chooseFile()
              // }
              chooseFile();

              // onChangeImage()
            }}
            style={{
              height: myHeight(20),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: myWidth(4),
              backgroundColor: myColors.primaryL6,
              borderWidth: myHeight(0.4),
              borderColor: vehicleImage
                ? myColors.background
                : myColors.primaryL6,
            }}>
            {imageLoading == 'vehicle' ? (
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  backgroundColor: myColors.offColor7,
                }}>
                <Text
                  style={[
                    styles.textCommon,
                    {
                      fontFamily: myFonts.body,
                      fontSize: myFontSize.body,
                      textAlign: 'center',
                    },
                  ]}>
                  Loading...
                </Text>
              </View>
            ) : vehicleImage ? (
              <ImageUri
                width={'100%'}
                height={'100%'}
                resizeMode="cover"
                borderRadius={0}
                uri={vehicleImage}
              />
            ) : (
              <View>
                <Text
                  style={[
                    styles.textCommon,
                    {
                      fontFamily: myFonts.body,
                      fontSize: myFontSize.body4,
                    },
                  ]}>
                  Upload Van Photo
                </Text>
                <Text
                  style={[
                    styles.textCommon,
                    {
                      fontFamily: myFonts.body,
                      fontSize: myFontSize.small3,
                      textAlign: 'center',
                    },
                  ]}>
                  maximum size 1 MB
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Spacer paddingT={myHeight(2.7)} />
          {/* Vehicle Details */}
          <View>
            <Text style={styles.heading}>Van Info</Text>

            <Spacer paddingT={myHeight(1)} />
            {/*Vehicle Name & Modal Year*/}

            <View style={styles.inputCont}>
              <TextInput
                placeholder="Brand - e.g Suzuki Bolan"
                autoCorrect={false}
                maxLength={35}
                placeholderTextColor={myColors.offColor}
                selectionColor={myColors.primary}
                cursorColor={myColors.primaryT}
                value={vehicleName}
                onChangeText={setVehicleName}
                style={{
                  padding: 0,
                  backgroundColor: myColors.background,
                  fontFamily: myFonts.bodyBold,
                  fontSize: myFontSize.body,

                  // textAlign: 'center'
                }}
              />
            </View>

            <Spacer paddingT={myHeight(2)} />
            <View style={styles.inputCont}>
              <TextInput
                placeholder="Modal Year - e.g 2000"
                autoCorrect={false}
                maxLength={4}
                placeholderTextColor={myColors.offColor}
                selectionColor={myColors.primary}
                cursorColor={myColors.primaryT}
                value={vehicleModal}
                onChangeText={setVehicleModal}
                keyboardType="numeric"
                style={{
                  padding: 0,
                  backgroundColor: myColors.background,
                  fontFamily: myFonts.bodyBold,
                  fontSize: myFontSize.body,

                  // textAlign: 'center'
                }}
              />
            </View>
            <Spacer paddingT={myHeight(2)} />

            {/* Number Plate &  Capacity*/}
            <View style={styles.inputCont}>
              <TextInput
                placeholder="Number Plate - e.g MKV-150"
                autoCorrect={false}
                maxLength={35}
                placeholderTextColor={myColors.offColor}
                selectionColor={myColors.primary}
                cursorColor={myColors.primaryT}
                value={vehicleNum}
                onChangeText={setVehicleNum}
                style={{
                  padding: 0,
                  backgroundColor: myColors.background,
                  fontFamily: myFonts.bodyBold,
                  fontSize: myFontSize.body,

                  // textAlign: 'center'
                }}
              />
            </View>

            <Spacer paddingT={myHeight(2)} />

            <View style={styles.inputCont}>
              <TextInput
                placeholder="Seats - e.g 12"
                autoCorrect={false}
                maxLength={4}
                placeholderTextColor={myColors.offColor}
                selectionColor={myColors.primary}
                cursorColor={myColors.primaryT}
                value={vehicleSeats}
                onChangeText={setVehicleSeats}
                keyboardType="numeric"
                style={{
                  padding: 0,
                  backgroundColor: myColors.background,
                  fontFamily: myFonts.bodyBold,
                  fontSize: myFontSize.body,

                  // textAlign: 'center'
                }}
              />
            </View>

            <Spacer paddingT={myHeight(2)} />
          </View>
          <Spacer paddingT={myHeight(0.5)} />

          {/* Driver  Info*/}
          <View>
            <Text style={styles.heading}>Driver Info</Text>
            <Spacer paddingT={myHeight(1)} />
            <View style={styles.inputCont}>
              <TextInput
                placeholder="Contact - e.g 03XXXXXXXXX"
                autoCorrect={false}
                maxLength={11}
                keyboardType="numeric"
                placeholderTextColor={myColors.offColor}
                selectionColor={myColors.primary}
                cursorColor={myColors.primaryT}
                value={contact}
                onChangeText={setContact}
                style={{
                  padding: 0,
                  backgroundColor: myColors.background,
                  fontFamily: myFonts.bodyBold,
                  fontSize: myFontSize.body,

                  // textAlign: 'center'
                }}
              />
            </View>

            <Spacer paddingT={myHeight(2)} />

            {/* Licence & Contact */}
            <View style={styles.inputCont}>
              <TextInput
                placeholder="Licence Number - e.g 123456789101112"
                autoCorrect={false}
                keyboardType="numeric"
                maxLength={15}
                placeholderTextColor={myColors.offColor}
                selectionColor={myColors.primary}
                cursorColor={myColors.primaryT}
                value={licence}
                onChangeText={setLicence}
                style={{
                  padding: 0,
                  backgroundColor: myColors.background,
                  fontFamily: myFonts.bodyBold,
                  fontSize: myFontSize.body,

                  textAlignVertical: 'center',
                }}
              />
            </View>
          </View>
          <Spacer paddingT={myHeight(3.5)} />

          {/* Amenities*/}
          <View>
            <Text style={styles.heading}>Amenities</Text>

            <Text style={styles.textH}>
              Kindly select the amenities available in your Van
            </Text>
            <Spacer paddingT={myHeight(1)} />

            <View
              style={{
                width: '100%',
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CommonFaci2
                fac={ac}
                setFAc={setAc}
                name={'Air Conditioned'}
                ImageSize={myHeight(2)}
                ImageSrc={require('../assets/home_main/home/ac2.png')}
              />

              <Spacer paddingEnd={myWidth(2.8)} />

              <CommonFaci2
                fac={isWifi}
                setFAc={setIsWifi}
                name={'Wifi'}
                ImageSize={myHeight(2.3)}
                ImageSrc={require('../assets/home_main/home/wifi.png')}
              />
            </View>
          </View>

          <Spacer paddingT={myHeight(3.5)} />

          {/* Availability*/}
          <View>
            <Text style={styles.heading}>Availability</Text>

            <Spacer paddingT={myHeight(1)} />
            <DaysShow list={dailyDays} setList={setDailyDays} />
          </View>

          <Spacer paddingT={myHeight(3.5)} />

          {/* Availability for Events*/}
          <View>
            <Text style={styles.heading}>Availability for Events</Text>

            <Spacer paddingT={myHeight(1)} />
            <YesNo fav={isOneRide} setFac={setOneRide} />

            <Collapsible collapsed={!isOneRide}>
              <Spacer paddingT={myHeight(1)} />

              <Text style={styles.textH}>Select Days</Text>
              <Spacer paddingT={myHeight(0.7)} />
              <DaysShow list={oneRideDays} setList={setOneRideDays} />
            </Collapsible>
          </View>

          <Spacer paddingT={myHeight(3.5)} />

          {/*Available For Inside Universities */}
          <View>
            <Text style={styles.heading}>
              Available For Inside Universities?
            </Text>

            <Spacer paddingT={myHeight(1.3)} />
            <YesNo fav={isInsideUni} setFac={setIsInsideUni} />
            <Collapsible
              collapsed={!isInsideUni}
              style={{paddingStart: myWidth(2)}}>
              <Spacer paddingT={myHeight(1)} />

              <Text style={styles.textH}>Select Universities</Text>
              <Spacer paddingT={myHeight(0.2)} />

              <View style={{justifyContent: 'space-between'}}>
                {allUnies.map((it, ii) => (
                  <CommonFaciUnies key={ii} name={it.name} small={true} />
                ))}
              </View>
              <Spacer paddingT={myHeight(1)} />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={[
                    styles.inputCont,
                    {flexDirection: 'row', alignItems: 'center'},
                  ]}>
                  <TextInput
                    placeholder="Charges between Departs"
                    autoCorrect={false}
                    placeholderTextColor={myColors.text}
                    selectionColor={myColors.primary}
                    cursorColor={myColors.primaryT}
                    editable={false}
                    style={{
                      width: 0,
                      padding: 0,
                      textAlignVertical: 'center',
                      fontFamily: myFonts.body,
                      fontSize: myFontSize.xxSmall,
                      backgroundColor: myColors.background,

                      // textAlign: 'center'
                    }}
                  />
                  <TextInput
                    placeholder="Charges between Departs"
                    maxLength={6}
                    autoCorrect={false}
                    placeholderTextColor={myColors.offColor}
                    selectionColor={myColors.primary}
                    cursorColor={myColors.primaryT}
                    value={departCharges}
                    onChangeText={SetDepartCharges}
                    keyboardType="numeric"
                    style={{
                      fontFamily: myFonts.body,
                      fontSize: myFontSize.xxSmall,
                      flex: 1,
                      padding: 0,
                      backgroundColor: myColors.background,

                      // textAlign: 'center'
                    }}
                  />

                  <TextInput
                    placeholder=" Rs"
                    autoCorrect={false}
                    placeholderTextColor={myColors.text}
                    selectionColor={myColors.primary}
                    cursorColor={myColors.primaryT}
                    editable={false}
                    style={{
                      padding: 0,
                      textAlignVertical: 'center',
                      fontFamily: myFonts.body,
                      fontSize: myFontSize.xxSmall,
                      backgroundColor: myColors.background,

                      // textAlign: 'center'
                    }}
                  />
                </View>
              </View>
            </Collapsible>
          </View>

          <Spacer paddingT={myHeight(3.5)} />

          {/*Available for One-Time Rides?*/}
          <View>
            <Text style={styles.heading}>Available for One-Time Rides?</Text>
            <Text style={styles.textH}>
              Do you provide one-time ride i.e carpooling service?
            </Text>

            <Spacer paddingT={myHeight(1.3)} />
            <YesNo fav={isOnline} setFac={setIsOnline} />
          </View>

          <Spacer paddingT={myHeight(3.5)} />

          {/*Billing Frequency*/}
          <View>
            <Text style={styles.heading}>Billing Frequency</Text>

            <Spacer paddingT={myHeight(1.3)} />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <CommonFaciPackage name={'Daily'} />

              <CommonFaciPackage name={'Weekly'} />
              <CommonFaciPackage name={'Monthly'} />
              <CommonFaciPackage name={'Yearly'} />
            </View>
          </View>

          <Spacer paddingT={myHeight(3.5)} />
          {/*Routes */}
          <View>
            <Text style={styles.heading}>Routes and Timings</Text>
            <Text style={styles.textH}>
              Select your routes against time. At least one.
            </Text>

            <Spacer paddingT={myHeight(1)} />
            {selectedItem.map((it, i) => {
              return (
                <View
                  key={i}
                  style={{
                    marginTop: myHeight(0.8),
                    paddingHorizontal: myWidth(2),
                    borderWidth: myHeight(0.15),
                    borderColor: myColors.divider,
                    paddingVertical: myHeight(0.3),
                    backgroundColor: myColors.primaryL6,
                    borderRadius: myWidth(1.5),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        styles.textCommon,
                        {
                          fontFamily: myFonts.heading,
                          fontSize: myFontSize.body,
                        },
                      ]}>
                      {it.time}
                    </Text>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          setShowLoc({...it, index: i});
                        }}
                        style={{
                          paddingVertical: myHeight(0.7),
                          paddingHorizontal: myWidth(3),
                          borderRadius: 5,
                          // backgroundColor: myColors.primaryT,
                        }}>
                        <Text
                          style={[
                            styles.textCommon,
                            {
                              fontFamily: myFonts.heading,
                              fontSize: myFontSize.body,
                              color: myColors.primaryT,
                            },
                          ]}>
                          {it.locations.length
                            ? `(${it.locations.length}) Edit Locations`
                            : 'Select Locations'}
                        </Text>
                      </TouchableOpacity>
                      <Spacer paddingEnd={myWidth(2)} />
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          selectedItem[i] = {
                            ...selectedItem[i],
                            show: !it.show,
                          };
                          setSelectedItems([...selectedItem]);
                        }}
                        style={{
                          width: myWidth(1) + myHeight(1.6),
                          paddingVertical: myHeight(0.5),
                        }}
                        disabled={it.locations.length == 0}>
                        {it.locations.length ? (
                          <Image
                            style={{
                              height: myHeight(1.8),
                              width: myHeight(1.8),
                              resizeMode: 'contain',
                              tintColor: myColors.primaryT,
                              paddingHorizontal: myWidth(1),
                              transform: [
                                {rotate: it.show ? '270deg' : '90deg'},
                              ],
                            }}
                            source={require('../assets/home_main/home/go.png')}
                          />
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Collapsible collapsed={!it.show} style={{}}>
                    {it.locations.map((loc, j) => (
                      <View
                        key={j}
                        style={{
                          flexDirection: 'row',
                          paddingVertical: myHeight(0.65),
                        }}>
                        <Text
                          style={[
                            styles.textCommon,
                            {
                              width: myWidth(0.2) + myFontSize.body * 2,
                              fontFamily: myFonts.bodyBold,
                              fontSize: myFontSize.xxSmall,
                            },
                          ]}>
                          {' '}
                          {j + 1}.
                        </Text>
                        <TouchableOpacity
                          disabled
                          activeOpacity={0.75}
                          style={{
                            // backgroundColor: myColors.background,
                            flex: 1,
                            paddingEnd: myWidth(3),
                          }}
                          onPress={() => null}>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.textCommon,
                              {
                                // flex: 1,
                                fontFamily: myFonts.body,
                                fontSize: myFontSize.xxSmall,
                              },
                            ]}>
                            {loc.name}
                          </Text>
                        </TouchableOpacity>
                        <Spacer paddingEnd={myWidth(2)} />

                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => {
                            selectedItem[i] = {
                              ...selectedItem[i],
                              locations: selectedItem[i].locations.filter(
                                it => it.id != loc.id,
                              ),
                            };
                            setSelectedItems([...selectedItem]);
                          }}
                          style={{
                            width: myWidth(1) + myHeight(1.6),
                            paddingHorizontal: myWidth(0),
                            paddingTop: myHeight(0.8),
                          }}>
                          {
                            <Image
                              style={{
                                height: myHeight(1.6),
                                width: myHeight(1.6),
                                resizeMode: 'contain',
                                tintColor: myColors.textL4,
                                paddingHorizontal: myWidth(1),
                              }}
                              source={require('../assets/account/close.png')}
                            />
                          }
                        </TouchableOpacity>
                      </View>
                    ))}
                  </Collapsible>
                </View>
              );
            })}
          </View>

          <Spacer paddingT={myHeight(3.5)} />

          {/* Description */}
          <View>
            <Text style={styles.heading}>Description </Text>
            <Spacer paddingT={myHeight(1)} />
            <TextInput
              placeholder="Write something you want your customer to know about your service..."
              multiline={true}
              autoCorrect={false}
              maxLength={100}
              numberOfLines={2}
              placeholderTextColor={myColors.offColor}
              selectionColor={myColors.primary}
              cursorColor={myColors.primaryT}
              value={description}
              onChangeText={SetDescription}
              style={{
                height: myFontSize.body * 2 + myHeight(13),
                textAlignVertical: 'top',
                borderRadius: myWidth(2),
                width: '100%',
                paddingBottom: ios
                  ? myHeight(1.2)
                  : myHeight(100) > 600
                  ? myHeight(0.8)
                  : myHeight(0.1),
                paddingTop: ios
                  ? myHeight(1.2)
                  : myHeight(100) > 600
                  ? myHeight(1.2)
                  : myHeight(0.3),
                fontSize: myFontSize.xxSmall,
                color: myColors.text,
                includeFontPadding: false,
                fontFamily: myFonts.body,
                paddingHorizontal: myWidth(3),
                backgroundColor: myColors.background,
                borderWidth: myHeight(0.1),
                borderColor: myColors.dot,
              }}
            />
          </View>

          <Spacer paddingT={myHeight(4)} />
        </KeyboardAwareScrollView>

        <View style={{backgroundColor: myColors.background}}>
          <View style={{height: 1, backgroundColor: myColors.offColor}} />

          <Spacer paddingT={myHeight(3)} />

          <TouchableOpacity
            onPress={onSave}
            activeOpacity={0.8}
            style={{
              width: myWidth(92),
              alignSelf: 'center',
              paddingVertical: myHeight(1.3),
              borderRadius: myHeight(1.4),
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              backgroundColor: myColors.background,
              borderWidth: myHeight(0.15),
              borderColor: myColors.textL4,
            }}>
            <Text
              style={[
                styles.textCommon,
                {
                  fontFamily: myFonts.heading,
                  fontSize: myFontSize.body3,
                  color: myColors.text,
                },
              ]}>
              Save
            </Text>
          </TouchableOpacity>

          <Spacer paddingT={myHeight(3)} />
        </View>
        {showChangeModal && (
          <ChangeImageView
            onChange={onChangeImage}
            onView={onViewImage}
            onHide={setShowChangeModal}
          />
        )}
        {showTimeModal && (
          <CalenderDate
            show={setShowTimeModal}
            content={showTimeModal}
            value={checkTime}
          />
        )}
        {errorMsg && <MyError message={errorMsg} />}

        {isLoading && <Loader />}
      </SafeAreaView>

      {showLoc ? (
        <Search
          locat={showLoc.locations}
          selected={selectedItem}
          setShowLoc={setShowLoc}
          index={showLoc.index}
          setSelected={setSelectedItems}
        />
      ) : null}
      {warning && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            backgroundColor: '#00000042',
            height: '100%',
            width: myWidth(100),
            alignItems: 'center',
            paddingHorizontal: myWidth(4.5),
          }}>
          <Animated.View
            // entering={}
            style={{
              width: '100%',
              backgroundColor: myColors.background,
              paddingHorizontal: myWidth(4.6),
              borderRadius: myHeight(1.5),
            }}>
            <Spacer paddingT={myHeight(2.5)} />
            <Text
              style={{
                textAlign: 'center',
                fontSize: myFontSize.body,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>
              Are you sure you want to back?{'\n'}
            </Text>
            <Spacer paddingT={myHeight(2)} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {/* NO */}
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setWarning(false)}
                style={{
                  width: '43%',
                  borderWidth: myHeight(0.09),
                  borderColor: myColors.primaryT,
                  borderRadius: myHeight(0.8),
                  paddingVertical: myHeight(0.8),
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: myFontSize.xBody,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.primaryT,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  No
                </Text>
              </TouchableOpacity>
              {/* Yes */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
                style={{
                  width: '43%',
                  borderWidth: myHeight(0.09),
                  borderColor: myColors.primaryT,
                  borderRadius: myHeight(0.8),
                  paddingVertical: myHeight(0.8),
                  backgroundColor: myColors.primaryT,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: myFontSize.xBody,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.background,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
            <Spacer paddingT={myHeight(3)} />
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
  inputCont: {
    borderRadius: myWidth(1.5),
    flex: 1,
    paddingVertical: myHeight(0.5),
    paddingHorizontal: myWidth(3),
    color: myColors.text,
    borderWidth: myHeight(0.1),
    borderRadius: myWidth(2),
    backgroundColor: myColors.background,
    // borderWidth: 0.7,
    borderColor: myColors.dot,
  },
  backItem: {
    paddingHorizontal: myWidth(5),
    paddingVertical: myHeight(0.75),
    borderRadius: myWidth(100),
    backgroundColor: myColors.background,
    borderWidth: myHeight(0.1),
    borderColor: myColors.divider,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    fontSize: myFontSize.body4,
    fontFamily: myFonts.bodyBold,
    color: myColors.textL4,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
  textH: {
    fontSize: myFontSize.xxSmall,
    fontFamily: myFonts.bodyBold,
    color: myColors.textL4,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
});
