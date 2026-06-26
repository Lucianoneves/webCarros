

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAq2t5V0JUw8G_oiyR5PNCkQunqijfX2eI",
  authDomain: "webcarros-17e54.firebaseapp.com",
  projectId: "webcarros-17e54",
  messagingSenderId: "502449473714",
  appId: "1:502449473714:web:87ecb17edca67afe7be1ab",
  measurementId: "G-F0C92JGMGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app);

export { db, auth };