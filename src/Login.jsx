```jsx
import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Username aur Password dono enter karein.");
      return;
    }

    // Login successful
    alert("Login successfully!");

    // Dashboard par redirect
    window.location.href = "/dashboard";
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          🎓
        </div>

        <h1>Welcome Back</h1>

        <p className="school-name">
          Iqra Model Public School Uthmanzai
        </p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Email / Username</label>

            <input
              type="text"
              placeholder="Enter your email or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-options">

            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#forgot">
              Forgot Password?
            </a>

          </div>

          <button type="submit" className="login-submit">
            Login
          </button>

        </form>

        <a href="/" className="back-home">
          ← Back to Home
        </a>

      </div>

    </div>
  );
}

export default Login;
```
