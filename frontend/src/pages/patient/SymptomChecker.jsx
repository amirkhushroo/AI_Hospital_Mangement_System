import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, ShieldAlert, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./SymptomChecker.css";

function SplitText({ text, className = "", delay = 35, duration = 0.7 }) {
  const words = text.split(" ");

  return (
    <span className={`split-text ${className}`} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="split-word">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={`${word}-${charIndex}`}
              className="split-char"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: wordIndex * 0.05 + charIndex * 0.03 + delay / 1000,
                duration,
              }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 ? <span className="split-space">&nbsp;</span> : null}
        </span>
      ))}
    </span>
  );
}

function SymptomChecker() {

  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // ================= CHECK SYMPTOMS =================

  const handleCheckSymptoms = async () => {

    if (!symptoms.trim()) {
      return toast.error("Please enter your symptoms");
    }

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/ai/symptom-checker",
        {
          symptoms,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {

        setResult(response.data);

        toast.success("Symptoms analyzed successfully");

      }

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to analyze symptoms"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <motion.div
      className="symptom-container"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >

      <h1>
        <span className="symptom-icon" aria-hidden="true">
          <Bot size={24} />
        </span>
        <SplitText text="AI Symptom Checker" className="symptom-title-text" />
      </h1>

      <textarea
        className="symptom-textarea"
        placeholder="Describe your symptoms..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <motion.button
        className="symptom-button"
        onClick={handleCheckSymptoms}
        disabled={loading}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
      >
        <Sparkles size={18} />
        {loading ? "Analyzing..." : "Analyze Symptoms"}
      </motion.button>

      {result && (

        <motion.div
          className="result-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >

          <h2>Analysis Result</h2>

          <p>
            <strong>Disease :</strong>{" "}
            {result.result.possibleDisease}
          </p>

          <p>
            <strong>Confidence :</strong>{" "}
            {result.result.confidence}
          </p>

          <p>
            <strong>Severity :</strong>{" "}
            {result.result.severity}
          </p>

          <p>
            <strong>Recommended Doctor :</strong>{" "}
            {result.result.recommendedDoctor}
          </p>
          <p>
            <strong>Medicines :</strong>{" "}
            {result.result.medicines?.length
              ? result.result.medicines.join(", ")
              : "Not Available"}
          </p>

          <p>
            <strong>Home Remedies :</strong>{" "}
            {result.result.homeRemedies?.length
              ? result.result.homeRemedies.join(", ")
              : "Not Available"}
          </p>

          <p>
            <strong>Diet :</strong>{" "}
            {result.result.diet?.length
              ? result.result.diet.join(", ")
              : "Not Available"}
          </p>

          <p>
            <strong>Tests Recommended :</strong>{" "}
            {result.result.testsRecommended?.length
              ? result.result.testsRecommended.join(", ")
              : "Not Available"}
          </p>

          <p>
            <strong>Precautions :</strong>{" "}
            {result.result.precautions?.length
              ? result.result.precautions.join(", ")
              : "Not Available"}
          </p>

          {result.result.emergency && (

            <div className="emergency-box">

              <h3>
                <ShieldAlert size={18} /> Emergency Alert
              </h3>

              <p>
                {result.result.emergencyMessage}
              </p>

            </div>

          )}

          <h2>Recommended Doctors</h2>

          {result.availableDoctors?.length > 0 ? (

            result.availableDoctors.map((doctor) => (

              <div
                key={doctor._id}
                className="doctor-card"
              >

                <h3>
                  <Stethoscope size={18} />
                  {doctor.name}
                </h3>

                <p>
                  <strong>Specialization :</strong>{" "}
                  {doctor.specialization}
                </p>

                <p>
                  <strong>Qualification :</strong>{" "}
                  {doctor.qualification}
                </p>

                <p>
                  <strong>Hospital :</strong>{" "}
                  {doctor.hospital}
                </p>

                <p>
                  <strong>Consultation Fee :</strong> ₹
                  {doctor.consultationFee}
                </p>

                <p>
                  <strong>Phone :</strong>{" "}
                  {doctor.phone}
                </p>

                <p>
                  <strong>Available Days :</strong>{" "}
                  {doctor.availableDays?.join(", ")}
                </p>

                <p>
                  <strong>Available Time :</strong>{" "}
                  {doctor.availableTime?.start} -
                  {doctor.availableTime?.end}
                </p>

                <motion.button
                  className="doctor-book-btn"
                  onClick={() =>
                    navigate("/patient/appointment")
                  }
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book Appointment
                </motion.button>

              </div>

            ))

          ) : (

            <p>No doctors available.</p>

          )}

        </motion.div>

      )}

    </motion.div>

  );

}

export default SymptomChecker;