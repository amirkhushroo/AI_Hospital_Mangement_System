import { FileText } from "lucide-react";
import "./MedicalRecords.css";

function MedicalRecords() {

  const records = [
    {
      id: 1,
      doctor: "Dr. Raj Sharma",
      specialization: "Cardiologist",
      date: "10 July 2026",
      diagnosis: "High Blood Pressure",
      prescription: "Amlodipine 5mg - Once Daily",
    },
    {
      id: 2,
      doctor: "Dr. Priya Singh",
      specialization: "Dermatologist",
      date: "22 July 2026",
      diagnosis: "Skin Allergy",
      prescription: "Cetirizine - Once Daily",
    },
  ];

  return (
    <div className="medical-container">

      {/* ================= BACK BUTTON ================= */}


      <h1><FileText size={20} /> Medical Records</h1>

      {records.length === 0 ? (

        <div className="no-records">
          <h3>No Medical Records Found</h3>
        </div>

      ) : (

        records.map((record) => (

          <div
            className="record-card"
            key={record.id}
          >

            <h2>{record.doctor}</h2>

            <p>
              <strong>Specialization :</strong>{" "}
              {record.specialization}
            </p>

            <p>
              <strong>Date :</strong>{" "}
              {record.date}
            </p>

            <p>
              <strong>Diagnosis :</strong>{" "}
              {record.diagnosis}
            </p>

            <p>
              <strong>Prescription :</strong>{" "}
              {record.prescription}
            </p>

          </div>

        ))

      )}

    </div>
  );
}

export default MedicalRecords;