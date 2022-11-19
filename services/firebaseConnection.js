// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCS9y6-wlLCSI3ar2c0XXDznUDdJ4R3RQE",
  authDomain: "urunning2022.firebaseapp.com",
  projectId: "urunning2022",
  storageBucket: "urunning2022.appspot.com",
  messagingSenderId: "848258029422",
  appId: "1:848258029422:web:72ab7a24b53a753367537f",
  measurementId: "G-HP7MB7CHYE"
};

// Initialize Firebase # https://stackoverflow.com/a/73536224
let app;
let auth;
if (getApps().length < 1) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth();
}

export { app, auth };
// export const analytics = getAnalytics(app);