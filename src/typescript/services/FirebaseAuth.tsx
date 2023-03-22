import { connectAuthEmulator, createUserWithEmailAndPassword, signInAnonymously, signInWithRedirect, updateProfile, UserCredential } from "firebase/auth";
import { getAdditionalUserInfo, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import Auth from "../interfaces/Auth";
import User from "../User";
import Firestore from "./Firestore";
import {auth} from "./FirebaseApp";
import {v4 as uuidv4} from "uuid";


const GoogleProvider = new GoogleAuthProvider();


function firebaseToUser(firebaseUser : UserCredential) : User {
    return {
        uid:firebaseUser.user.uid,
        displayName:firebaseUser.user.displayName,
        photoURL:firebaseUser.user.photoURL,
    }
}

function signInWithGoogle() {
    signInWithPopup(auth, GoogleProvider).then((result) => {
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
            console.log("auth change");
            setMeaningless(meaningless + 1);
        });

        return () => {
            unsubscribe();
        }
    }, []);
};

const signInAsGuest = (displayName:string) => {
    console.log("hi");
    signInAnonymously(auth).then((userCredential) => {
        updateProfile(userCredential.user, {displayName:displayName}).then(() => {
            //return userCredential.user.getIdTokenResult(true);
        });

    });
}

const FireAuth : Auth = {
    signInWithGoogle: signInWithGoogle,
    signInAsGuest,
    signOut,
    getCurrentUser,
    useAuthState,
}

export default FireAuth;