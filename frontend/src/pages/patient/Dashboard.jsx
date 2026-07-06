import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Dashboard() {
  const navigate = useNavigate();

  const patient = JSON.parse(localStorage.getItem("patient"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("patient");

    toast.success("Logged Out Successfully");

    navigate("/patient/login");
  };

  return (
    <div className="dashboard-container">

      {/* ================= HEADER ================= */}

      <header className="dashboard-header">
        <h1>🏥 AI Hospital</h1>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* ================= WELCOME ================= */}

      <div className="welcome-section">
        <h2>
          Welcome, {patient?.name || "Patient"} 👋
        </h2>

        <p>
          Manage your healthcare from one place.
        </p>
      </div>

      {/* ================= DASHBOARD CARDS ================= */}

      <div className="dashboard-cards">

        {/* Book Appointment */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/patient/appointment")}
        >
          <h3>📅 Book Appointment</h3>
          <p>Schedule appointments with doctors.</p>
        </div>

        {/* My Appointments */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/patient/my-appointments")}
        >
          <h3>📋 My Appointments</h3>
          <p>View all your booked appointments.</p>
        </div>

        {/* AI Symptom Checker */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/patient/symptom-checker")}
        >
          <h3>🤖 AI Symptom Checker</h3>
          <p>Analyze symptoms using AI.</p>
        </div>

        {/* Medical Records */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/patient/medical-records")}
        >
          <h3>📄 Medical Records</h3>
          <p>View prescriptions and reports.</p>
        </div>

        {/* My Profile */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/patient/profile")}
        >
          <h3>👤 My Profile</h3>
          <p>Manage your profile information.</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;