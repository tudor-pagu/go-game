import secret from '../../secret';
import { collection, connectFirestoreEmulator, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { initializeApp } from '@firebase/app';
import { VStack } from '@chakra-ui/react';

//eslint-disable-next-line no-restricted-globals
const local = (location.hostname === 'localhost');

const config = local ? secret.emulatorConfig : secret.firebaseConfig;

const app = initializeApp(config);

const db = getFirestore(app);
if(local) {
    connectFirestoreEmulator(db, 'localhost', 8080);
}

const auth = getAuth(app);
if (local) {
    connectAuthEmulator(auth, 'http://localhost:9099');
}

export {db, auth};
