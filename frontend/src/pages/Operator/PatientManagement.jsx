import { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import PageTitle from "../../components/UI/PageTitle";
import api from "../../services/api";


const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    age: "",
    phone: "",
    address: "",
  });

  const token = localStorage.getItem("operatorToken");

  // ====================== Fetch Patients ======================

const fetchPatients = async () => {
  try {
    if (!token) {
      alert("Operator not logged in.");
      return;
    }

    const response = await api.get("/patient/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (data.success) {
      console.log("Patients:", data.patients);
      setPatients(data.patients);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert(
      error.response?.data?.message ||
        "Failed to load patients."
    );
  }
};

// ====================== Load Patients ======================

useEffect(() => {
  if (token) {
    fetchPatients();
  } else {
    alert("Operator not logged in.");
  }
}, []);

  // ====================== Edit Patient ======================

  const editPatient = (patient) => {
    setEditingId(patient._id);

    setFormData({
      age: patient.age || "",
      phone: patient.phone || "",
      address: patient.address || "",
    });
  };

  // ====================== Update Patient ======================

 const updatePatient = async () => {
  try {
    const response = await api.put(
      `/patient/update/${editingId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (data.success) {
      alert("Patient Updated Successfully");

      setEditingId(null);

      fetchPatients();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert(
      error.response?.data?.message ||
        "Failed to update patient."
    );
  }
};
  // ====================== Search ======================

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <PageTitle
        title="Patient Management"
        subtitle="View and update patient details."
      />

      <Card>
        <input
          type="text"
          placeholder="Search Patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "20px",
          }}
        />

        {editingId && (
          <Card
            style={{
              marginBottom: "25px",
            }}
          >
            <h3>Edit Patient</h3>

            <div className="input-group">
              <label>Age</label>

              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    age: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>Phone</label>

              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>Address</label>

              <textarea
                rows="3"
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <Button onClick={updatePatient}>
              Save Changes
            </Button>

            <Button
              variant="danger"
              onClick={() => setEditingId(null)}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </Button>
          </Card>
        )}

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead
              style={{
                background: "#2563eb",
                color: "#fff",
              }}
            >
              <tr>
                <th style={{ padding: "12px" }}>Name</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient._id}
                  style={{
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <td style={{ padding: "12px" }}>
                    {patient.name}
                  </td>

                  <td>{patient.age}</td>

                  <td>{patient.phone}</td>

                  <td>{patient.address}</td>

                  <td>
                    <Button
                      onClick={() =>
                        editPatient(patient)
                      }
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredPatients.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PatientManagement;