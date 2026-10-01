import { useState } from "react";
import "./StudentLogin.css";

function StudentLogin({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!username || !password) {
      setError("Username aur password dono enter karein.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/student/login",
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
        setError(data.message || "Login failed.");
        return;
      }

      localStorage.setItem(
        "student",
        JSON.stringify(data.student)
      );

      onLogin(data.student);
    } catch (error) {
      console.error(error);
      setError(
        "Server se connection nahi ho raha. Backend check karein."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-login-page">
      <div className="student-login-card">

        <div className="student-login-icon">
          🎓
        </div>

        <h1>Student Login</h1>

        <p className="student-login-subtitle">
          Iqra Model High School
        </p>

        <form onSubmit={handleLogin}>

          <div className="student-input-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="student-input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="student-login-error">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            className="student-login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          className="student-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="student-login-info">
          <strong>Demo Student Account</strong>
          <p>Username: yaseen</p>
          <p>Password: 12345</p>
        </div>

      </div>
    </div>
  );
}

export default StudentLogin;