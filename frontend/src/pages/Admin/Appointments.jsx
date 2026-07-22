import { useEffect, useState } from "react";
import { CalendarDays, User } from "lucide-react";
import BackButton from "../../components/BackButton";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Appointments.css";

function Appointments() {

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ================= FETCH APPOINTMENTS =================

  const fetchAppointments = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const response = await api.get(
        "/admin/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {

        setAppointments(response.data.appointments);
        setFilteredAppointments(response.data.appointments);

      }

    } catch (error) {

      console.log(error);

      toast.error("Failed to load appointments");

    } finally {

      setLoading(false);

    }

  };

  // ================= SEARCH + FILTER =================

  const handleFilter = (value, status = statusFilter) => {

    let filtered = appointments.filter((item) => {

      const patientName =
        item.patient?.name?.toLowerCase() || "";

      const doctorName =
        item.doctor?.name?.toLowerCase() || "";

      return (
        patientName.includes(value.toLowerCase()) ||
        doctorName.includes(value.toLowerCase())
      );

    });

    if (status !== "All") {

      filtered = filtered.filter(
        (item) => item.status === status
      );

    }

    setFilteredAppointments(filtered);

  };

  const handleSearch = (e) => {

    const value = e.target.value;

    setSearch(value);

    handleFilter(value);

  };

  const handleStatus = (e) => {

    const value = e.target.value;

    setStatusFilter(value);

    handleFilter(search, value);

  };

  if (loading) {
    return <Loader text="Loading Appointments..." />;
  }

  return (

    <div className="appointments-container">

      {/* ================= BACK BUTTON ================= */}

      <BackButton />

      <h1><CalendarDays size={20} /> Manage Appointments</h1>

      <div className="filter-section">

        <input
          type="text"
          placeholder="Search Patient / Doctor..."
          value={search}
          onChange={handleSearch}
          className="search-box"
        />

        <select
          value={statusFilter}
          onChange={handleStatus}
          className="status-filter"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

      </div>

      <p className="appointment-count">
        Total Appointments : {filteredAppointments.length}
      </p>

      <div className="appointment-grid">

        {
          filteredAppointments.length === 0 ? (

            <p className="no-data">
              No Appointments Found
            </p>

          ) : (

            filteredAppointments.map((appointment) => (

              <div
                key={appointment._id}
                className="appointment-card"
              >

                <h2>
                  <User size={18} /> {appointment.patient?.name}
                </h2>

                <p>
                  <strong>Doctor :</strong>{" "}
                  {appointment.doctor?.name}
                </p>

                <p>
                  <strong>Specialization :</strong>{" "}
                  {appointment.doctor?.specialization}
                </p>

                <p>
                  <strong>Date :</strong>{" "}
                  {new Date(
                    appointment.appointmentDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>Time :</strong>{" "}
                  {appointment.appointmentTime}
                </p>

                <p>
                  <strong>Symptoms :</strong>{" "}
                  {appointment.symptoms || "Not Mentioned"}
                </p>

                <p>
                  <strong>Status :</strong>

                  <span
                    className={
                      appointment.status === "Accepted"
                        ? "status accepted"
                        : appointment.status === "Rejected"
                        ? "status rejected"
                        : appointment.status === "Completed"
                        ? "status completed"
                        : appointment.status === "Cancelled"
                        ? "status cancelled"
                        : "status pending"
                    }
                  >
                    {appointment.status}
                  </span>

                </p>

              </div>

            ))

          )
        }

      </div>

    </div>

  );

}

export default Appointments;