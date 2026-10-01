
import { useEffect, useMemo, useState } from "react";
import "./Results.css";

const API = "http://localhost:5000";

function Results({ student }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentId = student?.student_id || student?.id;
  const studentName = student?.name || "";

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API}/results`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Results load failed");
        }

        const myResults = data.filter((item) => {
          if (
            studentId &&
            item.student_id !== null &&
            item.student_id !== undefined
          ) {
            return Number(item.student_id) === Number(studentId);
          }

          return (
            String(item.student_name || "").trim().toLowerCase() ===
            String(studentName || "").trim().toLowerCase()
          );
        });

        setResults(myResults);
      } catch (err) {
        console.error("Results error:", err);
        setError("Results load nahi ho sake. Backend check karo.");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [studentId, studentName]);

  const summary = useMemo(() => {
    if (results.length === 0) {
      return {
        totalMarks: 0,
        totalPossible: 0,
        percentage: 0,
        grade: "-",
      };
    }

    const totalMarks = results.reduce(
      (sum, item) => sum + Number(item.marks || 0),
      0
    );

    const totalPossible = results.reduce(
      (sum, item) => sum + Number(item.total || 100),
      0
    );

    const percentage =
      totalPossible > 0
        ? Math.round((totalMarks / totalPossible) * 100)
        : 0;

    let grade = "F";

    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";

    return {
      totalMarks,
      totalPossible,
      percentage,
      grade,
    };
  }, [results]);

  const printMarksheet = () => {
    window.print();
  };

  return (
    <div className="results-page">
      {/* Top Header */}
      <div className="results-header no-print">
        <div>
          <p className="results-small-title">Student Portal</p>

          <h1>My Results</h1>

          <p>
            Apne subjects, marks aur academic performance yahan check karein.
          </p>
        </div>

        <div className="student-result-info">
          <strong>{studentName || "Student"}</strong>

          <span>
            {student?.class_name || "Class 9th"}
          </span>
        </div>
      </div>

      {/* Professional Marksheet */}
      <div className="marksheet">

        {/* School Header */}
        <div className="marksheet-school-header">
          <div className="school-logo-box">
            🏫
          </div>

          <div className="school-heading">
            <h1>Iqra Model High School</h1>

            <p>Student Academic Management System</p>

            <span>OFFICIAL STUDENT MARKSHEET</span>
          </div>

          <div className="school-badge">
            <span>RESULT</span>
            <strong>2026</strong>
          </div>
        </div>

        {/* Student Information */}
        <div className="student-information">
          <div className="info-title">
            <span>👨‍🎓</span>
            Student Information
          </div>

          <div className="student-info-grid">

            <div className="info-item">
              <span>Student Name</span>
              <strong>{studentName || "Student"}</strong>
            </div>

            <div className="info-item">
              <span>Student ID</span>
              <strong>
                {studentId || "N/A"}
              </strong>
            </div>

            <div className="info-item">
              <span>Class</span>
              <strong>
                {student?.class_name || "9th"}
              </strong>
            </div>

            <div className="info-item">
              <span>Roll Number</span>
              <strong>
                {student?.roll_number || "N/A"}
              </strong>
            </div>

          </div>
        </div>

        {/* Summary Cards */}
        <div className="result-summary-grid">

          <div className="result-summary-card">
            <span>Total Subjects</span>
            <strong>{results.length}</strong>
          </div>

          <div className="result-summary-card">
            <span>Total Marks</span>
            <strong>
              {summary.totalMarks}/{summary.totalPossible}
            </strong>
          </div>

          <div className="result-summary-card">
            <span>Percentage</span>
            <strong>
              {summary.percentage}%
            </strong>
          </div>

          <div className="result-summary-card">
            <span>Overall Grade</span>
            <strong>
              {summary.grade}
            </strong>
          </div>

        </div>

        {/* Results Table */}
        <div className="results-card">

          <div className="results-card-header">
            <div>
              <h2>Subject Results</h2>

              <p>
                Official academic performance record
              </p>
            </div>
          </div>

          {loading ? (
            <div className="results-state">
              <div className="results-loader"></div>

              <p>Results loading...</p>
            </div>
          ) : error ? (
            <div className="results-state error-state">
              <h3>⚠️ Error</h3>

              <p>{error}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="results-state">
              <div className="empty-result-icon">
                📊
              </div>

              <h3>No Results Available</h3>

              <p>
                Abhi aapke liye koi result upload nahi kiya gaya.
              </p>
            </div>
          ) : (
            <div className="results-table-wrapper">

              <table className="results-table">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Subject</th>
                    <th>Marks Obtained</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((result, index) => {

                    const marks = Number(
                      result.marks || 0
                    );

                    const total = Number(
                      result.total || 100
                    );

                    const percentage =
                      total > 0
                        ? Math.round(
                            (marks / total) * 100
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

                    const passed = percentage >= 50;

                    return (
                      <tr key={result.id || index}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <strong>
                            {result.subject}
                          </strong>
                        </td>

                        <td>
                          <strong>
                            {marks}
                          </strong>
                        </td>

                        <td>
                          {total}
                        </td>

                        <td>
                          <div className="percentage-cell">

                            <div className="percentage-bar">
                              <div
                                className="percentage-fill"
                                style={{
                                  width: `${Math.min(
                                    percentage,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>

                            <span>
                              {percentage}%
                            </span>

                          </div>
                        </td>

                        <td>
                          <span className="grade-badge">
                            {grade}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`result-status ${
                              passed
                                ? "passed"
                                : "failed"
                            }`}
                          >
                            {passed
                              ? "Passed"
                              : "Failed"}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* Final Result */}
        {results.length > 0 && (
          <div className="final-result-box">

            <div>
              <span>Overall Result</span>

              <strong>
                {summary.percentage >= 50
                  ? "PASS"
                  : "FAIL"}
              </strong>
            </div>

            <div>
              <span>Percentage</span>

              <strong>
                {summary.percentage}%
              </strong>
            </div>

            <div>
              <span>Grade</span>

              <strong>
                {summary.grade}
              </strong>
            </div>

          </div>
        )}

        {/* Note */}
        {results.length > 0 && (
          <div className="result-note">

            <span>💡</span>

            <div>
              <strong>
                Result Information
              </strong>

              <p>
                Ye marksheet school administration
                ki taraf se upload ki gayi hai.
              </p>
            </div>

          </div>
        )}

        {/* Signature Area */}
        {results.length > 0 && (
          <div className="signature-area">

            <div className="signature-box">
              <div></div>
              <span>Class Teacher</span>
            </div>

            <div className="signature-box">
              <div></div>
              <span>Principal</span>
            </div>

          </div>
        )}

        {/* Print Button */}
        {results.length > 0 && (
          <div className="print-area no-print">

            <button
              className="print-button"
              onClick={printMarksheet}
            >
              🖨️ Print Marksheet
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default Results;
