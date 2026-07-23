import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  CalendarPlus,
  ClipboardList,
  Users,
  Stethoscope,
  FileText,
  UserCircle,
  LogOut,
} from "lucide-react";

import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import PageTitle from "../../components/UI/PageTitle";
import "./OperatorDashboard.css";

const OperatorDashboard = () => {
  const navigate = useNavigate();

  const operator = JSON.parse(localStorage.getItem("operator"));

  const logout = () => {
    localStorage.removeItem("operator");
    localStorage.removeItem("operatorToken");
    navigate("/operator/login");
  };

  const cards = [
    {
      title: "Register Patient",
      icon: <UserPlus size={40} />,
      path: "/operator/register-patient",
    },
    {
      title: "Book Appointment",
      icon: <CalendarPlus size={40} />,
      path: "/operator/book-appointment",
    },
    {
      title: "Appointments",
      icon: <ClipboardList size={40} />,
      path: "/operator/appointments",
    },
    {
      title: "Patient Management",
      icon: <Users size={40} />,
      path: "/operator/patients",
    },
    {
      title: "Doctors",
      icon: <Stethoscope size={40} />,
       path: "/operator/doctor-availability",
    },
    {
      title: "Upload Reports",
      icon: <FileText size={40} />,
      path: "/operator/upload-report",
    },
    {
      title: "Profile",
      icon: <UserCircle size={40} />,
      path: "/operator/profile",
    },
  ];

  return (
    <div className="dashboard-container">
      <PageTitle
        title={`Welcome, ${operator?.name || "Operator"} `}
        subtitle="Manage patients, appointments and medical reports."
      />

      <div className="dashboard-grid">
        {cards.map((card, index) => (
          <Card key={index}>
            <div className="dashboard-card">
              <div className="dashboard-icon">
                {card.icon}
              </div>

              <h3>{card.title}</h3>

              <Button
                onClick={() => navigate(card.path)}
              >
                Open
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: "40px" }}>
        <Button
          variant="danger"
          onClick={logout}
        >
          <LogOut
            size={18}
            style={{ marginRight: "8px" }}
          />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default OperatorDashboard;