import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";


const Profile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const token = localStorage.getItem("operatorToken");

  // ====================== Fetch Profile ======================

  const fetchProfile = async () => {
    if (!token) {
      alert("Please login first.");
      navigate("/operator/login");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/operator/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = response.data;

      if (data.success) {
        setProfile({
          name: data.operator.name || "",
          email: data.operator.email || "",
          phone: data.operator.phone || "",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
     alert(
  error.response?.data?.message ||
  "Failed to load profile."
);
    } finally {
      setLoading(false);
    }
  };

  // ====================== Update Profile ======================

  const updateProfile = async () => {
    try {
      setUpdating(true);

      const response = await api.put(
  "/operator/profile",
  {
    name: profile.name,
    phone: profile.phone,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const data = response.data;

      if (data.success) {
        alert("Profile Updated Successfully");
        fetchProfile();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
     alert(
  error.response?.data?.message ||
  "Server Error"
);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "500px",
        margin: "30px auto",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Operator Profile</h2>

      <label>Name</label>
      <input
        type="text"
        value={profile.name}
        onChange={(e) =>
          setProfile({
            ...profile,
            name: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <label>Email</label>
      <input
        type="email"
        value={profile.email}
        readOnly
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          background: "#f1f1f1",
        }}
      />

      <label>Phone</label>
      <input
        type="text"
        value={profile.phone}
        onChange={(e) =>
          setProfile({
            ...profile,
            phone: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      <button
        onClick={updateProfile}
        disabled={updating}
        style={{
          width: "100%",
          padding: "12px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {updating ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
};

export default Profile;