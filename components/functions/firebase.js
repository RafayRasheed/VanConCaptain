import firestore from '@react-native-firebase/firestore';
import { storage } from "../common";
import { getLogin } from "./storageMMKV";
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import storeRedux from '../../redux/store_redux';
import { setAreasLocation } from '../../redux/areas_reducer';
import { dataFullData, verificationCode } from './functions';

export const FirebaseUser = firestore().collection('drivers')
export const FirebaseLocation = firestore().collection('locations')
export function uploadFavouriteFirebase(newFav, type) {
    // const dispatch = useDispatch()
    const profile = getLogin()

    firestore().collection('users').doc(profile.uid).update(
        type == 'res' ?
            { favoriteRes: newFav } :
            { favoriteItem: newFav }
    ).then(() => {
    }).catch((err) => {
        console.log('err uploadFavouriteFirebase', err)
    })

}
export const getTokenAndServerKey = async () => {
    const deviceToken = await getDeviceToken()
    const serverKey = 'AAAAvzxaN6w:APA91bGpnX3s6pQjXZL-Wr-NtJRt7fNxMyu8LkCoNGu1GPB9ht4XiS5QAgybtdGoz4mmkI3J9TTbJBHGGI8Q6SNDWaFiwZL3Ax3NbnbhwtPDK9nAh9loGDf_5MAXFhR8QfSp9dXN-rQ7'
    console.log('Token', deviceToken)
    console.log('serverKey', serverKey)
    return { deviceToken, serverKey }
}
export const sendPushNotification = async (title, body, status, tokens = [], navigate) => {
    const { deviceToken, serverKey } = await getTokenAndServerKey()

    const fcmEndpoint = 'https://fcm.googleapis.com/fcm/send';

    const headers = {
        'Authorization': `key=${serverKey}`,
        'Content-Type': 'application/json',
    };

    const data = {

        notification: {
            title: title,
            body: body,
        },
        data: {
            status,
            navigate,

        }
    };
    if (tokens.length == 1) {
        data.to = tokens[0]
    } else {
        data.registration_ids = tokens
    }

    try {
        const response = await fetch(fcmEndpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });


        if (response.ok) {
            console.log('Notification sent successfully');
        } else {
            console.error('Error sending notification:', response);
        }
    } catch (error) {
        console.error('Error sending notification:', error.message);
    }
};
export async function updateDeviceTokenToFireBase(uid) {
    const { deviceToken } = await getTokenAndServerKey()
    FirebaseUser.doc(uid)
        .update({
            deviceToken
        }).then((data) => {
            console.log('Token Update To Firebase Succesfully')
        }).catch(err => {
            console.log('Internal error while Updating a Token', err)
        });
}

export const getDeviceToken = async () => {
    try {
        const permissionStatus = await messaging().requestPermission();
        const enabled =
            permissionStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            permissionStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            console.log('Permission not granted!');
            return;
        }

        const token = await messaging().getToken();
        return token;
    } catch (error) {
        console.error('Error getting device token:', error);
    }
};

