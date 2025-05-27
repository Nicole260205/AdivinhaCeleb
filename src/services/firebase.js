import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArIoWO-mdebEm8VkKXLl0cAykzBgwAOQs",
  authDomain: "adivinhaceleb-react.firebaseapp.com",
  projectId: "adivinhaceleb-react",
  storageBucket: "adivinhaceleb-react.firebasestorage.app",
  messagingSenderId: "395522725556",
  appId: "1:395522725556:web:b164f006dfa4678da869e1",
  measurementId: "G-91GFPZXGV8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
