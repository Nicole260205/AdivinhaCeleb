import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

// Buscar um palpite de um usuário para uma celebridade
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

// Buscar todos os palpites do usuário
export const fetchAllUserGuesses = async (userId) => {
  const guessesRef = collection(db, "guesses");
  const q = query(
    guessesRef,
    where("userId", "==", userId),
    orderBy("timestamp", "desc")
  );

  const querySnapshot = await getDocs(q);
  const guesses = [];
  querySnapshot.forEach((doc) => {
    guesses.push({ id: doc.id, ...doc.data() });
  });

  return guesses;
};

// Enviar ou atualizar palpite
export const submitGuess = async (userId, celebrityId, gender) => {
  const guessId = `${userId}_${celebrityId}`;
  await setDoc(doc(db, "guesses", guessId), {
    userId,
    celebrityId,
    gender,
    timestamp: serverTimestamp(),
  });
};
