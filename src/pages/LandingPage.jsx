import { Link } from "react-router-dom";
import logo from "/babyy.png";

function LandingPage() {
  return (
    <div className="landing-container">
      <img src={logo} alt="Logo AdivinhaCeleb" className="landing-logo" />
      <h1>AdivinhaCeleb</h1>
      <p className="tagline">Lista de sexo de bebês 🍼🥳</p>
      <div className="landing-buttons">
        <Link to="/login">
          <button>Entrar</button>
        </Link>
        <Link to="/register">
          <button>Cadastrar</button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
