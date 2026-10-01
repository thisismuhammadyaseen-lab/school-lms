import { useState } from "react";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin";
import StudentLogin from "./StudentLogin";

function getGrade(marks) {
  const m = Number(marks);

  if (m >= 90) return "A+";
  if (m >= 80) return "A";
  if (m >= 70) return "B";
  if (m >= 60) return "C";
  if (m >= 50) return "D";
  return "F";
}

function App() {
  const [page, setPage] = useState("Dashboard");

  // Student Login
  const [studentLoggedIn, setStudentLoggedIn] = useState(false);
  const [studentUsername, setStudentUsername] = useState("");

  // Admin Login
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  // Assignment Files
  const [mathFile, setMathFile] = useState(null);
  const [englishFile, setEnglishFile] = useState(null);
  const [physicsFile, setPhysicsFile] = useState(null);

  const [submitted, setSubmitted] = useState({
    Mathematics: false,
    English: false,
    Physics: false,
  });

  // Results
  const [results, setResults] = useState([]);

  // =========================
  // STUDENT LOGIN
  // =========================

  if (!studentLoggedIn) {
    return (
      <StudentLogin
        onLogin={(username) => {
          setStudentUsername(username);
          setStudentLoggedIn(true);
          setPage("Dashboard");
        }}
      />
    );
  }

  // =========================
  // LOAD RESULTS
  // =========================

  const loadResults = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/files"
      );

      const data = await response.json();

      const studentResults = data.filter(
        (assignment) =>
          assignment.studentName === "Yaseen" &&
          assignment.marks !== undefined &&
          assignment.marks !== ""
      );

      setResults(studentResults);
    } catch (error) {
      console.error("Results error:", error);
    }
  };

  // =========================
  // FILE CHANGE
  // =========================

  const handleFileChange = (subject, file) => {
    if (subject === "Mathematics") {
      setMathFile(file);
    }

    if (subject === "English") {
      setEnglishFile(file);
    }

    if (subject === "Physics") {
      setPhysicsFile(file);
    }
  };

  // =========================
  // SUBMIT ASSIGNMENT
  // =========================

  const handleSubmit = async (subject, file) => {
    if (!file) {
      alert("Please pehle file select karo.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("studentName", "Yaseen");
      formData.append("subject", subject);

      const response = await fetch(
        "http://localhost:5000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Assignment successfully submit ho gaya ✅");

        setSubmitted((prev) => ({
          ...prev,
          [subject]: true,
        }));
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Backend se connection nahi ho raha.");
    }
  };

  // =========================
  // STUDENT LOGOUT
  // =========================

  const studentLogout = () => {
    setStudentLoggedIn(false);
    setStudentUsername("");
    setPage("Dashboard");
  };

  // =========================
  // ADMIN LOGIN
  // =========================

  if (page === "AdminLogin") {
    return (
      <AdminLogin
        onLogin={() => {
          setAdminLoggedIn(true);
          setPage("Admin");
        }}
      />
    );
  }

  // =========================
  // ADMIN PANEL
  // =========================

  if (page === "Admin" && adminLoggedIn) {
    return <Admin />;
  }

  // =========================
  // MAIN APP
  // =========================

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div>
          <h1>Iqra Model High School</h1>

          <p>
            Student Management System
          </p>
        </div>

        <div className="header-buttons">

          <span>
            👤 {studentUsername}
          </span>

          <button onClick={studentLogout}>
            Logout
          </button>

        </div>

      </header>

      {/* NAVBAR */}

      <nav className="navbar">

        <button
          onClick={() => setPage("Dashboard")}
        >
          Dashboard
        </button>

        <button
          onClick={() => setPage("Courses")}
        >
          Courses
        </button>

        <button
          onClick={() => setPage("Assignments")}
        >
          Assignments
        </button>

        <button
          onClick={() => {
            setPage("Results");
            loadResults();
          }}
        >
          Results
        </button>

        <button
          onClick={() => setPage("Attendance")}
        >
          Attendance
        </button>

        <button
          onClick={() => setPage("Profile")}
        >
          Profile
        </button>

        <button
          onClick={() => setPage("AdminLogin")}
        >
          Admin
        </button>

      </nav>

      {/* CONTENT */}

      <main className="content">

        {/* ================= DASHBOARD ================= */}

        {page === "Dashboard" && (
          <div className="dashboard-page">

            {/* Welcome */}

            <div className="welcome-box">

              <div>
                <h1>
                  Welcome back, {studentUsername} 👋
                </h1>

                <p>
                  Iqra Model High School Student Dashboard
                </p>
              </div>

              <div className="welcome-icon">
                🎓
              </div>

            </div>

            {/* Statistics */}

            <div className="dashboard-cards">

              <div className="card dashboard-stat">

                <div className="stat-icon">
                  📚
                </div>

                <div>
                  <h2>4</h2>
                  <p>Courses</p>
                </div>

              </div>

              <div className="card dashboard-stat">

                <div className="stat-icon">
                  📝
                </div>

                <div>
                  <h2>3</h2>
                  <p>Assignments</p>
                </div>

              </div>

              <div className="card dashboard-stat">

                <div className="stat-icon">
                  📊
                </div>

                <div>
                  <h2>92%</h2>
                  <p>Attendance</p>
                </div>

              </div>

              <div className="card dashboard-stat">

                <div className="stat-icon">
                  🎯
                </div>

                <div>
                  <h2>Active</h2>
                  <p>Student Status</p>
                </div>

              </div>

            </div>

            {/* Quick Actions */}

            <div className="quick-section">

              <h2>
                Quick Actions
              </h2>

              <div className="quick-actions">

                <button
                  onClick={() =>
                    setPage("Courses")
                  }
                >
                  📚
                  <span>
                    View Courses
                  </span>
                </button>

                <button
                  onClick={() =>
                    setPage("Assignments")
                  }
                >
                  📝
                  <span>
                    Assignments
                  </span>
                </button>

                <button
                  onClick={() => {
                    setPage("Results");
                    loadResults();
                  }}
                >
                  📊
                  <span>
                    View Results
                  </span>
                </button>

                <button
                  onClick={() =>
                    setPage("Attendance")
                  }
                >
                  📅
                  <span>
                    Attendance
                  </span>
                </button>

              </div>

            </div>

          </div>
        )}

        {/* ================= COURSES ================= */}

        {page === "Courses" && (
          <>

            <h1>
              My Courses 📚
            </h1>

            <div className="courses">

              <div className="course-card">
                <h2>
                  Mathematics
                </h2>

                <p>
                  Teacher: Sir Balal
                </p>
              </div>

              <div className="course-card">
                <h2>
                  English
                </h2>

                <p>
                  Teacher: Sir madrar
                </p>
              </div>

              <div className="course-card">
                <h2>
                  Physics
                </h2>

                <p>
                  Teacher: Sir fasal
                </p>
              </div>

              <div className="course-card">
                <h2>
                  Computer Science
                </h2>

                <p>
                  Teacher: Sir Usman
                </p>
              </div>

            </div>

          </>
        )}

        {/* ================= ASSIGNMENTS ================= */}

        {page === "Assignments" && (
          <>

            <h1>
              Assignments 📝
            </h1>

            {/* Mathematics */}

            <div className="assignment-card">

              <h2>
                Mathematics
              </h2>

              <p>
                Algebra and Equations
              </p>

              <p>
                Due Date: 15 September 2026
              </p>

              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(
                    "Mathematics",
                    e.target.files[0]
                  )
                }
              />

              {mathFile && (
                <p>
                  Selected File: {mathFile.name}
                </p>
              )}

              <button
                onClick={() =>
                  handleSubmit(
                    "Mathematics",
                    mathFile
                  )
                }
              >
                Submit Assignment
              </button>

              {submitted.Mathematics && (
                <p className="success">
                  Assignment Submitted ✅
                </p>
              )}

            </div>

            {/* English */}

            <div className="assignment-card">

              <h2>
                English
              </h2>

              <p>
                Essay Writing
              </p>

              <p>
                Due Date: 18 September 2026
              </p>

              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(
                    "English",
                    e.target.files[0]
                  )
                }
              />

              {englishFile && (
                <p>
                  Selected File: {englishFile.name}
                </p>
              )}

              <button
                onClick={() =>
                  handleSubmit(
                    "English",
                    englishFile
                  )
                }
              >
                Submit Assignment
              </button>

              {submitted.English && (
                <p className="success">
                  Assignment Submitted ✅
                </p>
              )}

            </div>

            {/* Physics */}

            <div className="assignment-card">

              <h2>
                Physics
              </h2>

              <p>
                Motion and Force
              </p>

              <p>
                Due Date: 20 September 2026
              </p>

              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(
                    "Physics",
                    e.target.files[0]
                  )
                }
              />

              {physicsFile && (
                <p>
                  Selected File: {physicsFile.name}
                </p>
              )}

              <button
                onClick={() =>
                  handleSubmit(
                    "Physics",
                    physicsFile
                  )
                }
              >
                Submit Assignment
              </button>

              {submitted.Physics && (
                <p className="success">
                  Assignment Submitted ✅
                </p>
              )}

            </div>

          </>
        )}

        {/* ================= RESULTS ================= */}

        {page === "Results" && (
          <>

            <h1>
              Results 📊
            </h1>

            {results.length === 0 ? (

              <div className="empty">

                <h2>
                  No Results Available
                </h2>

                <p>
                  Teacher ne abhi marks nahi diye.
                </p>

              </div>

            ) : (

              <div className="results-list">

                {results.map(
                  (result, index) => (

                    <div
                      className="result-card"
                      key={
                        result.filename ||
                        index
                      }
                    >

                      <h2>
                        {result.subject}
                      </h2>

                      <p>
                        <strong>
                          Marks:
                        </strong>{" "}
                        {result.marks}
                      </p>

                      <p>
                        <strong>
                          Percentage:
                        </strong>{" "}
                        {result.marks
                          ? `${(
                              (Number(
                                result.marks
                              ) /
                                100) *
                              100
                            ).toFixed(0)}%`
                          : "N/A"}
                      </p>

                      <p>
                        <strong>
                          Grade:
                        </strong>{" "}
                        {getGrade(
                          result.marks
                        )}
                      </p>

                      <p>
                        <strong>
                          Status:
                        </strong>{" "}
                        {Number(
                          result.marks
                        ) >= 50
                          ? "Pass ✅"
                          : "Fail ❌"}
                      </p>

                      <p>
                        <strong>
                          Teacher Feedback:
                        </strong>{" "}
                        {result.feedback ||
                          "No feedback"}
                      </p>

                    </div>

                  )
                )}

              </div>

            )}

          </>
        )}

        {/* ================= ATTENDANCE ================= */}

        {page === "Attendance" && (
          <>

            <h1>
              Attendance 📅
            </h1>

            <div className="attendance-card">

              <h2>
                Attendance: 92%
              </h2>

              <p>
                Present: 92 Days
              </p>

              <p>
                Absent: 8 Days
              </p>

              <p>
                Total: 100 Days
              </p>

            </div>

          </>
        )}

        {/* ================= PROFILE ================= */}

        {page === "Profile" && (
          <>

            <h1>
              My Profile 👤
            </h1>

            <div className="profile-card">

              <h2>
                {studentUsername}
              </h2>

              <p>
                <strong>
                  Class:
                </strong>{" "}
                9th
              </p>

              <p>
                <strong>
                  School:
                </strong>{" "}
                Iqra Model High School
              </p>

              <p>
                <strong>
                  Role:
                </strong>{" "}
                Student
              </p>

            </div>

          </>
        )}

      </main>

      {/* FOOTER */}

      <footer className="footer">

        <p>
          © 2026 Iqra Model High School
        </p>

        <p>
          Student Management System
        </p>

      </footer>

    </div>
  );
}

export default App;