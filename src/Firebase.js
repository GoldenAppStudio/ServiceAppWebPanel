import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyDIzk9Uyb0Mnk3HQlFtuWuUHwULqWpyBLk",
  authDomain: "serviceapp-67984.firebaseapp.com",
  databaseURL: "https://serviceapp-67984.firebaseio.com",
  projectId: "serviceapp-67984",
  storageBucket: "serviceapp-67984.appspot.com",
  messagingSenderId: "750058593774",
  appId: "1:750058593774:web:618d7c9e96048f24cc02ff",
  measurementId: "G-QC35081TF0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const storage = firebase.storage().ref();
export { storage, firebase as default };
