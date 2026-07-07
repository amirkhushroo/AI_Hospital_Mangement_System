import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Home, Info, LogOut, ShieldCheck, Stethoscope } from "lucide-react";
import "./Navbar.css";
import logo from "../../assets/logo1.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

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
  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      className="navbar"
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <Link className="logo" to="/">
        <motion.img
          src={logo}
          alt="MEDI-CONNECT AI"
          className="logo-img"
          whileHover={{ scale: 1.08, rotate: 3 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
        />
        <span className="logo-text">
          <span className="logo-word">MEDI-CONNECT</span>
          <span className="logo-accent">AI</span>
        </span>
      </Link>

      <ul className="nav-links">
        <li><Link className={isActive("/") ? "active" : ""} to="/"><span className="nav-link-icon"><Home size={16} /></span><span className="nav-link-text">Home</span></Link></li>
        <li><Link className={isActive("/about") ? "active" : ""} to="/about"><span className="nav-link-icon"><Info size={16} /></span><span className="nav-link-text">About</span></Link></li>
        <li><Link className={isActive("/patient/login") ? "active" : ""} to="/patient/login"><span className="nav-link-icon"><Activity size={16} /></span><span className="nav-link-text">Patient</span></Link></li>
        <li><Link className={isActive("/doctor/login") ? "active" : ""} to="/doctor/login"><span className="nav-link-icon"><Stethoscope size={16} /></span><span className="nav-link-text">Doctor</span></Link></li>
        <li><Link className={isActive("/admin/login") ? "active" : ""} to="/admin/login"><span className="nav-link-icon"><ShieldCheck size={16} /></span><span className="nav-link-text">Admin</span></Link></li>
        {isLoggedIn && (
          <li>
            <motion.button
              className="logout-btn"
              onClick={handleLogout}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <span className="nav-link-icon"><LogOut size={16} /></span>
              <span className="nav-link-text">Logout</span>
            </motion.button>
          </li>
        )}
      </ul>
    </motion.nav>
  );
}

export default Navbar;