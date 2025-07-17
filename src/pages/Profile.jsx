import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { fetchAllUserGuesses } from "../services/guess";
import { fetchCelebrities } from "../services/celebrity"; // ✅ novo

function Profile() {
  const [user, setUser] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unrevealedCount, setUnrevealedCount] = useState(0); // ✅ novo

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...docSnap.data(),
            };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));

            const userGuesses = await fetchAllUserGuesses(firebaseUser.uid);
            setGuesses(userGuesses);

            // ✅ buscar celebridades com gênero unknown
            const allCelebs = await fetchCelebrities();
            const unrevealed = allCelebs.filter(
              (c) => !c.gender || c.gender === "unknown"
            );
            setUnrevealedCount(unrevealed.length);
          } else {
            console.error("Usuário não encontrado no Firestore");
            setUser(null);
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          setUser(null);
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!user) return <p>Você não está logado.</p>;

  const acertos = guesses.filter((g) => {
    if (g.correto !== undefined) return g.correto;
    return g.celebrityGender && g.gender === g.celebrityGender;
  }).length;

  const erros = guesses.filter((g) => {
    if (!g.celebrityGender || g.celebrityGender === "unknown") return false; // não conta como erro ainda
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
          <p>Celebridades ainda não reveladas: {unrevealedCount}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
