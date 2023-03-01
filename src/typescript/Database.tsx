
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { DocumentData, updateDoc, doc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import secret from "../secret"

const firebaseConfig = secret.firebaseConfig;
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

async function add_to_collection<T extends DocumentData>(collection:string, object:T) {
    const collectionRef = firestore.collection(collection);
    await collectionRef.add(object);
}

async function update_document<T extends DocumentData>(collection:string, id:string, data : T) {
    const documentRef = firestore.collection(collection).doc(id);
    await documentRef.update(data);
}

export {
    add_to_collection,
    update_document,
}