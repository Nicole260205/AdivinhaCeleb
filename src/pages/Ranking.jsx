import { useEffect, useState } from "react";
import { fetchRanking } from "../services/ranking";
import Navbar from "../components/Navbar";

function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const data = await fetchRanking();
        setRanking(data);
      } catch (error) {
        console.error("Erro ao carregar ranking:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRanking();
  }, []);

  if (loading) return <p className="loading">Carregando ranking...</p>;

  const podium = ranking.slice(0, 3);
  const remaining = ranking.slice(3);

  return (
    <div className="ranking-container">
      <Navbar />

      <header className="ranking-header">
        <h1>🏆 Ranking</h1>
      </header>

      {ranking.length === 0 ? (
        <div className="no-data-card">
          <p>Ainda não há palpites suficientes para o ranking.</p>
        </div>
      ) : (
        <div className="ranking-content">
          {/* Pódio Visual - Responsivo */}
          <div className="podium-section">
            {/* 2º Lugar */}
            {podium[1] && (
              <div className="podium-card silver">
                <div className="avatar-wrapper">
                  <img src={podium[1].avatar} alt={podium[1].name} />
                  <div className="rank-badge">2</div>
                </div>
                <div className="podium-info">
                  <p className="p-name">{podium[1].name}</p>
                  <p className="p-score">{podium[1].score} pts</p>
                </div>
              </div>
            )}

            {/* 1º Lugar */}
            {podium[0] && (
              <div className="podium-card gold">
                <div className="avatar-wrapper">
                  <img src={podium[0].avatar} alt={podium[0].name} />
                  <div className="rank-badge">1</div>
                </div>
                <div className="podium-info">
                  <p className="p-name">{podium[0].name}</p>
                  <p className="p-score">{podium[0].score} pts</p>
                </div>
              </div>
            )}

            {/* 3º Lugar */}
            {podium[2] && (
              <div className="podium-card bronze">
                <div className="avatar-wrapper">
                  <img src={podium[2].avatar} alt={podium[2].name} />
                  <div className="rank-badge">3</div>
                </div>
                <div className="podium-info">
                  <p className="p-name">{podium[2].name}</p>
                  <p className="p-score">{podium[2].score} pts</p>
                </div>
              </div>
            )}
          </div>

          {/* Lista do 4º em diante */}
          <div className="ranking-list">
            {remaining.map((player, index) => (
              <div key={player.userId} className="ranking-item">
                <span className="item-rank">{index + 4}º</span>
                <img src={player.avatar} alt="" className="item-avatar" />
                <span className="item-name">{player.name}</span>
                <span className="item-score">
                  <strong>{player.score}</strong> pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Ranking;
