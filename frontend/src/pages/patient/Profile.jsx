import { useEffect, useState } from "react";
import { User } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Profile.css";

function Profile() {

  const [patient, setPatient] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= Fetch Profile =================

  const fetchProfile = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await api.get("/patient/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPatient(response.data.patient);
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= Handle Input =================

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    });
  };

  // ================= Update Profile =================

  const handleUpdate = async () => {
    try {

      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await api.put(
        "/patient/profile",
        patient,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile Updated Successfully");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update Failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="profile-page">

      <div className="profile-card">

        <h1><User size={20} /> My Profile</h1>

        <div className="profile-image">
          <User size={28} />
        </div>

        <div className="profile-form">

          <label>Name</label>

          <input
            type="text"
            name="name"
            value={patient.name}
            onChange={handleChange}
          />

          <label>Email</label>

          <input
            type="email"
            value={patient.email}
            disabled
          />

          <label>Age</label>

          <input
            type="number"
            name="age"
            value={patient.age}
            onChange={handleChange}
          />

          <label>Gender</label>

          <select
            name="gender"
            value={patient.gender}
            onChange={handleChange}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <label>Phone</label>

          <input
            type="text"
            name="phone"
            value={patient.phone}
            onChange={handleChange}
          />

          <label>Address</label>

          <textarea
            rows="4"
            name="address"
            value={patient.address}
            onChange={handleChange}
          />

          <button onClick={handleUpdate}>
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;