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
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const celebs = await fetchCelebrities();
        const found = celebs.find((c) => String(c.id) === String(id));
        setCelebrity(found);

        if (found) {
          const existingGuess = await fetchUserGuess(user.uid, id);
          if (existingGuess) {
            setSelected(existingGuess.gender);
            setMessage(
              `Você já escolheu: ${
                existingGuess.gender === "male" ? "Menino" : "Menina"
              }`
            );
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

  const handleSelection = (e) => {
    const choice = e.target.value;
    setSelected(choice);
    setMessage(`Você escolheu: ${choice === "male" ? "Menino" : "Menina"}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) {
      alert("Selecione um gênero");
      return;
    }
    try {
      await submitGuess(user.uid, id, selected);
      setSuccessMessage("Palpite salvo com sucesso! 🎉");
      setMessage(`Você escolheu: ${selected === "male" ? "Menino" : "Menina"}`);

      // Navega para home após 3 segundos
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 3000);
    } catch (error) {
      alert("Erro ao salvar palpite. Tente novamente.");
    }
  };

  if (loading) {
    return <p className="loading">Carregando...</p>
  }

  if (!celebrity) {
    return <p>Celebridade não encontrada.</p>
  }

  return (
    <div className="guess-container">
      <Navbar />
      <h1>Palpite para {celebrity.name}</h1>
      <img src={celebrity.photo} alt={celebrity.name} className="celeb-img" />

      <form onSubmit={handleSubmit}>
        <div className="options">
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={selected === "male"}
              onChange={handleSelection}
            />
            Menino
          </label>

          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={selected === "female"}
              onChange={handleSelection}
            />
            Menina
          </label>
        </div>

        {message && <p className="selected-message">{message}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit">Salvar Palpite</button>
      </form>
    </div>
  );
}

export default Guess;
