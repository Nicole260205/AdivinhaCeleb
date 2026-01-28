import { useEffect, useState, useMemo } from "react";
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
  const [filter, setFilter] = useState("all"); // 'all', 'correct', 'incorrect', 'pending'

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

    if (user) loadHistory();
  }, [user]);

  const getCelebrityById = (id) =>
    celebrities.find((c) => String(c.id) === String(id));

  // Lógica de Filtragem
  const filteredGuesses = useMemo(() => {
    return guesses.filter((guess) => {
      const celeb = getCelebrityById(guess.celebrityId);
      const isRevealed = celeb?.gender && celeb.gender !== "unknown";
      const isCorrect = isRevealed && celeb.gender === guess.gender;

      if (filter === "correct") return isCorrect;
      if (filter === "incorrect") return isRevealed && !isCorrect;
      if (filter === "pending") return !isRevealed;
      return true;
    });
  }, [guesses, filter, celebrities]);

  const handleDeleteGuess = async (guessId) => {
    if (window.confirm("Deseja excluir este palpite?")) {
      try {
        await deleteGuess(guessId);
        setGuesses((prev) => prev.filter((g) => g.id !== guessId));
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "---";
    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp.seconds * 1000 || timestamp);
    return date.toLocaleDateString();
  };

  if (loading) return <p className="loading">Carregando histórico...</p>;

  return (
    <div className="history-container">
      <Navbar />

      <header className="history-header">
        <h1>Seu Histórico</h1>
        <div className="filter-bar">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            Todos
          </button>
          <button
            className={filter === "correct" ? "active" : ""}
            onClick={() => setFilter("correct")}
          >
            Acertos
          </button>
          <button
            className={filter === "incorrect" ? "active" : ""}
            onClick={() => setFilter("incorrect")}
          >
            Erros
          </button>
          <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Aguardando
          </button>
        </div>
      </header>

      <div className="history-list">
        {filteredGuesses.length === 0 ? (
          <div className="history-empty">
            Nenhum palpite encontrado para este filtro.
          </div>
        ) : (
          filteredGuesses.map((guess) => {
            const celeb = getCelebrityById(guess.celebrityId);
            const isRevealed = celeb?.gender && celeb.gender !== "unknown";
            const isCorrect = isRevealed && celeb.gender === guess.gender;

            return (
              <div
                key={guess.id}
                className={`history-item ${isRevealed ? (isCorrect ? "item-correct" : "item-incorrect") : ""}`}
              >
                {celeb ? (
                  <>
                    <img
                      src={celeb.photo}
                      alt={celeb.name}
                      className="history-thumb"
                    />
                    <div className="history-content">
                      <div className="history-top">
                        <h3>{celeb.name}</h3>
                        <span className="history-date">
                          {formatTimestamp(guess.timestamp)}
                        </span>
                      </div>
                      <div className="history-stats">
                        <p>
                          Votou:{" "}
                          <strong>
                            {guess.gender === "male" ? "Menino" : "Menina"}
                          </strong>
                        </p>
                        <p
                          className={`status-text ${isRevealed ? (isCorrect ? "success" : "danger") : "waiting"}`}
                        >
                          {isRevealed
                            ? isCorrect
                              ? "✅ Acertou"
                              : "❌ Errou"
                            : "⏳ Pendente"}
                        </p>
                      </div>
                      <div className="history-actions">
                        <button
                          className="btn-edit"
                          onClick={() => navigate(`/guess/${celeb.id}`)}
                          disabled={isRevealed}
                        >
                          {isRevealed ? "Revelado" : "Editar"}
                        </button>
                        <button
                          className="btn-del"
                          onClick={() => handleDeleteGuess(guess.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>Dados incompletos.</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default GuessHistory;
