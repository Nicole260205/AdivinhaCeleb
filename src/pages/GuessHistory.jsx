import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCelebrities } from "../services/celebrity";
import { fetchAllUserGuesses } from "../services/guess";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

function GuessHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [guesses, setGuesses] = useState([]);
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        console.log("UID do usuário:", user.uid);
        const [celebData, guessData] = await Promise.all([
          fetchCelebrities(),
          fetchAllUserGuesses(user.uid),
        ]);
        console.log("Palpites encontrados:", guessData);
        setCelebrities(celebData);
        setGuesses(guessData);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user.uid]);

  const getCelebrityById = (id) => {
    return celebrities.find((c) => String(c.id) === String(id));
  };

  if (loading) {
    return <p className="loading">Carregando histórico...</p>;
  }

  return (
    <div className="history-container">
      <Navbar />
      <h1>Seu Histórico de Palpites</h1>
      {guesses.length === 0 ? (
        <div className="history-card">
          <p>Você ainda não fez nenhum palpite.</p>
        </div>
      ) : (
        <div className="history-list">
          {guesses.map((guess) => {
            const celeb = getCelebrityById(guess.celebrityId);
            return (
              <div key={guess.id} className="history-card">
                {celeb ? (
                  <>
                    <img
                      src={celeb.photo}
                      alt={celeb.name}
                      className="history-img"
                    />
                    <div className="history-info">
                      <h3>{celeb.name}</h3>
                      <p>
                        Palpite:{" "}
                        <strong>
                          {guess.gender === "male" ? "Menino" : "Menina"}
                        </strong>
                      </p>

                      {/* RESULTADO DO PALPITE */}
                      <p>
                        Resultado:{" "}
                        <strong>
                          {celeb.gender === "unknown" || !celeb.gender
                            ? "Aguardando..."
                            : celeb.gender === guess.gender
                            ? "✔️ Acertou"
                            : "❌ Errou"}
                        </strong>
                      </p>

                      <p>
                        Data do palpite:{" "}
                        <strong>
                          {guess.timestamp?.toDate().toLocaleDateString() ||
                            "Desconhecida"}
                        </strong>
                      </p>
                      <button onClick={() => navigate(`/guess/${celeb.id}`)}>
                        Editar Palpite
                      </button>
                    </div>
                  </>
                ) : (
                  <p>Dados da celebridade não encontrados.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GuessHistory;
