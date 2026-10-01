import { useEffect, useState } from "react";
import "./Admin.css";

const API = "http://localhost:5000";

function Admin({ onLogout }) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [message, setMessage] = useState("");

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [studentForm, setStudentForm] = useState({
    name: "",
    father_name: "",
    class_name: "",
    roll_number: "",
    student_code: "",
    phone: "",
  });

  const [teacherForm, setTeacherForm] = useState({
    name: "",
    subject: "",
    phone: "",
    email: "",
  });

  const [resultForm, setResultForm] = useState({
    student_name: "",
    subject: "",
    marks: "",
  });

  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    subject: "",
    due_date: "",
    description: "",
  });

  const [attendanceForm, setAttendanceForm] = useState({
    student_id: "",
    attendance_date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
  });

  useEffect(() => {
    loadAll();
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const loadAll = async () => {
    try {
      const [
        studentsRes,
        teachersRes,
        assignmentsRes,
        resultsRes,
        attendanceRes,
        announcementsRes,
      ] = await Promise.all([
        fetch(`${API}/students`),
        fetch(`${API}/teachers`),
        fetch(`${API}/assignments`),
        fetch(`${API}/results`),
        fetch(`${API}/attendance`),
        fetch(`${API}/announcements`),
      ]);

      setStudents(await studentsRes.json());
      setTeachers(await teachersRes.json());
      setAssignments(await assignmentsRes.json());
      setResults(await resultsRes.json());
      setAttendance(await attendanceRes.json());
      setAnnouncements(await announcementsRes.json());
    } catch (error) {
      console.error(error);
      showMessage("Server connection error");
    }
  };

  const resetForms = () => {
    setEditingId(null);

    setStudentForm({
      name: "",
      father_name: "",
      class_name: "",
      roll_number: "",
      student_code: "",
      phone: "",
    });

    setTeacherForm({
      name: "",
      subject: "",
      phone: "",
      email: "",
    });

    setResultForm({
      student_name: "",
      subject: "",
      marks: "",
    });

    setAssignmentForm({
      title: "",
      subject: "",
      due_date: "",
      description: "",
    });

    setAttendanceForm({
      student_id: "",
      attendance_date: new Date().toISOString().split("T")[0],
      status: "Present",
    });

    setAnnouncementForm({
      title: "",
      message: "",
    });
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSearch("");
    resetForms();
  };

  /* ================= STUDENTS ================= */

  const saveStudent = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `${API}/students/${editingId}`
        : `${API}/students`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentForm),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Student save failed");
        return;
      }

      showMessage(editingId ? "Student updated" : "Student added");

      resetForms();
      loadAll();
    } catch (error) {
      showMessage("Server error");
    }
  };

  const editStudent = (student) => {
    setEditingId(student.id);

    setStudentForm({
      name: student.name || "",
      father_name: student.father_name || "",
      class_name: student.class_name || "",
      roll_number: student.roll_number || "",
      student_code: student.student_code || "",
      phone: student.phone || "",
    });
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      const response = await fetch(`${API}/students/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Delete failed");
        return;
      }

      showMessage("Student deleted");
      loadAll();
    } catch {
      showMessage("Server error");
    }
  };

  /* ================= TEACHERS ================= */

  const saveTeacher = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `${API}/teachers/${editingId}`
        : `${API}/teachers`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherForm),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Teacher save failed");
        return;
      }

      showMessage(editingId ? "Teacher updated" : "Teacher added");

      resetForms();
      loadAll();
    } catch {
      showMessage("Server error");
    }
  };

  const editTeacher = (teacher) => {
    setEditingId(teacher.id);

    setTeacherForm({
      name: teacher.name || "",
      subject: teacher.subject || "",
      phone: teacher.phone || "",
      email: teacher.email || "",
    });
  };

  const deleteTeacher = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;

    try {
      const response = await fetch(`${API}/teachers/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Delete failed");
        return;
      }

      showMessage("Teacher deleted");
      loadAll();
    } catch {
      showMessage("Server error");
    }
  };

  /* ================= RESULTS ================= */

  const saveResult = async (e) => {
    e.preventDefault();

    const marks = Number(resultForm.marks);

    if (marks < 0 || marks > 100) {
      showMessage("Marks 0 se 100 ke darmiyan honay chahiye");
      return;
    }

    try {
      const url = editingId
        ? `${API}/results/${editingId}`
        : `${API}/results`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...resultForm,
          marks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Result save failed");
        return;
      }

      showMessage(editingId ? "Result updated" : "Result added");

      resetForms();
      loadAll();
    } catch {
      showMessage("Server error");
    }
  };

  const editResult = (result) => {
    setEditingId(result.id);

    setResultForm({
      student_name: result.student_name || "",
      subject: result.subject || "",
      marks: result.marks || "",
    });
  };

  const deleteResult = async (id) => {
    if (!window.confirm("Delete this result?")) return;

    try {
      const response = await fetch(`${API}/results/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Delete failed");
        return;
      }

      showMessage("Result deleted");
      loadAll();
    } catch {
      showMessage("Server error");
    }
  };

  const getGrade = (marks) => {
    if (marks >= 80) return "A+";
    if (marks >= 70) return "A";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C";
    if (marks >= 40) return "D";
    return "F";
  };

  /* ================= ASSIGNMENTS ================= */

  const saveAssignment = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/admin/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentForm),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Assignment save failed");
        return;
      }

      showMessage("Assignment added");

      resetForms();
      loadAll();
    } catch {
      showMessage("Server error");
    }
  };

  const deleteAssignment = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;

    try {
      const response = await fetch(`${API}/assignments/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Delete failed");
        return;
      }

      showMessage("Assignment deleted");
      loadAll();
    } catch {
      showMessage("Server error");
    }
  };

  /* ================= ATTENDANCE ================= */

  const saveAttendance = async (e) => {
    e.preventDefault();

    if (!attendanceForm.student_id) {
      showMessage("Student select karo");
      return;
    }

    try {
      const url = editingId
        ? `${API}/attendance/${editingId}`
        : `${API}/attendance`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceForm),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Attendance save failed");
        return;
      }

      showMessage(editingId ? "Attendance updated" : "Attendance marked");

      resetForms();
      loadAll();
    } catch {
      showMessage("Server error");
    }
  };

  const editAttendance = (item) => {
    setEditingId(item.id);

    setAttendanceForm({
      student_id: item.student_id || "",
      attendance_date: item.attendance_date
        ? String(item.attendance_date).split("T")[0]
        : "",
      status: item.status || "Present",
    });
  };

  const deleteAttendance = async (id) => {
    if (!window.confirm("Delete this attendance?")) return;

    try {
      const response = await fetch(`${API}/attendance/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Delete failed");
        return;
      }

      showMessage("Attendance deleted");
      loadAll();
    } catch {
      showMessage("Server error");
    }
  };

  /* ================= ANNOUNCEMENTS ================= */

  const saveAnnouncement = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(announcementForm),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Announcement save failed");
        return;
      }

      showMessage("Announcement added");

      resetForms();
      loadAll();
    } catch {
      showMessage("Server error");
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    try {
      const response = await fetch(`${API}/announcements/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Delete failed");
        return;
      }

      showMessage("Announcement deleted");
      loadAll();
    } catch {
      showMessage("Server error");
    }
  };

  /* ================= FILTERS ================= */

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.father_name} ${student.class_name} ${student.roll_number} ${student.student_code}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.name} ${teacher.subject} ${teacher.phone} ${teacher.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredResults = results.filter((result) =>
    `${result.student_name} ${result.subject}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalMarks = results.reduce(
    (sum, result) => sum + Number(result.marks || 0),
    0
  );

  const averageMarks = results.length
    ? Math.round(totalMarks / results.length)
    : 0;

  return (
    <div className="admin-container">
      {/* SIDEBAR */}

      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="school-logo">IMS</div>

          <div>
            <h2>Iqra Model</h2>
            <p>School LMS</p>
          </div>
        </div>

        <nav className="admin-nav">
          {[
            "Dashboard",
            "Students",
            "Teachers",
            "Assignments",
            "Results",
            "Attendance",
            "Announcements",
          ].map((item) => (
            <button
              key={item}
              className={`admin-nav-item ${
                activeTab === item ? "active" : ""
              }`}
              onClick={() => changeTab(item)}
            >
              <span>
                {item === "Dashboard" && "🏠"}
                {item === "Students" && "👨‍🎓"}
                {item === "Teachers" && "👨‍🏫"}
                {item === "Assignments" && "📝"}
                {item === "Results" && "📊"}
                {item === "Attendance" && "📅"}
                {item === "Announcements" && "📢"}
              </span>

              {item}
            </button>
          ))}
        </nav>

        <button className="admin-logout" onClick={onLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* MAIN */}

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>{activeTab}</h1>
            <p>Iqra Model High School Administration</p>
          </div>

          <div className="admin-header-right">
            <span className="online-badge">● Online</span>
            <span className="admin-user">👨‍💼 Administrator</span>
          </div>
        </header>

        <div className="admin-content">
          {message && <div className="admin-message">{message}</div>}

          {/* DASHBOARD */}

          {activeTab === "Dashboard" && (
            <>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">👨‍🎓</div>
                  <div>
                    <h3>{students.length}</h3>
                    <p>Total Students</p>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon">👨‍🏫</div>
                  <div>
                    <h3>{teachers.length}</h3>
                    <p>Total Teachers</p>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon">📝</div>
                  <div>
                    <h3>{assignments.length}</h3>
                    <p>Assignments</p>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon">📊</div>
                  <div>
                    <h3>{results.length}</h3>
                    <p>Results</p>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon">📅</div>
                  <div>
                    <h3>{attendance.length}</h3>
                    <p>Attendance Records</p>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon">📢</div>
                  <div>
                    <h3>{announcements.length}</h3>
                    <p>Announcements</p>
                  </div>
                </div>
              </div>

              <div className="admin-dashboard-grid">
                <div className="admin-card school-info-card">
                  <div className="admin-card-header">
                    <h2>🏫 School Information</h2>
                  </div>

                  <div className="school-info">
                    <div className="school-info-row">
                      <strong>School:</strong>
                      <span>Iqra Model High School</span>
                    </div>

                    <div className="school-info-row">
                      <strong>System:</strong>
                      <span>School LMS</span>
                    </div>

                    <div className="school-info-row">
                      <strong>Status:</strong>
                      <span className="status-badge">Active</span>
                    </div>

                    <div className="school-info-row">
                      <strong>Average Marks:</strong>
                      <span>{averageMarks}%</span>
                    </div>
                  </div>
                </div>

                <div className="admin-card quick-actions-card">
                  <div className="admin-card-header">
                    <h2>⚡ Quick Actions</h2>
                  </div>

                  <div className="quick-actions">
                    <button
                      className="quick-action"
                      onClick={() => changeTab("Students")}
                    >
                      👨‍🎓
                      <span>Manage Students</span>
                    </button>

                    <button
                      className="quick-action"
                      onClick={() => changeTab("Teachers")}
                    >
                      👨‍🏫
                      <span>Manage Teachers</span>
                    </button>

                    <button
                      className="quick-action"
                      onClick={() => changeTab("Results")}
                    >
                      📊
                      <span>Manage Results</span>
                    </button>

                    <button
                      className="quick-action"
                      onClick={() => changeTab("Attendance")}
                    >
                      📅
                      <span>Attendance</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STUDENTS */}

          {activeTab === "Students" && (
            <>
              <div className="management-top">
                <div>
                  <h2>Student Management</h2>
                  <p>Add, edit, search and delete students</p>
                </div>

                <button
                  className="add-button"
                  onClick={() => resetForms()}
                >
                  + Add Student
                </button>
              </div>

              <div className="search-box">
                🔎
                <input
                  className="admin-search"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="form-card">
                <h3>{editingId ? "Edit Student" : "Add New Student"}</h3>

                <form onSubmit={saveStudent}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Student Name</label>
                      <input
                        required
                        value={studentForm.name}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Father Name</label>
                      <input
                        required
                        value={studentForm.father_name}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            father_name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Class</label>
                      <input
                        required
                        value={studentForm.class_name}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            class_name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Roll Number</label>
                      <input
                        required
                        value={studentForm.roll_number}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            roll_number: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Student Code</label>
                      <input
                        required
                        value={studentForm.student_code}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            student_code: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        value={studentForm.phone}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="primary-button" type="submit">
                      {editingId ? "Update Student" : "Save Student"}
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={resetForms}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Father Name</th>
                        <th>Class</th>
                        <th>Roll No</th>
                        <th>Code</th>
                        <th>Phone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td>
                            <strong>{student.name}</strong>
                          </td>
                          <td>{student.father_name}</td>
                          <td>{student.class_name}</td>
                          <td>{student.roll_number}</td>
                          <td>{student.student_code}</td>
                          <td>{student.phone || "-"}</td>
                          <td>
                            <button
                              className="edit-button"
                              onClick={() => editStudent(student)}
                            >
                              Edit
                            </button>

                            <button
                              className="delete-button"
                              onClick={() => deleteStudent(student.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TEACHERS */}

          {activeTab === "Teachers" && (
            <>
              <div className="management-top">
                <div>
                  <h2>Teacher Management</h2>
                  <p>Manage school teachers</p>
                </div>

                <button
                  className="add-button"
                  onClick={() => resetForms()}
                >
                  + Add Teacher
                </button>
              </div>

              <div className="search-box">
                🔎
                <input
                  className="admin-search"
                  placeholder="Search teachers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="form-card">
                <h3>{editingId ? "Edit Teacher" : "Add New Teacher"}</h3>

                <form onSubmit={saveTeacher}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Teacher Name</label>
                      <input
                        required
                        value={teacherForm.name}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Subject</label>
                      <input
                        required
                        value={teacherForm.subject}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            subject: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        value={teacherForm.phone}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={teacherForm.email}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="primary-button" type="submit">
                      {editingId ? "Update Teacher" : "Save Teacher"}
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={resetForms}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Teacher</th>
                        <th>Subject</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredTeachers.map((teacher) => (
                        <tr key={teacher.id}>
                          <td>{teacher.id}</td>

                          <td>
                            <div className="teacher-avatar">
                              {teacher.name?.charAt(0)?.toUpperCase()}
                            </div>

                            <div className="teacher-name">
                              {teacher.name}
                            </div>
                          </td>

                          <td>
                            <span className="teacher-subject">
                              {teacher.subject}
                            </span>
                          </td>

                          <td>{teacher.phone || "-"}</td>
                          <td>{teacher.email || "-"}</td>

                          <td>
                            <button
                              className="edit-button"
                              onClick={() => editTeacher(teacher)}
                            >
                              Edit
                            </button>

                            <button
                              className="delete-button"
                              onClick={() => deleteTeacher(teacher.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ASSIGNMENTS */}

          {activeTab === "Assignments" && (
            <>
              <div className="management-top">
                <div>
                  <h2>Assignment Management</h2>
                  <p>Create and manage student assignments</p>
                </div>
              </div>

              <div className="form-card">
                <h3>Add Assignment</h3>

                <form onSubmit={saveAssignment}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        required
                        value={assignmentForm.title}
                        onChange={(e) =>
                          setAssignmentForm({
                            ...assignmentForm,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Subject</label>
                      <input
                        required
                        value={assignmentForm.subject}
                        onChange={(e) =>
                          setAssignmentForm({
                            ...assignmentForm,
                            subject: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Due Date</label>
                      <input
                        type="date"
                        required
                        value={assignmentForm.due_date}
                        onChange={(e) =>
                          setAssignmentForm({
                            ...assignmentForm,
                            due_date: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <input
                        value={assignmentForm.description}
                        onChange={(e) =>
                          setAssignmentForm({
                            ...assignmentForm,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="primary-button" type="submit">
                      Add Assignment
                    </button>
                  </div>
                </form>
              </div>

              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Subject</th>
                        <th>Due Date</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {assignments.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.title}</td>
                          <td>{item.subject}</td>
                          <td>{item.due_date}</td>
                          <td>{item.description || "-"}</td>
                          <td>
                            <button
                              className="delete-button"
                              onClick={() => deleteAssignment(item.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* RESULTS */}

          {activeTab === "Results" && (
            <>
              <div className="management-top">
                <div>
                  <h2>Results Management</h2>
                  <p>Add and manage student examination results</p>
                </div>
              </div>

              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">📊</div>
                  <div>
                    <h3>{results.length}</h3>
                    <p>Total Results</p>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon">⭐</div>
                  <div>
                    <h3>{averageMarks}%</h3>
                    <p>Average Marks</p>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon">👨‍🎓</div>
                  <div>
                    <h3>{students.length}</h3>
                    <p>Students</p>
                  </div>
                </div>
              </div>

              <div className="form-card">
                <h3>{editingId ? "Edit Result" : "Add Result"}</h3>

                <form onSubmit={saveResult}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Student</label>

                      <select
                        required
                        value={resultForm.student_name}
                        onChange={(e) =>
                          setResultForm({
                            ...resultForm,
                            student_name: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Student</option>

                        {students.map((student) => (
                          <option key={student.id} value={student.name}>
                            {student.name} - {student.class_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Subject</label>

                      <select
                        required
                        value={resultForm.subject}
                        onChange={(e) =>
                          setResultForm({
                            ...resultForm,
                            subject: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Subject</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Physics">Physics</option>
                        <option value="Computer Science">
                          Computer Science
                        </option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Urdu">Urdu</option>
                        <option value="Islamiat">Islamiat</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Marks</label>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={resultForm.marks}
                        onChange={(e) =>
                          setResultForm({
                            ...resultForm,
                            marks: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="primary-button" type="submit">
                      {editingId ? "Update Result" : "Save Result"}
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={resetForms}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="search-box">
                🔎
                <input
                  className="admin-search"
                  placeholder="Search results..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Grade</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredResults.map((result) => (
                        <tr key={result.id}>
                          <td>{result.id}</td>
                          <td>
                            <strong>{result.student_name}</strong>
                          </td>
                          <td>{result.subject}</td>
                          <td>
                            <strong>{result.marks}/100</strong>
                          </td>
                          <td>
                            <span className="status-badge">
                              {getGrade(Number(result.marks))}
                            </span>
                          </td>
                          <td>
                            {result.created_at
                              ? new Date(
                                  result.created_at
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>
                            <button
                              className="edit-button"
                              onClick={() => editResult(result)}
                            >
                              Edit
                            </button>

                            <button
                              className="delete-button"
                              onClick={() => deleteResult(result.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ATTENDANCE */}

          {activeTab === "Attendance" && (
            <>
              <div className="management-top">
                <div>
                  <h2>Attendance Management</h2>
                  <p>Mark daily student attendance</p>
                </div>
              </div>

              <div className="form-card">
                <h3>
                  {editingId ? "Edit Attendance" : "Mark Attendance"}
                </h3>

                <form onSubmit={saveAttendance}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Student</label>

                      <select
                        required
                        value={attendanceForm.student_id}
                        onChange={(e) =>
                          setAttendanceForm({
                            ...attendanceForm,
                            student_id: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Student</option>

                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.name} - {student.class_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Date</label>

                      <input
                        type="date"
                        required
                        value={attendanceForm.attendance_date}
                        onChange={(e) =>
                          setAttendanceForm({
                            ...attendanceForm,
                            attendance_date: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Status</label>

                      <select
                        value={attendanceForm.status}
                        onChange={(e) =>
                          setAttendanceForm({
                            ...attendanceForm,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="primary-button" type="submit">
                      {editingId
                        ? "Update Attendance"
                        : "Mark Attendance"}
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={resetForms}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendance.map((item) => {
                        const student = students.find(
                          (s) => Number(s.id) === Number(item.student_id)
                        );

                        return (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>
                              {student
                                ? student.name
                                : `Student #${item.student_id}`}
                            </td>
                            <td>{item.attendance_date}</td>
                            <td>
                              <span className="status-badge">
                                {item.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="edit-button"
                                onClick={() => editAttendance(item)}
                              >
                                Edit
                              </button>

                              <button
                                className="delete-button"
                                onClick={() =>
                                  deleteAttendance(item.id)
                                }
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ANNOUNCEMENTS */}

          {activeTab === "Announcements" && (
            <>
              <div className="management-top">
                <div>
                  <h2>Announcements</h2>
                  <p>Publish school announcements</p>
                </div>
              </div>

              <div className="form-card">
                <h3>Add Announcement</h3>

                <form onSubmit={saveAnnouncement}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title</label>

                      <input
                        required
                        value={announcementForm.title}
                        onChange={(e) =>
                          setAnnouncementForm({
                            ...announcementForm,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Message</label>

                      <input
                        required
                        value={announcementForm.message}
                        onChange={(e) =>
                          setAnnouncementForm({
                            ...announcementForm,
                            message: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="primary-button" type="submit">
                      Publish Announcement
                    </button>
                  </div>
                </form>
              </div>

              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {announcements.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>
                            <strong>{item.title}</strong>
                          </td>
                          <td>{item.message}</td>
                          <td>
                            {item.created_at
                              ? new Date(
                                  item.created_at
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>
                            <button
                              className="delete-button"
                              onClick={() =>
                                deleteAnnouncement(item.id)
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Admin;
