import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // Dummy admin credentials
    const adminEmail = "admin@moviesdom.com";
    const adminPass = "admin123";

    if (email === adminEmail && pass === adminPass) {
      localStorage.setItem("adminLogged", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="admin-login-page">
      <div className="login-box">
        <h1 className="admin-title">Movies Dom Admin</h1>
        <p className="admin-sub">Login to manage your news app</p>

        <form onSubmit={handleLogin} className="admin-form">
          {error && <p className="admin-error">{error}</p>}

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="admin-input"
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
            className="admin-input"
          />

          <button className="admin-btn">Login</button>
        </form>
      </div>
    </div>
  );
}
