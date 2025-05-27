import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setPlayerName(storedName);
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("playerName");
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
              Guess
            </Link>
          </li>
          <li className={isActive("/ranking") ? "active" : ""}>
            <Link to="/ranking" onClick={() => setMenuOpen(false)}>
              Ranking
            </Link>
          </li>
          <li className={isActive("/admin") ? "active" : ""}>
            <Link to="/admin" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        {playerName && <span className="greeting">Olá, {playerName}</span>}
        <button className="logout-button" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
