import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// ====================== Common ======================
import Home from "../pages/common/Home";
import About from "../pages/common/About";
import NotFound from "../pages/common/NotFound";

// ====================== Patient ======================
import PatientLogin from "../pages/patient/Login";
import PatientRegister from "../pages/patient/Register";
import VerifyRegistrationOTP from "../pages/patient/VerifyRegistrationOTP";
import PatientDashboard from "../pages/patient/Dashboard";
import PatientProfile from "../pages/patient/Profile";
import Appointment from "../pages/patient/Appointment";
import MyAppointments from "../pages/patient/MyAppointments";
import MedicalRecords from "../pages/patient/MedicalRecords";
import SymptomChecker from "../pages/patient/SymptomChecker";

// ====================== Doctor ======================
import DoctorLogin from "../pages/doctor/Login";
import DoctorDashboard from "../pages/doctor/Dashboard";
import DoctorProfile from "../pages/doctor/Profile";
import DoctorAppointments from "../pages/doctor/Appointments";
import DoctorPatients from "../pages/doctor/Patients";

// ====================== Admin ======================
import AdminLogin from "../pages/Admin/Login";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminDoctors from "../pages/Admin/Doctors";
import AdminPatients from "../pages/Admin/Patients";
import AdminAppointments from "../pages/Admin/Appointments";
import AdminReports from "../pages/Admin/Reports";

// ====================== Operator ======================
import OperatorLogin from "../pages/operator/OperatorLogin";
import OperatorDashboard from "../pages/operator/OperatorDashboard";
import AppointmentList from "../pages/operator/AppointmentList";
import RegisterPatient from "../pages/operator/RegisterPatient";
import BookAppointment from "../pages/operator/BookAppointment";
import PatientManagement from "../pages/operator/PatientManagement";
import DoctorAvailability from "../pages/operator/DoctorAvailability";
import UploadReports from "../pages/operator/UploadReports";
import Profile from "../pages/operator/Profile";
function AppRoutes() {
  return (
    <Routes>
      {/* ====================== Common ====================== */}

      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />

      {/* ====================== Patient ====================== */}

      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/patient/register" element={<PatientRegister />} />

      <Route
        path="/patient/verify-registration-otp"
        element={<VerifyRegistrationOTP />}
      />

      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute role="patient">
            <PatientProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/appointment"
        element={
          <ProtectedRoute role="patient">
            <Appointment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/my-appointments"
        element={
          <ProtectedRoute role="patient">
            <MyAppointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/medical-records"
        element={
          <ProtectedRoute role="patient">
            <MedicalRecords />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/symptom-checker"
        element={
          <ProtectedRoute role="patient">
            <SymptomChecker />
          </ProtectedRoute>
        }
      />

      {/* ====================== Doctor ====================== */}

      <Route path="/doctor/login" element={<DoctorLogin />} />

      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute role="doctor">
            <DoctorProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute role="doctor">
            <DoctorAppointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/patients"
        element={
          <ProtectedRoute role="doctor">
            <DoctorPatients />
          </ProtectedRoute>
        }
      />

      {/* ====================== Admin ====================== */}

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute role="admin">
            <AdminDoctors />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/patients"
        element={
          <ProtectedRoute role="admin">
            <AdminPatients />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute role="admin">
            <AdminAppointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute role="admin">
            <AdminReports />
          </ProtectedRoute>
        }
      />

      {/* ====================== Operator ====================== */}

<Route path="/operator/login" element={<OperatorLogin />} />

<Route
  path="/operator/dashboard"
  element={
    <ProtectedRoute role="operator">
      <OperatorDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/operator/register-patient"
  element={
    <ProtectedRoute role="operator">
      <RegisterPatient />
    </ProtectedRoute>
  }
/>

<Route
  path="/operator/book-appointment"
  element={
    <ProtectedRoute role="operator">
      <BookAppointment />
    </ProtectedRoute>
  }
/>

<Route
  path="/operator/appointments"
  element={
    <ProtectedRoute role="operator">
      <AppointmentList />
    </ProtectedRoute>
  }
/>

<Route
  path="/operator/patients"
  element={
    <ProtectedRoute role="operator">
      <PatientManagement />
    </ProtectedRoute>
  }
/>

<Route
  path="/operator/doctor-availability"
  element={
    <ProtectedRoute role="operator">
      <DoctorAvailability />
    </ProtectedRoute>
  }
/>

<Route
  path="/operator/upload-report"
  element={
    <ProtectedRoute role="operator">
      <UploadReports />
    </ProtectedRoute>
  }
/>

<Route
  path="/operator/profile"
  element={
    <ProtectedRoute role="operator">
      <Profile />
    </ProtectedRoute>
  }
/>

      {/* ====================== 404 ====================== */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;