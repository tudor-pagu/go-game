
import secret from '../../secret';
import {initializeApp} from "firebase/app"

const firebaseConfig = secret.firebaseConfig;
const app = initializeApp(firebaseConfig);

export default app;
