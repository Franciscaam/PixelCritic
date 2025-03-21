import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerWithEmail } from "../firebaseConfig";
import "../style/global.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailRegex.test(email)) {
      setError("⚠ El correo electrónico no es válido.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("⚠ La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.");
      return;
    }

    if (password !== confirmPassword) {
      setError("⚠ Las contraseñas no coinciden.");
      return;
    }

    try {
      await registerWithEmail(email, password);
      navigate("/wishlist");
    } catch (error) {
      setError("⚠ " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-box">
          <h1>Crear Cuenta</h1>
          <form onSubmit={handleRegister}>
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
            <input
              type="password"
              placeholder="🔑 Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Registrarse</button>
          </form>

          {error && <p className="error">{error}</p>}

          <p className="toggle-auth">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
