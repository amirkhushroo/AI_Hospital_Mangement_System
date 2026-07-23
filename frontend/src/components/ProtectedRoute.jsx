import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, role = "patient" }) {
  const location = useLocation();

  const getToken = () => {
    switch (role) {
      case "admin":
        return localStorage.getItem("adminToken");

      case "doctor":
        return localStorage.getItem("doctorToken");

      case "operator":
        return localStorage.getItem("operatorToken");

      default:
        return localStorage.getItem("token");
    }
  };

  const token = getToken();

  if (!token) {
    let redirectPath = "/patient/login";

    switch (role) {
      case "admin":
        redirectPath = "/admin/login";
        break;

      case "doctor":
        redirectPath = "/doctor/login";
        break;

      case "operator":
        redirectPath = "/operator/login";
        break;

      default:
        redirectPath = "/patient/login";
    }

    return (
      <Navigate
        to={redirectPath}
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;