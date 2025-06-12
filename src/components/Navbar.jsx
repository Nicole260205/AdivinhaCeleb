import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Se não estiver logado, não renderiza a Navbar
  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>
        <ul className={`navbar-list ${menuOpen ? "open" : ""}`}>
          <li className={isActive("/home") ? "active" : ""}>
            <Link to="/home" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className={isActive("/guess") ? "active" : ""}>
            <Link to="/guess" onClick={() => setMenuOpen(false)}>
              Palpites
            </Link>
          </li>
          <li className={isActive("/ranking") ? "active" : ""}>
            <Link to="/ranking" onClick={() => setMenuOpen(false)}>
              Ranking
            </Link>
          </li>
          <li className={isActive("/jogadoras") ? "active" : ""}>
            <Link to="/jogadoras" onClick={() => setMenuOpen(false)}>
              Jogadoras
            </Link>
          </li>
          {user?.role === "judge" && (
            <li className={isActive("/admin") ? "active" : ""}>
              <Link to="/admin" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-right">
        <Link
          to="/profile"
          className="profile-button"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt="avatar"
            className="avatar"
          />
          <span>{user?.name || "Perfil"}</span>
        </Link>

        <button className="logout-button" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
