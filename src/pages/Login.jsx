import { useState } from "react";
import { login, getUserData, resetPassword } from "../services/auth"; // ✅ import reset
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const user = await login(email, password);
      await getUserData(user.uid);

      navigate("/home"); // Redireciona sempre para /home
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Digite seu email para redefinir a senha.");
      return;
    }
    setError("");
    try {
      await resetPassword(email);
      setMessage("Enviamos um link de redefinição para o seu email.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>

        {/* ✅ Botão de reset */}
        <button
          type="button"
          onClick={handleResetPassword}
          style={{
            background: "hsl(350, 100%, 88%);",
            border: "none",
            color: "white",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Esqueci minha senha
        </button>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
      </form>
    </div>
  );
}

export default Login;
