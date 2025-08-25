import { useEffect, useState } from "react";
import {
  fetchCelebrities,
  addCelebrity,
  deleteCelebrity,
  updateCelebrity,
} from "../services/celebrity";
import Navbar from "../components/Navbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { sendEmailToUser } from "../services/email";
import EditModal from "../components/EditModal";

function AdminPanel() {
  const [celebrities, setCelebrities] = useState([]);
  const [form, setForm] = useState({ name: "", photo: "", gender: "unknown" });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

    await addCelebrity(form);
    alert("Celebridade adicionada.");

    setForm({ name: "", photo: "", gender: "unknown" });
    loadCelebrities();
  };

  const handleEdit = (c) => {
    setForm({ name: c.name, photo: c.photo, gender: c.gender });
    setEditingId(c.id);
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    if (editingId) {
      await updateCelebrity(editingId, form);
      alert("Celebridade atualizada.");
      setEditingId(null);
      setForm({ name: "", photo: "", gender: "unknown" });
      setShowModal(false);
      loadCelebrities();
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Deseja realmente excluir?");
    if (confirm) {
      await deleteCelebrity(id);
      loadCelebrities();
    }
  };

  const handleNotifyUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const users = snapshot.docs.map((doc) => doc.data());

      for (const user of users) {
        if (user.email && user.name) {
          await sendEmailToUser(user.email, user.name);
        }
      }

      alert("Notificações enviadas com sucesso!");
    } catch (error) {
      console.error("Erro ao notificar usuárias:", error);
      alert("Ocorreu um erro ao enviar os emails.");
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

      <button onClick={handleNotifyUsers} className="notify-button">
        Notificar Usuárias
      </button>

      <h2>Lista de Celebridades</h2>
      <div className="celeb-list">
        {celebrities.map((c) => (
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

      {/* Modal de edição */}
      <EditModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        form={form}
        setForm={setForm}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default AdminPanel;
