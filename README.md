
# 🏥 AI Hospital Management System

A full-stack AI-powered Hospital Management System built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. 
The system provides separate portals for **Patients, Doctors, and Admin**, along with an **AI Symptom Checker** that helps patients understand possible diseases based on their symptoms.
WEBSITE LINK ~https://ai-hospital-mangement-system.vercel.app/
---

# 📌 Features

## 👤 Patient Module

* Patient Registration & Login
* JWT Authentication
* Patient Dashboard
* Update Profile
* Book Appointment
* View My Appointments
* Medical Records
* AI Symptom Checker
* Secure Authentication

---

## 👨‍⚕️ Doctor Module

* Doctor Login
* Doctor Dashboard
* View Profile
* View Patient Appointments
* Accept Appointment
* Reject Appointment
* Complete Appointment
* View Assigned Patients

---

## 👨‍💼 Admin Module

* Admin Login
* Dashboard Analytics
* Manage Doctors
* Manage Patients
* Manage Appointments
* AI Reports
* Hospital Statistics

---

## 🤖 AI Symptom Checker

Patients can enter their symptoms in natural language.

Example:

```
Fever
Headache
Body Pain
Cough
```

The AI analyzes the symptoms and predicts:

* Possible Disease
* Confidence Score
* Precautions
* Recommended Specialist

---

# 🛠 Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* CSS3
* React Hot Toast

---

## Backend

* Node.js
* Express.js
* JWT Authentication
* Bcrypt.js

---

## Database

* MongoDB Atlas
* Mongoose ODM

---

## AI

* Google Gemini API
* AI Symptom Prediction

---

# 📂 Project Structure

```
AI-Hospital-Management-System/

│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │
│   ├── components/
│   ├── pages/
│   │     ├── common/
│   │     ├── patient/
│   │     ├── doctor/
│   │     └── Admin/
│   │
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
└── README.md
```

---

# 🔐 Authentication

Three different authentication systems are implemented.

* Patient Authentication
* Doctor Authentication
* Admin Authentication

JWT Tokens are used for secure authentication and authorization.

---

# 📊 Modules

## Patient

* Register
* Login
* Profile
* Book Appointment
* AI Symptom Checker

---

## Doctor

* Login
* Dashboard
* Accept Appointment
* Reject Appointment
* Complete Appointment

---

## Admin

* Dashboard
* Doctors Management
* Patients Management
* Appointment Management
* Reports

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/AI-Hospital-Management-System.git
```

---

## Backend

```bash
cd backend
npm install
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# ⚙ Environment Variables

Create a `.env` file inside the backend folder.

```
PORT=5000

MONGO_URI=Your_MongoDB_URI

JWT_SECRET=Your_JWT_Secret

GEMINI_API_KEY=Your_Gemini_API_Key
```

---

# 🌐 API Endpoints

## Patient

```
POST /api/patient/register
POST /api/patient/login
GET  /api/patient/profile
```

---

## Doctor

```
POST /api/doctor/login
GET  /api/doctor/profile
GET  /api/doctor/patients
```

---

## Appointment

```
POST /api/appointment/book
GET  /api/appointment/my
PUT  /api/appointment/status/:id
```

---

## Admin

```
POST /api/admin/login

GET /api/admin/dashboard

GET /api/admin/doctors

GET /api/admin/patients

GET /api/admin/appointments

GET /api/admin/ai-reports
```
---

# 🎯 Future Improvements

* Online Payment Gateway
* Video Consultation
* Email Notifications
* SMS Alerts
* Chat Between Doctor & Patient
* Prescription PDF Download
* Medical Report Upload
* Dark Mode
* Analytics Dashboard
* Multi Hospital Support

---

# 👥 Team Members

This project was developed collaboratively by:

| Team Member | Module |
|--------------------------|-------------------------------------|
| **Mohammad Amaan**       | Patient Module  |
| **Bilal Ahmad Mansoori** | Doctor Module |
| **Amir Khushroo**        | Admin Module |
| **Falak Anwar**          | Appointment Module |
| **Muhammad Arshad**      | UI & Documentation |
| **Moh Avish**            | AI Symptom Checker |
---
 
# 📄 License

This project is developed for educational and learning purposes.
