import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

function PlayersList() {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Adicionei a busca para facilitar
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const list = [];

        snapshot.forEach((doc) => {
          const user = doc.data();
          // Mantém a sua lógica original de filtragem
          if (
            user.role !== "judge" &&
            (doc.id !== currentUser?.uid || role === "judge")
          ) {
            list.push({ id: doc.id, ...user });
          }
        });

        setPlayers(list);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, role]);

  // Filtra as jogadoras pelo nome digitado
  const filteredPlayers = players.filter((player) =>
    player.displayName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <p className="loading">Carregando jogadoras...</p>;

  return (
    <div className="players-list-container">
      <Navbar />

      <header className="players-header">
        <h2>Ver Palpites de Outras Jogadoras</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <div className="players-grid">
        {filteredPlayers.length === 0 ? (
          <p className="no-results">Nenhuma jogadora encontrada.</p>
        ) : (
          filteredPlayers.map((player) => (
            /* Mantendo o botão e a navegação original */
            <button
              key={player.id}
              className="player-social-card"
              onClick={() => navigate(`/palpites/${player.id}`)}
            >
              <div className="avatar-wrapper">
                <img src={player.avatar} alt={player.displayName} />
              </div>
              <div className="player-info">
                <span className="player-name">{player.displayName}</span>
                <span className="view-link">Ver histórico completo →</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default PlayersList;
