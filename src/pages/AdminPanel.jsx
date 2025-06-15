// src/pages/AdminPanel.jsx
import { useEffect, useState } from "react";
import {
  fetchCelebrities,
  addCelebrity,
  deleteCelebrity,
  updateCelebrity,
} from "../services/celebrity";
import { sendEmail } from "../services/email"; // ✅ serviço de email
import Navbar from "../components/Navbar";
import { JOGADORAS } from "../data/jogadoras"; // ✅ Importa as jogadoras

function AdminPanel() {
  const [celebrities, setCelebrities] = useState([]);
  const [form, setForm] = useState({ name: "", photo: "", gender: "unknown" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCelebrities();
  }, []);

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

    let mensagem = "";
    let isRevealed = false;

    if (editingId) {
      const celebridadeAntiga = celebrities.find((c) => c.id === editingId);
      await updateCelebrity(editingId, form);
      alert("Celebridade atualizada.");

      // Se o gênero foi revelado agora, notifica as jogadoras
      if (celebridadeAntiga.gender === "unknown" && form.gender !== "unknown") {
        isRevealed = true;
        mensagem = `👶 O gênero do bebê de ${form.name} foi revelado: ${
          form.gender === "male" ? "Menino" : "Menina"
        }!`;

        for (const jogadora of JOGADORAS) {
          await sendEmail({
            to_name: jogadora.name,
            to_email: jogadora.email,
            message: mensagem,
          });
        }
      }
    } else {
      await addCelebrity(form);
      alert("Celebridade adicionada.");

      mensagem = `🎉 Uma nova celebridade foi adicionada: ${form.name}. Já pode dar seu palpite!`;

      for (const jogadora of JOGADORAS) {
        await sendEmail({
          to_name: jogadora.name,
          to_email: jogadora.email,
          message: mensagem,
        });
      }
    }

    setForm({ name: "", photo: "", gender: "unknown" });
    setEditingId(null);
    loadCelebrities();
  };

  // Aqui você deve implementar onde confere o palpite da jogadora e dispara email dizendo se acertou ou errou.
  // Exemplo de função para chamar quando uma jogadora palpitar:
  const enviarResultadoPalpite = async (jogadora, celebridade, acertou) => {
    const mensagem = acertou
      ? `🎉 Parabéns, ${jogadora.name}! Você acertou o sexo do bebê de ${celebridade.name}.`
      : `😞 Que pena, ${jogadora.name}, você errou o sexo do bebê de ${celebridade.name}. Tente novamente!`;

    await sendEmail({
      to_name: jogadora.name,
      to_email: jogadora.email,
      message: mensagem,
    });
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

  const renderGender = (gender) => {
    if (gender === "unknown" || !gender) return "Não Revelado";
    if (gender === "male") return "Menino";
    if (gender === "female") return "Menina";
    return "Não Revelado";
  };

  return (
    <div className="admin-container">
      <Navbar />
      <h1>Painel do Juiz</h1>

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
        {[...celebrities].reverse().map((c) => (
          <div key={c.id} className="celeb-card">
            <img src={c.photo} alt={c.name} />
            <h3>{c.name}</h3>
            <p>Gênero: {renderGender(c.gender)}</p>
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
