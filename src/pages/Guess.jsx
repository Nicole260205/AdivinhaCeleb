import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCelebrities } from "../services/celebrity";
import { fetchUserGuess, submitGuess } from "../services/guess";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

function Guess() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [celebrity, setCelebrity] = useState(null);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const celebs = await fetchCelebrities();
        const found = celebs.find((c) => String(c.id) === String(id));
        setCelebrity(found);

        if (found) {
          const existingGuess = await fetchUserGuess(id);
          if (existingGuess) {
            setSelected(existingGuess.gender);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, user.uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;

    try {
      await submitGuess(id, selected);
      setSuccessMessage("Palpite salvo com sucesso! 🎉");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar palpite.");
    }
  };

  if (loading) return <p className="loading">Carregando...</p>;
  if (!celebrity) return <p>Celebridade não encontrada.</p>;

  return (
    <div className="guess-container">
      <Navbar />
      <div className="guess-content">
        <h1>Quem é?</h1>
        <div className="celeb-preview">
          <img
            src={celebrity.photo}
            alt={celebrity.name}
            className="celeb-img-large"
          />
          <h2 className="celeb-name-title">{celebrity.name}</h2>
        </div>

        <form onSubmit={handleSubmit} className="guess-form">
          <p className="instruction-text">Seu palpite é:</p>

          <div className="gender-options">
            <div
              className={`gender-card male ${selected === "male" ? "active" : ""}`}
              onClick={() => setSelected("male")}
            >
              <span>Menino</span>
            </div>

            <div
              className={`gender-card female ${selected === "female" ? "active" : ""}`}
              onClick={() => setSelected("female")}
            >
              <span>Menina</span>
            </div>
          </div>

          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          <button
            type="submit"
            className={`submit-btn ${!selected ? "disabled" : ""}`}
            disabled={!selected}
          >
            Confirmar Palpite
          </button>
        </form>
      </div>
    </div>
  );
}

export default Guess;
