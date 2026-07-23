import { useState } from "react";
import { Building2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    gender: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // ================= Validation =================

    if (!formData.email && !formData.phone) {
      toast.error("Please enter either Email or Mobile Number.");
      return;
    }

    if (formData.email && formData.phone) {
      toast.error("Register using either Email or Mobile Number, not both.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/patient/register", formData);

      if (response.data.success) {
        toast.success(response.data.message);

        // ================= Email Registration =================

        if (formData.email) {
          navigate("/patient/login");
          return;
        }

        // ================= Phone Registration =================

        navigate("/patient/verify-registration-otp", {
          state: {
            phone: formData.phone,
          },
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>
          <Building2 size={22} />
          AI Hospital
        </h1>

        <h2>Create Patient Account</h2>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email (Optional)"
            value={formData.email}
            onChange={handleChange}
          />

          <div
            style={{
              textAlign: "center",
              margin: "8px 0",
              fontWeight: "bold",
              color: "#666",
            }}
          >
            OR
          </div>

          <input
            type="text"
            name="phone"
            placeholder="Mobile Number (Optional)"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            name="address"
            rows="3"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <div className="login-link">
          <p>
            Already have an account?{" "}
            <Link to="/patient/login">Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;