
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import secret from '../../secret';

import { useCollectionData, useDocument, useDocumentData } from 'react-firebase-hooks/firestore';
import { DocumentData, updateDoc, doc, DocumentReference, getFirestore } from 'firebase/firestore';

const firebaseConfig = secret.firebaseConfig;
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

async function setDocument<T extends DocumentData>(collection:string, id:string, object:T) {
    const collectionRef = firestore.collection(collection);
    await collectionRef.doc(id).set(object);
}

async function getCollection(collection:string) : Promise<any[]> {
    const collectionRef = await firestore.collection(collection).get();
    let a : DocumentData[] = [];
    collectionRef.forEach(doc => {
        a.push(doc.data());
    });
    return a;
}

function useDatabaseState<T>(collection:string,documentPath:string) : [T|undefined,<T extends DocumentData>(newVal:T)=>void] {
    const query = firestore.collection(collection).doc(documentPath);
    const [value,loadinmeMessages,error] = useDocumentData(query as any);
    const updater = <T extends DocumentData>(newValue : T) => {
        setDocument<T>(collection,documentPath,newValue);
    };

    return [value as T|undefined,updater];
}

function useCollectionDataDB<T>(collection:string) : T[] | undefined {
    const query = firestore.collection(collection).orderBy("id");
    const [data] = useCollectionData(query as any);
    return data as T[] | undefined;
}


/**
 * Takes a collection and a document path, and gives the value of that document, as well as a function to update it, and refreshes the component when
 * the value changes. T is the type of the object that it receives from the database.
*/

export {
    setDocument,
    getCollection,
    useDatabaseState,
    useCollectionDataDB as useCollectionData,
}