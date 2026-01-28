import { useEffect, useState } from "react";
import { fetchCelebrities } from "../services/celebrity";
import { fetchAllUserGuesses } from "../services/guess"; // Importando a função de palpites
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const [celebrities, setCelebrities] = useState([]);
  const [userGuesses, setUserGuesses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Busca celebridades e palpites simultaneamente
        const [celebData, guessData] = await Promise.all([
          fetchCelebrities(),
          fetchAllUserGuesses(),
        ]);

        setCelebrities(celebData);

        // Mapeia os palpites por ID da celebridade para acesso rápido
        const guessesMap = {};
        guessData.forEach((g) => {
          guessesMap[g.celebrityId] = g.gender;
        });
        setUserGuesses(guessesMap);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const renderGender = (gender) => {
    if (gender === "unknown" || !gender) return null;
    return gender === "male" ? "Menino" : "Menina";
  };

  if (loading) return <p className="loading">Carregando celebridades...</p>;

  // Separar as listas
  const unrevealed = celebrities.filter(
    (celeb) => !celeb.gender || celeb.gender === "unknown",
  );
  const revealed = celebrities.filter(
    (celeb) => celeb.gender && celeb.gender !== "unknown",
  );

  // Cálculo de progresso para a UX
  const totalUnrevealed = unrevealed.length;
  const votedCount = unrevealed.filter((c) => userGuesses[c.id]).length;

  return (
    <div className="home-container">
      <Navbar />

      <header className="home-header">
        <h1>Celebridades</h1>
        <div className="progress-container">
          <p>
            Seus Palpites:{" "}
            <strong>
              {votedCount} / {totalUnrevealed}
            </strong>
          </p>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${(votedCount / totalUnrevealed) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      <h2>Faltando Revelar</h2>
      {unrevealed.length === 0 ? (
        <p>Todas as celebridades já foram reveladas!</p>
      ) : (
        <div className="celebrity-list">
          {unrevealed.map((celeb) => {
            const myGuess = userGuesses[celeb.id];
            return (
              <div
                key={celeb.id}
                className={`celebrity-card ${myGuess ? "voted" : ""}`}
              >
                <img src={celeb.photo} alt={celeb.name} />

                {myGuess && (
                  <span className="guess-badge">
                    Você votou: {renderGender(myGuess)}
                  </span>
                )}

                <h3>{celeb.name}</h3>
                <Link to={`/guess/${celeb.id}`}>
                  <button className={myGuess ? "btn-edit" : "btn-primary"}>
                    {myGuess ? "Mudar Palpite" : "Dar Palpite"}
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <hr style={{ margin: "3rem 0", borderColor: "#eee" }} />

      <h2>Já Reveladas</h2>
      {revealed.length === 0 ? (
        <p>Nenhuma celebridade foi revelada ainda.</p>
      ) : (
        <div className="celebrity-list">
          {revealed.map((celeb) => {
            const myGuess = userGuesses[celeb.id];
            const isCorrect = myGuess === celeb.gender;

            return (
              <div
                key={celeb.id}
                className={`celebrity-card revealed ${myGuess ? (isCorrect ? "correct" : "incorrect") : ""}`}
              >
                <img src={celeb.photo} alt={celeb.name} />
                <h3>{celeb.name}</h3>

                <p className="gender-revealed">
                  Gênero: {renderGender(celeb.gender)}
                </p>

                {myGuess ? (
                  <div
                    className={`result-overlay ${isCorrect ? "text-success" : "text-danger"}`}
                  >
                    {isCorrect
                      ? "✅ Você acertou!"
                      : `❌ Você votou ${renderGender(myGuess)}`}
                  </div>
                ) : (
                  <p className="no-guess">Você não palpitou</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Home;
