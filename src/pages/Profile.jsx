import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import { fetchAllUserGuesses } from "../services/guess";
import { fetchCelebrities } from "../services/celebrity";

function Profile() {
  const { user, loading } = useAuth();
  const [guesses, setGuesses] = useState([]);
  const [unrevealedCount, setUnrevealedCount] = useState(0);
  const [missingGuesses, setMissingGuesses] = useState(0);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      try {
        const userGuesses = await fetchAllUserGuesses(user.uid);
        setGuesses(userGuesses);

        const allCelebs = await fetchCelebrities();
        const unrevealed = allCelebs.filter(
          (c) => !c.gender || c.gender === "unknown"
        );
        setUnrevealedCount(unrevealed.length);

        const missing = unrevealed.filter(
          (c) => !userGuesses.some((g) => g.celebrityId === c.id)
        ).length;
        setMissingGuesses(missing);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    };

    loadProfileData();
  }, [user]);

  if (loading) return <p>Carregando...</p>;
  if (!user) return <p>Você não está logado.</p>;

  const acertos = guesses.filter((g) => {
    if (g.correto !== undefined) return g.correto;
    return g.celebrityGender && g.gender === g.celebrityGender;
  }).length;

  const erros = guesses.filter((g) => {
    if (!g.celebrityGender || g.celebrityGender === "unknown") return false;
    if (g.correto !== undefined) return !g.correto;
    return g.gender !== g.celebrityGender;
  }).length;

  return (
    <div className="profile-container">
      <Navbar />
      <h1>Meu Perfil</h1>
      <div className="profile-content">
        <img src={user.avatar} alt="Avatar" className="profile-avatar" />
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <div className="profile-stats">
          <p>Palpites: {guesses.length}</p>
          <p>✅ Acertos: {acertos}</p>
          <p>❌ Erros: {erros}</p>
          <p>🎭 Celebridades ainda não reveladas: {unrevealedCount}</p>
          <p>🤔 Palpites faltando: {missingGuesses}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
