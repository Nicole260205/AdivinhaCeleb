import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export const fetchUserGuess = async (userId, celebrityId) => {
  const q = query(
    collection(db, "guesses"),
    where("userId", "==", userId),
    where("celebrityId", "==", celebrityId)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docData = querySnapshot.docs[0];
    return { id: docData.id, ...docData.data() };
  }
  return null;
};

export const submitGuess = async (userId, celebrityId, gender) => {
  const guessId = `${userId}_${celebrityId}`;
  await setDoc(doc(db, "guesses", guessId), {
    userId,
    celebrityId,
    gender,
    timestamp: serverTimestamp(),
  });
};
