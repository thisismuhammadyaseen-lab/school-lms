import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import "./App.css";

import Dashboard from "./Dashboard.jsx";
import StudentLogin from "./StudentLogin.jsx";
import AdminLogin from "./AdminLogin.jsx";
import Admin from "./Admin.jsx";
import Results from "./Results.jsx";

const features = [
  {
    icon: "📚",
    title: "Assignments",
    text: "Students can view and submit assignments online.",
    link: "/student-login",
  },
  {
    icon: "📊",
    title: "Results",
    text: "View marks, percentages and examination results.",
    link: "/results",
  },
  {
    icon: "📅",
    title: "Attendance",
    text: "Track daily and monthly attendance records.",
    link: "/dashboard",
  },
  {
    icon: "👨‍🏫",
    title: "Administration",
    text: "Manage students, teachers, results and assignments.",
    link: "/admin-login",
  },
];

function Home() {
  return (
    <div className="school-home">
      {/* NAVBAR */}
      <header className="home-navbar">
        <Link to="/" className="nav-brand">
          <div className="school-logo">🏫</div>

          <div>
            <h2>Iqra Model Public School</h2>
            <span>Uthmanzai</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <a href="#about">About</a>
          <a href="#features">Features</a>

          <Link to="/student-login" className="nav-login">
            Student Login
          </Link>

          <Link to="/admin-login" className="nav-admin">
            Admin Login
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <div className="hero-badge">
              🎓 SCHOOL MANAGEMENT SYSTEM
            </div>

            <h1>
              Welcome to
              <span> Iqra Model Public School</span>
            </h1>

            <h3>Uthmanzai</h3>

            <p>
              A modern digital platform for students, teachers and
              school administration. Manage learning, assignments,
              results and attendance in one simple place.
            </p>

            <div className="hero-buttons">
              <Link to="/student-login" className="primary-btn">
                🎓 Student Login
              </Link>

              <Link to="/admin-login" className="secondary-btn">
                🔐 Admin Panel
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <strong>5+</strong>
                <span>Students</span>
              </div>

              <div>
                <strong>2+</strong>
                <span>Teachers</span>
              </div>

              <div>
                <strong>6+</strong>
                <span>Assignments</span>
              </div>

              <div>
                <strong>5+</strong>
                <span>Results</span>
              </div>
            </div>
          </div>

          <div className="hero-image-card">
            <img
              src="/src/assets/school.jpg"
              alt="Iqra Model Public School"
            />

            <div className="image-caption">
              <span>🏫</span>

              <div>
                <strong>Iqra Model Public School</strong>
                <small>Uthmanzai</small>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about-section" id="about">
          <div className="section-label">
            ABOUT OUR LMS
          </div>

          <h2>
            Everything you need,
            <span> in one place.</span>
          </h2>

          <p>
            Our School LMS makes academic information easier to
            manage. Students can access their learning information
            while school administration can manage important
            academic records.
          </p>
        </section>

        {/* FEATURES */}
        <section className="features-section" id="features">
          <div className="section-heading">
            <div>
              <div className="section-label">
                SMART FEATURES
              </div>

              <h2>School LMS Features</h2>
            </div>

            <p>
              Simple, organized and easy-to-use tools for everyday
              school management.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <Link
                to={feature.link}
                className="feature-card"
                key={feature.title}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>

                <span className="feature-link">
                  Open Section →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div>
            <div className="section-label">
              GET STARTED
            </div>

            <h2>
              Ready to access your School LMS?
            </h2>

            <p>
              Students can login to view their academic
              information and administrators can manage the
              school system.
            </p>
          </div>

          <div className="cta-buttons">
            <Link
              to="/student-login"
              className="primary-btn"
            >
              Student Login →
            </Link>

            <Link
              to="/admin-login"
              className="secondary-btn"
            >
              Admin Login →
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="home-footer">
        <div>
          <strong>
            🏫 Iqra Model Public School Uthmanzai
          </strong>

          <p>
            School Management & Learning Management System
          </p>
        </div>

        <div className="footer-right">
          © 2026 All Rights Reserved
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* STUDENT */}
      <Route
        path="/student-login"
        element={<StudentLogin />}
      />

      {/* STUDENT DASHBOARD */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* RESULTS */}
      <Route
        path="/results"
        element={<Results />}
      />

      {/* ADMIN */}
      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={<Admin />}
      />

      {/* FALLBACK */}
      <Route
        path="*"
        element={<Home />}
      />
    </Routes>
  );
}

export default App;