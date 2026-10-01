import { useEffect, useMemo, useState } from "react";
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
  });

  const [resultForm, setResultForm] = useState({
    student_id: "",
    student_name: "",
    subject: "",
    marks: "",
    total: 100,
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

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  const loadAll = async () => {
    try {
      const responses = await Promise.all([
        fetch(`${API}/students`),
        fetch(`${API}/teachers`),
        fetch(`${API}/assignments`),
        fetch(`${API}/results`),
        fetch(`${API}/attendance`),
        fetch(`${API}/announcements`),
      ]);

      const [
        studentsRes,
        teachersRes,
        assignmentsRes,
        resultsRes,
        attendanceRes,
        announcementsRes,
      ] = responses;

      if (studentsRes.ok) {
        const data = await studentsRes.json();
        setStudents(Array.isArray(data) ? data : []);
      }

      if (teachersRes.ok) {
        const data = await teachersRes.json();
        setTeachers(Array.isArray(data) ? data : []);
      }

      if (assignmentsRes.ok) {
        const data = await assignmentsRes.json();

        const formattedAssignments = Array.isArray(data)
          ? data.map((assignment) => {
              const rawDescription = assignment.description || "";

              const parts = rawDescription.split("\\n\\n");

              const title =
                assignment.title ||
                parts[0] ||
                "Assignment";

              const description =
                assignment.title
                  ? rawDescription
                  : parts.slice(1).join("\\n\\n");

              return {
                ...assignment,
                title,
                description,
              };
            })
          : [];

        setAssignments(formattedAssignments);
      }

      if (resultsRes.ok) {
        const data = await resultsRes.json();
        setResults(Array.isArray(data) ? data : []);
      }

      if (attendanceRes.ok) {
        const data = await attendanceRes.json();
        setAttendance(Array.isArray(data) ? data : []);
      }

      if (announcementsRes.ok) {
        const data = await announcementsRes.json();
        setAnnouncements(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Load error:", error);
      showMessage("Server connection error");
    }
  };

  // =====================================================
  // RESET FORMS
  // =====================================================

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
    });

    setResultForm({
      student_id: "",
      student_name: "",
      subject: "",
      marks: "",
      total: 100,
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

  // =====================================================
  // STUDENTS
  // =====================================================

  const handleStudentChange = (e) => {
    const { name, value } = e.target;

    setStudentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveStudent = async (e) => {
    e.preventDefault();

    if (!studentForm.name.trim()) {
      showMessage("Student name required");
      return;
    }

    if (!studentForm.class_name.trim()) {
      showMessage("Class required");
      return;
    }

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
        showMessage(
          data.error ||
            data.message ||
            "Student save failed"
        );
        return;
      }

      showMessage(
        editingId
          ? "Student updated successfully"
          : "Student added successfully"
      );

      await loadAll();
      resetForms();
    } catch (error) {
      console.error("Student save error:", error);
      showMessage("Server error. Backend check karo.");
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

    setActiveTab("Students");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteStudent = async (id) => {
    if (
      !window.confirm(
        "Kya aap is student ko delete karna chahte hain?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API}/students/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.error || data.message || "Delete failed"
        );
        return;
      }

      showMessage("Student deleted successfully");
      await loadAll();
    } catch (error) {
      console.error(error);
      showMessage("Server error");
    }
  };

  // =====================================================
  // TEACHERS
  // =====================================================

  const handleTeacherChange = (e) => {
    const { name, value } = e.target;

    setTeacherForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveTeacher = async (e) => {
    e.preventDefault();

    if (!teacherForm.name.trim()) {
      showMessage("Teacher name required");
      return;
    }

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
        body: JSON.stringify({
          name: teacherForm.name,
          subject: teacherForm.subject,
          phone: teacherForm.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.error ||
            data.message ||
            "Teacher save failed"
        );
        return;
      }

      showMessage(
        editingId
          ? "Teacher updated successfully"
          : "Teacher added successfully"
      );

      await loadAll();
      resetForms();
    } catch (error) {
      console.error("Teacher error:", error);
      showMessage("Server error");
    }
  };

  const editTeacher = (teacher) => {
    setEditingId(teacher.id);

    setTeacherForm({
      name: teacher.name || "",
      subject: teacher.subject || "",
      phone: teacher.phone || "",
    });

    setActiveTab("Teachers");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteTeacher = async (id) => {
    if (
      !window.confirm(
        "Kya aap is teacher ko delete karna chahte hain?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API}/teachers/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.error || data.message || "Delete failed"
        );
        return;
      }

      showMessage("Teacher deleted successfully");
      await loadAll();
    } catch (error) {
      console.error(error);
      showMessage("Server error");
    }
  };

  // =====================================================
  // RESULTS
  // =====================================================

  const handleResultChange = (e) => {
    const { name, value } = e.target;

    if (name === "student_id") {
      const selectedStudent = students.find(
        (student) =>
          String(student.id) === String(value)
      );

      setResultForm((prev) => ({
        ...prev,
        student_id: value,
        student_name: selectedStudent?.name || "",
      }));

      return;
    }

    setResultForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveResult = async (e) => {
    e.preventDefault();

    const marks = Number(resultForm.marks);
    const total = Number(resultForm.total);

    if (!resultForm.student_id) {
      showMessage("Student select karo");
      return;
    }

    if (!resultForm.subject) {
      showMessage("Subject select karo");
      return;
    }

    if (!Number.isFinite(total) || total <= 0) {
      showMessage("Total marks valid honay chahiye");
      return;
    }

    if (
      !Number.isFinite(marks) ||
      marks < 0 ||
      marks > total
    ) {
      showMessage(
        `Marks 0 se ${total} ke darmiyan honay chahiye`
      );
      return;
    }

    const selectedStudent = students.find(
      (student) =>
        String(student.id) ===
        String(resultForm.student_id)
    );

    if (!selectedStudent) {
      showMessage("Selected student nahi mila");
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
          student_id: Number(selectedStudent.id),
          student_name: selectedStudent.name,
          subject: resultForm.subject,
          marks,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.error ||
            data.message ||
            "Result save failed"
        );
        return;
      }

      showMessage(
        editingId
          ? "Result updated successfully"
          : "Result added successfully"
      );

      await loadAll();
      resetForms();
    } catch (error) {
      console.error("Result error:", error);
      showMessage("Server error. Backend check karo.");
    }
  };

  const getGrade = (marks, total = 100) => {
    const value = Number(marks);
    const max = Number(total) || 100;
    const percentage = (value / max) * 100;

    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";

    return "F";
  };

  const editResult = (result) => {
    setEditingId(result.id);

    let studentId = result.student_id || "";

    if (!studentId && result.student_name) {
      const matchingStudent = students.find(
        (student) =>
          String(student.name)
            .trim()
            .toLowerCase() ===
          String(result.student_name)
            .trim()
            .toLowerCase()
      );

      if (matchingStudent) {
        studentId = matchingStudent.id;
      }
    }

    setResultForm({
      student_id: studentId,
      student_name: result.student_name || "",
      subject: result.subject || "",
      marks: result.marks ?? "",
      total: result.total || 100,
    });

    setActiveTab("Results");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteResult = async (id) => {
    if (
      !window.confirm(
        "Kya aap is result ko delete karna chahte hain?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API}/results/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.error || data.message || "Delete failed"
        );
        return;
      }

      showMessage("Result deleted successfully");
      await loadAll();
    } catch (error) {
      console.error(error);
      showMessage("Server error");
    }
  };

  // =====================================================
  // ASSIGNMENTS
  // =====================================================

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;

    setAssignmentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveAssignment = async (e) => {
    e.preventDefault();

    if (!assignmentForm.title.trim()) {
      showMessage("Assignment title required");
      return;
    }

    if (!assignmentForm.subject.trim()) {
      showMessage("Subject required");
      return;
    }

    try {
      const url = editingId
        ? `${API}/assignments/${editingId}`
        : `${API}/admin/assignments`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentForm),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.error ||
            data.message ||
            "Assignment save failed"
        );
        return;
      }

      showMessage(
        editingId
          ? "Assignment updated successfully"
          : "Assignment added successfully"
      );

      await loadAll();
      resetForms();
    } catch (error) {
      console.error("Assignment error:", error);
      showMessage("Server error");
    }
  };

  const editAssignment = (assignment) => {
    const rawDescription =
      assignment.description || "";

    const parts = rawDescription.split("\\n\\n");

    const title =
      assignment.title ||
      parts.shift() ||
      "";

    const description = assignment.title
      ? rawDescription
      : parts.join("\\n\\n");

    setAssignmentForm({
      title: title.trim(),
      subject: assignment.subject || "",
      due_date: assignment.due_date
        ? String(assignment.due_date).slice(0, 10)
        : "",
      description: description.trim(),
    });

    setEditingId(assignment.id);

    setActiveTab("Assignments");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteAssignment = async (id) => {
    if (
      !window.confirm(
        "Kya aap is assignment ko delete karna chahte hain?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/assignments/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.error || data.message || "Delete failed"
        );
        return;
      }

      showMessage("Assignment deleted successfully");
      await loadAll();
    } catch (error) {
      console.error(error);
      showMessage("Server error");
    }
  };

  // =====================================================
  // ATTENDANCE
  // =====================================================

  const handleAttendanceChange = (e) => {
    const { name, value } = e.target;

    setAttendanceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveAttendance = async (e) => {
    e.preventDefault();

    if (!attendanceForm.student_id) {
      showMessage("Student select karo");
      return;
    }

    if (!attendanceForm.attendance_date) {
      showMessage("Date required");
      return;
    }

    if (!attendanceForm.status) {
      showMessage("Status select karo");
      return;
    }

    const selectedStudent = students.find(
      (student) =>
        String(student.id) ===
        String(attendanceForm.student_id)
    );

    if (!selectedStudent) {
      showMessage("Selected student nahi mila");
      return;
    }

    try {
      const response = await fetch(`${API}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: Number(selectedStudent.id),
          student_name: selectedStudent.name,
          attendance_date:
            attendanceForm.attendance_date,
          status: attendanceForm.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.error ||
            data.message ||
            "Attendance save failed"
        );
        return;
      }

      showMessage("Attendance saved successfully");

      await loadAll();
      resetForms();
    } catch (error) {
      console.error("Attendance error:", error);
      showMessage("Server error");
    }
  };

  const deleteAttendance = async (id) => {
    if (
      !window.confirm(
        "Kya aap attendance delete karna chahte hain?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/attendance/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.error || data.message || "Delete failed"
        );
        return;
      }

      showMessage("Attendance deleted");
      await loadAll();
    } catch (error) {
      console.error(error);
      showMessage("Server error");
    }
  };

  // =====================================================
  // ANNOUNCEMENTS
  // =====================================================

  const handleAnnouncementChange = (e) => {
    const { name, value } = e.target;

    setAnnouncementForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveAnnouncement = async (e) => {
    e.preventDefault();

    if (!announcementForm.title.trim()) {
      showMessage("Announcement title required");
      return;
    }

    if (!announcementForm.message.trim()) {
      showMessage("Announcement message required");
      return;
    }

    try {
      const response = await fetch(
        `${API}/announcements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(announcementForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.error ||
            data.message ||
            "Announcement save failed"
        );
        return;
      }

      showMessage(
        "Announcement added successfully"
      );

      await loadAll();
      resetForms();
    } catch (error) {
      console.error(error);
      showMessage("Server error");
    }
  };

  const deleteAnnouncement = async (id) => {
    if (
      !window.confirm(
        "Kya aap announcement delete karna chahte hain?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/announcements/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.error || data.message || "Delete failed"
        );
        return;
      }

      showMessage("Announcement deleted");
      await loadAll();
    } catch (error) {
      console.error(error);
      showMessage("Server error");
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredStudents = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return students;

    return students.filter((student) =>
      [
        student.name,
        student.father_name,
        student.class_name,
        student.roll_number,
        student.student_code,
        student.phone,
      ]
        .filter(Boolean)
        .some((item) =>
          String(item)
            .toLowerCase()
            .includes(value)
        )
    );
  }, [students, search]);

  const filteredTeachers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return teachers;

    return teachers.filter((teacher) =>
      [
        teacher.name,
        teacher.subject,
        teacher.phone,
      ]
        .filter(Boolean)
        .some((item) =>
          String(item)
            .toLowerCase()
            .includes(value)
        )
    );
  }, [teachers, search]);

  const filteredResults = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return results;

    return results.filter((result) =>
      [
        result.student_name,
        result.subject,
        result.marks,
        result.total,
        result.grade,
      ]
        .filter(Boolean)
        .some((item) =>
          String(item)
            .toLowerCase()
            .includes(value)
        )
    );
  }, [results, search]);

  // =====================================================
  // DASHBOARD STATS
  // =====================================================

  const presentCount = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const lateCount = attendance.filter(
    (item) => item.status === "Late"
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="admin-page">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-brand-icon">
            🎓
          </div>

          <div>
            <h2>Iqra Model</h2>
            <p>School LMS</p>
          </div>
        </div>

        <div className="admin-user">
          <div className="admin-avatar">
            A
          </div>

          <div>
            <strong>Administrator</strong>
            <span>School Admin</span>
          </div>
        </div>

        <nav className="admin-nav">

          <button
            className={
              activeTab === "Dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              changeTab("Dashboard")
            }
          >
            <span>📊</span>
            Dashboard
          </button>

          <button
            className={
              activeTab === "Students"
                ? "active"
                : ""
            }
            onClick={() =>
              changeTab("Students")
            }
          >
            <span>👨‍🎓</span>
            Students
          </button>

          <button
            className={
              activeTab === "Teachers"
                ? "active"
                : ""
            }
            onClick={() =>
              changeTab("Teachers")
            }
          >
            <span>👨‍🏫</span>
            Teachers
          </button>

          <button
            className={
              activeTab === "Assignments"
                ? "active"
                : ""
            }
            onClick={() =>
              changeTab("Assignments")
            }
          >
            <span>📝</span>
            Assignments
          </button>

          <button
            className={
              activeTab === "Results"
                ? "active"
                : ""
            }
            onClick={() =>
              changeTab("Results")
            }
          >
            <span>📈</span>
            Results
          </button>

          <button
            className={
              activeTab === "Attendance"
                ? "active"
                : ""
            }
            onClick={() =>
              changeTab("Attendance")
            }
          >
            <span>📅</span>
            Attendance
          </button>

          <button
            className={
              activeTab === "Announcements"
                ? "active"
                : ""
            }
            onClick={() =>
              changeTab("Announcements")
            }
          >
            <span>📢</span>
            Announcements
          </button>

        </nav>

        <button
          className="admin-logout"
          onClick={() => {
            if (onLogout) onLogout();
          }}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="admin-main">

        <header className="admin-topbar">

          <div>
            <p className="topbar-label">
              ADMINISTRATION
            </p>

            <h1>{activeTab}</h1>
          </div>

          <div className="topbar-status">
            <span className="online-dot"></span>
            System Online
          </div>

        </header>

        {message && (
          <div className="admin-message">
            <span>✓</span>
            {message}
          </div>
        )}

        {/* DASHBOARD */}

        {activeTab === "Dashboard" && (
          <section className="admin-content">

            <div className="welcome-card">

              <div>
                <span className="welcome-small">
                  WELCOME BACK
                </span>

                <h2>
                  School Administration 👋
                </h2>

                <p>
                  Yahan se aap students,
                  teachers, assignments,
                  results aur attendance
                  manage kar sakte hain.
                </p>
              </div>

              <div className="welcome-icon">
                🎓
              </div>

            </div>

            <div className="stats-grid">

              <div className="stat-box">
                <div className="stat-box-icon">
                  👨‍🎓
                </div>

                <div>
                  <span>Total Students</span>
                  <strong>
                    {students.length}
                  </strong>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-box-icon">
                  👨‍🏫
                </div>

                <div>
                  <span>Total Teachers</span>
                  <strong>
                    {teachers.length}
                  </strong>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-box-icon">
                  📝
                </div>

                <div>
                  <span>Assignments</span>
                  <strong>
                    {assignments.length}
                  </strong>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-box-icon">
                  📈
                </div>

                <div>
                  <span>Results</span>
                  <strong>
                    {results.length}
                  </strong>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-box-icon">
                  📅
                </div>

                <div>
                  <span>Present</span>
                  <strong>
                    {presentCount}
                  </strong>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-box-icon">
                  ❌
                </div>

                <div>
                  <span>Absent</span>
                  <strong>
                    {absentCount}
                  </strong>
                </div>
              </div>

            </div>

            <div className="dashboard-grid">

              <div className="admin-card">

                <div className="card-title">
                  <div>
                    <span>QUICK ACCESS</span>
                    <h3>Management</h3>
                  </div>
                </div>

                <div className="quick-actions">

                  <button
                    onClick={() =>
                      changeTab("Students")
                    }
                  >
                    👨‍🎓
                    <span>Add Student</span>
                  </button>

                  <button
                    onClick={() =>
                      changeTab("Teachers")
                    }
                  >
                    👨‍🏫
                    <span>Add Teacher</span>
                  </button>

                  <button
                    onClick={() =>
                      changeTab("Results")
                    }
                  >
                    📈
                    <span>Add Result</span>
                  </button>

                  <button
                    onClick={() =>
                      changeTab("Attendance")
                    }
                  >
                    📅
                    <span>Attendance</span>
                  </button>

                </div>

              </div>

              <div className="admin-card">

                <div className="card-title">
                  <div>
                    <span>SCHOOL INFORMATION</span>
                    <h3>
                      Iqra Model High School
                    </h3>
                  </div>
                </div>

                <div className="school-info">

                  <p>
                    <strong>🏫 School:</strong>{" "}
                    Iqra Model High School
                  </p>

                  <p>
                    <strong>📚 System:</strong>{" "}
                    Learning Management System
                  </p>

                  <p>
                    <strong>👨‍🎓 Students:</strong>{" "}
                    {students.length}
                  </p>

                  <p>
                    <strong>👨‍🏫 Teachers:</strong>{" "}
                    {teachers.length}
                  </p>

                  <p>
                    <strong>⏰ Late Attendance:</strong>{" "}
                    {lateCount}
                  </p>

                </div>

              </div>

            </div>

          </section>
        )}

        {/* STUDENTS */}

        {activeTab === "Students" && (
          <section className="admin-content">

            <div className="section-header">

              <div>
                <span>
                  STUDENT MANAGEMENT
                </span>

                <h2>
                  {editingId
                    ? "Edit Student"
                    : "Add Student"}
                </h2>

                <p>
                  Students ko database mein
                  manage karein.
                </p>
              </div>

              <div className="record-count">
                {students.length} Students
              </div>

            </div>

            <div className="form-card">

              <form onSubmit={saveStudent}>

                <div className="form-grid">

                  <div className="form-group">
                    <label>
                      Student Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter student name"
                      value={studentForm.name}
                      onChange={
                        handleStudentChange
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Father Name
                    </label>

                    <input
                      type="text"
                      name="father_name"
                      placeholder="Enter father name"
                      value={
                        studentForm.father_name
                      }
                      onChange={
                        handleStudentChange
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Class *
                    </label>

                    <input
                      type="text"
                      name="class_name"
                      placeholder="Example: 9th"
                      value={
                        studentForm.class_name
                      }
                      onChange={
                        handleStudentChange
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Roll Number
                    </label>

                    <input
                      type="text"
                      name="roll_number"
                      placeholder="Enter roll number"
                      value={
                        studentForm.roll_number
                      }
                      onChange={
                        handleStudentChange
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Student Code
                    </label>

                    <input
                      type="text"
                      name="student_code"
                      placeholder="Example: STU004"
                      value={
                        studentForm.student_code
                      }
                      onChange={
                        handleStudentChange
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      placeholder="03000000000"
                      value={studentForm.phone}
                      onChange={
                        handleStudentChange
                      }
                    />
                  </div>

                </div>

                <div className="form-buttons">

                  <button
                    type="submit"
                    className="primary-admin-button"
                  >
                    {editingId
                      ? "✓ Update Student"
                      : "＋ Add Student"}
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

            <div className="admin-card">

              <div className="table-header">

                <div>
                  <span>
                    DATABASE RECORDS
                  </span>

                  <h3>All Students</h3>
                </div>

                <input
                  className="search-input"
                  type="text"
                  placeholder="🔎 Search student..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <div className="table-wrapper">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Father Name</th>
                      <th>Class</th>
                      <th>Roll</th>
                      <th>Student Code</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredStudents.length >
                    0 ? (
                      filteredStudents.map(
                        (student) => (
                          <tr
                            key={student.id}
                          >

                            <td>
                              #{student.id}
                            </td>

                            <td>
                              <strong>
                                {student.name}
                              </strong>
                            </td>

                            <td>
                              {student.father_name ||
                                "-"}
                            </td>

                            <td>
                              {student.class_name ||
                                "-"}
                            </td>

                            <td>
                              {student.roll_number ||
                                "-"}
                            </td>

                            <td>
                              {student.student_code ||
                                "-"}
                            </td>

                            <td>
                              {student.phone ||
                                "-"}
                            </td>

                            <td>

                              <div className="action-buttons">

                                <button
                                  className="edit-button"
                                  onClick={() =>
                                    editStudent(
                                      student
                                    )
                                  }
                                >
                                  ✏️
                                </button>

                                <button
                                  className="delete-button"
                                  onClick={() =>
                                    deleteStudent(
                                      student.id
                                    )
                                  }
                                >
                                  🗑️
                                </button>

                              </div>

                            </td>

                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="empty-table"
                        >
                          No students found.
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* TEACHERS */}

        {activeTab === "Teachers" && (
          <section className="admin-content">

            <div className="section-header">

              <div>

                <span>
                  TEACHER MANAGEMENT
                </span>

                <h2>
                  {editingId
                    ? "Edit Teacher"
                    : "Add Teacher"}
                </h2>

                <p>
                  Teachers ko database mein
                  manage karein.
                </p>

              </div>

              <div className="record-count">
                {teachers.length} Teachers
              </div>

            </div>

            <div className="form-card">

              <form onSubmit={saveTeacher}>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Teacher Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter teacher name"
                      value={teacherForm.name}
                      onChange={
                        handleTeacherChange
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Subject
                    </label>

                    <input
                      type="text"
                      name="subject"
                      placeholder="Example: Mathematics"
                      value={
                        teacherForm.subject
                      }
                      onChange={
                        handleTeacherChange
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      placeholder="03000000000"
                      value={teacherForm.phone}
                      onChange={
                        handleTeacherChange
                      }
                    />

                  </div>

                </div>

                <div className="form-buttons">

                  <button
                    type="submit"
                    className="primary-admin-button"
                  >
                    {editingId
                      ? "✓ Update Teacher"
                      : "＋ Add Teacher"}
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

            <div className="admin-card">

              <div className="table-header">

                <div>

                  <span>
                    DATABASE RECORDS
                  </span>

                  <h3>All Teachers</h3>

                </div>

                <input
                  className="search-input"
                  type="text"
                  placeholder="🔎 Search teacher..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <div className="table-wrapper">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Subject</th>
                      <th>Phone</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredTeachers.length >
                    0 ? (
                      filteredTeachers.map(
                        (teacher) => (
                          <tr
                            key={teacher.id}
                          >

                            <td>
                              #{teacher.id}
                            </td>

                            <td>
                              <strong>
                                {teacher.name}
                              </strong>
                            </td>

                            <td>
                              {teacher.subject ||
                                "-"}
                            </td>

                            <td>
                              {teacher.phone ||
                                "-"}
                            </td>

                            <td>
                              {teacher.created_at
                                ? new Date(
                                    teacher.created_at
                                  ).toLocaleDateString()
                                : "-"}
                            </td>

                            <td>

                              <div className="action-buttons">

                                <button
                                  className="edit-button"
                                  onClick={() =>
                                    editTeacher(
                                      teacher
                                    )
                                  }
                                >
                                  ✏️
                                </button>

                                <button
                                  className="delete-button"
                                  onClick={() =>
                                    deleteTeacher(
                                      teacher.id
                                    )
                                  }
                                >
                                  🗑️
                                </button>

                              </div>

                            </td>

                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="empty-table"
                        >
                          No teachers found.
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* ASSIGNMENTS */}

        {activeTab === "Assignments" && (
          <section className="admin-content">

            <div className="section-header">

              <div>

                <span>
                  ASSIGNMENT MANAGEMENT
                </span>

                <h2>
                  {editingId
                    ? "Edit Assignment"
                    : "Add Assignment"}
                </h2>

                <p>
                  Students ke liye assignment
                  create aur manage karein.
                </p>

              </div>

              <div className="record-count">
                {assignments.length} Assignments
              </div>

            </div>

            <div className="form-card">

              <form onSubmit={saveAssignment}>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Assignment Title *
                    </label>

                    <input
                      type="text"
                      name="title"
                      placeholder="Example: Algebra Homework"
                      value={
                        assignmentForm.title
                      }
                      onChange={
                        handleAssignmentChange
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Subject *
                    </label>

                    <input
                      type="text"
                      name="subject"
                      placeholder="Example: Mathematics"
                      value={
                        assignmentForm.subject
                      }
                      onChange={
                        handleAssignmentChange
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Due Date
                    </label>

                    <input
                      type="date"
                      name="due_date"
                      value={
                        assignmentForm.due_date
                      }
                      onChange={
                        handleAssignmentChange
                      }
                    />

                  </div>

                  <div className="form-group full-width">

                    <label>
                      Description
                    </label>

                    <textarea
                      name="description"
                      placeholder="Assignment details..."
                      rows="5"
                      value={
                        assignmentForm.description
                      }
                      onChange={
                        handleAssignmentChange
                      }
                    />

                  </div>

                </div>

                <div className="form-buttons">

                  <button
                    type="submit"
                    className="primary-admin-button"
                  >
                    {editingId
                      ? "✓ Update Assignment"
                      : "＋ Add Assignment"}
                  </button>

                  {editingId ? (
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={resetForms}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={resetForms}
                    >
                      Clear
                    </button>
                  )}

                </div>

              </form>

            </div>

            <div className="admin-card">

              <div className="table-header">

                <div>

                  <span>
                    DATABASE RECORDS
                  </span>

                  <h3>
                    All Assignments
                  </h3>

                </div>

              </div>

              <div className="table-wrapper">

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

                    {assignments.length > 0 ? (
                      assignments.map(
                        (assignment) => (
                          <tr
                            key={assignment.id}
                          >

                            <td>
                              #{assignment.id}
                            </td>

                            <td>
                              <strong>
                                {assignment.title ||
                                  "Assignment"}
                              </strong>
                            </td>

                            <td>
                              {assignment.subject ||
                                "-"}
                            </td>

                            <td>
                              {assignment.due_date
                                ? String(
                                    assignment.due_date
                                  ).slice(0, 10)
                                : "-"}
                            </td>

                            <td>
                              {assignment.description ||
                                "-"}
                            </td>

                            <td>

                              <div className="action-buttons">

                                <button
                                  type="button"
                                  className="edit-button"
                                  onClick={() =>
                                    editAssignment(
                                      assignment
                                    )
                                  }
                                >
                                  ✏️
                                </button>

                                <button
                                  type="button"
                                  className="delete-button"
                                  onClick={() =>
                                    deleteAssignment(
                                      assignment.id
                                    )
                                  }
                                >
                                  🗑️
                                </button>

                              </div>

                            </td>

                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="empty-table"
                        >
                          No assignments found.
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* RESULTS */}

        {activeTab === "Results" && (
          <section className="admin-content">

            <div className="section-header">

              <div>

                <span>
                  RESULT MANAGEMENT
                </span>

                <h2>
                  {editingId
                    ? "Edit Result"
                    : "Add Result"}
                </h2>

                <p>
                  Student select karo aur
                  marks save karo.
                </p>

              </div>

              <div className="record-count">
                {results.length} Results
              </div>

            </div>

            <div className="form-card">

              <form onSubmit={saveResult}>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Student *
                    </label>

                    <select
                      required
                      name="student_id"
                      value={
                        resultForm.student_id
                      }
                      onChange={
                        handleResultChange
                      }
                    >

                      <option value="">
                        Select Student
                      </option>

                      {students.length > 0 ? (
                        students.map(
                          (student) => (
                            <option
                              key={student.id}
                              value={student.id}
                            >
                              {student.name} —{" "}
                              {student.class_name ||
                                "Class"}{" "}
                              — ID #{student.id}
                            </option>
                          )
                        )
                      ) : (
                        <option
                          value=""
                          disabled
                        >
                          No students available
                        </option>
                      )}

                    </select>

                    <small className="input-help">
                      Student select karne par
                      Student ID automatically
                      save hogi.
                    </small>

                  </div>

                  <div className="form-group">

                    <label>
                      Subject *
                    </label>

                    <select
                      required
                      name="subject"
                      value={
                        resultForm.subject
                      }
                      onChange={
                        handleResultChange
                      }
                    >

                      <option value="">
                        Select Subject
                      </option>

                      <option value="Mathematics">
                        Mathematics
                      </option>

                      <option value="English">
                        English
                      </option>

                      <option value="Physics">
                        Physics
                      </option>

                      <option value="Computer Science">
                        Computer Science
                      </option>

                      <option value="Chemistry">
                        Chemistry
                      </option>

                      <option value="Biology">
                        Biology
                      </option>

                      <option value="Urdu">
                        Urdu
                      </option>

                      <option value="Islamiat">
                        Islamiat
                      </option>

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Marks *
                    </label>

                    <input
                      type="number"
                      name="marks"
                      min="0"
                      max={resultForm.total}
                      placeholder="Example: 85"
                      value={resultForm.marks}
                      onChange={
                        handleResultChange
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Total Marks *
                    </label>

                    <input
                      type="number"
                      name="total"
                      min="1"
                      placeholder="Example: 100"
                      value={resultForm.total}
                      onChange={
                        handleResultChange
                      }
                      required
                    />

                  </div>

                </div>

                {resultForm.student_id && (
                  <div className="selected-student-info">

                    <div>
                      <span>
                        Selected Student
                      </span>

                      <strong>
                        {resultForm.student_name}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Student ID
                      </span>

                      <strong>
                        #{resultForm.student_id}
                      </strong>
                    </div>

                  </div>
                )}

                <div className="form-buttons">

                  <button
                    type="submit"
                    className="primary-admin-button"
                  >
                    {editingId
                      ? "✓ Update Result"
                      : "＋ Save Result"}
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

            <div className="admin-card">

              <div className="table-header">

                <div>
                  <span>
                    RESULT RECORDS
                  </span>

                  <h3>
                    Examination Results
                  </h3>
                </div>

                <input
                  className="search-input"
                  type="text"
                  placeholder="🔎 Search result..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <div className="table-wrapper">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student</th>
                      <th>Student ID</th>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Total</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredResults.length >
                    0 ? (
                      filteredResults.map(
                        (result) => {

                          const total =
                            Number(
                              result.total || 100
                            );

                          const marks =
                            Number(
                              result.marks || 0
                            );

                          const percentage =
                            total > 0
                              ? Math.round(
                                  (marks /
                                    total) *
                                    100
                                )
                              : 0;

                          const grade =
                            result.grade ||
                            getGrade(
                              marks,
                              total
                            );

                          return (
                            <tr
                              key={result.id}
                            >

                              <td>
                                #{result.id}
                              </td>

                              <td>
                                <strong>
                                  {result.student_name ||
                                    "-"}
                                </strong>
                              </td>

                              <td>
                                {result.student_id
                                  ? `#${result.student_id}`
                                  : "-"}
                              </td>

                              <td>
                                {result.subject ||
                                  "-"}
                              </td>

                              <td>
                                {marks}
                              </td>

                              <td>
                                {total}
                              </td>

                              <td>
                                {percentage}%
                              </td>

                              <td>
                                <span className="grade-badge">
                                  {grade}
                                </span>
                              </td>

                              <td>

                                <div className="action-buttons">

                                  <button
                                    className="edit-button"
                                    onClick={() =>
                                      editResult(
                                        result
                                      )
                                    }
                                  >
                                    ✏️
                                  </button>

                                  <button
                                    className="delete-button"
                                    onClick={() =>
                                      deleteResult(
                                        result.id
                                      )
                                    }
                                  >
                                    🗑️
                                  </button>

                                </div>

                              </td>

                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="empty-table"
                        >
                          No results found.
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* ATTENDANCE */}

        {activeTab === "Attendance" && (
          <section className="admin-content">

            <div className="section-header">

              <div>

                <span>
                  ATTENDANCE MANAGEMENT
                </span>

                <h2>
                  Mark Attendance
                </h2>

                <p>
                  Student ki daily attendance
                  save karein.
                </p>

              </div>

              <div className="record-count">
                {attendance.length} Records
              </div>

            </div>

            <div className="form-card">

              <form onSubmit={saveAttendance}>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Student *
                    </label>

                    <select
                      required
                      name="student_id"
                      value={
                        attendanceForm.student_id
                      }
                      onChange={
                        handleAttendanceChange
                      }
                    >

                      <option value="">
                        Select Student
                      </option>

                      {students.map(
                        (student) => (
                          <option
                            key={student.id}
                            value={student.id}
                          >
                            {student.name} —{" "}
                            {student.class_name ||
                              "Class"}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Date *
                    </label>

                    <input
                      type="date"
                      name="attendance_date"
                      value={
                        attendanceForm.attendance_date
                      }
                      onChange={
                        handleAttendanceChange
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Status *
                    </label>

                    <select
                      name="status"
                      value={
                        attendanceForm.status
                      }
                      onChange={
                        handleAttendanceChange
                      }
                      required
                    >

                      <option value="Present">
                        Present
                      </option>

                      <option value="Absent">
                        Absent
                      </option>

                      <option value="Late">
                        Late
                      </option>

                    </select>

                  </div>

                </div>

                <div className="form-buttons">

                  <button
                    type="submit"
                    className="primary-admin-button"
                  >
                    ✓ Save Attendance
                  </button>

                </div>

              </form>

            </div>

            <div className="admin-card">

              <div className="table-header">

                <div>

                  <span>
                    ATTENDANCE RECORDS
                  </span>

                  <h3>
                    Latest Attendance
                  </h3>

                </div>

              </div>

              <div className="table-wrapper">

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

                    {attendance.length > 0 ? (
                      attendance.map(
                        (item) => {

                          const student =
                            students.find(
                              (s) =>
                                String(s.id) ===
                                String(
                                  item.student_id
                                )
                            );

                          return (
                            <tr
                              key={item.id}
                            >

                              <td>
                                #{item.id}
                              </td>

                              <td>
                                <strong>
                                  {item.student_name ||
                                    student?.name ||
                                    `Student #${item.student_id}`}
                                </strong>
                              </td>

                              <td>
                                {item.attendance_date
                                  ? new Date(
                                      item.attendance_date
                                    ).toLocaleDateString()
                                  : "-"}
                              </td>

                              <td>

                                <span className="status-badge">

                                  {item.status ===
                                    "Present" &&
                                    "✅ Present"}

                                  {item.status ===
                                    "Absent" &&
                                    "❌ Absent"}

                                  {item.status ===
                                    "Late" &&
                                    "⏰ Late"}

                                  {![
                                    "Present",
                                    "Absent",
                                    "Late",
                                  ].includes(
                                    item.status
                                  ) &&
                                    item.status}

                                </span>

                              </td>

                              <td>

                                <button
                                  className="delete-button"
                                  onClick={() =>
                                    deleteAttendance(
                                      item.id
                                    )
                                  }
                                >
                                  🗑️
                                </button>

                              </td>

                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="empty-table"
                        >
                          No attendance records
                          found.
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* ANNOUNCEMENTS */}

        {activeTab === "Announcements" && (
          <section className="admin-content">

            <div className="section-header">

              <div>

                <span>
                  ANNOUNCEMENT MANAGEMENT
                </span>

                <h2>
                  Add Announcement
                </h2>

                <p>
                  Students ke liye school
                  announcement publish karein.
                </p>

              </div>

            </div>

            <div className="form-card">

              <form onSubmit={saveAnnouncement}>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Title *
                    </label>

                    <input
                      type="text"
                      name="title"
                      placeholder="Announcement title"
                      value={
                        announcementForm.title
                      }
                      onChange={
                        handleAnnouncementChange
                      }
                      required
                    />

                  </div>

                  <div className="form-group full-width">

                    <label>
                      Message *
                    </label>

                    <textarea
                      name="message"
                      rows="5"
                      placeholder="Write announcement..."
                      value={
                        announcementForm.message
                      }
                      onChange={
                        handleAnnouncementChange
                      }
                      required
                    />

                  </div>

                </div>

                <div className="form-buttons">

                  <button
                    type="submit"
                    className="primary-admin-button"
                  >
                    📢 Publish Announcement
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={resetForms}
                  >
                    Clear
                  </button>

                </div>

              </form>

            </div>

            <div className="admin-card">

              <div className="table-header">

                <div>

                  <span>
                    PUBLISHED ANNOUNCEMENTS
                  </span>

                  <h3>
                    All Announcements
                  </h3>

                </div>

              </div>

              <div className="announcement-admin-list">

                {announcements.length > 0 ? (
                  announcements.map(
                    (announcement) => (
                      <div
                        className="announcement-admin-card"
                        key={announcement.id}
                      >

                        <div className="announcement-admin-icon">
                          📢
                        </div>

                        <div className="announcement-admin-content">

                          <h3>
                            {announcement.title}
                          </h3>

                          <p>
                            {announcement.message}
                          </p>

                          {announcement.created_at && (
                            <small>
                              {new Date(
                                announcement.created_at
                              ).toLocaleDateString()}
                            </small>
                          )}

                        </div>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteAnnouncement(
                              announcement.id
                            )
                          }
                        >
                          🗑️
                        </button>

                      </div>
                    )
                  )
                ) : (
                  <div className="empty-state">

                    <div>📢</div>

                    <h3>
                      No announcements
                    </h3>

                    <p>
                      Abhi koi announcement
                      available nahi hai.
                    </p>

                  </div>
                )}

              </div>

            </div>

          </section>
        )}

      </main>
    </div>
  );
}

export default Admin;