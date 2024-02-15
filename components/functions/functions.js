import { Base64 } from 'js-base64';
import storeRedux from '../../redux/store_redux';
import { setCurrentLocation } from '../../redux/location_reducer';
import Geolocation from '@react-native-community/geolocation';
import { setErrorAlert } from '../../redux/error_reducer';
import { getDistance } from 'geolib';
import { FirebaseLocation } from './firebase';
import { setAreasLocation } from '../../redux/areas_reducer';
import firestore from '@react-native-firebase/firestore';

const karaAreas = [
  {
    "name": "Askari 1"
  },
  {
    "name": "Askari 2"
  },
  {
    "name": "Askari 3"
  },
  {
    "name": "Askari 4"
  },
  {
    "name": "Askari 5"
  },
  {
    "name": "Bahria Town - Precinct 1"
  },
  {
    "name": "Bahria Town - Precinct 10"
  },
  {
    "name": "Bahria Town - Precinct 11"
  },
  {
    "name": "Bahria Town - Precinct 12"
  },
  {
    "name": "Bahria Town - Precinct 13"
  },
  {
    "name": "Bahria Town - Precinct 14"
  },
  {
    "name": "Bahria Town - Precinct 15"
  },
  {
    "name": "Bahria Town - Precinct 16"
  },
  {
    "name": "Bahria Town - Precinct 17"
  },
  {
    "name": "Bahria Town - Precinct 18"
  },
  {
    "name": "Bahria Town - Precinct 19"
  },
  {
    "name": "Bahria Town - Precinct 2"
  },
  {
    "name": "Bahria Town - Precinct 20"
  },
  {
    "name": "Bahria Town - Precinct 21"
  },
  {
    "name": "Bahria Town - Precinct 22"
  },
  {
    "name": "Bahria Town - Precinct 23"
  },
  {
    "name": "Bahria Town - Precinct 24"
  },
  {
    "name": "Bahria Town - Precinct 25"
  },
  {
    "name": "Bahria Town - Precinct 26"
  },
  {
    "name": "Bahria Town - Precinct 27"
  },
  {
    "name": "Bahria Town - Precinct 28"
  },
  {
    "name": "Bahria Town - Precinct 29"
  },
  {
    "name": "Bahria Town - Precinct 3"
  },
  {
    "name": "Bahria Town - Precinct 30"
  },
  {
    "name": "Bahria Town - Precinct 31"
  },
  {
    "name": "Bahria Town - Precinct 32"
  },
  {
    "name": "Bahria Town - Precinct 33"
  },
  {
    "name": "Bahria Town - Precinct 4"
  },
  {
    "name": "Bahria Town - Precinct 5"
  },
  {
    "name": "Bahria Town - Precinct 6"
  },
  {
    "name": "Bahria Town - Precinct 7"
  },
  {
    "name": "Bahria Town - Precinct 8"
  },
  {
    "name": "Bahria Town - Precinct 9"
  },
  {
    "name": "BufferZone - Sector 15 A 1"
  },
  {
    "name": "BufferZone - Sector 15 A 2"
  },
  {
    "name": "BufferZone - Sector 15 A 3"
  },
  {
    "name": "BufferZone - Sector 15 A 4"
  },
  {
    "name": "BufferZone - Sector 15 A 5"
  },
  {
    "name": "BufferZone - Sector 15 B"
  },
  {
    "name": "BufferZone - Sector 16 A"
  },
  {
    "name": "BufferZone - Sector 16 B"
  },
  {
    "name": "Cantonment"
  },
  {
    "name": "Clifton - Block 1"
  },
  {
    "name": "Clifton - Block 2"
  },
  {
    "name": "Clifton - Block 3"
  },
  {
    "name": "Clifton - Block 4"
  },
  {
    "name": "Clifton - Block 5"
  },
  {
    "name": "Clifton - Block 6"
  },
  {
    "name": "Clifton - Block 7"
  },
  {
    "name": "Clifton - Block 8"
  },
  {
    "name": "Clifton - Block 9"
  },
  {
    "name": "Clifton - Kehkashan"
  },
  {
    "name": "DHA - Phase 1"
  },
  {
    "name": "DHA - Phase 2"
  },
  {
    "name": "DHA - Phase 3"
  },
  {
    "name": "DHA - Phase 4"
  },
  {
    "name": "DHA - Phase 5"
  },
  {
    "name": "DHA - Phase 6"
  },
  {
    "name": "DHA - Phase 7"
  },
  {
    "name": "DHA - Phase 8"
  },
  {
    "name": "DHA - Phase 9"
  },
  {
    "name": "F.B Area - Azizabad"
  },
  {
    "name": "F.B Area - B1 Area"
  },
  {
    "name": "F.B Area - B Area"
  },
  {
    "name": "F.B Area - Block 1"
  },
  {
    "name": "F.B Area - Block 10"
  },
  {
    "name": "F.B Area - Block 11"
  },
  {
    "name": "F.B Area - Block 12"
  },
  {
    "name": "F.B Area - Block 13"
  },
  {
    "name": "F.B Area - Block 14"
  },
  {
    "name": "F.B Area - Block 15"
  },
  {
    "name": "F.B Area - Block 16"
  },
  {
    "name": "F.B Area - Block 17"
  },
  {
    "name": "F.B Area - Block 18"
  },
  {
    "name": "F.B Area - Block 19"
  },
  {
    "name": "F.B Area - Block 2"
  },
  {
    "name": "F.B Area - Block 20"
  },
  {
    "name": "F.B Area - Block 21"
  },
  {
    "name": "F.B Area - Block 22"
  },
  {
    "name": "F.B Area - Block 3"
  },
  {
    "name": "F.B Area - Block 4"
  },
  {
    "name": "F.B Area - Block 5"
  },
  {
    "name": "F.B Area - Block 6"
  },
  {
    "name": "F.C Area - C1 Area"
  },
  {
    "name": "F.C Area - C Area"
  },
  {
    "name": "Garden - Garden East"
  },
  {
    "name": "Garden - Garden West"
  },
  {
    "name": "Garden - Soldier Bazaar"
  },
  {
    "name": "Gulistan-e-Johar - Block 1"
  },
  {
    "name": "Gulistan-e-Johar - Block 10"
  },
  {
    "name": "Gulistan-e-Johar - Block 11"
  },
  {
    "name": "Gulistan-e-Johar - Block 12"
  },
  {
    "name": "Gulistan-e-Johar - Block 13"
  },
  {
    "name": "Gulistan-e-Johar - Block 14"
  },
  {
    "name": "Gulistan-e-Johar - Block 15"
  },
  {
    "name": "Gulistan-e-Johar - Block 16"
  },
  {
    "name": "Gulistan-e-Johar - Block 17"
  },
  {
    "name": "Gulistan-e-Johar - Block 18"
  },
  {
    "name": "Gulistan-e-Johar - Block 19"
  },
  {
    "name": "Gulistan-e-Johar - Block 2"
  },
  {
    "name": "Gulistan-e-Johar - Block 20"
  },
  {
    "name": "Gulistan-e-Johar - Block 3"
  },
  {
    "name": "Gulistan-e-Johar - Block 4"
  },
  {
    "name": "Gulistan-e-Johar - Block 5"
  },
  {
    "name": "Gulistan-e-Johar - Block 6"
  },
  {
    "name": "Gulistan-e-Johar - Block 7"
  },
  {
    "name": "Gulistan-e-Johar - Block 8"
  },
  {
    "name": "Gulistan-e-Johar - Block 9"
  },
  {
    "name": "Gulshan-e-Hadeed - Data Nagar"
  },
  {
    "name": "Gulshan-e-Hadeed - EIDU Goth"
  },
  {
    "name": "Gulshan-e-Hadeed - Gulshan-e-Mauzzam"
  },
  {
    "name": "Gulshan-e-Hadeed - Gulshan-e-Rehman"
  },
  {
    "name": "Gulshan-e-Hadeed - Mehran Road"
  },
  {
    "name": "Gulshan-e-Hadeed - Phase 1"
  },
  {
    "name": "Gulshan-e-Hadeed - Phase 2"
  },
  {
    "name": "Gulshan-e-Hadeed - Phase 3"
  },
  {
    "name": "Gulshan-e-Hadeed - PTCL Satellite Station"
  },
  {
    "name": "Gulshan-e-Hadeed - Shah Latif Town"
  },
  {
    "name": "Gulshan-e-Hadeed - Shahnawaz Goth"
  },
  {
    "name": "Gulshan-e-Hadeed - Shah Town"
  },
  {
    "name": "Gulshan-e-Hadeed - Steel Town"
  },
  {
    "name": "Gulshan-e-Hadeed - TCP Godowns"
  },
  {
    "name": "Gulshan-e-Iqbal - Adamjee Nagar"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 1"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 10"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 11"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 12"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 13"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 14"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 15"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 16"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 17"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 18"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 19"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 2"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 3"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 4"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 5"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 6"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 7"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 8"
  },
  {
    "name": "Gulshan-e-Iqbal - Block 9"
  },
  {
    "name": "Gulshan-e-Iqbal - Civic Center"
  },
  {
    "name": "Gulshan-e-Iqbal - Dhoraji"
  },
  {
    "name": "Korangi - Abdullah Shah Noorani Pahari Colony"
  },
  {
    "name": "Korangi - Korangi Industrial Area"
  },
  {
    "name": "Korangi - Nasir Colony"
  },
  {
    "name": "Korangi - PAF Base Korangi Creek"
  },
  {
    "name": "Korangi - Zaman Town"
  },
  {
    "name": "Korangi - Zia Colony"
  },
  {
    "name": "Landhi - Alflah Housing Society"
  },
  {
    "name": "Landhi - Awami Colony"
  },
  {
    "name": "Landhi - Bagh-e-Korangi"
  },
  {
    "name": "Landhi - Bakhtawar Goth"
  },
  {
    "name": "Landhi - Barmi Colony"
  },
  {
    "name": "Landhi - Bhutto Nagar"
  },
  {
    "name": "Landhi - Future Colony"
  },
  {
    "name": "Landhi - Gulshan-e-Rafi"
  },
  {
    "name": "Landhi - Ilyas Goth"
  },
  {
    "name": "Landhi - Labour Colony"
  },
  {
    "name": "Landhi - Landhi Industrial Area"
  },
  {
    "name": "Landhi - Muslimabad Colony"
  },
  {
    "name": "Landhi - Muzaffarabad Colony"
  },
  {
    "name": "Landhi - Punjab Town"
  },
  {
    "name": "Landhi - Qasim Town"
  },
  {
    "name": "Landhi - Sadat Colony"
  },
  {
    "name": "Landhi - Shah Khalid Colony"
  },
  {
    "name": "Landhi - Sharafi Goth"
  },
  {
    "name": "Landhi - Zamanabad"
  },
  {
    "name": "Liaquatabad - Block 1"
  },
  {
    "name": "Liaquatabad - Block 10"
  },
  {
    "name": "Liaquatabad - Block 2"
  },
  {
    "name": "Liaquatabad - Block 3"
  },
  {
    "name": "Liaquatabad - Block 4"
  },
  {
    "name": "Liaquatabad - Block 5"
  },
  {
    "name": "Liaquatabad - Block 6"
  },
  {
    "name": "Liaquatabad - Block 7"
  },
  {
    "name": "Liaquatabad - Block 8"
  },
  {
    "name": "Liaquatabad - Block 9"
  },
  {
    "name": "Malir - Malir"
  },
  {
    "name": "Malir - Malir Cantt"
  },
  {
    "name": "Nazimabad - Block 1"
  },
  {
    "name": "Nazimabad - Block 2"
  },
  {
    "name": "Nazimabad - Block 3"
  },
  {
    "name": "Nazimabad - Block 4"
  },
  {
    "name": "Nazimabad - Block 5"
  },
  {
    "name": "North Karachi  - Sector 10"
  },
  {
    "name": "North Karachi  - Sector 11 - A"
  },
  {
    "name": "North Karachi  - Sector 11 - B"
  },
  {
    "name": "North Karachi  - Sector 11 - C 1"
  },
  {
    "name": "North Karachi  - Sector 11 - C 2"
  },
  {
    "name": "North Karachi  - Sector 11 - C 3"
  },
  {
    "name": "North Karachi  - Sector 11 - E"
  },
  {
    "name": "North Karachi  - Sector 11 - H"
  },
  {
    "name": "North Karachi  - Sector 11 - I"
  },
  {
    "name": "North Karachi  - Sector 11 - K"
  },
  {
    "name": "North Karachi  - Sector 11 - L"
  },
  {
    "name": "North Karachi  - Sector 2"
  },
  {
    "name": "North Karachi  - Sector 3"
  },
  {
    "name": "North Karachi  - Sector 4"
  },
  {
    "name": "North Karachi  - Sector 5 - A 1"
  },
  {
    "name": "North Karachi  - Sector 5 - A 2"
  },
  {
    "name": "North Karachi  - Sector 5 - A 3"
  },
  {
    "name": "North Karachi  - Sector 5 - A 4"
  },
  {
    "name": "North Karachi  - Sector 5 - B 1"
  },
  {
    "name": "North Karachi  - Sector 5 - B 2"
  },
  {
    "name": "North Karachi  - Sector 5 - B 3"
  },
  {
    "name": "North Karachi  - Sector 5 - B 4"
  },
  {
    "name": "North Karachi  - Sector 5 - C 1"
  },
  {
    "name": "North Karachi  - Sector 5 - C 2"
  },
  {
    "name": "North Karachi  - Sector 5 - C 3"
  },
  {
    "name": "North Karachi  - Sector 5 - C 4"
  },
  {
    "name": "North Karachi  - Sector 5 - I"
  },
  {
    "name": "North Karachi  - Sector 5 - J"
  },
  {
    "name": "North Karachi  - Sector 5 - K"
  },
  {
    "name": "North Karachi  - Sector 5 - L"
  },
  {
    "name": "North Karachi  - Sector 5 - M"
  },
  {
    "name": "North Karachi  - Sector 6"
  },
  {
    "name": "North Karachi  - Sector 7 - D 1"
  },
  {
    "name": "North Karachi  - Sector 7 - D 2"
  },
  {
    "name": "North Karachi  - Sector 7 - D 3"
  },
  {
    "name": "North Karachi  - Sector 7 - D 4"
  },
  {
    "name": "North Karachi  - Sector 8"
  },
  {
    "name": "North Karachi  - Sector 9"
  },
  {
    "name": "North Nazimabad - Block A"
  },
  {
    "name": "North Nazimabad - Block B"
  },
  {
    "name": "North Nazimabad - Block C"
  },
  {
    "name": "North Nazimabad - Block D"
  },
  {
    "name": "North Nazimabad - Block E"
  },
  {
    "name": "North Nazimabad - Block F"
  },
  {
    "name": "North Nazimabad - Block G"
  },
  {
    "name": "North Nazimabad - Block H"
  },
  {
    "name": "North Nazimabad - Block I"
  },
  {
    "name": "North Nazimabad - Block J"
  },
  {
    "name": "North Nazimabad - Block K"
  },
  {
    "name": "North Nazimabad - Block L"
  },
  {
    "name": "North Nazimabad - Block M"
  },
  {
    "name": "North Nazimabad - Block N"
  },
  {
    "name": "North Nazimabad - Block O"
  },
  {
    "name": "North Nazimabad - Block P"
  },
  {
    "name": "North Nazimabad - Block Q"
  },
  {
    "name": "North Nazimabad - Block R"
  },
  {
    "name": "North Nazimabad - Block S"
  },
  {
    "name": "North Nazimabad - Block T"
  },
  {
    "name": "Old Town - Bhimpora"
  },
  {
    "name": "Old Town - Bohra Pir"
  },
  {
    "name": "Old Town - Bombay Bazar"
  },
  {
    "name": "Old Town - Jodia Bazar"
  },
  {
    "name": "Old Town - Kagzi Bazar"
  },
  {
    "name": "Old Town - Kakri Ground"
  },
  {
    "name": "Old Town - Kamil Gali"
  },
  {
    "name": "Old Town - Khada Market"
  },
  {
    "name": "Old Town - Kharadar"
  },
  {
    "name": "Old Town - Lee Market"
  },
  {
    "name": "Old Town - Mithadar"
  },
  {
    "name": "Old Town - Nanwara"
  },
  {
    "name": "Old Town - Nishter Road"
  },
  {
    "name": "Old Town - Pan Mandi"
  },
  {
    "name": "Old Town - Ramswami"
  },
  {
    "name": "Old Town - Ranchorline"
  },
  {
    "name": "Orangi Town - Banaras Town"
  },
  {
    "name": "Orangi Town - Bangla Bazaar"
  },
  {
    "name": "Orangi Town - Bilal Colony"
  },
  {
    "name": "Orangi Town - Katti Pahari"
  },
  {
    "name": "Orangi Town - Moria Goth Orangi"
  },
  {
    "name": "Orangi Town - Orangi"
  },
  {
    "name": "Orangi Town - Sector 14 - A"
  },
  {
    "name": "Orangi Town - Sector 14 - C"
  },
  {
    "name": "Orangi Town - Thorani Goth"
  },
  {
    "name": "Baldiya Town"
  },
  {
    "name": "Baloch Colony"
  },
  {
    "name": "Civil Line"
  },
  {
    "name": "FC Area"
  },
  {
    "name": "Firdous Colony"
  },
  {
    "name": "Gulshan-e-Maymar"
  },
  {
    "name": "Hawksbay"
  },
  {
    "name": "I.I Chundrigar"
  },
  {
    "name": "Jamshed Road"
  },
  {
    "name": "K.D.A Officers"
  },
  {
    "name": "Kemari"
  },
  {
    "name": "Liyari"
  },
  {
    "name": "M.A Jinnah Rd"
  },
  {
    "name": "Manora"
  },
  {
    "name": "New Karachi"
  },
  {
    "name": "New Surjani"
  },
  {
    "name": "PIB Colony"
  },
  {
    "name": "Pipri Goth"
  },
  {
    "name": "Rizvia Society"
  },
  {
    "name": "Saddar"
  },
  {
    "name": "Scheme 33"
  },
  {
    "name": "Shabbirabad"
  },
  {
    "name": "P.E.C.H.S - Block 1"
  },
  {
    "name": "P.E.C.H.S - Block 2"
  },
  {
    "name": "P.E.C.H.S - Block 3"
  },
  {
    "name": "P.E.C.H.S - Block 4"
  },
  {
    "name": "P.E.C.H.S - Block 5"
  },
  {
    "name": "P.E.C.H.S - Block 6"
  },
  {
    "name": "P.E.C.H.S - Khalid Bin Walid"
  },
  {
    "name": "P.E.C.H.S - Tariq Road"
  },
  {
    "name": "S.I.T.E - Golimar"
  },
  {
    "name": "S.I.T.E - S.I.T.E"
  },
  {
    "name": "Shah Faisal Colony - Aswan Town"
  },
  {
    "name": "Shah Faisal Colony - Gulshan-e-Asghar"
  },
  {
    "name": "Shah Faisal Colony - Shah Faisal Colony 1"
  },
  {
    "name": "Shah Faisal Colony - Shah Faisal Colony 5"
  },
  {
    "name": "F.B Area – Block 7"
  },
  {
    "name": "F.B Area - Block 9"
  },
  {
    "name": "P.E.C.H.S - Block 7"
  },
  {
    "name": "Aram Bagh"
  },
  {
    "name": "Bath Island"
  },
  {
    "name": "University Road"
  },
  {
    "name": "Bahadurabad"
  },
  {
    "name": "Shah Faisal Colony - 4"
  },
  {
    "name": "Banglore Town"
  },
  {
    "name": "Fowler Lines"
  },
  {
    "name": "Shah Faisal Colony - Shamsi Society"
  },
  {
    "name": "Gulshan-e-Jamal"
  },
  {
    "name": "Shah Faisal Colony - 3"
  },
  {
    "name": "Shah Faisal Colony - Green Town"
  },
  {
    "name": "Darwaish Colony"
  },
  {
    "name": "Korangi - Sector 31 B"
  },
  {
    "name": "Firdous Colony"
  },
  {
    "name": "North Nazimabad - Block W"
  },
  {
    "name": "K.A.E.C.H.S"
  },
  {
    "name": "Mehmoodabad"
  },
  {
    "name": "Korangi - Mehran Town"
  },
  {
    "name": "Landhi Town - 36 B"
  },
  {
    "name": "Karachi Memon Society"
  },
  {
    "name": "Madras Cooperative Housing Society"
  },
  {
    "name": "Shahrah-e-Faisal"
  },
  {
    "name": "Korangi - Sector 41 B"
  },
  {
    "name": "Clifton - Delhi Colony"
  },
  {
    "name": "Korangi - Sector 32 B"
  },
  {
    "name": "Dhoraji"
  },
  {
    "name": "Bhimpura"
  },

  {
    "name": "Shahra-e-Faisal - Umar Colony"
  },
  {
    "name": "Model Colony"
  },
  {
    "name": "Gulshan-e-Shamim"
  },
  {
    "name": "Clifton - Shah Rasool Colony"
  },
  {
    "name": "North Karachi  - Sector 12 C"
  },
  {
    "name": "Jail Road - Hyderabad Colony"
  },
  {
    "name": "Napier Quarter"
  },
  {
    "name": "Gulzar-e-Hijri"
  },
  {
    "name": "North Karachi  - Sector 12 A"
  },
  {
    "name": "Shahra-e-Faisal - Jinnah Housing Society"
  },
  {
    "name": "K.D.A Scheme 1"
  },
  {
    "name": "Clifton - Punjab Colony"
  },
  {
    "name": "Korangi - Sector 31 D"
  },
  {
    "name": "Clifton - Zamzama"
  },
  {
    "name": "Parsi Colony"
  },
  {
    "name": "Qayyumabad"
  },
  {
    "name": "Khokrapar"
  },
  {
    "name": "Shah Faisal Colony - Muslimabad Malir City"
  },
  {
    "name": "F.B Area - Block 8"
  },
  {
    "name": "Nanak Wara"
  },
  {
    "name": "Mohammad Ali Society"
  },
  {
    "name": "Manzoor Colony"
  },
  {
    "name": "Dalmia"
  },
  {
    "name": "Defence View - Phase 1"
  },
  {
    "name": "Defence View - Phase 2"
  },
  {
    "name": "KDA Officers Housing Society"
  },
  {
    "name": "Karimabad"
  },
  {
    "name": "Soldier Bazar"
  },
  {
    "name": "Hussainabad"
  },
  {
    "name": "Sharfabad Society"
  },
  {
    "name": "Gharibabad"
  },
  {
    "name": "Sindhi Muslim Cooperative Housing Society"
  }
]

export function verificationCode() {
  return Math.floor(Math.random() * 899999 + 100000);
}


export function encodeInfo(info) {
  return Base64.encode(info);
}

export function deccodeInfo(encode) {
  return Base64.decode(encode);
}

function adjustSting(string, size) {
  const len = string.length
  let myStr = ''
  for (let i = 0; i < size - len; i++) {
    myStr += '0'
  }
  return (myStr + string)

}

export function dataFullData() {
  const date = new Date()

  const year = adjustSting(date.getUTCFullYear().toString(), 2)
  const month = adjustSting((date.getUTCMonth() + 1).toString(), 2)
  const day = adjustSting(date.getUTCDate().toString(), 2)
  const hours = adjustSting(date.getUTCHours().toString(), 2)
  const minutes = adjustSting(date.getUTCMinutes().toString(), 2)
  const seconds = adjustSting(date.getUTCSeconds().toString(), 2)
  const mili = adjustSting(date.getUTCMilliseconds().toString(), 3)
  const extra = verificationCode().toString().slice(0, 1)
  const code = year + month + day + hours + minutes + seconds + mili + extra


  const hoursN = adjustSting(date.getHours().toString(), 2)
  const minutesN = adjustSting(date.getMinutes().toString(), 2)
  const dateData = {
    date: day + '-' + month + '-' + year,
    time: hoursN + ":" + minutesN,
    dateInt: parseInt(code),
    actualDate: date,
  }
  return (dateData)


}
export function statusDate(YDate, time) {
  const today = new Date()
  const todayDate = today.toLocaleDateString()
  const yesterday = new Date(today - 86400000);
  var yesterdayDate = yesterday.toLocaleDateString()
  if (todayDate == YDate) {
    return (time ? time : 'Today')

  } else if (yesterdayDate == YDate) {
    return ('Yesterday')

  } else {

    return (YDate)
  }
}

export function getDistanceFromRes(from, to) {
  try {
    const dis = getDistance(from, to, 1)
    let d = dis
    // alert(d)
    // alert(typeof d == 'NaN')
    if (d >= 1000) {
      d = Math.round(d / 1000) + ' KM'

    }
    else if (d < 1000) {
      d = d + ' M'
    }
    else {
      d = 0 + ' KM'
    }
    // alert(d)
    return ({ distance: dis, string: d })
  }
  catch (error) {
  }
}

export function updateAndNewLocation(coords) {
  // coords = { latitude: 24.7691021, longitude: 67.072842 }

  const { areas } = storeRedux.getState().areas
  const { profile } = storeRedux.getState().profile

  let minArea = null
  areas.map((it, i) => {
    const { latitude, longitude } = it
    const from = coords
    const to = { latitude, longitude }
    const { distance } = getDistanceFromRes(from, to)

    if (minArea == null || distance < minArea.distance) {
      minArea = { ...it, distance }
    }
  })
  console.log('minDistance: ', minArea)
  return
  if (profile.city && minArea && minArea.distance > 1300) {
    // if (true) {


    const { latitude, longitude } = coords
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    fetch(apiUrl, {
      headers: {
        'Accept-Language': 'en',
      },
    })
      .then(response => response.json())
      .then(data => {

        // Handle the response data
        const { display_name } = data
        const myArray = display_name.split(',')
        const modifiedArray = myArray.slice(0, myArray.length - 3);
        const name = modifiedArray.join(',');

        if (!display_name.includes(profile.city)) {

          return
        }
        const { dateInt } = dataFullData()
        const id = dateInt.toString() + verificationCode().toString()
        const detail = {}
        detail[id] = ({ id, name, latitude, longitude });

        storeRedux.dispatch(setCurrentLocation({ id, name, latitude, longitude }))
        FirebaseLocation.doc(profile.city).update(detail)
          .then(() => {
            getAreasLocations()
            console.log('New Location Update', detail)
          }).catch(err => { console.log('update location error', err) })
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

}
export function getCurrentLocations() {
  Geolocation.getCurrentPosition(info => {
    if (info) {
      const { coords } = info
      const { latitude, longitude } = coords
      const detail = { latitude, longitude };
      storeRedux.dispatch(setCurrentLocation(detail))
      updateAndNewLocation(detail)

    } else {
      console.log('info', 2)

    }
  }, (err) => { console.log(err) });
}
export const SetErrorAlertToFunction = ({ Title, Body, Status }) => {
  storeRedux.dispatch(setErrorAlert({ Title, Body, Status }))

}

export const getAreasLocations = () => {
  const { profile } = storeRedux.getState().profile

  FirebaseLocation.doc(profile.city).get().then((result) => {
    if (result.exists) {


      const areas = result.data()
      let AllAreas = []
      for (const [key, value] of Object.entries(areas)) {
        AllAreas.push(value)
      }

      storeRedux.dispatch(setAreasLocation(AllAreas))
      getCurrentLocations()

    }

  }).catch((ERR) => {
    console.log('ERROR ON getAreasLocations', ERR)
  })


}






// Backup

// const detail = {}
// karaAreas.map((it, i) => {
//   const address = `${encodeURIComponent(it.name)},${encodeURIComponent(profile.city)}`;

//   fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=`)
//     .then(response => response.json())
//     .then(data => {
//       if (data.results.length > 0) {
//         const location = data.results[0].geometry.location;
//         const latitude = location.lat;
//         const longitude = location.lng;

//         const { dateInt } = dataFullData()
//         const id = dateInt.toString() + verificationCode().toString()

//         detail[id] = ({ id, name: it.name, latitude, longitude });
//         newLocations.push(detail)

//       } else {
//         console.log(it.name, "Location not found.");
//       }
//       console.log(i + 1)
//       if (i == karaAreas.length - 1) {

//         FirebaseLocation.doc(profile.city).set(detail).then((result) => {
//           console.log('set suucess')


//         }).catch((ERR) => {
//           console.log('ERROR ON set', ERR)
//         })
//       }
//     })
//     .catch(error => console.error("Error fetching data:", error));
//   // console.log(encodeURIComponent(it.name))
//   return
//   const apiUrl = `https://nominatim.openstreetmap.org/search?q=${address}%201%20${profile.city}&format=json&limit=1`;

//   fetch(apiUrl, {
//     headers: {
//       'Accept-Language': 'en',
//     },
//   })
//     .then(response => response.json())
//     .then(data => {
//       console.log(it.name, data)
//     })
//   const { dateInt } = dataFullData()
//   const id = dateInt.toString() + verificationCode().toString()
//   const detail = {}

//   detail[id] = ({ id, name: it.name, latitude: '', longitude: '' });
//   console.log(detail)
// })