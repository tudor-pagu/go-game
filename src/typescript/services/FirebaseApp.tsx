
import secret from '../../secret';
import {initializeApp} from "firebase/app"

const firebaseConfig = secret.firebaseConfig;
const emulatorConfig = secret.emulatorConfig;
const app = initializeApp(emulatorConfig);

export default app;
