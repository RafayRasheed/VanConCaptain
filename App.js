import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, Platform, TouchableOpacity, StyleSheet, PermissionsAndroid, LogBox, Alert } from 'react-native';
// import { MMKV } from 'react-native-mmkv';
import { myColors } from './ultils/myColors';
import { myHeight, printWithPlat } from './components/common';
import { AppNavigator } from './components/app_navigator';
import { enableScreens } from 'react-native-screens';
import { Provider, useDispatch, useStore } from 'react-redux';
import storeRedux from './redux/store_redux';
import SplashScreen from 'react-native-splash-screen'
import { getCartLocal } from './components/functions/storageMMKV';
import { dataFullData, getCurrentLocations, verificationCode } from './components/functions/functions';
import { notificationListeners, requestUserPermission } from './components/RootNavigation';
import Geolocation from '@react-native-community/geolocation';
import { setCurrentLocation } from './redux/location_reducer';
import { all } from 'axios';
import { FirebaseLocation } from './components/functions/firebase';
// import { enableLatestRenderer } from 'react-native-maps';

// enableLatestRenderer();
// const storage = new MMKV()
const pakd = ["Islamabad", "Ahmed Nager", "Ahmadpur East",
  "Ali Khan", "Alipur", "Arifwala", "Attock", "Bhera",
  "Bhalwal", "Bahawalnagar", "Bahawalpur", "Bhakkar",
  "Burewala", "Chillianwala", "Chakwal", "Chichawatni",
  "Chiniot", "Chishtian", "Daska", "Darya Khan", "Dera Ghazi",
  "Dhaular", "Dina", "Dinga", "Dipalpur", "Faisalabad",
  "Fateh Jhang", "Ghakhar Mandi", "Gojra", "Gujranwala",
  "Gujrat", "Gujar Khan", "Hafizabad", "Haroonabad", "Hasilpur",
  "Haveli", "Lakha", "Jalalpur", "Jattan", "Jampur", "Jaranwala",
  "Jhang", "Jhelum", "Kalabagh", "Karor Lal", "Kasur", "Kamalia",
  "Kamoke", "Khanewal", "Khanpur", "Kharian", "Khushab",
  "Kot Adu", "Jauharabad", "Lahore", "Lalamusa", "Layyah",
  "Liaquat Pur", "Lodhran", "Malakwal", "Mamoori",
  "Mailsi", "Mandi Bahauddin", "mian Channu", "Mianwali",
  "Multan", "Murree", "Muridke", "Mianwali Bangla",
  "Muzaffargarh", "Narowal", "Okara", "Renala Khurd",
  "Pakpattan", "Pattoki", "Pir Mahal", "Qaimpur",
  "Qila Didar", "Rabwah", "Raiwind", "Rajanpur",
  "Rahim Yar", "Rawalpindi", "Sadiqabad", "Safdarabad",
  "Sahiwal", "Sangla Hill", "Sarai Alamgir", "Sargodha",
  "Shakargarh", "Sheikhupura", "Sialkot", "Sohawa", "Soianwala",
  "Siranwali", "Talagang", "Taxila", "Toba Tek", "Vehari",
  "Wah Cantonment", "Wazirabad", "Badin", "Bhirkan",
  "Rajo Khanani", "Chak", "Dadu", "Digri", "Diplo",
  "Dokri", "Ghotki", "Haala", "Hyderabad", "Islamkot",
  "Jacobabad", "Jamshoro", "Jungshahi", "Kandhkot",
  "Kandiaro", "Karachi", "Kashmore", "Keti Bandar",
  "Khairpur", "Kotri", "Larkana", "Matiari", "Mehar",
  "Mirpur Khas", "Mithani", "Mithi", "Mehrabpur", "Moro",
  "Nagarparkar", "Naudero", "Naushahro Feroze", "Naushara",
  "Nawabshah", "Nazimabad", "Qambar", "Qasimabad", "Ranipur"
  , "Ratodero", "Rohri", "Sakrand", "Sanghar", "Shahbandar",
  "Shahdadkot", "Shahdadpur", "Shahpur Chakar", "Shikarpaur",
  "Sukkur", "Tangwani", "Tando Adam", "Tando Allahyar", "Tando Muhammad",
  "Thatta", "Umerkot", "Warah", "Abbottabad", "Adezai", "Alpuri",
  "Akora Khattak", "Ayubia", "Banda Daud", "Bannu", "Batkhela",
  "Battagram", "Birote", "Chakdara", "Charsadda", "Chitral",
  "Daggar", "Dargai", "Darya Khan", "dera Ismail", "Doaba", "Dir",
  "Drosh", "Hangu", "Haripur", "Karak", "Kohat", "Kulachi",
  "Lakki Marwat", "Latamber", "Madyan", "Mansehra", "Mardan",
  "Mastuj", "Mingora", "Nowshera", "Paharpur", "Pabbi",
  "Peshawar", "Saidu Sharif", "Shorkot", "Shewa Adda",
  "Swabi", "Swat", "Tangi", "Tank", "Thall", "Timergara",
  "Tordher", "Awaran", "Barkhan", "Chagai", "Dera Bugti",
  "Gwadar", "Harnai", "Jafarabad", "Jhal Magsi", "Kacchi",
  "Kalat", "Kech", "Kharan", "Khuzdar", "Killa Abdullah",
  "Killa Saifullah", "Kohlu", "Lasbela", "Lehri", "Loralai",
  "Mastung", "Musakhel", "Nasirabad", "Nushki", "Panjgur",
  "Pishin valley", "Quetta", "Sherani", "Sibi", "Sohbatpur",
  "Washuk", "Zhob", "Ziarat"]


const citiesPakistan = [
  'Karachi',
  'Lahore',
  'Faisalabad',
  'Rawalpindi',
  'Multan',
  'Gujranwala',
  'Peshawar',
  'Quetta',
  'Islamabad',
  'Sialkot',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Jhang',
  'Sheikhupura',
  'Larkana',
  'Gujrat',
  'Mardan',
  'Kasur',
  'Rahim Yar Khan',
  'Sahiwal',
  'Okara',
  'Wah Cantonment',
  'Dera Ghazi Khan',
  'Mingora',
  'Mirpur Khas',
  'Chiniot',
  'Nawabshah',
  'Kamoke',
  'Burewala',
  'Jhelum',
  'Sadiqabad',
  'Khanewal',
  'Hafizabad',
  'Kohat',
  'Jacobabad',
  'Shikarpur',
  'Muzaffargarh',
  'Khanpur',
  'Gojra',
  'Bahawalnagar',
  'Abbottabad',
  'Muridke',
  'Pakpattan',
  'Khuzdar',
  'Jaranwala',
  'Chishtian',
  'Daska',
  'Mandi Bahauddin',
  'Ahmedpur East',
  'Kamalia',
  'Tando Adam',
  'Khairpur',
  'Dera Ismail Khan',
  'Vehari',
  'Nowshera',
  'Dadu',
  'Wazirabad',
  'Khushab',
  'Charsadda',
  'Swabi',
  'Chakwal',
  'Mianwali',
  'Tando Allahyar',
  'Kot Adu',
  'Turbat',
  'Shahdadkot',
  'Haripur',
  'Lodhran',
  'Batgram',
  'Thatta',
  'Bagh',
  'Badin',
  'Mansehra',
  'Ziarat',
  'Muzaffarabad',
  'Tando Muhammad Khan',
  'Layyah',
  'Hangu',
  'Karak',
  'Nankana Sahib',
  'Bannu',
  'Lakki Marwat',
  'Jacobabad',
  'Shikarpur',
  'Tank',
  'Dera Allahyar',
  'Chaman',
  'Zhob',
  'Gwadar',
  'Hub',
  'Matiari',
  'Loralai',
  'Dera Murad Jamali',
  'Balakot',
  'Ghotki',
  'Sibi',
  'Zahedan',
  'Shahkot',
  'Narowal',
  'Kundian',
  'Kandhkot',
  'Kotli',
  'Toba Tek Singh',
  'Jampur',
  'Shahdadpur',
  'Ghotki',
  'Rajanpur',
  'Renala Khurd',
  'Havelian',
  'Lala Musa',
  'Kambar',
  'Kharan',
  'Usta Muhammad',
  'Samundri',
  'Jatoi',
  'Vihari',
  'Kabirwala',
  'Mian Channu',
  'Haroonabad',
  'Bhakkar',
  'Chuhar Kana',
  'Kahuta',
  'Tando Jam',
  'Umarkot',
  'Hassan Abdal',
  'Alipur',
  'Lodhran',
  'Pindi Gheb',
  'Jamshoro',
  'Pattoki',
  'Kot Radha Kishan',
  'Turbat',
  'Kasur',
  'Nankana Sahib',
  'Pasni',
  'Gaddani',
  'Dalbandin',
  'Chilas',
  'Kalat',
  'Taftan',
  'Panjgur',
  'Surab',
  'Mastung',
  'Tump',
];
export default function App() {
  // const dispatch = useDispatch()
  // const store = useStore()
  const sss = [
    { lat: 24.90571769, long: 67.07942426 },
    { lat: 24.86017029, long: 67.06177533 },
    { lat: 24.94131856, long: 67.04685688 },
    { lat: 24.84926942, long: 67.0050171 },
    { lat: 24.8269049, long: 67.02859908 },
    { lat: 24.8269049, long: 67.02859908 },
    { lat: 24.80913553, long: 67.06273288 },
    { lat: 24.85130169, long: 67.02921867 },
    { lat: 24.91473807, long: 67.12781936 },
    { lat: 24.86556074, long: 67.02477962 },
    { lat: 24.87515103, long: 67.05315471 },
    { lat: 24.87408034, long: 67.07406521 },
    { lat: 24.84155621, long: 67.05782712 },
    { lat: 24.84155621, long: 67.05782712 },
    { lat: 24.92543614, long: 67.06112623 },
    { lat: 24.87468626, long: 67.08788127 },
    { lat: 24.92466507, long: 67.03394473 },
    { lat: 24.92466507, long: 67.03394473 },
    { lat: 24.80112033, long: 67.07364142 },
    { lat: 24.86477957, long: 67.05527902 },
    { lat: 24.8269049, long: 67.02859908 },
    { lat: 24.80843434, long: 67.06225812 },
    { lat: 24.81608875, long: 67.04265118 }, // Note: There's a string value in the long' property.
    { lat: 24.85643699, long: 67.02758789 },
    { lat: 24.8489019, long: 67.00295448 },
    { lat: 24.80702465, long: 67.03820407 },
    { lat: 24.83506935, long: 67.09997267 },
    { lat: 24.94131856, long: 67.04685688 },
    { lat: 24.88095448, long: 67.06595153 },
    { lat: 24.802474, long: 67.030249 },
    { lat: 24.92029155, long: 67.08289504 },
    { lat: 24.77920008, long: 67.05513954 },
    { lat: 24.88517368, long: 67.14581698 },
    { lat: 24.88517368, long: 67.14581698 },
    { lat: 24.82795409, long: 67.05436975 },
    { lat: 24.89143651, long: 67.08110601 },
    { lat: 24.90966358, long: 67.01042712 },
    { lat: 24.85523472, long: 67.00164557 },
    { lat: 24.85386693, long: 67.00945884 },
    { lat: 24.90588069, long: 67.11656213 },
    { lat: 24.85748593, long: 67.04579473 },
    { lat: 24.90334815, long: 67.18443274 },
    { lat: 24.868683, long: 67.074966 },
    { lat: 24.850927, long: 67.005358 },
    { lat: 24.83558782, long: 67.03320712 },
    { lat: 24.84926942, long: 67.0050171 },
    { lat: 24.829535, long: 67.084811 },
    { lat: 24.916225, long: 67.098906 },
    { lat: 24.861462, long: 67.009939 },
    { lat: 24.861462, long: 67.009939 },
    { lat: 24.8678000, long: 67.08415499 }, // Note: Both lat' and long' are the same values.
    { lat: 24.855264, long: 67.026132 },
    { lat: 24.910454, long: 67.011414 },
    { lat: 24.829535, long: 67.084811 },
    { lat: 24.900457, long: 67.16816 },
    { lat: 24.861462, long: 67.009939 },
    { lat: 24.824796, long: 67.031566 },
    { lat: 24.801362, long: 67.154677 },
    { lat: 24.833094, long: 67.098216 },
    { lat: 24.847355, long: 67.025643 },
    { lat: 24.847355, long: 67.025643 },
    { lat: 24.841648, long: 66.976878 },
    { lat: 24.841648, long: 66.976878 },
    { lat: 24.893506, long: 67.116834 },
    { lat: 24.883319, long: 67.089666 },
    { lat: 24.824796, long: 67.031566 },
    { lat: 24.833094, long: 67.098216 },
    { lat: 24.910454, long: 67.011414 },
    { lat: 24.861462, long: 67.009939 },
    { lat: 24.86, long: 67.1764 },
    { lat: 24.846, long: 67.02479 },
    { lat: 24.917, long: 66.968068 },
    { lat: 24.8477, long: 66.847756 },
    { lat: 24.858378, long: 67.0527 },
    { lat: 24.8218, long: 67.038794 },
    { lat: 24.919097, long: 67.095842 },
    { lat: 24.876796, long: 67.062678 },
    { lat: 24.935451, long: 67.040411 },
    { lat: 24.872339, long: 67.028027 },
    { lat: 24.84926942, long: 67.0050171 },
    { lat: 24.94131856, long: 67.04685688 },
    { lat: 24.8269049, long: 67.02859908 },
    { lat: 24.90571769, long: 67.07942426 },
    { lat: 24.80702465, long: 67.03820407 },
    { lat: 24.92466507, long: 67.03394473 },
    { lat: 24.83506935, long: 67.09997267 },
    { lat: 24.8269049, long: 67.02859908 },
    { lat: 24.802474, long: 67.030249 },
    { lat: 24.92543614, long: 67.06112623 },
    { lat: 24.80913553, long: 67.06273288 },
    { lat: 24.84926942, long: 67.0050171 },
    { lat: 24.8269049, long: 67.02859908 },
    { lat: 24.80112033, long: 67.07364142 },
    { lat: 24.8269049, long: 67.02859908 },
    { lat: 24.86017029, long: 67.06177533 },
    { lat: 24.87515103, long: 67.05315471 },
    { lat: 24.86556074, long: 67.02477962 },
    { lat: 24.85386693, long: 67.00945884 },
    { lat: 24.85130169, long: 67.02921867 },
    { lat: 24.83506935, long: 67.09997267 },
    { lat: 24.80702465, long: 67.03820407 },
    { lat: 24.90966358, long: 67.01042712 },
    { lat: 24.85643699, long: 67.02758789 },
    { lat: 24.87408034, long: 67.07406521 },
    { lat: 24.94131856, long: 67.04685688 },
    { lat: 24.90571769, long: 67.07942426 },
    { lat: 24.91473807, long: 67.12781936 },
    { lat: 24.83558782, long: 67.03320712 },
    { lat: 24.88095448, long: 67.06595153 },
    { lat: 24.868683, long: 67.074966 },
    { lat: 24.81608875, long: 67.04265118 },
    { lat: 24.86477957, long: 67.05527902 },
    { lat: 24.80913553, long: 67.06273288 },
    { lat: 24.85748593, long: 67.04579473 },
    { lat: 24.92029155, long: 67.08289504 },
    { lat: 24.92543614, long: 67.06112623 },
    { lat: 24.802474, long: 67.030249 }
  ];


  useEffect(() => {
    const api = 'https://fcm.googleapis.com/v1/projects/foodapp-edd7e/messages:send'
    const myToken = 'dph9AvipQKa-rwb7sJG_K7:APA91bEo3djpvpDx9GFN_UEjJ2lMQBfzSe1fEsA5GQccV49_FOTYf_bdyWgl9-dFc3FXCtM3PSbAnmx4a9zLcTUwiHmLxZGFV5xqJVywztCOWyc0KlKN3n_0t60JejK8y1rRBGqUFKV9'
    // fetch(api, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type: 'application/json', // Specify the content type as JSON
    //     // Authorization: myToken,
    //   },
    //   message: {
    //     token: myToken,
    //     notification: {
    //       "body": "This is an FCM notification message!",
    //       "title": "FCM Message"
    //     }
    //   }
    //   // body: JSON.stringify(postData) // Convert the data to JSON format
    // })
    //   .then(response => {
    //     console.log(response.json())
    //     return response.json(); // Parse the response as JSON
    //   })
    //   .then(data => {
    //     // Handle the response data
    //     console.log(data);
    //     console.log('data');
    //   })
    //   .catch(error => {
    //     // Handle errors
    //     console.error('Fetch error:', error);
    //   })

    // if (Platform.OS == 'android') {
    //   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).then((res) => {
    //     console.log("res+++++", res)
    //     if (!!res && res != 'granted') {
    //       requestUserPermission()

    //     }
    //     if (!!res && res == 'granted') {
    //       requestUserPermission()

    //     }
    //   }).catch(error => {
    //     alert('something wrong')
    //   })
    // } else {

    // }

  }, [])
  useEffect(() => {
    printWithPlat('Started Successfully')
    SplashScreen.hide()
    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs();


    // const allLocations = []
    // sss.map((loc, i) => {
    //   const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.long}`;
    //   console.log(apiUrl)
    //   fetch(apiUrl, {
    //     headers: {
    //       'Accept-Language': 'en',
    //     },
    //   })
    //     .then(response => response.json())
    //     .then(data => {

    //       // Handle the response data
    //       const { display_name, address } = data
    //       const { road, neighbourhood } = address
    //       let shortName = null
    //       if (road) {
    //         shortName = road
    //       }
    //       if (neighbourhood) {
    //         shortName = shortName ? `${shortName}, ${neighbourhood}` : neighbourhood
    //       }
    //       if (allLocations.findIndex(it => shortName != null && it.shortName == shortName) == -1) {

    //         const detail = ({ fullName: display_name, shortName, latitude: loc.lat, longitude: loc.long });
    //         allLocations.push(detail)
    //       }
    //       console.log(i + 1)
    //       if (i + 1 == sss.length) {
    //         FirebaseLocation.doc('locations').set({ Karachi: allLocations })
    //           .then(success => {
    //             console.log('success', success)
    //           })
    //           .catch(err => {
    //             showError('Something wrong', err)
    //           })

    //       }


    //     })
    //     .catch(error => {
    //       console.error('Error:', error);
    //     });
    // })
    // console.log('allLocations', allLocations)
    // FirebaseLocation.doc('locations').set({ Karachi: [{ lat: 10000, lng: 10000 }] })
    //   .then(success => {
    //     console.log('success', success)
    //   })
    //   .catch(err => {
    //     showError('Something wrong', err)
    //   })

    // Geolocation.getCurrentPosition(info => {
    //   if (info) {
    //     const { coords } = info
    //     const { latitude, longitude } = coords
    //     const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${24.8168778}&lon=${67.0345444}`;

    //     fetch(apiUrl, {
    //       headers: {
    //         'Accept-Language': 'en',
    //       },
    //     })
    //       .then(response => response.json())
    //       .then(data => {

    //         // Handle the response data
    //         const { display_name, address } = data
    //         const { road, neighbourhood } = address
    //         const detail = ({ fullName: display_name, shortName: `${road}, ${neighbourhood}`, latitude, longitude });
    //         storeRedux.dispatch(setCurrentLocation(detail))

    //       })
    //       .catch(error => {
    //         console.error('Error:', error);
    //       });
    //   } else {

    //   }
    // });


  }, [])
  const isAndroid = Platform.OS == 'android'
  // const OsVer = Platform.constants['Release']; Android Version like 9,10, 11
  const OsVer = Platform.Version; //API level like 27, 28, 22 

  return (
    <>
      {OsVer >= 23 &&
        <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} />
      }
      <Provider store={storeRedux}>
        <AppNavigator />
      </Provider>
    </>
  );
}

