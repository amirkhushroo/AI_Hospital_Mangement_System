import { useEffect, useRef, useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import PageTitle from "../../components/UI/PageTitle";
import api from "../../services/api";


const UploadReports = () => {
  const token = localStorage.getItem("operatorToken");
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [patientId, setPatientId] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [reportName, setReportName] = useState("");
  const [reportFile, setReportFile] = useState(null);

  // ================= Fetch Patients =================

  const fetchPatients = async () => {
    try {
     const response = await api.get("/patient/all", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = response.data;

      if (data.success) {
        setPatients(data.patients);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load patients.");
    }
  };

  // ================= Fetch Appointments =================

  const fetchAppointments = async (selectedPatientId) => {
    try {
      const response = await api.get("/appointment/all", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = response.data;

      if (data.success) {
        const filtered = data.appointments.filter(
          (appointment) =>
            appointment.patient &&
            appointment.patient._id === selectedPatientId
        );

        setAppointments(filtered);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load appointments.");
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Please login first.");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await fetchPatients();
      setLoading(false);
    };

    loadData();
  }, []);

  // ================= Upload Report =================

  const uploadReport = async (e) => {
    e.preventDefault();

    if (!patientId || !appointmentId || !reportName || !reportFile) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("patient", patientId);
      formData.append("appointment", appointmentId);
      formData.append("reportName", reportName);
      formData.append("report", reportFile);

    const response = await api.post(
  "/report/upload",
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }
);

const data = response.data;

      if (data.success) {
        alert("Report Uploaded Successfully");

        setPatientId("");
        setAppointmentId("");
        setReportName("");
        setReportFile(null);
        setAppointments([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert(
  error.response?.data?.message || "Server Error"
);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <PageTitle
        title="Upload Medical Report"
        subtitle="Upload reports for patient appointments."
      />

      <Card
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <form onSubmit={uploadReport}>
          <div className="input-group">
            <label>Select Patient</label>

            <select
              value={patientId}
              onChange={(e) => {
                setPatientId(e.target.value);
                setAppointmentId("");
                fetchAppointments(e.target.value);
              }}
              required
            >
              <option value="">Select Patient</option>

              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Select Appointment</label>

            <select
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              required
            >
              <option value="">Select Appointment</option>

              {appointments.map((appointment) => (
                <option key={appointment._id} value={appointment._id}>
                  {appointment.appointmentDate} | {appointment.appointmentTime}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Report Name</label>

            <input
              type="text"
              placeholder="Enter Report Name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Select PDF / Image</label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setReportFile(e.target.files[0])}
              required
            />
          </div>

          {reportFile && (
            <p
              style={{
                marginTop: "10px",
                color: "#2563eb",
                fontWeight: "600",
              }}
            >
              Selected File: {reportFile.name}
            </p>
          )}

          <div style={{ marginTop: "25px" }}>
            <Button type="submit">
              Upload Report
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UploadReports;