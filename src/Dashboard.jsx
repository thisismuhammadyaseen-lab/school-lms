
import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

const API = "http://localhost:5000";

function Dashboard({ student, onNavigate, onLogout }) {
  const studentData = student || {
    id: 2,
    student_id: 2,
    name: "Muhammad Yaseen",
    father_name: "Aziz Jan",
    class_name: "9th",
    roll_number: "1",
    student_code: "STU001",
    username: "yaseen",
  };

  // ==========================================
  // ATTENDANCE STATE
  // ==========================================

  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceError, setAttendanceError] = useState("");

  // ==========================================
  // RESULTS STATE
  // ==========================================

  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [resultsError, setResultsError] = useState("");

  // ==========================================
  // STUDENT ID
  // ==========================================

  const currentStudentId =
    studentData.student_id || studentData.id;

  // ==========================================
  // LOAD ATTENDANCE
  // ==========================================

  useEffect(() => {
    const loadStudentAttendance = async () => {
      if (!currentStudentId) {
        setAttendanceLoading(false);
        setAttendanceError("Student ID not found.");
        return;
      }

      try {
        setAttendanceLoading(true);
        setAttendanceError("");

        const response = await fetch(
          `${API}/attendance/student/${currentStudentId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Attendance loading failed."
          );
        }

        setAttendance(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Student attendance error:", error);

        setAttendance([]);
        setAttendanceError(
          "Attendance load nahi ho saki."
        );
      } finally {
        setAttendanceLoading(false);
      }
    };

    loadStudentAttendance();
  }, [currentStudentId]);

  // ==========================================
  // LOAD RESULTS
  // ==========================================

  useEffect(() => {
    const loadStudentResults = async () => {
      if (!currentStudentId) {
        setResultsLoading(false);
        setResultsError("Student ID not found.");
        return;
      }

      try {
        setResultsLoading(true);
        setResultsError("");

        const response = await fetch(`${API}/results`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Results loading failed."
          );
        }

        const allResults = Array.isArray(data) ? data : [];

        // Student ID se match
        let studentResults = allResults.filter(
          (item) =>
            Number(item.student_id) ===
            Number(currentStudentId)
        );

        // Purane records ke liye student_name fallback
        if (studentResults.length === 0) {
          studentResults = allResults.filter(
            (item) =>
              String(item.student_name || "")
                .trim()
                .toLowerCase() ===
              String(studentData.name || "")
                .trim()
                .toLowerCase()
          );
        }

        setResults(studentResults);
      } catch (error) {
        console.error("Student results error:", error);

        setResults([]);
        setResultsError(
          "Results load nahi ho sake."
        );
      } finally {
        setResultsLoading(false);
      }
    };

    loadStudentResults();
  }, [
    currentStudentId,
    studentData.name,
  ]);

  // ==========================================
  // ATTENDANCE CALCULATIONS
  // ==========================================

  const totalAttendance = attendance.length;

  const presentAttendance = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentAttendance = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const lateAttendance = attendance.filter(
    (item) => item.status === "Late"
  ).length;

  const attendancePercentage =
    totalAttendance > 0
      ? Math.round(
          (presentAttendance /
            totalAttendance) *
            100
        )
      : 0;

  // ==========================================
  // RESULTS CALCULATIONS
  // ==========================================

  const resultSummary = useMemo(() => {
    if (results.length === 0) {
      return {
        totalMarks: 0,
        totalPossible: 0,
        percentage: 0,
        grade: "-",
      };
    }

    const totalMarks = results.reduce(
      (sum, item) =>
        sum + Number(item.marks || 0),
      0
    );

    const totalPossible = results.reduce(
      (sum, item) =>
        sum + Number(item.total || 100),
      0
    );

    const percentage =
      totalPossible > 0
        ? Math.round(
            (totalMarks / totalPossible) * 100
          )
        : 0;

    let grade = "F";

    if (percentage >= 90) {
      grade = "A+";
    } else if (percentage >= 80) {
      grade = "A";
    } else if (percentage >= 70) {
      grade = "B";
    } else if (percentage >= 60) {
      grade = "C";
    } else if (percentage >= 50) {
      grade = "D";
    }

    return {
      totalMarks,
      totalPossible,
      percentage,
      grade,
    };
  }, [results]);

  return (
    <div className="student-dashboard">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="dashboard-header">

        <div>
          <h1>Student Dashboard</h1>

          <p>
            Welcome back, {studentData.name} 👋
          </p>
        </div>

        <div className="student-mini-profile">

          <div className="student-avatar">
            {studentData.name
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>{studentData.name}</strong>

            <span>
              Class {studentData.class_name}
            </span>
          </div>

        </div>

      </div>

      {/* ========================================
          NAVIGATION
      ======================================== */}

      <div className="student-navigation">

        <button
          className="student-nav-button active"
          onClick={() =>
            onNavigate &&
            onNavigate("Dashboard")
          }
        >
          📊 Dashboard
        </button>

        <button
          className="student-nav-button"
          onClick={() =>
            onNavigate &&
            onNavigate("Assignments")
          }
        >
          📝 Assignments
        </button>

        <button
          className="student-nav-button"
          onClick={() =>
            onNavigate &&
            onNavigate("Results")
          }
        >
          📈 Results
        </button>

        <button
          className="student-nav-button"
          onClick={() =>
            onNavigate &&
            onNavigate("Attendance")
          }
        >
          📅 Attendance
        </button>

        <button
          className="student-nav-button"
          onClick={() =>
            onNavigate &&
            onNavigate("Profile")
          }
        >
          👤 Profile
        </button>

        <button
          className="student-logout-button"
          onClick={onLogout}
        >
          🚪 Logout
        </button>

      </div>

      {/* ========================================
          PROFILE CARD
      ======================================== */}

      <div className="profile-card">

        <div className="profile-avatar">
          {studentData.name
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <div className="profile-info">

          <h2>{studentData.name}</h2>

          <p>
            🎓 Student of Iqra Model Public School
          </p>

        </div>

        <div className="profile-details">

          <div>
            <span>Father Name</span>

            <strong>
              {studentData.father_name || "-"}
            </strong>
          </div>

          <div>
            <span>Class</span>

            <strong>
              {studentData.class_name || "-"}
            </strong>
          </div>

          <div>
            <span>Roll Number</span>

            <strong>
              {studentData.roll_number || "-"}
            </strong>
          </div>

          <div>
            <span>Student Code</span>

            <strong>
              {studentData.student_code || "-"}
            </strong>
          </div>

        </div>

      </div>

      {/* ========================================
          STATS
      ======================================== */}

      <div className="dashboard-stats">

        {/* COURSES */}

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            📚
          </div>

          <div>
            <span>Courses</span>

            <strong>3</strong>
          </div>

        </div>

        {/* ASSIGNMENTS */}

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            📝
          </div>

          <div>
            <span>Assignments</span>

            <strong>3</strong>
          </div>

        </div>

        {/* ATTENDANCE */}

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            📊
          </div>

          <div>
            <span>Attendance</span>

            <strong>
              {attendanceLoading
                ? "..."
                : `${attendancePercentage}%`}
            </strong>
          </div>

        </div>

        {/* GRADE */}

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            🏆
          </div>

          <div>
            <span>Grade</span>

            <strong>
              {resultsLoading
                ? "..."
                : resultSummary.grade}
            </strong>
          </div>

        </div>

      </div>

      {/* ========================================
          RESULTS SUMMARY
      ======================================== */}

      <div className="dashboard-section">

        <div className="section-title">

          <div>
            <h2>📈 My Results</h2>

            <p>
              Your latest examination results
            </p>
          </div>

          <button
            className="student-nav-button"
            onClick={() =>
              onNavigate &&
              onNavigate("Results")
            }
          >
            View Results →
          </button>

        </div>

        {resultsLoading ? (
          <div className="quick-info">

            <div className="info-row">

              <span>⏳ Results</span>

              <strong>
                Loading...
              </strong>

            </div>

          </div>
        ) : resultsError ? (
          <div className="quick-info">

            <div className="info-row">

              <span>⚠️ Results</span>

              <strong>
                {resultsError}
              </strong>

            </div>

          </div>
        ) : results.length === 0 ? (
          <div className="quick-info">

            <div className="info-row">

              <span>📊 Results</span>

              <strong>
                No results available yet.
              </strong>

            </div>

          </div>
        ) : (
          <>
            <div className="quick-info">

              <div className="info-row">

                <span>
                  📚 Subjects
                </span>

                <strong>
                  {results.length}
                </strong>

              </div>

              <div className="info-row">

                <span>
                  📝 Total Marks
                </span>

                <strong>
                  {resultSummary.totalMarks} /{" "}
                  {resultSummary.totalPossible}
                </strong>

              </div>

              <div className="info-row">

                <span>
                  📊 Percentage
                </span>

                <strong>
                  {resultSummary.percentage}%
                </strong>

              </div>

              <div className="info-row">

                <span>
                  🏆 Grade
                </span>

                <strong>
                  {resultSummary.grade}
                </strong>

              </div>

            </div>

            {/* RESULTS TABLE */}

            <div className="student-results-table">

              <div className="student-results-header">
                <span>Subject</span>
                <span>Marks</span>
                <span>Total</span>
                <span>Percentage</span>
              </div>

              {results
                .slice(0, 5)
                .map((item) => {

                  const marks =
                    Number(item.marks || 0);

                  const total =
                    Number(item.total || 100);

                  const percentage =
                    total > 0
                      ? Math.round(
                          (marks / total) * 100
                        )
                      : 0;

                  return (
                    <div
                      className="student-results-row"
                      key={item.id}
                    >

                      <span>
                        {item.subject}
                      </span>

                      <span>
                        {marks}
                      </span>

                      <span>
                        {total}
                      </span>

                      <span>
                        {percentage}%
                      </span>

                    </div>
                  );
                })}

            </div>
          </>
        )}

      </div>

      {/* ========================================
          ATTENDANCE SUMMARY
      ======================================== */}

      <div className="dashboard-section">

        <div className="section-title">

          <div>
            <h2>📅 My Attendance</h2>

            <p>
              Your attendance summary
            </p>
          </div>

          <button
            className="student-nav-button"
            onClick={() =>
              onNavigate &&
              onNavigate("Attendance")
            }
          >
            View Attendance →
          </button>

        </div>

        {attendanceLoading ? (
          <div className="quick-info">

            <div className="info-row">

              <span>⏳ Attendance</span>

              <strong>
                Loading...
              </strong>

            </div>

          </div>
        ) : attendanceError ? (
          <div className="quick-info">

            <div className="info-row">

              <span>⚠️ Attendance</span>

              <strong>
                {attendanceError}
              </strong>

            </div>

          </div>
        ) : (
          <div className="quick-info">

            <div className="info-row">

              <span>
                📊 Attendance Percentage
              </span>

              <strong>
                {attendancePercentage}%
              </strong>

            </div>

            <div className="info-row">

              <span>
                📅 Total Records
              </span>

              <strong>
                {totalAttendance}
              </strong>

            </div>

            <div className="info-row">

              <span>
                ✅ Present
              </span>

              <strong>
                {presentAttendance}
              </strong>

            </div>

            <div className="info-row">

              <span>
                ❌ Absent
              </span>

              <strong>
                {absentAttendance}
              </strong>

            </div>

            <div className="info-row">

              <span>
                ⏰ Late
              </span>

              <strong>
                {lateAttendance}
              </strong>

            </div>

          </div>
        )}

      </div>

      {/* ========================================
          MAIN GRID
      ======================================== */}

      <div className="dashboard-grid">

        {/* ======================================
            COURSES
        ====================================== */}

        <div className="dashboard-section">

          <div className="section-title">

            <div>

              <h2>
                My Courses
              </h2>

              <p>
                Your current subjects
              </p>

            </div>

            <span>
              3 Courses
            </span>

          </div>

          <div className="course-list">

            <div className="course-card">

              <div className="course-icon">
                📐
              </div>

              <div>

                <h3>
                  Mathematics
                </h3>

                <p>
                  Algebra, Geometry & More
                </p>

                <small>
                  Teacher: Sir Ahmad
                </small>

              </div>

              <div className="course-arrow">
                →
              </div>

            </div>

            <div className="course-card">

              <div className="course-icon">
                💻
              </div>

              <div>

                <h3>
                  Computer Science
                </h3>

                <p>
                  Programming & Computer Basics
                </p>

                <small>
                  Teacher: Sir Usman
                </small>

              </div>

              <div className="course-arrow">
                →
              </div>

            </div>

            <div className="course-card">

              <div className="course-icon">
                📖
              </div>

              <div>

                <h3>
                  English
                </h3>

                <p>
                  Grammar, Writing & Literature
                </p>

                <small>
                  Teacher: Sir Ali
                </small>

              </div>

              <div className="course-arrow">
                →
              </div>

            </div>

          </div>

        </div>

        {/* ======================================
            QUICK INFORMATION
        ====================================== */}

        <div className="dashboard-section">

          <div className="section-title">

            <div>

              <h2>
                Quick Information
              </h2>

              <p>
                Student account details
              </p>

            </div>

          </div>

          <div className="quick-info">

            <div className="info-row">

              <span>
                👤 Username
              </span>

              <strong>
                {studentData.username || "-"}
              </strong>

            </div>

            <div className="info-row">

              <span>
                🎓 Class
              </span>

              <strong>
                {studentData.class_name || "-"}
              </strong>

            </div>

            <div className="info-row">

              <span>
                🔢 Roll Number
              </span>

              <strong>
                {studentData.roll_number || "-"}
              </strong>

            </div>

            <div className="info-row">

              <span>
                🆔 Student Code
              </span>

              <strong>
                {studentData.student_code || "-"}
              </strong>

            </div>

            <div className="info-row">

              <span>
                📅 Attendance
              </span>

              <strong>
                {attendanceLoading
                  ? "Loading..."
                  : `${attendancePercentage}%`}
              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================
          RECENT ATTENDANCE
      ======================================== */}

      <div className="dashboard-section">

        <div className="section-title">

          <div>

            <h2>
              📅 Recent Attendance
            </h2>

            <p>
              Your latest attendance records
            </p>

          </div>

          <button
            className="student-nav-button"
            onClick={() =>
              onNavigate &&
              onNavigate("Attendance")
            }
          >
            View All →
          </button>

        </div>

        {attendanceLoading ? (
          <div className="quick-info">

            <div className="info-row">

              <span>
                ⏳ Loading
              </span>

              <strong>
                Please wait...
              </strong>

            </div>

          </div>
        ) : attendance.length === 0 ? (
          <div className="quick-info">

            <div className="info-row">

              <span>
                📅 Attendance
              </span>

              <strong>
                No attendance records yet.
              </strong>

            </div>

          </div>
        ) : (
          <div className="quick-info">

            {attendance
              .slice(0, 5)
              .map((item) => (

                <div
                  className="info-row"
                  key={item.id}
                >

                  <span>
                    📅{" "}
                    {item.attendance_date
                      ? String(
                          item.attendance_date
                        ).split("T")[0]
                      : "Date"}
                  </span>

                  <strong>

                    {item.status ===
                      "Present" && (
                      <span>
                        ✅ Present
                      </span>
                    )}

                    {item.status ===
                      "Absent" && (
                      <span>
                        ❌ Absent
                      </span>
                    )}

                    {item.status ===
                      "Late" && (
                      <span>
                        ⏰ Late
                      </span>
                    )}

                  </strong>

                </div>

              ))}

          </div>
        )}

      </div>

      {/* ========================================
          NOTICE
      ======================================== */}

      <div className="dashboard-notice">

        <div className="notice-icon">
          🎓
        </div>

        <div>

          <h3>
            Welcome to Iqra Model Public School
          </h3>

          <p>
            Yahan aap apne courses,
            assignments, results aur
            attendance ko easily manage
            kar sakte hain.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
