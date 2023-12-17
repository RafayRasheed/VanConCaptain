import firestore from '@react-native-firebase/firestore';
import { storage } from "../common";
import { getLogin } from "./storageMMKV";
export const FirebaseUser= firestore().collection('drivers')
export function uploadFavouriteFirebase(newFav, type) {
    // const dispatch = useDispatch()
    const profile = getLogin()

    FirebaseUser.doc(profile.uid).update(
        type == 'res' ?
            { favoriteRes: newFav } :
            { favoriteItem: newFav }
    ).then(() => {
    }).catch((err) => {
        console.log('err uploadFavouriteFirebase', err)
    })

}

