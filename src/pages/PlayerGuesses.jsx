import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import Navbar from "../components/Navbar";

function PlayerGuesses() {
  const { id } = useParams();
  const [guesses, setGuesses] = useState([]);
  const [player, setPlayer] = useState(null);
  const [celebrities, setCelebrities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Buscar informações do jogador
        const userSnap = await getDoc(doc(db, "users", id));
        if (userSnap.exists()) {
          setPlayer(userSnap.data());
        }

        // 🔹 Buscar todas as celebridades
        const celebSnap = await getDocs(collection(db, "celebrities"));
        const celebMap = {};
        celebSnap.forEach((doc) => {
          celebMap[doc.id] = doc.data();
        });
        setCelebrities(celebMap);

        // 🔹 Buscar palpites ordenados por data (mais recentes primeiro)
        const q = query(
          collection(db, "guesses"),
          where("userId", "==", id),
          orderBy("timestamp", "desc")
        );
        const guessesSnap = await getDocs(q);
        const list = [];
        guessesSnap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setGuesses(list);
      } catch (error) {
        console.error("Erro ao carregar palpites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const traduzirGenero = (gender) => {
    if (gender === "male") return "Menino";
    if (gender === "female") return "Menina";
    return "—";
  };

  if (loading) {
    return (
      <div className="player-guesses-container">
        <Navbar />
        <p>Carregando palpites...</p>
      </div>
    );
  }

  return (
    <div className="player-guesses-container">
      <Navbar />
      <h2>Palpites de {player?.displayName || "Jogadora"}</h2>
      {guesses.length === 0 ? (
        <p>Esta jogadora ainda não fez palpites.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Celebridade</th>
              <th>Palpite</th>
              <th>Resultado</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {guesses.map((guess, index) => {
              const celeb = celebrities[guess.celebrityId];
              const acertou =
                celeb?.gender && celeb.gender !== "unknown"
                  ? guess.gender === celeb.gender
                  : null;

              // 🔹 Formatar a data do palpite
              let dataPalpite = "—";
              const ts = guess.timestamp;
              if (ts) {
                if (ts.toDate) {
                  dataPalpite = ts.toDate().toLocaleDateString();
                } else if (ts.seconds) {
                  dataPalpite = new Date(
                    ts.seconds * 1000
                  ).toLocaleDateString();
                } else if (typeof ts === "number") {
                  dataPalpite = new Date(ts).toLocaleDateString();
                }
              }

              return (
                <tr key={index}>
                  <td data-label="Celebridade">{celeb?.name || "?"}</td>
                  <td data-label="Palpite">{traduzirGenero(guess.gender)}</td>
                  <td data-label="Resultado">
                    {acertou === null
                      ? "Ainda não revelado"
                      : acertou
                      ? "✅"
                      : "❌"}
                  </td>
                  <td data-label="Data">{dataPalpite}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PlayerGuesses;
