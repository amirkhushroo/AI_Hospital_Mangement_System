import { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import PageTitle from "../../components/UI/PageTitle";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://your-backend-url.com";

const DoctorAvailability = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("operatorToken");

  // ================= Fetch Doctors =================

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      if (!token) {
        alert("Please login first.");
        return;
      }

      const res = await fetch(`${API_URL}/api/doctor/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ================= Search =================

  const filteredDoctors = doctors.filter((doctor) => {
    const name = doctor.name || "";
    const specialization = doctor.specialization || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      specialization.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading Doctors...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <PageTitle
        title="Doctor Availability"
        subtitle="View available doctors and their details."
      />

      <Card>
        <input
          type="text"
          placeholder="Search Doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "25px",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "20px",
          }}
        >
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Card key={doctor._id}>
                <h3
                  style={{
                    color: "#2563eb",
                    marginBottom: "15px",
                  }}
                >
                  {doctor.name}
                </h3>

                <p>
                  <strong>Specialization:</strong>{" "}
                  {doctor.specialization || "N/A"}
                </p>

                <p>
                  <strong>Qualification:</strong>{" "}
                  {doctor.qualification || "N/A"}
                </p>

                <p>
                  <strong>Experience:</strong>{" "}
                  {doctor.experience || 0} Years
                </p>

                <p>
                  <strong>Consultation Fee:</strong> ₹
                  {doctor.consultationFee || 0}
                </p>

                <p>
                  <strong>Phone:</strong> {doctor.phone || "N/A"}
                </p>

                <div style={{ marginTop: "15px" }}>
                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#15803d",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontWeight: "600",
                    }}
                  >
                    Available
                  </span>
                </div>
              </Card>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                width: "100%",
                padding: "30px",
                fontSize: "18px",
                color: "#666",
              }}
            >
              No Doctors Found
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DoctorAvailability;