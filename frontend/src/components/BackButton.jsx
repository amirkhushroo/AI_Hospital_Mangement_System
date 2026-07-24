import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./BackButton.css";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button className="back-btn" onClick={() => navigate(-1)}>
      <FaArrowLeft />
      <span>Back</span>
    </button>
  );
};

export default BackButton;