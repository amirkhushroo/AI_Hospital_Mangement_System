import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";
import BackButton from "../../components/BackButton";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Profile.css";

function Profile() {

  const [loading, setLoading] = useState(true);

  const [doctor, setDoctor] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    phone: "",
    hospital: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // ====================== FETCH PROFILE ======================

  const fetchProfile = async () => {
    try {

      setLoading(true);

      const token = localStorage.getItem("doctorToken");

      const response = await api.get("/doctor/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setDoctor(response.data.doctor);
        setFormData(response.data.doctor);
      }

    } catch (error) {

      console.log(error);
      toast.error("Failed to load profile");

    } finally {

      setLoading(false);

    }
  };

  // ====================== HANDLE CHANGE ======================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ====================== UPDATE PROFILE ======================

  const updateProfile = async (e) => {
    e.preventDefault();

    try {

      const token = localStorage.getItem("doctorToken");

      const response = await api.put(
        "/doctor/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile Updated");
        fetchProfile();
      }

    } catch (error) {

      console.log(error);
      toast.error("Update Failed");

    }
  };

  if (loading) {
    return <Loader text="Loading Profile..." />;
  }

  return (
    <div className="profile-container">

      {/* ================= BACK BUTTON ================= */}

      <BackButton />

      <h1>
        <Stethoscope size={20} /> Doctor Profile
      </h1>

      <form className="profile-card" onSubmit={updateProfile}>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />

        <input
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          placeholder="Specialization"
        />

        <input
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          placeholder="Qualification"
        />

        <input
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Experience"
        />

        <input
          name="consultationFee"
          value={formData.consultationFee}
          onChange={handleChange}
          placeholder="Consultation Fee"
        />

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
        />

        <input
          name="hospital"
          value={formData.hospital}
          onChange={handleChange}
          placeholder="Hospital"
        />

        <button type="submit">
          Update Profile
        </button>

      </form>

    </div>
  );
}

export default Profile;