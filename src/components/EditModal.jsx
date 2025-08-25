
function EditModal({ isOpen, onClose, form, setForm, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Celebridade</h2>
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
        <div className="modal-actions">
          <button onClick={onSave}>Salvar</button>
          <button onClick={onClose} className="cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
