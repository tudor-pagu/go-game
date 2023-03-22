import { connectAuthEmulator, signInAnonymously, signInWithRedirect, UserCredential } from "firebase/auth";
import { getAdditionalUserInfo, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import Auth from "../interfaces/Auth";
import User from "../User";
import Firestore from "./Firestore";
import {auth} from "./FirebaseApp";


const provider = new GoogleAuthProvider();


function firebaseToUser(firebaseUser : UserCredential) : User {
    return {
        uid:firebaseUser.user.uid,
        displayName:firebaseUser.user.displayName,
        photoURL:firebaseUser.user.photoURL,
    }
}

function signIn() {
    signInWithRedirect(auth, provider).then((result) => {
        Firestore.setUser(firebaseToUser(result));
    },()=>{});
}
function signOut() : void {
    auth.signOut();
}

function getCurrentUser() {
    return auth.currentUser;
}

const useAuthState = () => {
    ///just to trigger re-render
    const [meaningless,setMeaningless] = useState(0);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(() => {
            setMeaningless(meaningless + 1);
        });

        return () => {
            unsubscribe();
        }
    });
};

const signInAsGuest = () => {
    signInAnonymously(auth).then(()=>{

    }).catch(()=>{
        console.log("sign in anonymously error");
    })
}

const FireAuth : Auth = {
    signInWithGoogle: signIn,
    signInAsGuest,
    signOut,
    getCurrentUser,
    useAuthState,
}

export default FireAuth;