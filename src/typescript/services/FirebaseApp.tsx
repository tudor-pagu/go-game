
import secret from '../../secret';
import { collection, connectFirestoreEmulator, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { initializeApp } from '@firebase/app';
import { VStack } from '@chakra-ui/react';

const app = initializeApp(secret.firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

console.log('hi!');
connectFirestoreEmulator(db, 'localhost', 8080);
setDoc(doc(collection(db,'juice'),"new_juice"),{juiceboy:"hi"});
getDocs(collection(db,"juice")).then((val)=>{
    val.forEach((id)=>{
        console.log(id.data());
    })
})

export {db, auth};
