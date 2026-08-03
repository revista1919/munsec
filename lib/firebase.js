import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA8En7fsFAecYHYZyi8aSuuFDw0WLOcKt0",
  authDomain: "munsec-db.firebaseapp.com",
  projectId: "munsec-db",
  storageBucket: "munsec-db.firebasestorage.app",
  messagingSenderId: "831152890071",
  appId: "1:831152890071:web:edeccd2e26196d70ca9092",
  measurementId: "G-9XFSFLKTJ1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);