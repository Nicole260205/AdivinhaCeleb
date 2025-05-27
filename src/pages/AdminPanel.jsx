import { useEffect, useState } from "react";
import {
  fetchCelebrities,
  addCelebrity,
  deleteCelebrity,
  updateCelebrity,
} from "../services/celebrity";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [celebrities, setCelebrities] = useState([]);
  const [form, setForm] = useState({ name: "", photo: "", gender: "unknown" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (user.role !== "judge") {
      navigate("/");
    }
    loadCelebrities();
  }, [user, navigate]);

  const loadCelebrities = async () => {
    const data = await fetchCelebrities();
    setCelebrities(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.photo) {
      alert("Preencha todos os campos.");
      return;
    }

    if (editingId) {
      await updateCelebrity(editingId, form);
      alert("Celebridade atualizada.");
    } else {
      await addCelebrity(form);
      alert("Celebridade adicionada.");
    }

    setForm({ name: "", photo: "", gender: "unknown" });
    setEditingId(null);
    loadCelebrities();
  };

  const handleEdit = (c) => {
    setForm({ name: c.name, photo: c.photo, gender: c.gender });
    setEditingId(c.id);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Deseja realmente excluir?");
    if (confirm) {
      await deleteCelebrity(id);
      loadCelebrities();
    }
  };

  return (
    <div className="admin-container">
      <Navbar />
      <h1>Painel do Juiz 👩‍⚖️</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Nome da Celebridade"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="URL da Foto"
          value={form.photo}
          onChange={(e) => setForm({ ...form, photo: e.target.value })}
        />

        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="unknown">Não Revelado</option>
          <option value="male">Menino</option>
          <option value="female">Menina</option>
        </select>

        <button type="submit">{editingId ? "Atualizar" : "Adicionar"}</button>
      </form>

      <h2>Lista de Celebridades</h2>
      <div className="celeb-list">
        {celebrities.map((c) => (
          <div key={c.id} className="celeb-card">
            <img src={c.photo} alt={c.name} />
            <h3>{c.name}</h3>
            <p>
              Gênero:{" "}
              {c.gender === "unknown"
                ? "Não Revelado"
                : c.gender === "male"
                ? "Menino"
                : "Menina"}
            </p>
            <div className="actions">
              <button onClick={() => handleEdit(c)}>Editar</button>
              <button onClick={() => handleDelete(c.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
