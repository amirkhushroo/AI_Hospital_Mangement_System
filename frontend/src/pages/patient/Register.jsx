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

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= REGISTER =================

  const handleRegister = async (e) => {
    e.preventDefault();

    // Name Validation
    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    // Email OR Phone Validation
    if (!formData.email && !formData.phone) {
      toast.error("Please enter either Email or Mobile Number.");
      return;
    }

    if (formData.email && formData.phone) {
      toast.error(
        "Please use either Email or Mobile Number, not both."
      );
      return;
    }

    // Password Validation
    if (!formData.password) {
      toast.error("Please enter your password.");
      return;
    }

    try {

      setLoading(true);

      // Backend expects identifier
      const payload = {
        name: formData.name.trim(),
        identifier: formData.email
          ? formData.email.trim()
          : formData.phone.trim(),
        password: formData.password,
        age: formData.age,
        gender: formData.gender,
        address: formData.address,
      };

      const response = await api.post(
        "/patient/register",
        payload
      );

      if (response.data.success) {

        toast.success(response.data.message);

        // Phone Registration
        if (formData.phone) {

          navigate("/patient/verify-registration-otp", {
            state: {
              phone: formData.phone,
            },
          });

        }

        // Email Registration
        else {

          navigate("/patient/login");

        }

      }

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Registration Failed"
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

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <div className="login-link">
          <p>
            Already have an account?{" "}
            <Link to="/patient/login">
              Login
            </Link>
          </p>
        </div>

      </div>

    </div>

  );

}

export default Register;