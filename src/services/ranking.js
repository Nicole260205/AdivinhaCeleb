import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export const fetchRanking = async () => {
  const guessesSnap = await getDocs(collection(db, "guesses"));
  const celebritiesSnap = await getDocs(collection(db, "celebrities"));
  const usersSnap = await getDocs(collection(db, "users"));

  const celebrities = {};
  celebritiesSnap.forEach((doc) => {
    celebrities[doc.id] = doc.data();
  });

  const users = {};
  usersSnap.forEach((doc) => {
    users[doc.id] = doc.data();
  });

  const scores = {};

  guessesSnap.forEach((docSnap) => {
    const guess = docSnap.data();
    const celeb = celebrities[guess.celebrityId];

    if (!celeb || celeb.gender === "unknown") return; // Ignora não revelados

    const correct = guess.guess === celeb.gender;

    if (correct) {
      scores[guess.userId] = (scores[guess.userId] || 0) + 1;
    }
  });

  // Filtrar e montar ranking, excluindo juízes (role === "judge")
  const ranking = Object.entries(scores)
    .map(([userId, score]) => {
      const user = users[userId];
      if (!user || user.role === "judge") {
        return null; // Ignora juízes e usuários não encontrados
      }
      return {
        userId,
        name: user.displayName || "Desconhecido",
        score,
        avatar: user.avatar || "", // caso tenha avatar
      };
    })
    .filter(Boolean) // remove null
    .sort((a, b) => b.score - a.score);

  return ranking;
};
