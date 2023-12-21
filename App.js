import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, Platform, TouchableOpacity, StyleSheet, PermissionsAndroid, LogBox } from 'react-native';
// import { MMKV } from 'react-native-mmkv';
import { myColors } from './ultils/myColors';
import { myHeight, printWithPlat } from './components/common';
import { AppNavigator } from './components/app_navigator';
import { enableScreens } from 'react-native-screens';
import { Provider, useDispatch, useStore } from 'react-redux';
import storeRedux from './redux/store_redux';
import SplashScreen from 'react-native-splash-screen'
import { getCartLocal } from './components/functions/storageMMKV';
import { dataFullData, verificationCode } from './components/functions/functions';
import { notificationListeners, requestUserPermission } from './components/RootNavigation';
import Geolocation from '@react-native-community/geolocation';
import { setCurrentLocation } from './redux/location_reducer';
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
  useEffect(() => {
    const api = 'https://fcm.googleapis.com/v1/projects/foodapp-edd7e/messages:send'
    const myToken = 'dph9AvipQKa-rwb7sJG_K7:APA91bEo3djpvpDx9GFN_UEjJ2lMQBfzSe1fEsA5GQccV49_FOTYf_bdyWgl9-dFc3FXCtM3PSbAnmx4a9zLcTUwiHmLxZGFV5xqJVywztCOWyc0KlKN3n_0t60JejK8y1rRBGqUFKV9'
    // fetch(api, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json', // Specify the content type as JSON
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
    Geolocation.getCurrentPosition(info => {
      if (info) {

        console.log(info)
        storeRedux.dispatch(setCurrentLocation('yes'))
      } else {

      }
    });

    // const dispatch = useDispatch()
    // dispatch(setCart(getCartLocal()))
    // console.log(typeof getCartLocal())
    // printWithPlat("Is MMKV store successful? " + storage.contains('mberr'))
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

