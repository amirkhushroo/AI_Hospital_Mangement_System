import { Link } from "react-router-dom";
import { X, User, Stethoscope, ShieldCheck, ClipboardList } from "lucide-react";
import "./LoginModal.css";

const LoginModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="login-overlay" onClick={onClose}>
      <div
        className="login-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          <X size={22} />
        </button>

        <h2>Login Portal</h2>
        <p>Select your role</p>

        <Link className="portal-login-card patient" to="/patient/login">
          <User size={22} />
          <span>Patient Login</span>
        </Link>

        <Link className="portal-login-card doctor" to="/doctor/login">
          <Stethoscope size={22} />
          <span>Doctor Login</span>
        </Link>

        <Link className="portal-login-card admin" to="/admin/login">
          <ShieldCheck size={22} />
          <span>Admin Login</span>
        </Link>

        <Link className="portal-login-card operator" to="/operator/login">
          <ClipboardList size={22} />
          <span>Operator Login</span>
        </Link>
      </div>
    </div>
  );
};

export default LoginModal;