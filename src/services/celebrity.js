import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const celebritiesRef = collection(db, "celebrities");

export const fetchCelebrities = async () => {
  const snapshot = await getDocs(celebritiesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addCelebrity = async (data) => {
  await addDoc(celebritiesRef, data);
};

export const deleteCelebrity = async (id) => {
  await deleteDoc(doc(db, "celebrities", id));
};

export const updateCelebrity = async (id, data) => {
  await updateDoc(doc(db, "celebrities", id), data);
};
