import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKVFMO_wqeLOS1PJNR8t_I-LpQE9Xz8HU",
  authDomain: "dsw3-5b7cb.firebaseapp.com",
  projectId: "dsw3-5b7cb",
  storageBucket: "dsw3-5b7cb.firebasestorage.app",
  messagingSenderId: "714573811149",
  appId: "1:714573811149:web:015e494d430cb8749a8884",
  measurementId: "G-JGKBMV2MV3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
