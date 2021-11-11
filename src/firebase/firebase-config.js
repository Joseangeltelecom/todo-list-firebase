// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2Lt31-yW12rozFzEnzmijnWsIkHwugjc",
  authDomain: "react-firebase9.firebaseapp.com",
  projectId: "react-firebase9",
  storageBucket: "react-firebase9.appspot.com",
  messagingSenderId: "289718155800",
  appId: "1:289718155800:web:7f051bd60427b30273216d",
}

export function getFirebaseConfig() {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    throw new Error(
      "No Firebase configuration object provided." +
        "\n" +
        "Add your web app's configuration object to firebase-config.js"
    )
  } else {
    return firebaseConfig
  }
}

// Initialize Firebase
// const app = initializeApp(firebaseConfig)

const firebaseAppConfig = getFirebaseConfig()
const app = initializeApp(firebaseAppConfig)
export const db = getFirestore()
export default app