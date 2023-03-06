
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData, useDocument, useDocumentData } from 'react-firebase-hooks/firestore';
import { DocumentData, updateDoc, doc, DocumentReference, getFirestore } from 'firebase/firestore';
import { User } from 'firebase/auth';
import secret from "../secret"
import { useState } from 'react';

const firebaseConfig = secret.firebaseConfig;
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

async function add_to_collection<T extends DocumentData>(collection:string, object:T) {
    const collectionRef = firestore.collection(collection);
    await collectionRef.doc(object.uid).set(object);
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

export {
    add_to_collection,
    update_document,
    useDatabaseState,
}