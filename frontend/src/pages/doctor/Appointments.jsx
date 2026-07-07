import { useEffect, useState } from "react";
import { Check, CircleX, CalendarDays, User } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Appointments.css";

function Appointments() {

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ================= FETCH =================

  const fetchAppointments = async () => {

    try {

      const token = localStorage.getItem("doctorToken");

      const response = await api.get(
        "/appointment/doctor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAppointments(response.data.appointments);
      }

    } catch (error) {

      console.log(error);

      toast.error("Failed to load appointments");

    }

  };

  // ================= UPDATE STATUS =================

  const updateStatus = async (id, status) => {

    try {

      const token = localStorage.getItem("doctorToken");

      const response = await api.put(
        `/appointment/status/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {

        toast.success(
          `Appointment ${status}`
        );

        fetchAppointments();

      }

    } catch (error) {

      console.log(error);

      toast.error("Status Update Failed");

    }

  };

  return (

    <div className="appointments-container">

      <h1><CalendarDays size={20} /> Doctor Appointments</h1>

      {
        appointments.length === 0 ?

          <p>No Appointments Found</p>

          :

          appointments.map((app) => (

            <div
              className="appointment-card"
              key={app._id}
            >

              <h3>
                <User size={18} /> {app.patient.name}
              </h3>

              <p>
                <b>Email :</b> {app.patient.email}
              </p>

              <p>
                <b>Phone :</b> {app.patient.phone}
              </p>

              <p>
                <b>Date :</b>{" "}
                {
                  new Date(
                    app.appointmentDate
                  ).toLocaleDateString()
                }
              </p>

              <p>
                <b>Time :</b>{" "}
                {app.appointmentTime}
              </p>

              <p>

                <b>Status :</b>

                <span
                  style={{
                    marginLeft: "10px",
                    fontWeight: "bold",
                    color:
                      app.status === "Accepted"
                        ? "green"
                        : app.status === "Rejected"
                        ? "red"
                        : app.status === "Completed"
                        ? "blue"
                        : app.status === "Cancelled"
                        ? "gray"
                        : "orange",
                  }}
                >

                  {app.status}

                </span>

              </p>

              <p>

                <b>Symptoms :</b>

                {app.symptoms || "Not Mentioned"}

              </p>

              <div className="btn-group">
                          {app.status === "Pending" && (
                  <>
                    <button
                      className="accept-btn"
                      onClick={() =>
                        updateStatus(app._id, "Accepted")
                      }
                    >
                      <Check size={16} /> Accept
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        updateStatus(app._id, "Rejected")
                      }
                    >
                      <CircleX size={16} /> Reject
                    </button>
                  </>
                )}

                {app.status === "Accepted" && (
                  <button
                    className="complete-btn"
                    onClick={() =>
                      updateStatus(app._id, "Completed")
                    }
                  >
                    <Check size={16} /> Complete
                  </button>
                )}

                {app.status === "Rejected" && (
                  <button
                    disabled
                    className="reject-btn"
                  >
                    <CircleX size={16} /> Rejected
                  </button>
                )}

                {app.status === "Completed" && (
                  <button
                    disabled
                    className="complete-btn"
                  >
                    <Check size={16} /> Completed
                  </button>
                )}

                {app.status === "Cancelled" && (
                  <button disabled>
                    Cancelled
                  </button>
                )}

              </div>

            </div>

          ))

      }

    </div>

  );

}

export default Appointments;