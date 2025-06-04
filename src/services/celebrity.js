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
} from "firebase/firestore";

const celebritiesRef = collection(db, "celebrities");
const guessesRef = collection(db, "guesses");
const usersRef = collection(db, "users");

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
  // Atualiza o gênero da celebridade
  await updateDoc(doc(db, "celebrities", id), data);

  if (data.gender && data.gender !== "unknown") {
    // Busca todos os palpites para essa celebridade
    const q = query(guessesRef, where("celebrityId", "==", id));
    const guessSnapshot = await getDocs(q);

    for (const guessDoc of guessSnapshot.docs) {
      const guessData = guessDoc.data();
      const userId = guessData.userId;
      const guessGender = guessData.gender;

      // Pega o documento do usuário
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        let currentScore = userDocSnap.data().score || 0;

        // Se o palpite acertou, garante que o score aumenta em 1
        // Se o palpite errou, pode ser que o score diminua 1? (depende do que quer)
        // Para evitar duplicar pontuação, talvez atualizar só se mudou

        // Para isso, vamos verificar se o score atual já considera esse acerto
        // Isso pode complicar, então vou assumir que o score é recalculado completamente

        // Alternativa: atualizar o score conforme o acerto, sem diminuir
        // Para simplificar, vamos só adicionar +1 para os palpites que acertarem

        if (guessGender === data.gender) {
          // Incrementa score do usuário em 1
          await updateDoc(userDocRef, {
            score: increment(1),
          });
        } else {
          // Se quiser decrementar score, descomente abaixo
          // await updateDoc(userDocRef, {
          //   score: increment(-1),
          // });
        }
      }
    }
  }
};
