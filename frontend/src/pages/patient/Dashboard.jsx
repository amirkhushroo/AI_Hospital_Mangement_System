import "./Dashboard.css";
import { Brain, Building2, CalendarDays, FileText, Hand, User } from "lucide-react";
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
        <h1><Building2 size={20} /> MED-Connect</h1>

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
          Welcome, {patient?.name || "Patient"} <Hand size={18} />
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
          <h3><CalendarDays size={18} /> Book Appointment</h3>
          <p>Schedule appointments with doctors.</p>
        </div>

        {/* My Appointments */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/patient/my-appointments")}
        >
          <h3><CalendarDays size={18} /> My Appointments</h3>
          <p>View all your booked appointments.</p>
        </div>

        {/* AI Symptom Checker */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/patient/symptom-checker")}
        >
          <h3><Brain size={18} /> AI Symptom Checker</h3>
          <p>Analyze symptoms using AI.</p>
        </div>

        {/* Medical Records */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/patient/medical-records")}
        >
          <h3><FileText size={18} /> Medical Records</h3>
          <p>View prescriptions and reports.</p>
        </div>

        {/* My Profile */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/patient/profile")}
        >
          <h3><User size={18} /> My Profile</h3>
          <p>Manage your profile information.</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;