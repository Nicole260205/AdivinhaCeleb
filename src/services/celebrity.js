// src/services/celebrity.js
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDoc,
  increment,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const celebritiesRef = collection(db, "celebrities");
const guessesRef = collection(db, "guesses");
const usersRef = collection(db, "users");

// Busca celebridades em ordem de adição (mais antigas primeiro)
export const fetchCelebrities = async () => {
  const q = query(celebritiesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Adiciona uma nova celebridade com data de criação
export const addCelebrity = async (data) => {
  await addDoc(celebritiesRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
};

// Deleta uma celebridade
export const deleteCelebrity = async (id) => {
  await deleteDoc(doc(db, "celebrities", id));
};

// Atualiza celebridade e confere palpites para atualizar score
export const updateCelebrity = async (id, data) => {
  await updateDoc(doc(db, "celebrities", id), data);

  if (data.gender && data.gender !== "unknown") {
    const q = query(guessesRef, where("celebrityId", "==", id));
    const guessSnapshot = await getDocs(q);

    for (const guessDoc of guessSnapshot.docs) {
      const guessData = guessDoc.data();
      const userId = guessData.userId;
      const guessGender = guessData.gender;

      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const currentScore = userDocSnap.data().score || 0;

        if (guessGender === data.gender) {
          await updateDoc(userDocRef, {
            score: increment(1),
          });
        }
        // Se quiser penalizar erros:
        // else {
        //   await updateDoc(userDocRef, {
        //     score: increment(-1),
        //   });
        // }
      }
    }
  }
};
