import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCelebrities } from "../services/celebrity";
import { fetchAllUserGuesses, deleteGuess } from "../services/guess";
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
        const [celebData, guessData] = await Promise.all([
          fetchCelebrities(),
          fetchAllUserGuesses(),
        ]);
        setCelebrities(celebData);
        setGuesses(guessData);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadHistory();
    }
  }, [user]);

  const getCelebrityById = (id) => {
    return celebrities.find((c) => String(c.id) === String(id));
  };

  const handleDeleteGuess = async (guessId) => {
    const confirm = window.confirm(
      "Tem certeza que deseja excluir este palpite?"
    );
    if (confirm) {
      try {
        await deleteGuess(guessId);
        setGuesses((prev) => prev.filter((g) => g.id !== guessId));
      } catch (error) {
        alert("Erro ao excluir palpite.");
      }
    }
  };

  // Função para formatar a data de forma segura
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Desconhecida";

    // Se já é um objeto Date
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString();
    }

    // Se é um Timestamp do Firestore (com método toDate)
    if (timestamp.toDate && typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleDateString();
    }

    // Se é um número (milissegundos)
    if (typeof timestamp === "number") {
      return new Date(timestamp).toLocaleDateString();
    }

    // Se é um objeto com seconds (formato Firestore alternativo)
    if (timestamp.seconds && typeof timestamp.seconds === "number") {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }

    return "Desconhecida";
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
                        <strong>{formatTimestamp(guess.timestamp)}</strong>
                      </p>
                      <button onClick={() => navigate(`/guess/${celeb.id}`)}>
                        Editar Palpite
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteGuess(guess.id)}
                      >
                        Excluir Palpite
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
