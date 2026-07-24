import ProtectedLayout from "../components/ProtectedLayout";
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
  element={
    <ProtectedRoute role="patient">
      <ProtectedLayout />
    </ProtectedRoute>
  }
>
  <Route path="/patient/dashboard" element={<PatientDashboard />} />
  <Route path="/patient/profile" element={<PatientProfile />} />
  <Route path="/patient/appointment" element={<Appointment />} />
  <Route path="/patient/my-appointments" element={<MyAppointments />} />
  <Route path="/patient/medical-records" element={<MedicalRecords />} />
  <Route path="/patient/symptom-checker" element={<SymptomChecker />} />
</Route>

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

      /<Route
  element={
    <ProtectedRoute role="doctor">
      <ProtectedLayout />
    </ProtectedRoute>
  }
>
  <Route path="/doctor/profile" element={<DoctorProfile />} />
  <Route path="/doctor/appointments" element={<DoctorAppointments />} />
  <Route path="/doctor/patients" element={<DoctorPatients />} />
</Route>

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
  element={
    <ProtectedRoute role="admin">
      <ProtectedLayout />
    </ProtectedRoute>
  }
>
  <Route path="/admin/doctors" element={<AdminDoctors />} />
  <Route path="/admin/patients" element={<AdminPatients />} />
  <Route path="/admin/appointments" element={<AdminAppointments />} />
  <Route path="/admin/reports" element={<AdminReports />} />
</Route>
     
      

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
  element={
    <ProtectedRoute role="operator">
      <ProtectedLayout />
    </ProtectedRoute>
  }
>
  <Route path="/operator/register-patient" element={<RegisterPatient />} />
  <Route path="/operator/book-appointment" element={<BookAppointment />} />
  <Route path="/operator/appointments" element={<AppointmentList />} />
  <Route path="/operator/patients" element={<PatientManagement />} />
  <Route path="/operator/doctor-availability" element={<DoctorAvailability />} />
  <Route path="/operator/upload-report" element={<UploadReports />} />
  <Route path="/operator/profile" element={<Profile />} />
</Route>



      {/* ====================== 404 ====================== */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;