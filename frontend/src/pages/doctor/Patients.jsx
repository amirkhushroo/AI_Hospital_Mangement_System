import { useEffect, useState } from "react";
import { Stethoscope, User } from "lucide-react";
import BackButton from "../../components/BackButton";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Patients.css";

function Patients() {

  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  // ================= FETCH PATIENTS =================

  const fetchPatients = async () => {

    try {

      setLoading(true);

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

        setPatients(response.data.appointments);
        setFilteredPatients(response.data.appointments);

      }

    } catch (error) {

      console.log(error);

      toast.error("Failed to load patients");

    } finally {

      setLoading(false);

    }

  };

  // ================= SEARCH =================

  const handleSearch = (e) => {

    const value = e.target.value;

    setSearch(value);

    const filtered = patients.filter(
      (item) =>
        item.patient &&
        item.patient.name
          .toLowerCase()
          .includes(value.toLowerCase())
    );

    setFilteredPatients(filtered);

  };

  if (loading) {
    return <Loader text="Loading Patients..." />;
  }

  return (

    <div className="patients-container">

      {/* ================= BACK BUTTON ================= */}

      <BackButton />

      <h1><Stethoscope size={20} /> My Patients</h1>

      <input
        type="text"
        placeholder="Search Patient..."
        value={search}
        onChange={handleSearch}
        className="search-box"
      />

      {

        filteredPatients.length === 0 ? (

          <p className="no-data">
            No Patients Found
          </p>

        ) : (

          filteredPatients.map((item) => (

            <div
              key={item._id}
              className="patient-card"
            >

              <h2>
                <User size={18} /> {item.patient?.name || "Unknown Patient"}
              </h2>

              <p>
                <strong>Email :</strong>{" "}
                {item.patient?.email || "N/A"}
              </p>

              <p>
                <strong>Phone :</strong>{" "}
                {item.patient?.phone || "N/A"}
              </p>

              <p>
                <strong>Age :</strong>{" "}
                {item.patient?.age || "N/A"}
              </p>

              <p>
                <strong>Gender :</strong>{" "}
                {item.patient?.gender || "N/A"}
              </p>

              <p>
                <strong>Address :</strong>{" "}
                {item.patient?.address || "N/A"}
              </p>

              <p>
                <strong>Symptoms :</strong>{" "}
                {item.symptoms || "Not Mentioned"}
              </p>

              <p>
                <strong>Date :</strong>{" "}
                {new Date(item.appointmentDate).toLocaleDateString()}
              </p>

              <p>
                <strong>Time :</strong>{" "}
                {item.appointmentTime}
              </p>

              <p>
                <strong>Status :</strong>

                <span
                  className={
                    item.status === "Accepted"
                      ? "status accepted"
                      : item.status === "Rejected"
                      ? "status rejected"
                      : item.status === "Completed"
                      ? "status completed"
                      : item.status === "Cancelled"
                      ? "status cancelled"
                      : "status pending"
                  }
                >
                  {item.status}
                </span>

              </p>

            </div>

          ))

        )

      }

    </div>

  );

}

export default Patients;