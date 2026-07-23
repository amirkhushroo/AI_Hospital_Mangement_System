import { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import PageTitle from "../../components/UI/PageTitle";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://your-backend-url.com";

const BookAppointment = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    symptoms: "",
  });

  const token = localStorage.getItem("operatorToken");

  // ================= Fetch Patients =================

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/api/patient/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setPatients(data.patients);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ================= Fetch Doctors =================

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${API_URL}/api/doctor/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPatients(), fetchDoctors()]);
      setLoading(false);
    };

    loadData();
  }, []);

  // ================= Handle Input =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= Book Appointment =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Operator not logged in.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/appointment/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Appointment booked successfully.");

        setFormData({
          patientId: "",
          doctorId: "",
          appointmentDate: "",
          appointmentTime: "",
          symptoms: "",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
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
        title="Book Appointment"
        subtitle="Schedule an appointment for a patient."
      />

      <Card
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Select Patient</label>

            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
            >
              <option value="">Choose Patient</option>

              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Select Doctor</label>

            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Choose Doctor</option>

              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} ({doctor.specialization})
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Appointment Date</label>

            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Appointment Time</label>

            <input
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Symptoms</label>

            <textarea
              name="symptoms"
              rows="4"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Enter symptoms..."
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <Button type="submit">
              Book Appointment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BookAppointment;