
import { useState } from "react";
import "./AdminLogin.css";

function AdminLogin({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Username ya password ghalat hai.");
        return;
      }

      onLogin();
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "❌ Backend server se connection nahi ho raha."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-icon">
          🔐
        </div>

        <h1>Admin Login</h1>

        <p className="login-subtitle">
          Iqra Model High School
        </p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "⏳ Checking..."
              : "🔑 Login to Admin Panel"}
          </button>

        </form>

        <button
          onClick={onBack}
          className="back-button"
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default AdminLogin;
