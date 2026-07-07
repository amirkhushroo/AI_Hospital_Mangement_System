import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo1.png";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("patient");
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/");
  };

  const isLoggedIn = Boolean(localStorage.getItem("token") || localStorage.getItem("doctorToken") || localStorage.getItem("adminToken"));

  return (
    <nav className="navbar">
      <Link className="logo" to="/">
  <img src={logo} alt="MEDI-CONNECT AI" className="logo-img" />
  <span>MEDI-CONNECT AI</span>
</Link>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/patient/login">Patient</Link></li>
        <li><Link to="/doctor/login">Doctor</Link></li>
        <li><Link to="/admin/login">Admin</Link></li>
        {isLoggedIn && (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;