import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Patients.css";

function Patients() {

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  // ================= FETCH PATIENTS =================

  const fetchPatients = async () => {

    try {

      const token = localStorage.getItem("adminToken");

      const response = await api.get(
        "/admin/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {

        setPatients(response.data.patients);
        setFilteredPatients(response.data.patients);

      }

    } catch (error) {

      console.log(error);

      toast.error("Failed to load patients");

    }

  };

  // ================= SEARCH =================

  const handleSearch = (e) => {

    const value = e.target.value;

    setSearch(value);

    const filtered = patients.filter((patient) =>
      patient.name
        .toLowerCase()
        .includes(value.toLowerCase())
    );

    setFilteredPatients(filtered);

  };

  // ================= DELETE =================

  const deletePatient = async (id) => {

    if (!window.confirm("Delete this patient?")) return;

    try {

      const token = localStorage.getItem("adminToken");

      const response = await api.delete(
        `/admin/patient/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {

        toast.success("Patient Deleted");

        fetchPatients();

      }

    } catch (error) {

      console.log(error);

      toast.error("Delete Failed");

    }

  };

  return (

    <div className="patients-container">

      <h1>🧑‍🤝‍🧑 Manage Patients</h1>

      <input
        type="text"
        className="search-box"
        placeholder="Search Patient..."
        value={search}
        onChange={handleSearch}
      />

      <p className="patient-count">
        Total Patients : {filteredPatients.length}
      </p>

      <div className="patient-grid">
              {
        filteredPatients.length === 0 ? (

          <p className="no-data">
            No Patients Found
          </p>

        ) : (

          filteredPatients.map((patient) => (

            <div
              key={patient._id}
              className="patient-card"
            >

              <h2>
                👤 {patient.name}
              </h2>

              <p>
                <strong>Email :</strong>{" "}
                {patient.email}
              </p>

              <p>
                <strong>Phone :</strong>{" "}
                {patient.phone}
              </p>

              <p>
                <strong>Age :</strong>{" "}
                {patient.age}
              </p>

              <p>
                <strong>Gender :</strong>{" "}
                {patient.gender}
              </p>

              <p>
                <strong>Address :</strong>{" "}
                {patient.address}
              </p>

              <button
                className="delete-btn"
                onClick={() =>
                  deletePatient(patient._id)
                }
              >
                🗑 Delete Patient
              </button>

            </div>

          ))

        )
      }

      </div>

    </div>

  );

}

export default Patients;