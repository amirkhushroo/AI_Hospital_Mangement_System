import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, role = "patient" }) {
  const location = useLocation();

  const getToken = () => {
    if (role === "admin") return localStorage.getItem("adminToken");
    if (role === "doctor") return localStorage.getItem("doctorToken");
    return localStorage.getItem("token");
  };

  const token = getToken();

  if (!token) {
    const redirectPath =
      role === "admin"
        ? "/admin/login"
        : role === "doctor"
          ? "/doctor/login"
          : "/patient/login";

    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
