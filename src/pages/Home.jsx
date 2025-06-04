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
        console.log("Celebridades:", data);
        setCelebrities(data);
      } catch (error) {
        console.error("Erro ao carregar celebridades:", error);
      }
      setLoading(false);
    };

    loadCelebrities();
  }, []);

  const renderGender = (gender) => {
    if (gender === "unknown" || !gender) {
      return null;
    }
    return gender === "male" ? "Menino" : "Menina";
  };

  if (loading) {
    return <p className="loading">Carregando celebridades...</p>;
  }

  return (
    <div className="home-container">
      <Navbar />
      <h1>Celebridades</h1>
      <div className="celebrity-list">
        {celebrities
          .slice()
          .reverse()
          .map((celeb) => {
            const genderLabel = renderGender(celeb.gender);
            return (
              <div key={celeb.id} className="celebrity-card">
                <img src={celeb.photo} alt={celeb.name} />
                <h3>{celeb.name}</h3>
                {genderLabel ? (
                  <p className="gender-revealed">Gênero: {genderLabel}</p>
                ) : (
                  <Link to={`/guess/${celeb.id}`}>
                    <button>Dar Palpite</button>
                  </Link>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Home;
