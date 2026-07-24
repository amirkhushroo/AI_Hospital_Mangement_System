import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { User, CalendarDays, FileText, LogOut, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import LoginModal from "../LoginModal";

import {
  Home,
  Info,
} from "lucide-react";

import "./Navbar.css";
import logo from "../../assets/logo1.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogin, setShowLogin] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

const menuRef = useRef(null);

const patient = JSON.parse(localStorage.getItem("patient"));
const doctor = JSON.parse(localStorage.getItem("doctor"));
const admin = JSON.parse(localStorage.getItem("admin"));
const operator = JSON.parse(localStorage.getItem("operator"));

const user = patient || doctor || admin || operator;

const role = patient
  ? "patient"
  : doctor
  ? "doctor"
  : admin
  ? "admin"
  : operator
  ? "operator"
  : null;

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowProfileMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("patient");

    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");

    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    localStorage.removeItem("operatorToken");
    localStorage.removeItem("operator");

    navigate("/");
  };

  const isLoggedIn = Boolean(
    localStorage.getItem("token") ||
      localStorage.getItem("doctorToken") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("operatorToken")
  );

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}

        <Link className="logo" to="/">
          <motion.img
            src={logo}
            alt="MED-CONNECT"
            className="logo-img"
            whileHover={{ scale: 1.08, rotate: 3 }}
          />

          <span className="logo-text">
            <span className="logo-word">MED-CONNECT</span>
            <span className="logo-accent">HOSPITAL</span>
          </span>
        </Link>

        {/* Navigation */}

        <ul className="nav-links">
          <li>
            <Link
              className={isActive("/") ? "active" : ""}
              to="/"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
          </li>

          <li>
            <Link
              className={isActive("/about") ? "active" : ""}
              to="/about"
            >
              <Info size={18} />
              <span>About</span>
            </Link>
          </li>

          {!isLoggedIn && (
            <li>
              <button
                className="login-menu-btn"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            </li>
          )}

       {isLoggedIn && (

<li className="profile-dropdown" ref={menuRef}>

<button
className="profile-btn"
onClick={() => setShowProfileMenu(!showProfileMenu)}
>

<div className="avatar">
  {(user?.name || role || "U")
    .charAt(0)
    .toUpperCase()}
</div>

<span>{user?.name || "Patient"}</span>

<ChevronDown
size={18}
className={showProfileMenu ? "rotate" : ""}
/>

</button>

{showProfileMenu && (

<div className="profile-menu">

<div className="profile-header">
<h4>{user?.name || "User"}</h4>

<p>{user?.email}</p>

<small style={{ color: "#666" }}>
  {role?.charAt(0).toUpperCase() + role?.slice(1)}
</small>

</div>

<Link
to={`/${role}/profile`}
onClick={() => setShowProfileMenu(false)}
>
<User size={16}/>
My Profile
</Link>

<Link
to={
  role === "patient"
    ? "/patient/my-appointments"
    : role === "doctor"
    ? "/doctor/appointments"
    : role === "admin"
    ? "/admin/dashboard"
    : "/operator/dashboard"
}
onClick={() => setShowProfileMenu(false)}
>
<CalendarDays size={16}/>
My Appointments
</Link>

<Link
to={
  role === "patient"
    ? "/patient/medical-records"
    : role === "doctor"
    ? "/doctor/dashboard"
    : role === "admin"
    ? "/admin/dashboard"
    : "/operator/dashboard"
}
onClick={() => setShowProfileMenu(false)}
>
<FileText size={16}/>
Medical Records
</Link>

<button
  onClick={() => {
    setShowProfileMenu(false);
    handleLogout();
  }}
>
<LogOut size={16}/>
Logout
</button>

</div>

)}

</li>

)}
        </ul>
      </motion.nav>

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </>
  );
}

export default Navbar;