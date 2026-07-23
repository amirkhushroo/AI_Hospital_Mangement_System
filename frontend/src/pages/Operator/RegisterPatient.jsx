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
    email: "",
    password: "",
    age: "",
    gender: "",
    phone: "",
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

    try {
      const response = await fetch(`${API_URL}/api/patient/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Patient Registered Successfully");

        setFormData({
          name: "",
          email: "",
          password: "",
          age: "",
          gender: "",
          phone: "",
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
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "name",
                  value: e.target.value,
                },
              })
            }
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "email",
                  value: e.target.value,
                },
              })
            }
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "password",
                  value: e.target.value,
                },
              })
            }
          />

          <Input
            label="Age"
            type="number"
            placeholder="Enter age"
            value={formData.age}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "age",
                  value: e.target.value,
                },
              })
            }
          />

          <div className="input-group">
            <label>Gender</label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <Input
            label="Phone Number"
            type="text"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "phone",
                  value: e.target.value,
                },
              })
            }
          />

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