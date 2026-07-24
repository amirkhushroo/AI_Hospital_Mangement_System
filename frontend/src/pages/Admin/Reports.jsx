import { useEffect, useState } from "react";
import { Activity, Brain, User } from "lucide-react";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Reports.css";

function Reports() {

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalAIReports: 0,
  });

  const [reports, setReports] = useState([]);

  useEffect(() => {

    fetchData();

  }, []);

  // ================= FETCH ALL DATA =================

  const fetchData = async () => {

    setLoading(true);

    await Promise.all([
      fetchDashboard(),
      fetchReports(),
    ]);

    setLoading(false);

  };

  // ================= DASHBOARD =================

  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("adminToken");

      const response = await api.get(
        "/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setDashboard(response.data.dashboard);
      }

    } catch (error) {

      console.log(error);

      toast.error("Failed to load dashboard");

    }

  };

  // ================= AI REPORTS =================

  const fetchReports = async () => {

    try {

      const token = localStorage.getItem("adminToken");

      const response = await api.get(
        "/admin/ai-reports",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setReports(response.data.reports);
      }

    } catch (error) {

      console.log(error);

      toast.error("Failed to load reports");

    }

  };

  if (loading) {
    return <Loader text="Loading Reports..." />;
  }

  return (

    <div className="reports-container">

      {/* ================= BACK BUTTON ================= */}


      <h1>
        <Activity size={20} /> Hospital Reports
      </h1>

      <div className="stats-grid">

        <div className="stat-card">
          <h2>{dashboard.totalDoctors}</h2>
          <p>Total Doctors</p>
        </div>

        <div className="stat-card">
          <h2>{dashboard.totalPatients}</h2>
          <p>Total Patients</p>
        </div>

        <div className="stat-card">
          <h2>{dashboard.totalAppointments}</h2>
          <p>Total Appointments</p>
        </div>

        <div className="stat-card">
          <h2>{dashboard.totalAIReports}</h2>
          <p>AI Reports</p>
        </div>

      </div>

      <h2 className="report-title">
        <Brain size={18} /> AI Reports
      </h2>

      <div className="report-grid">

        {
          reports.length === 0 ? (

            <p className="no-data">
              No AI Reports Found
            </p>

          ) : (

            reports.map((report) => (

              <div
                key={report._id}
                className="report-card"
              >

                <h3>
                  <User size={16} /> {report.patient?.name}
                </h3>

                <p>
                  <strong>Email :</strong>{" "}
                  {report.patient?.email}
                </p>

                <p>
                  <strong>Symptoms :</strong>{" "}
                  {report.symptoms}
                </p>

                <p>
                  <strong>Predicted Disease :</strong>{" "}
                  {report.prediction}
                </p>

                <p>
                  <strong>Confidence :</strong>{" "}
                  {report.confidence}%
                </p>

                <p>
                  <strong>Precautions :</strong>{" "}
                  {report.precautions}
                </p>

                <p>
                  <strong>Date :</strong>{" "}
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>

              </div>

            ))

          )
        }

      </div>

    </div>

  );

}

export default Reports;