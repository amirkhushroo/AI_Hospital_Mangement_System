import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./MyAppointments.css";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ====================== FETCH APPOINTMENTS ======================

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/appointment/patient", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // ====================== CANCEL APPOINTMENT ======================

  const cancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/appointment/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Appointment Cancelled");
        fetchAppointments();
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  };

  if (loading) {
    return (
      <div className="appointments-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="appointments-container">

      <h1>📅 My Appointments</h1>

      {appointments.length === 0 ? (

        <div className="no-appointments">
          <h3>No Appointments Found</h3>
        </div>

      ) : (

        appointments.map((appointment) => (

          <div
            className="appointment-card"
            key={appointment._id}
          >

            <h3>👨‍⚕️ Dr. {appointment.doctor.name}</h3>

            <p>
              <strong>Specialization:</strong>{" "}
              {appointment.doctor.specialization}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                appointment.appointmentDate
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {appointment.appointmentTime}
            </p>

            <p>
  <strong>Status:</strong>

  <span
    style={{
      marginLeft: "10px",
      fontWeight: "bold",
      color:
        appointment.status === "Accepted"
          ? "green"
          : appointment.status === "Rejected"
          ? "red"
          : appointment.status === "Completed"
          ? "blue"
          : appointment.status === "Cancelled"
          ? "gray"
          : "orange",
    }}
  >
    {appointment.status}
  </span>

</p>

            {appointment.status === "Pending" && (
              <button
                className="cancel-btn"
                onClick={() => cancelAppointment(appointment._id)}
              >
                Cancel Appointment
              </button>
            )}

          </div>

        ))

      )}

    </div>
  );
}

export default MyAppointments;