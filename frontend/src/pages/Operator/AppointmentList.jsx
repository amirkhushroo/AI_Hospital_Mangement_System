import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://your-backend-url.com";

const AppointmentList = () => {
  // ====================== States ======================

  const [appointments, setAppointments] = useState([]);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Reschedule
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // ====================== Fetch Appointments ======================

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("operatorToken");

      const res = await fetch(
        `${API_URL}/api/appointment/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ====================== Search & Filter ======================

  const filteredAppointments = appointments.filter(
    (appointment) => {
      const patientName =
        appointment.patient?.name?.toLowerCase() || "";

      const doctorName =
        appointment.doctor?.name?.toLowerCase() || "";

      const matchesSearch =
        patientName.includes(search.toLowerCase()) ||
        doctorName.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );
    // ====================== Update Status ======================

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("operatorToken");

      const res = await fetch(
        `${API_URL}/api/appointment/status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Status Updated Successfully");
        fetchAppointments();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ====================== Cancel Appointment ======================

  const cancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem("operatorToken");

      const res = await fetch(
        `${API_URL}/api/appointment/cancel/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Appointment Cancelled Successfully");
        fetchAppointments();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ====================== Reschedule Appointment ======================

  const rescheduleAppointment = async () => {
    try {
      if (!newDate || !newTime) {
        return alert("Please select date and time.");
      }

      const token = localStorage.getItem("operatorToken");

      const res = await fetch(
        `${API_URL}/api/appointment/reschedule/${editingAppointment}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            appointmentDate: newDate,
            appointmentTime: newTime,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Appointment Rescheduled Successfully");

        setEditingAppointment(null);
        setNewDate("");
        setNewTime("");

        fetchAppointments();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ====================== Load Appointments ======================

  useEffect(() => {
    fetchAppointments();
  }, []);

    // ====================== UI ======================

  return (
    <div
      style={{
        padding: "30px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          marginBottom: "25px",
          color: "#1f2937",
        }}
      >
        Appointment Management
      </h2>

      {/* ====================== Search & Filter ====================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "15px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search Patient / Doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: "250px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* ====================== Reschedule Form ====================== */}

      {editingAppointment && (
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "25px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
            }}
          >
            Reschedule Appointment
          </h3>

          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="date"
              value={newDate}
              onChange={(e) =>
                setNewDate(e.target.value)
              }
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="time"
              value={newTime}
              onChange={(e) =>
                setNewTime(e.target.value)
              }
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <button
              onClick={rescheduleAppointment}
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>

            <button
              onClick={() =>
                setEditingAppointment(null)
              }
              style={{
                marginLeft: "10px",
                background: "#6b7280",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ====================== Appointment Table ====================== */}

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead
          style={{
            background: "#2563eb",
            color: "#fff",
          }}
        >
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

      

                {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.patient?.name}</td>

                <td>{appointment.doctor?.name}</td>

                <td>{appointment.appointmentDate}</td>

                <td>{appointment.appointmentTime}</td>

                <td>
                  <select
                    value={appointment.status}
                    onChange={(e) =>
                      updateStatus(
                        appointment._id,
                        e.target.value
                      )
                    }
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      background:
                        appointment.status === "Completed"
                          ? "#d1fae5"
                          : appointment.status === "Accepted"
                          ? "#dbeafe"
                          : appointment.status === "Rejected"
                          ? "#fee2e2"
                          : appointment.status === "Cancelled"
                          ? "#fecaca"
                          : "#fef3c7",
                    }}
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Accepted">
                      Accepted
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </td>

                <td>
                  <button
                    onClick={() => {
                      setEditingAppointment(
                        appointment._id
                      );

                      setNewDate(
                        appointment.appointmentDate
                      );

                      setNewTime(
                        appointment.appointmentTime
                      );
                    }}
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      cancelAppointment(
                        appointment._id
                      )
                    }
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "25px",
                  color: "#6b7280",
                }}
              >
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentList;