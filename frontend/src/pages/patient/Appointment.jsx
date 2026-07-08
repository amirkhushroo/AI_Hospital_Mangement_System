import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Appointment.css";

function Appointment() {

  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    symptoms: ""
  });

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ===========================
  // FETCH ALL DOCTORS
  // ===========================

  const fetchDoctors = async () => {

    try {

      const response = await api.get("/doctor/all", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

      if (response.data.success) {

        setDoctors(response.data.doctors);

      }

    } catch (error) {

      console.log(error);

      toast.error("Unable to load doctors");

    }

  };

  // ===========================
  // HANDLE INPUT
  // ===========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({

      ...formData,

      [name]: value,

    });

    if (name === "doctorId") {

      const doctor = doctors.find(
        (doc) => doc._id === value
      );

      setSelectedDoctor(doctor);

    }

  };

  // ===========================
  // BOOK APPOINTMENT
  // ===========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !formData.doctorId ||
      !formData.appointmentDate ||
      !formData.appointmentTime ||
      !formData.symptoms
    ) {

      return toast.error("Please fill all fields");

    }

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await api.post(

        "/appointment/book",

        formData,

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

      if (response.data.success) {

        toast.success("Appointment Booked Successfully");

        navigate("/patient/my-appointments");

      }

    } catch (error) {

      console.log(error);

      toast.error(

        error.response?.data?.message ||

        "Booking Failed"

      );

    } finally {

      setLoading(false);

    }

  };
    return (
    <div className="appointment-container">

      <div className="appointment-card">

        <h1><CalendarDays size={20} /> Book Appointment</h1>

        <form onSubmit={handleSubmit}>

          {/* ================= Doctor ================= */}

          <label>Select Doctor</label>

          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
          >
            <option value="">-- Select Doctor --</option>

            {doctors.map((doctor) => (

              <option
                key={doctor._id}
                value={doctor._id}
              >
                 {doctor.name} - {doctor.specialization}
              </option>

            ))}

          </select>

          {/* ================= Doctor Details ================= */}

          {selectedDoctor && (

            <div className="doctor-info">

              <h2>Doctor Information</h2>

              <p>
                <strong>Name :</strong> Dr. {selectedDoctor.name}
              </p>

              <p>
                <strong>Specialization :</strong>{" "}
                {selectedDoctor.specialization}
              </p>

              <p>
                <strong>Qualification :</strong>{" "}
                {selectedDoctor.qualification}
              </p>

              <p>
                <strong>Hospital :</strong>{" "}
                {selectedDoctor.hospital}
              </p>

              <p>
                <strong>Consultation Fee :</strong> ₹
                {selectedDoctor.consultationFee}
              </p>

              <p>
  <strong>Available Days :</strong>{" "}
  {selectedDoctor?.availableDays?.join(", ")}
</p>

<p>
  <strong>Available Time :</strong>{" "}
  {selectedDoctor?.availableTime?.start} - {selectedDoctor?.availableTime?.end}
</p>

            </div>

          )}

          {/* ================= Date ================= */}

          <label>Appointment Date</label>

          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
          />

          {/* ================= Time ================= */}

          <label>Appointment Time</label>

          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
           
          />

          {/* ================= Symptoms ================= */}

          <label>Symptoms</label>

          <textarea
            rows="5"
            placeholder="Describe your symptoms..."
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
          />

          {/* ================= Button ================= */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Booking..."
              : "Book Appointment"}
          </button>

        </form>

      </div>

    </div>
  );
  }

export default Appointment;