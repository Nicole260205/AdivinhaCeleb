import { useEffect, useState } from "react";
import { fetchRanking } from "../services/ranking";

function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const loadRanking = async () => {
      const data = await fetchRanking();
      setRanking(data);
    };
    loadRanking();
  }, []);

  return (
    <div className="ranking-container">
      <h1>🏆 Ranking dos Palpites</h1>

      {ranking.length === 0 ? (
        <p>Ainda não há palpites suficientes para gerar um ranking.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Posição</th>
              <th>Jogador</th>
              <th>Acertos</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((player, index) => (
              <tr key={player.userId}>
                <td>{index + 1}º</td>
                <td>{player.name}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Ranking;
