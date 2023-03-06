
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData, useDocument, useDocumentData } from 'react-firebase-hooks/firestore';
import { DocumentData, updateDoc, doc, DocumentReference, getFirestore } from 'firebase/firestore';
import { connectAuthEmulator, getAuth, User as FirebaseUser } from 'firebase/auth';
import secret from "../secret"
import { useState } from 'react';
import User from './User';
import { dataToGame, Game, gameToData } from './GameComp';
import { List } from 'immutable';

const firebaseConfig = secret.firebaseConfig;
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

async function add_to_collection<T extends DocumentData>(collection:string, id:string, object:T) {
    const collectionRef = firestore.collection(collection);
    await collectionRef.doc(id).set(object);
}

async function update_document<T extends DocumentData>(collection:string, id:string, data : T) {
    const documentRef = firestore.collection(collection).doc(id);
    await documentRef.update(data);
}


/**
 * Takes a collection and a document path, and gives the value of that document, as well as a function to update it, and refreshes the component when
 * the value changes. T is the type of the object that it receives from the database.
*/
function useDatabaseState<T>(collection:string,documentPath:string) : [T|undefined,<T extends DocumentData>(newVal:T)=>void] {
    const query = firestore.collection(collection).doc(documentPath);
    const [value,loadinmeMessages,error] = useDocumentData(query as any);
    const updater = <T extends DocumentData>(newValue : T) => {
        update_document<T>(collection,documentPath,newValue);
    };

    return [value as T|undefined,updater];
}

async function getCollection(collection:string) : Promise<any[]> {
    console.log("read");
    const collectionRef = await firestore.collection(collection).get();
    let a : DocumentData[] = [];
    collectionRef.forEach(doc => {
        a.push(doc.data());
    });
    return a;
}


function getCurrentUser() : User | null {
    console.log("read");
    return auth.currentUser;
}
async function getUsers() : Promise<List<User>> {
    console.log("read");
    const x = await getCollection("users");
    return List<User>(x);
}
async function getGames() : Promise<List<Game>> {
    console.log("read");
    const x = await getCollection("games");
    return List<Game>(x.map((game) => dataToGame(game)));
}

function signIn() : void {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((userCredentials) => {  
        if (userCredentials.user != null) {
            const {uid,displayName, photoURL} = userCredentials.user;
            const user : User = {
                uid,
                displayName,
                photoURL,
            }
            add_to_collection("users",user.uid,user);
        }
    })
}
function SignOut() : void {
    auth.signOut();
}

const useAuthStateDb = () => {const [user] = useAuthState(auth as any); return user;};

export {
    getCurrentUser,
    getUsers,
    getGames,
    add_to_collection,
    update_document,
    useDatabaseState,
    signIn,
    SignOut,
    useAuthStateDb,
}