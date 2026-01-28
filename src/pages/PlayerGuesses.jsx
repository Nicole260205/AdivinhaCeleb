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
        const userSnap = await getDoc(doc(db, "users", id));
        if (userSnap.exists()) setPlayer(userSnap.data());

        const celebSnap = await getDocs(collection(db, "celebrities"));
        const celebMap = {};
        celebSnap.forEach((doc) => {
          celebMap[doc.id] = doc.data();
        });
        setCelebrities(celebMap);

        const q = query(
          collection(db, "guesses"),
          where("userId", "==", id),
          orderBy("timestamp", "desc"),
        );
        const guessesSnap = await getDocs(q);
        const list = [];
        guessesSnap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setGuesses(list);
      } catch (error) {
        console.error("Erro ao carregar:", error);
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

  const formatarData = (ts) => {
    if (!ts) return "—";
    const date = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000 || ts);
    return date.toLocaleDateString();
  };

  if (loading)
    return (
      <div className="loading-container">
        <Navbar />
        <p>Carregando palpites...</p>
      </div>
    );

  return (
    <div className="player-guesses-container">
      <Navbar />

      <header className="player-profile-header">
        <img src={player?.avatar} alt="" className="player-avatar-large" />
        <div className="player-meta">
          <h2>Palpites de {player?.displayName || "Jogadora"}</h2>
          <span>{guesses.length} palpites totais</span>
        </div>
      </header>

      <div className="guesses-social-grid">
        {guesses.length === 0 ? (
          <p className="no-guesses">Esta jogadora ainda não fez palpites.</p>
        ) : (
          guesses.map((guess, index) => {
            const celeb = celebrities[guess.celebrityId];
            const revelado = celeb?.gender && celeb.gender !== "unknown";
            const acertou = revelado ? guess.gender === celeb.gender : null;

            return (
              <div
                key={index}
                className={`guess-social-card ${revelado ? (acertou ? "success" : "fail") : ""}`}
              >
                <div className="celeb-info-row">
                  <img src={celeb?.photo} alt="" className="celeb-thumb" />
                  <div className="celeb-name-date">
                    <h3>{celeb?.name || "???"}</h3>
                    <small>{formatarData(guess.timestamp)}</small>
                  </div>
                </div>

                <div className="guess-result-row">
                  <div className="guess-choice">
                    <p>
                      Votou: <strong>{traduzirGenero(guess.gender)}</strong>
                    </p>
                  </div>
                  <div
                    className={`status-badge ${revelado ? (acertou ? "win" : "loss") : "wait"}`}
                  >
                    {revelado
                      ? acertou
                        ? "Acertou ✅"
                        : "Errou ❌"
                      : "Aguardando ⏳"}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default PlayerGuesses;
