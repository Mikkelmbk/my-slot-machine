 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyD4ONhqdFvjA2QbTdGIWu4SzpGgfdvb8Pc",
    authDomain: "my-slot-machine-e6a05.firebaseapp.com",
    databaseURL: "https://my-slot-machine-e6a05.firebaseio.com",
    projectId: "my-slot-machine-e6a05",
    storageBucket: "my-slot-machine-e6a05.appspot.com",
    messagingSenderId: "379335747472",
    appId: "1:379335747472:web:8207b456b95d15f6da7515"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();
  const auth = firebase.auth();