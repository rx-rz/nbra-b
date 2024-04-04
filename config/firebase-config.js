import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, writeBatch } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCpykb-OyGw7aQe9liLilKFM2p2zGv5jVY",
  authDomain: "rb-blog-1817e.firebaseapp.com",
  projectId: "rb-blog-1817e",
  storageBucket: "rb-blog-1817e.appspot.com",
  messagingSenderId: "337043325519",
  appId: "1:337043325519:web:b9398add089300dfec203a",
  measurementId: "G-0M1QXKJNEV",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);
export const storage = getStorage(app);
export const batch = writeBatch(database);
