import { Base64 } from 'js-base64';
import storeRedux from '../../redux/store_redux';
import { setCurrentLocation } from '../../redux/location_reducer';
import Geolocation from '@react-native-community/geolocation';
import { setErrorAlert } from '../../redux/error_reducer';
import { getDistance } from 'geolib';

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
export function getCurrentLocations() {
  Geolocation.getCurrentPosition(info => {
    if (info) {
      console.log('info', 1)
      const { coords } = info
      const { latitude, longitude } = coords
      const detail = ({ latitude, longitude });
      storeRedux.dispatch(setCurrentLocation(detail))
      console.log(detail)
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      fetch(apiUrl, {
        headers: {
          'Accept-Language': 'en',
        },
      })
        .then(response => response.json())
        .then(data => {

          // Handle the response data
          const { display_name, address } = data
          const { road, neighbourhood } = address
          const detail = ({ fullName: display_name, shortName: `${road}, ${neighbourhood}`, latitude, longitude });
          storeRedux.dispatch(setCurrentLocation(detail))

        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      console.log('info', 2)

    }
  }, (err) => { console.log(err) });
}
export const SetErrorAlertToFunction = ({ Title, Body, Status }) => {
  storeRedux.dispatch(setErrorAlert({ Title, Body, Status }))

}