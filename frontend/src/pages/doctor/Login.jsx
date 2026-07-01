import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await api.post("/doctor/login", {
        email,
        password,
      });

      if (response.data.success) {

        localStorage.setItem(
          "doctorToken",
          response.data.token
        );

        localStorage.setItem(
          "doctor",
          JSON.stringify(response.data.doctor)
        );

        toast.success("Login Successful");

        navigate("/doctor/dashboard");

      }

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Login Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="login-container">

      <div className="login-card">

        <h1>🏥 AI Hospital</h1>

        <h2>Doctor Login</h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">

            {loading
              ? "Logging In..."
              : "Login"}

          </button>

        </form>

      </div>

    </div>

  );

}

export default Login;