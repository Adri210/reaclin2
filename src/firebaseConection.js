import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDZaknmfk8Q0vZIYBZ3jxBUV4GmdkS9EiQ",
    authDomain: "realclin-ae57c.firebaseapp.com",
    projectId: "realclin-ae57c",
    storageBucket: "realclin-ae57c.appspot.com",
    messagingSenderId: "26279444780",
    appId: "1:26279444780:web:81b1eee8fa2eaeefe4ac89"
  }

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);
const storage = getStorage(appFirebase);

export { db, auth, appFirebase, storage};