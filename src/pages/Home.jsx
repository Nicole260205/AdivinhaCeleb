import { useEffect, useState } from "react";
import { fetchCelebrities } from "../services/celebrity";
import { Link } from "react-router-dom";

function Home() {
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCelebrities = async () => {
      try {
        const data = await fetchCelebrities();
        console.log("Celebridades:", data);
        setCelebrities(data);
      } catch (error) {
        console.error("Erro ao carregar celebridades:", error);
      }
      setLoading(false);
    };

    loadCelebrities();
  }, []);

  if (loading) {
    return <p className="loading">Carregando celebridades...</p>;
  }

  return (
    <div className="home-container">
      <h1>Celebridades Grávidas</h1>
      <div className="celebrity-list">
        {celebrities.map((celeb) => (
          <div key={celeb.id} className="celebrity-card">
            <img src={celeb.photo} alt={celeb.name} />
            <h3>{celeb.name}</h3>
            {celeb.gender ? (
              <p className="gender-revealed">
                Gênero: {celeb.gender === "male" ? "Menino" : "Menina"}
              </p>
            ) : (
              <Link to={`/guess/${celeb.id}`}>
                <button>Dar Palpite</button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
