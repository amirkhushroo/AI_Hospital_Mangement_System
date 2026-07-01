import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const handleAppointment = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/patient/appointment");
    } else {
      navigate("/patient/login");
    }
  };

  const handleSymptomChecker = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/patient/symptom-checker");
    } else {
      navigate("/patient/login");
    }
  };

  return (
    <>
      <Navbar />

      {/* ================= HERO SECTION ================= */}

      <section className="hero-section">

        <div className="hero-left">

          <span className="hero-tag">
            🤖 AI Powered Smart Healthcare
          </span>

          <h1>
            Your Health,
            <br />
            Our Intelligence.
          </h1>

          <p>
            Experience the future of healthcare with Artificial Intelligence.
            Instantly analyze symptoms, connect with verified doctors,
            manage appointments, and access your medical records from
            anywhere.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={handleAppointment}
            >
              Book Appointment
            </button>

            <button
              className="secondary-btn"
              onClick={handleSymptomChecker}
            >
              AI Symptom Checker
            </button>

          </div>

        </div>

        <div className="hero-right">

          <div className="doctor-card">

            <div className="doctor-image">
              👨‍⚕️
            </div>

            <h3>AI Healthcare Assistant</h3>

            <p>
              24/7 Intelligent Medical Support
            </p>

          </div>

          <div className="floating-card card-one">
            ❤️ Heart Monitoring
          </div>

          <div className="floating-card card-two">
            🤖 AI Diagnosis
          </div>

          <div className="floating-card card-three">
            🩺 100+ Doctors
          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="stats-section">

        <div className="stat-card">
          <h2>100+</h2>
          <p>Expert Doctors</p>
        </div>

        <div className="stat-card">
          <h2>10K+</h2>
          <p>Happy Patients</p>
        </div>

        <div className="stat-card">
          <h2>98%</h2>
          <p>AI Accuracy</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>Emergency Support</p>
        </div>

      </section>

      {/* ================= AI PREVIEW ================= */}

      <section className="ai-preview">

        <div className="ai-left">

          <span className="section-tag">
            Artificial Intelligence
          </span>

          <h2>
            AI Symptom Checker
          </h2>

          <p>
            Enter your symptoms in natural language and let our AI
            analyze possible conditions, recommend specialists,
            provide precautions, and guide your next steps.
          </p>

          <button
            className="primary-btn"
            onClick={handleSymptomChecker}
          >
            Try AI Diagnosis
          </button>

        </div>

        <div className="ai-right">

          <div className="ai-box">

            <h4>Describe Symptoms</h4>

            <textarea
  placeholder="Example: Fever, headache, sore throat..."
/>

<button
  className="primary-btn"
  onClick={handleSymptomChecker}
>
  Analyze with AI
</button>

          </div>

        </div>

      </section>

      {/* ================= SERVICES ================= */}
       <section className="services-section">

        <div className="section-header">
          <span className="section-tag">Our Healthcare Services</span>
          <h2>Everything You Need In One Platform</h2>
          <p>
            AI-powered healthcare with verified doctors, online appointments,
            digital medical records, and secure patient management.
          </p>
        </div>

        <div className="services-grid">

          <div className="service-card">
            <div className="service-icon">🤖</div>
            <h3>AI Symptom Checker</h3>
            <p>
              Describe your symptoms and receive AI-powered disease prediction,
              precautions, and doctor recommendations.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">👨‍⚕️</div>
            <h3>Expert Doctors</h3>
            <p>
              Consult experienced doctors from multiple specialties with
              verified profiles.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">📅</div>
            <h3>Easy Appointments</h3>
            <p>
              Book appointments online without waiting in long hospital queues.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">📄</div>
            <h3>Medical Records</h3>
            <p>
              Store prescriptions, reports and previous consultations securely.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">🚑</div>
            <h3>Emergency Support</h3>
            <p>
              Get quick access to emergency healthcare whenever you need it.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">🔒</div>
            <h3>Secure Platform</h3>
            <p>
              Your healthcare data is encrypted and protected using modern
              security practices.
            </p>
          </div>

        </div>

      </section>

      {/* ================= FEATURED DOCTORS ================= */}

      <section className="doctors-section">

        <div className="section-header">
          <span className="section-tag">Meet Our Specialists</span>
          <h2>Featured Doctors</h2>
        </div>

        <div className="doctor-grid">

          <div className="doctor-profile">
            <div className="doctor-avatar">👨‍⚕️</div>
            <h3>Cardiologist</h3>
            <p>Heart Specialist</p>
            <button onClick={handleAppointment}>
              Book Appointment
            </button>
          </div>

          <div className="doctor-profile">
            <div className="doctor-avatar">👩‍⚕️</div>
            <h3>Neurologist</h3>
            <p>Brain Specialist</p>
            <button onClick={handleAppointment}>
              Book Appointment
            </button>
          </div>

          <div className="doctor-profile">
            <div className="doctor-avatar">🧑‍⚕️</div>
            <h3>Dermatologist</h3>
            <p>Skin Specialist</p>
            <button onClick={handleAppointment}>
              Book Appointment
            </button>
          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="steps-section">

        <div className="section-header">
          <span className="section-tag">Simple Process</span>
          <h2>How It Works</h2>
        </div>

        <div className="steps-grid">

          <div className="step-card">
            <span>1</span>
            <h3>Describe Symptoms</h3>
            <p>Enter your symptoms using natural language.</p>
          </div>

          <div className="step-card">
            <span>2</span>
            <h3>AI Analysis</h3>
            <p>Our AI analyzes possible diseases and precautions.</p>
          </div>

          <div className="step-card">
            <span>3</span>
            <h3>Choose Doctor</h3>
            <p>Select the most suitable specialist.</p>
          </div>

          <div className="step-card">
            <span>4</span>
            <h3>Book Appointment</h3>
            <p>Confirm your appointment in seconds.</p>
          </div>

        </div>

      </section>

      {/* ================= TESTIMONIALS ================= */}

      <section className="testimonial-section">

        <div className="section-header">
          <span className="section-tag">Patient Reviews</span>
          <h2>What Patients Say</h2>
        </div>

        <div className="testimonial-grid">

          <div className="testimonial-card">
            ⭐⭐⭐⭐⭐
            <p>
              The AI diagnosis helped me understand my condition before meeting
              a doctor. Amazing experience.
            </p>
            <h4>Rahul Sharma</h4>
          </div>

          <div className="testimonial-card">
            ⭐⭐⭐⭐⭐
            <p>
              Booking appointments has never been this easy. The interface is
              clean and simple.
            </p>
            <h4>Priya Verma</h4>
          </div>

          <div className="testimonial-card">
            ⭐⭐⭐⭐⭐
            <p>
              Doctors were professional and the AI suggestions were very
              helpful.
            </p>
            <h4>Aman Khan</h4>
          </div>

        </div>

      </section>

      {/* ================= EMERGENCY ================= */}

      <section className="emergency-section">

        <h2>Need Emergency Medical Assistance?</h2>

        <p>
          Our healthcare platform is available 24 hours a day for urgent
          appointments and AI-powered assistance.
        </p>

        <button
          className="primary-btn"
          onClick={handleAppointment}
        >
          Book Emergency Appointment
        </button>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div>

          <h3>🏥 AI Hospital</h3>

          <p>
            Smart Healthcare Powered by Artificial Intelligence.
          </p>

        </div>

        <div>

          <h4>Quick Links</h4>

          <p>Home</p>
          <p>About</p>
          <p>Doctors</p>
          <p>Appointments</p>

        </div>

        <div>

          <h4>Contact</h4>

          <p>support@aihospital.com</p>
          <p>+91 98765 43210</p>

        </div>

      </footer>

    </>
  );
}

export default Home;