import { Outlet } from "react-router-dom";
import BackButton from "./BackButton";

const ProtectedLayout = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <BackButton />
      </div>

      <Outlet />
    </div>
  );
};

export default ProtectedLayout;