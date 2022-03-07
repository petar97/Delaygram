import Firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { getFirestore } from 'firebase/firestore';

const config = {
    apiKey: "AIzaSyCnqfImgPg_hla3SR8-IpyB5C9he7qez-o",
    authDomain: "delaygram-678c1.firebaseapp.com",
    projectId: "delaygram-678c1",
    storageBucket: "delaygram-678c1.appspot.com",
    messagingSenderId: "282033273065",
    appId: "1:282033273065:web:30e2befd44342230cf5878"
};

const firebase = Firebase.initializeApp(config);
const db = getFirestore();
const { FieldValue } = Firebase.firestore;
const storage = Firebase.storage();

export { firebase, db, FieldValue, storage };