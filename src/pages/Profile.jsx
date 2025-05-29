import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  if (!user) return <p>Carregando...</p>;

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
