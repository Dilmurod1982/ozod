import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6VDlbr1-dUvd3HF_WCfckoKQ3pk7C9uM",
  authDomain: "ozod-b0781.firebaseapp.com",
  projectId: "ozod-b0781",
  storageBucket: "ozod-b0781.firebasestorage.app",
  messagingSenderId: "1058333956977",
  appId: "1:1058333956977:web:44e10af58aee67d5e074d0",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
