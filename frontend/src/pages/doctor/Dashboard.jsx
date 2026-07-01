import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Dashboard() {

  const navigate = useNavigate();

  const doctor = JSON.parse(localStorage.getItem("doctor"));

  const handleLogout = () => {

    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");

    toast.success("Logged Out Successfully");

    navigate("/doctor/login");

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
          Welcome Dr. {doctor?.name || "Doctor"} 👋
        </h2>

        <p>
          Manage your appointments and patients.
        </p>

      </div>

      {/* ================= DASHBOARD CARDS ================= */}

      <div className="dashboard-cards">

        {/* Appointments */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/doctor/appointments")}
        >
          <h3>📅 Appointments</h3>
          <p>View all patient appointments.</p>
        </div>

        {/* Patients */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/doctor/patients")}
        >
          <h3>👨‍⚕️ Patients</h3>
          <p>View patient details.</p>
        </div>

        {/* Profile */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/doctor/profile")}
        >
          <h3>👤 My Profile</h3>
          <p>Update your profile.</p>
        </div>

      </div>

    </div>

  );

}

export default Dashboard;