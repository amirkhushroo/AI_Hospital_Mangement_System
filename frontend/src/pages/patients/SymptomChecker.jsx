import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./SymptomChecker.css";

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

    <div className="symptom-container">

      <h1>🤖 AI Symptom Checker</h1>

      <textarea
        placeholder="Describe your symptoms..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <button
        onClick={handleCheckSymptoms}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Symptoms"}
      </button>

      {result && (

        <div className="result-card">

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

              <h3>🚨 Emergency Alert</h3>

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

                <h3>{doctor.name}</h3>

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

                <button
                  onClick={() =>
                    navigate("/patient/appointment")
                  }
                >
                  Book Appointment
                </button>

              </div>

            ))

          ) : (

            <p>No doctors available.</p>

          )}

        </div>

      )}

    </div>

  );

}

export default SymptomChecker;