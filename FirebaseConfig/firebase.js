import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDxtomIApLQmJE5BgISHHd9LDJxMly9RoA",
    authDomain: "whatsapp-2-6f98c.firebaseapp.com",
    projectId: "whatsapp-2-6f98c",
    storageBucket: "whatsapp-2-6f98c.appspot.com",
    messagingSenderId: "544977989610",
    appId: "1:544977989610:web:40479cb2ff2a76c2ea0c93",
    measurementId: "G-WJGSXYW68J"
};

// If app not initialized, create a new app else use initialized app
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();

const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export {db, auth, provider};