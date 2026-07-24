import { useEffect, useState } from "react";
import { Stethoscope, Trash2 } from "lucide-react";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Doctors.css";

function Doctors() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ================= FETCH DOCTORS =================

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const response = await api.get("/admin/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setDoctors(response.data.doctors);
        setFilteredDoctors(response.data.doctors);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  // ================= SEARCH =================

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredDoctors(filtered);
  };

  // ================= DELETE =================

  const deleteDoctor = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await api.delete(`/admin/doctor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Doctor Deleted Successfully");
        fetchDoctors();
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete Failed");
    }
  };

  if (loading) {
    return <Loader text="Loading Doctors..." />;
  }

  return (
    <div className="doctors-container">

      {/* ================= BACK BUTTON ================= */}

  

      <h1>
        <Stethoscope size={20} /> Manage Doctors
      </h1>

      <input
        type="text"
        className="search-box"
        placeholder="Search Doctor..."
        value={search}
        onChange={handleSearch}
      />

      <p className="doctor-count">
        Total Doctors : {filteredDoctors.length}
      </p>

      <div className="doctor-grid">
        {filteredDoctors.length === 0 ? (
          <p className="no-data">
            No Doctors Found
          </p>
        ) : (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="doctor-card"
            >
              <h2>
                <Stethoscope size={18} /> {doctor.name}
              </h2>

              <p>
                <strong>Email :</strong> {doctor.email}
              </p>

              <p>
                <strong>Phone :</strong> {doctor.phone}
              </p>

              <p>
                <strong>Specialization :</strong> {doctor.specialization}
              </p>

              <p>
                <strong>Qualification :</strong> {doctor.qualification}
              </p>

              <p>
                <strong>Experience :</strong> {doctor.experience} Years
              </p>

              <p>
                <strong>Hospital :</strong> {doctor.hospital}
              </p>

              <p>
                <strong>Consultation Fee :</strong> ₹{doctor.consultationFee}
              </p>

              <button
                className="delete-btn"
                onClick={() => deleteDoctor(doctor._id)}
              >
                <Trash2 size={16} /> Delete Doctor
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Doctors;