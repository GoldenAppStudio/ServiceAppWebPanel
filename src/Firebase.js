import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyCr2pxBDsAL_ZuSN4KId5VTf81HYoW263E",
  authDomain: "serviceapp-project.firebaseapp.com",
  databaseURL: "https://serviceapp-project.firebaseio.com",
  projectId: "serviceapp-project",
  storageBucket: "serviceapp-project.appspot.com",
  messagingSenderId: "405705349026",
  appId: "1:405705349026:web:aadc5061713cea8e7344fb",
  measurementId: "G-78RYRDSPHN",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const storage = firebase.storage().ref();
export { storage, firebase as default };
