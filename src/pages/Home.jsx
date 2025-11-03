import { useEffect, useState } from "react";
import { fetchCelebrities } from "../services/celebrity";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCelebrities = async () => {
      try {
        const data = await fetchCelebrities();
        setCelebrities(data);
      } catch (error) {
        console.error("Erro ao carregar celebridades:", error);
      }
      setLoading(false);
    };

    loadCelebrities();
  }, []);

  const renderGender = (gender) => {
    if (gender === "unknown" || !gender) return null;
    return gender === "male" ? "Menino" : "Menina";
  };

  if (loading) return <p className="loading">Carregando celebridades...</p>;

  // Separar as listas
  const unrevealed = celebrities.filter(
    (celeb) => !celeb.gender || celeb.gender === "unknown"
  );
  const revealed = celebrities.filter(
    (celeb) => celeb.gender && celeb.gender !== "unknown"
  );

  return (
    <div className="home-container">
      <Navbar />
      <h1>Celebridades</h1>

      <h2>Faltando Revelar</h2>
      {unrevealed.length === 0 ? (
        <p>Todas as celebridades já foram reveladas!</p>
      ) : (
        <div className="celebrity-list">
          {unrevealed.map((celeb) => (
            <div key={celeb.id} className="celebrity-card">
              <img src={celeb.photo} alt={celeb.name} />
              <h3>{celeb.name}</h3>
              <Link to={`/guess/${celeb.id}`}>
                <button>Dar Palpite</button>
              </Link>
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: "2rem 0", borderColor: "#ccc" }} />

      <h2>Já Reveladas</h2>
      {revealed.length === 0 ? (
        <p>Nenhuma celebridade foi revelada ainda.</p>
      ) : (
        <div className="celebrity-list">
          {revealed.map((celeb) => (
            <div key={celeb.id} className="celebrity-card revealed">
              <img src={celeb.photo} alt={celeb.name} />
              <h3>{celeb.name}</h3>
              <p className="gender-revealed">
                Gênero: {renderGender(celeb.gender)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
