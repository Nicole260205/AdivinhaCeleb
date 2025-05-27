import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCelebrities } from "../services/celebrity";
import { fetchUserGuess, submitGuess } from "../services/guess";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";


function Guess() {
  const { id } = useParams(); // id da celebridade
  const { user } = useAuth();
  const navigate = useNavigate();

  const [celebrity, setCelebrity] = useState(null);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const celebs = await fetchCelebrities();
      const found = celebs.find((c) => c.id === id);
      setCelebrity(found);

      const existingGuess = await fetchUserGuess(user.uid, id);
      if (existingGuess) {
        setSelected(existingGuess.gender);
      }

      setLoading(false);
    };

    loadData();
  }, [id, user.uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) {
      alert("Selecione um gênero");
      return;
    }
    await submitGuess(user.uid, id, selected);
    alert("Palpite salvo!");
    navigate("/");
  };

  if (loading) {
    return <p className="loading">Carregando...</p>;
  }

  if (!celebrity) {
    return <p>Celebridade não encontrada.</p>;
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
              onChange={(e) => setSelected(e.target.value)}
            />
            Menino
          </label>

          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={selected === "female"}
              onChange={(e) => setSelected(e.target.value)}
            />
            Menina
          </label>
        </div>

        <button type="submit">Salvar Palpite</button>
      </form>
    </div>
  );
}

export default Guess;
