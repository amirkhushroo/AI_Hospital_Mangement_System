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

    }

  };

  // ================= SEARCH =================

  const handleSearch = (e) => {

    const value = e.target.value;

    setSearch(value);

    const filtered = patients.filter((item) =>

      item.patient.name
        .toLowerCase()
        .includes(value.toLowerCase())

    );

    setFilteredPatients(filtered);

  };

  return (

    <div className="patients-container">

      <h1>👨‍⚕️ My Patients</h1>

      <input
        type="text"
        placeholder="Search Patient..."
        value={search}
        onChange={handleSearch}
        className="search-box"
      />

      {
        filteredPatients.length === 0 ?

          <p className="no-data">
            No Patients Found
          </p>

          :

          filteredPatients.map((item) => (

            <div
              key={item._id}
              className="patient-card"
            >

              <h2>
                👤 {item.patient.name}
              </h2>

              <p>
                <strong>Email :</strong>{" "}
                {item.patient.email}
              </p>

              <p>
                <strong>Phone :</strong>{" "}
                {item.patient.phone}
              </p>

              <p>
                <strong>Age :</strong>{" "}
                {item.patient.age}
              </p>

              <p>
                <strong>Gender :</strong>{" "}
                {item.patient.gender}
              </p>

              <p>
                <strong>Address :</strong>{" "}
                {item.patient.address}
              </p>

              <p>
                <strong>Symptoms :</strong>{" "}
                {item.symptoms || "Not Mentioned"}
              </p>

              <p>
                <strong>Date :</strong>{" "}
                {new Date(
                  item.appointmentDate
                ).toLocaleDateString()}
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

      }

    </div>

  );

}

export default Patients;