// firebaseConfig.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDge2NH2aANGhIIwLsslZUXOyCHVUL74Ds",
  authDomain: "cosmozoom-app.firebaseapp.com",
  projectId: "cosmozoom-app",
  storageBucket: "cosmozoom-app.firebasestorage.app",
  messagingSenderId: "212604807081",
  appId: "1:212604807081:web:2967c42fe09728dad006b8",
  measurementId: "G-H5D4R36VXJ"
};


const app = initializeApp(firebaseConfig);
export default app;
