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

  // Monta ranking com todos os usuários (exceto juízes), usando pontuação 0 para quem não tem
  const ranking = Object.entries(users)
    .filter(([userId, user]) => user.role !== "judge") // Exclui juízes
    .map(([userId, user]) => ({
      userId,
      name: user.displayName || "Desconhecido",
      score: scores[userId] || 0,
      avatar: user.avatar || "",
    }))
    .sort((a, b) => b.score - a.score);

  return ranking;
};
