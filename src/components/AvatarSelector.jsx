const avatars = [
  "/avatars/avatar01.png",
  "/avatars/avatar02.png",
  "/avatars/avatar03.png",
  "/avatars/avatar04.png",
  "/avatars/avatar05.png",
  "/avatars/avatar06.png",
  "/avatars/avatar07.png",
  "/avatars/avatar08.png",
];

function AvatarSelector({ selected, setSelected }) {
  return (
    <div className="avatar-selector">
      <p>Escolha seu avatar:</p>
      <div className="avatar-grid">
        {avatars.map((avatar) => (
          <img
            key={avatar}
            src={avatar}
            alt="Avatar"
            className={`avatar-option ${selected === avatar ? "selected" : ""}`}
            onClick={() => setSelected(avatar)}
          />
        ))}
      </div>
    </div>
  );
}

export default AvatarSelector;
