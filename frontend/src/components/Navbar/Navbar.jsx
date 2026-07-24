import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import LoginModal from "../LoginModal";

import {
  Home,
  Info,
  LogOut,
} from "lucide-react";

import "./Navbar.css";
import logo from "../../assets/logo1.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogin, setShowLogin] = useState(false);

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
            <li>
              <motion.button
                className="logout-btn"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={18} />
                Logout
              </motion.button>
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