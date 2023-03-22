import { connectAuthEmulator, createUserWithEmailAndPassword, signInAnonymously, signInWithRedirect, updateProfile, UserCredential ,User as FirebaseUser } from "firebase/auth";
import { getAdditionalUserInfo, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import Auth from "../interfaces/Auth";
import User from "../User";
import Firestore from "./Firestore";
import {auth} from "./FirebaseApp";
import {v4 as uuidv4} from "uuid";


const GoogleProvider = new GoogleAuthProvider();


function firebaseToUser(firebaseUser : FirebaseUser) : User {
    return {
        uid:firebaseUser.uid,
        displayName:firebaseUser.displayName,
        photoURL:firebaseUser.photoURL,
    }
}

function signInWithGoogle() {
    signInWithPopup(auth, GoogleProvider).then((result) => {
        Firestore.setUser(firebaseToUser(result.user));
    },()=>{});
}
function signOut() : void {
    auth.signOut();
}

const useCurrentUser = () => {
    ///just to trigger re-render
    function convert(firebaseUser:FirebaseUser | null) : User | null {
        if (firebaseUser === null) return null;
        return firebaseToUser(firebaseUser);
    }
    const [user,setUser] = useState(convert(auth.currentUser));
    useEffect(() => {

        const unsubscribe = auth.onIdTokenChanged(() => {
            setUser(convert(auth.currentUser));
        });

        return () => {
            unsubscribe();
        }
    }, []);
    return user;
};

const signInAsGuest = (displayName:string) => {
    signInAnonymously(auth).then((userCredential) => {
        updateProfile(userCredential.user, {displayName:displayName}).then(() => {
            return userCredential.user.getIdTokenResult(true);
        }).then(()=>{
            Firestore.setUser(firebaseToUser(userCredential.user));
        });
    });
}

const FireAuth : Auth = {
    signInWithGoogle: signInWithGoogle,
    signInAsGuest,
    signOut,
    useCurrentUser,
}

export default FireAuth;