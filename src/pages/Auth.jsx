import React, { useState } from "react";

function Auth({ onAuth }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAuth(email, password, isRegistering);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isRegistering ? "Cadastrar" : "Entrar"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegistering ? "Cadastrar" : "Entrar"}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Já tem conta? Entrar" : "Não tem conta? Cadastrar"}
      </button>
    </div>
  );
}

export default Auth;
