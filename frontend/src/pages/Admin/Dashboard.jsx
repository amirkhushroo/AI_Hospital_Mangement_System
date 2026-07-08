import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Brain, Building2, CalendarDays, Hand, Stethoscope, Users } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

function Dashboard() {

  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));

  const [dashboard, setDashboard] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalAIReports: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ================= FETCH DASHBOARD =================

  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("adminToken");

      const response = await api.get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setDashboard(response.data.dashboard);
      }

    } catch (error) {

      console.log(error);

      toast.error("Failed to load dashboard");

    }

  };

  // ================= LOGOUT =================

  const handleLogout = () => {

    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    toast.success("Logged Out Successfully");

    navigate("/admin/login");

  };

  return (

    <div className="dashboard-container">

      {/* ================= HEADER ================= */}

      <header className="dashboard-header">

        <h1><Building2 size={20} /> MED-Connect Admin</h1>

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
          Welcome  {admin?.name || ""} <Hand size={18} />
        </h2>

        <p>
          Manage the complete hospital system.
        </p>

      </div>

      {/* ================= DASHBOARD CARDS ================= */}

      <div className="dashboard-cards">

        {/* Doctors */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/doctors")}
          style={{ cursor: "pointer" }}
        >
          <h3><Stethoscope size={18} /> Doctors</h3>

          <h2>{dashboard.totalDoctors}</h2>

          <p>Manage all doctors</p>

        </div>

        {/* Patients */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/patients")}
          style={{ cursor: "pointer" }}
        >
          <h3><Users size={18} /> Patients</h3>

          <h2>{dashboard.totalPatients}</h2>

          <p>Manage all patients</p>

        </div>

        {/* Appointments */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/appointments")}
          style={{ cursor: "pointer" }}
        >
          <h3><CalendarDays size={18} /> Appointments</h3>

          <h2>{dashboard.totalAppointments}</h2>

          <p>View all appointments</p>

        </div>

        {/* AI Reports */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/reports")}
          style={{ cursor: "pointer" }}
        >
          <h3><Brain size={18} /> AI Reports</h3>

          <h2>{dashboard.totalAIReports}</h2>

          <p>View AI analysis reports</p>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;