
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAq2t5V0JUw8G_oiyR5PNCkQunqijfX2eI",
  authDomain: "webcarros-17e54.firebaseapp.com",
  projectId: "webcarros-17e54",
  storageBucket: "webcarros-17e54.firebasestorage.app",
  messagingSenderId: "502449473714",
  appId: "1:502449473714:web:4547733ee1d81c3e7be1ab",
  measurementId: "G-DLVRJKYNS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);



export { db, auth, storage };
