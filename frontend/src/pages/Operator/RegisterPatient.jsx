import { useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import PageTitle from "../../components/UI/PageTitle";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://your-backend-url.com";

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    name: "",
    identifier: "",
    password: "",
    age: "",
    gender: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const registerPatient = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.identifier ||
      !formData.password
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const patientData = {
      name: formData.name.trim(),
      identifier: formData.identifier.trim(),
      password: formData.password.trim(),
      age: formData.age,
      gender: formData.gender,
      address: formData.address.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/api/patient/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);

        setFormData({
          name: "",
          identifier: "",
          password: "",
          age: "",
          gender: "",
          address: "",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <PageTitle
        title="Register Patient"
        subtitle="Create a new patient account."
      />

      <Card
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <form onSubmit={registerPatient}>
          <Input
            label="Full Name"
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            label="Email / Mobile Number"
            type="text"
            name="identifier"
            placeholder="Enter Email or Mobile Number"
            value={formData.identifier}
            onChange={handleChange}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />

          <Input
            label="Age"
            type="number"
            name="age"
            placeholder="Enter age"
            value={formData.age}
            onChange={handleChange}
          />

          <div className="input-group">
            <label>Gender</label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label>Address</label>

            <textarea
              name="address"
              rows="4"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <Button type="submit">
              Register Patient
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPatient;