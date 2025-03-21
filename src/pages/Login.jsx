import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../firebaseConfig";
import "../style/global.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginWithEmail(email, password);
      navigate("/wishlist");
    } catch {
      setError("⚠ Correo o contraseña incorrectos.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/wishlist");
    } catch {
      setError("⚠ No se pudo iniciar sesión con Google.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-box">
          <h1>Iniciar Sesión</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="📧 Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="🔑 Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Iniciar Sesión</button>
          </form>

          <button onClick={handleGoogleLogin} className="google-btn">
            Iniciar sesión con Google
          </button>

          {error && <p className="error">{error}</p>}

          <p className="toggle-auth">
            ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

