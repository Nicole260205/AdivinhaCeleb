import { useEffect, useState, useMemo } from "react";
import {
  fetchCelebrities,
  addCelebrity,
  deleteCelebrity,
  updateCelebrity,
} from "../services/celebrity";
import Navbar from "../components/Navbar";
import { notifyAllPlayers } from "../services/email";
import EditModal from "../components/EditModal";

function AdminPanel() {
  const [celebrities, setCelebrities] = useState([]);
  const [form, setForm] = useState({ name: "", photo: "", gender: "unknown" });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Novo estado para o filtro
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'revealed'

  useEffect(() => {
    loadCelebrities();
  }, []);

  const loadCelebrities = async () => {
    setLoading(true);
    try {
      const data = await fetchCelebrities();
      setCelebrities(data);
    } catch (error) {
      console.error("Erro ao carregar celebridades:", error);
    }
    setLoading(false);
  };

  // 🔹 Lógica de Filtragem
  const filteredCelebrities = useMemo(() => {
    return celebrities.filter((c) => {
      if (filter === "pending") return c.gender === "unknown" || !c.gender;
      if (filter === "revealed")
        return c.gender === "male" || c.gender === "female";
      return true; // 'all'
    });
  }, [celebrities, filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.photo) {
      alert("Preencha todos os campos.");
      return;
    }
    await addCelebrity(form);
    alert("Celebridade adicionada! ✨");
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
      alert("Celebridade atualizada! ✅");
      setEditingId(null);
      setForm({ name: "", photo: "", gender: "unknown" });
      setShowModal(false);
      loadCelebrities();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir esta celebridade?")) {
      await deleteCelebrity(id);
      loadCelebrities();
    }
  };

  const handleNotifyUsers = async () => {
    if (window.confirm("Enviar e-mail para todas as jogadoras?")) {
      try {
        await notifyAllPlayers();
        alert("Notificações enviadas! 📧");
      } catch (error) {
        alert("Erro ao enviar e-mails.");
      }
    }
  };

  const renderGenderTag = (gender) => {
    if (gender === "male")
      return <span className="gender-tag male">Menino</span>;
    if (gender === "female")
      return <span className="gender-tag female">Menina</span>;
    return <span className="gender-tag unknown">Pendente</span>;
  };

  return (
    <div className="admin-container">
      <Navbar />

      <header className="admin-header">
        <h1>Painel do Juiz</h1>
        <button onClick={handleNotifyUsers} className="notify-button">
          📢 Notificar Jogadoras
        </button>
      </header>

      <section className="admin-add-section">
        <div className="form-card">
          <h2>Adicionar Nova Celebridade</h2>
          <form onSubmit={handleSubmit} className="admin-stack-form">
            <input
              type="text"
              placeholder="Nome da celebridade"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="URL da foto"
              value={form.photo}
              onChange={(e) => setForm({ ...form, photo: e.target.value })}
              required
            />
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="unknown">Aguardando Revelação</option>
              <option value="male">Menino</option>
              <option value="female">Menina</option>
            </select>
            <button type="submit" className="btn-primary">
              Adicionar ao Jogo
            </button>
          </form>
        </div>
      </section>

      <hr className="admin-divider" />

      <main className="admin-list-section">
        <div className="list-header">
          <h2>Gerenciar Celebridades</h2>

          {/* 🔹 Barra de Filtros */}
          <div className="admin-filter-bar">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              Todas ({celebrities.length})
            </button>
            <button
              className={filter === "pending" ? "active" : ""}
              onClick={() => setFilter("pending")}
            >
              Pendentes
            </button>
            <button
              className={filter === "revealed" ? "active" : ""}
              onClick={() => setFilter("revealed")}
            >
              Reveladas
            </button>
          </div>
        </div>

        {loading ? (
          <p className="loading-text">Atualizando lista...</p>
        ) : (
          <div className="admin-vertical-list">
            {filteredCelebrities.length === 0 ? (
              <p className="empty-filter-text">
                Nenhuma celebridade encontrada para este filtro.
              </p>
            ) : (
              filteredCelebrities.map((c) => (
                <div key={c.id} className="admin-row-card">
                  <img src={c.photo} alt={c.name} className="admin-img-large" />

                  <div className="admin-row-info">
                    <h3>{c.name}</h3>
                    {renderGenderTag(c.gender)}
                    <div className="admin-row-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(c)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(c.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <EditModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingId(null);
          setForm({ name: "", photo: "", gender: "unknown" });
        }}
        form={form}
        setForm={setForm}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default AdminPanel;
