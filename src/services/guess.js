import { db, auth } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
  orderBy,
  deleteDoc,
} from "firebase/firestore";

// Deletar palpite
export async function deleteGuess(guessId) {
  const guessRef = doc(db, "guesses", guessId);
  await deleteDoc(guessRef);
}

// Buscar um palpite de um usuário para uma celebridade
export const fetchUserGuess = async (celebrityId) => {
  if (!auth.currentUser) throw new Error("Usuário não autenticado");

  const userId = auth.currentUser.uid;

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

// Buscar todos os palpites do usuário autenticado
export const fetchAllUserGuesses = async () => {
  if (!auth.currentUser) throw new Error("Usuário não autenticado");

  const userId = auth.currentUser.uid;
  const guessesRef = collection(db, "guesses");
  const q = query(
    guessesRef,
    where("userId", "==", userId),
    orderBy("timestamp", "desc")
  );

  const querySnapshot = await getDocs(q);
  const guesses = [];

  for (const docSnap of querySnapshot.docs) {
    const guessData = docSnap.data();
    const celebRef = doc(db, "celebrities", guessData.celebrityId);
    const celebSnap = await getDoc(celebRef);

    let celebrityGender = null;
    if (celebSnap.exists()) {
      celebrityGender = celebSnap.data().gender || null;
    }

    guesses.push({
      id: docSnap.id,
      ...guessData,
      celebrityGender,
    });
  }

  return guesses;
};

// Enviar ou atualizar palpite (com validação de acerto)
export const submitGuess = async (celebrityId, gender) => {
  try {
    if (!auth.currentUser) {
      throw new Error("Usuário não autenticado");
    }

    const userId = auth.currentUser.uid;
    const guessId = `${userId}_${celebrityId}`;

    // Buscar o gênero real da celebridade
    const celebRef = doc(db, "celebrities", celebrityId);
    const celebSnap = await getDoc(celebRef);

    let correto = null;
    if (celebSnap.exists()) {
      const celebData = celebSnap.data();
      if (celebData.gender && celebData.gender !== "unknown") {
        correto = celebData.gender === gender;
      }
    }

    await setDoc(doc(db, "guesses", guessId), {
      userId,
      celebrityId,
      gender,
      timestamp: serverTimestamp(),
      correto,
    });

    return { success: true, correto };
  } catch (error) {
    console.error("Erro em submitGuess:", error);
    throw error;
  }
};
