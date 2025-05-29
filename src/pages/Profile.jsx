import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para controlar o carregamento

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

  const acertos = user.palpites?.filter((p) => p.correto).length || 0;
  const erros = (user.palpites?.length || 0) - acertos;

  return (
    <div className="profile-container">
      <Navbar />
      <h1>Meu Perfil</h1>
      <div className="profile-content">
        <img src={user.avatar} alt="Avatar" className="profile-avatar" />
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <div className="profile-stats">
          <p>Palpites: {user.palpites?.length || 0}</p>
          <p>✅ Acertos: {acertos}</p>
          <p>❌ Erros: {erros}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
