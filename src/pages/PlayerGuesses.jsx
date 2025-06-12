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
} from "firebase/firestore";
import Navbar from "../components/Navbar";

function PlayerGuesses() {
  const { id } = useParams();
  const [guesses, setGuesses] = useState([]);
  const [player, setPlayer] = useState(null);
  const [celebrities, setCelebrities] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const userSnap = await getDoc(doc(db, "users", id));
      if (userSnap.exists()) {
        setPlayer(userSnap.data());
      }

      const celebSnap = await getDocs(collection(db, "celebrities"));
      const celebMap = {};
      celebSnap.forEach((doc) => {
        celebMap[doc.id] = doc.data();
      });
      setCelebrities(celebMap);

      const q = query(collection(db, "guesses"), where("userId", "==", id));
      const guessesSnap = await getDocs(q);
      const list = [];
      guessesSnap.forEach((doc) => {
        list.push(doc.data());
      });
      setGuesses(list);
    };

    fetchData();
  }, [id]);

  const traduzirGenero = (gender) => {
    if (gender === "male") return "Menino";
    if (gender === "female") return "Menina";
    return gender;
  };

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
            </tr>
          </thead>
          <tbody>
            {guesses.map((guess, index) => {
              const celeb = celebrities[guess.celebrityId];
              const acertou =
                celeb?.gender && celeb.gender !== "unknown"
                  ? guess.gender === celeb.gender
                  : null;

              return (
                <tr key={index}>
                  <td>{celeb?.name || "?"}</td>
                  <td>{traduzirGenero(guess.gender)}</td>
                  <td>
                    {acertou === null
                      ? "Ainda não revelado"
                      : acertou
                      ? "✅"
                      : "❌"}
                  </td>
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
