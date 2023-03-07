import {
    signIn as signInFirebase,
    signOut,
    getCurrentUser,
    useAuthState
} from "../services/Firebase";
import firebase from 'firebase/compat/app';
import User from "../User";
import { setDocument } from "./Database";


function userCredentialsToUser(userCredentials: firebase.User): User {
    const { uid, displayName, photoURL } = userCredentials;
    const user: User = {
        uid,
        displayName,
        photoURL,
    }
    return user;
}

function signIn() : void {
    signInFirebase().then((userCredential) => {
        if (userCredential.user) {
            addUserToDatabase(userCredential.user);
        }
    })
}

function addUserToDatabase(userCredentials:firebase.User) : void {
    const user = userCredentialsToUser(userCredentials);
    setDocument("users",user.uid,user);
}

export { signIn, signOut, getCurrentUser, useAuthState }