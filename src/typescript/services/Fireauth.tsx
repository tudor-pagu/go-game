import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {setDocument} from "../interfaces/Database"
import { useAuthState as useAuthStateFire} from 'react-firebase-hooks/auth';
import secret from "../../secret";

const firebaseConfig = secret.firebaseConfig;
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();


function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider);
}
function signOut() : void {
    auth.signOut();
}

function getCurrentUser() {
    return auth.currentUser;
}

const useAuthState = () => {const [user] = useAuthStateFire(auth as any); return user;};


export {
    signIn,
    signOut,
    getCurrentUser,
    useAuthState,
}