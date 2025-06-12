import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

function PlayersList() {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const list = [];

        snapshot.forEach((doc) => {
          const user = doc.data();
          console.log("User doc:", doc.id, user); // Para debug
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
      }
    };

    fetchUsers();
  }, [currentUser, role]);

  return (
    <div className="players-list-container">
      <Navbar />
      <h2>Ver Palpites de Outras Jogadoras</h2>
      <div className="players-grid">
        {players.length === 0 ? (
          <p>Nenhuma jogadora encontrada.</p>
        ) : (
          players.map((player) => (
            <button
              key={player.id}
              className="player-card"
              onClick={() => navigate(`/palpites/${player.id}`)}
            >
              <img src={player.avatar} alt={player.displayName} />
              <span>{player.displayName}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default PlayersList;
