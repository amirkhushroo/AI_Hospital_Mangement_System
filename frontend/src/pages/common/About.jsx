import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Ambulance,
  Brain,
  Building2,
  CalendarDays,
  FileText,
  Stethoscope,
} from "lucide-react";
import "./About.css";
import aboutBg from "../../assets/about-bg.jpg";

function About() {
  const doctors = [
    {
      name: "Dr. Rahul Sharma",
      qualification: "MBBS, MD (Cardiology)",
      experience: "12 Years",
      hospital: "AI Hospital",
      specialization: "Cardiologist",
    },
    {
      name: "Dr. Priya Singh",
      qualification: "MBBS, MS (Neurology)",
      experience: "10 Years",
      hospital: "AI Hospital",
      specialization: "Neurologist",
    },
    {
      name: "Dr. Amit Kumar",
      qualification: "MBBS, MS (Orthopedics)",
      experience: "15 Years",
      hospital: "AI Hospital",
      specialization: "Orthopedic",
    },
  ];
  const [activeIndex, setActiveIndex] = useState(null);

const features = [
  {
    icon: Brain,
    title: "AI Based Diagnosis",
    description:
      "Analyze patient symptoms using AI and receive intelligent disease predictions along with department recommendations.",
    points: [
      "Symptom Analysis",
      "Disease Prediction",
      "Department Recommendation",
      "Suggested Tests",
    ],
  },
  {
    icon: CalendarDays,
    title: "Easy Appointment Booking",
    description:
      "Book appointments quickly without waiting in long queues.",
    points: [
      "Instant Booking",
      "Doctor Availability",
      "Appointment History",
      "Reschedule Anytime",
    ],
  },
  {
    icon: Stethoscope,
    title: "Expert Doctors",
    description:
      "Consult experienced and verified healthcare professionals.",
    points: [
      "Verified Specialists",
      "Multiple Departments",
      "Doctor Profiles",
      "Experienced Staff",
    ],
  },
  {
    icon: FileText,
    title: "Secure Medical Records",
    description:
      "Patient records are securely stored and accessible anytime.",
    points: [
      "Encrypted Storage",
      "Medical History",
      "Prescriptions",
      "Lab Reports",
    ],
  },
  {
    icon: Building2,
    title: "Modern Healthcare",
    description:
      "A complete digital healthcare platform for patients and hospitals.",
    points: [
      "Paperless System",
      "AI Integration",
      "Fast Workflow",
      "Cloud Storage",
    ],
  },
  {
    icon: Ambulance,
    title: "24×7 Emergency Support",
    description:
      "Emergency healthcare support whenever you need it.",
    points: [
      "Quick Response",
      "Emergency Contact",
      "Priority Treatment",
      "24/7 Availability",
    ],
  },
];

  return (
    <div
      className="about-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0,20,40,0.55), rgba(0,20,40,0.55)), url(${aboutBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Hero Section */}

      <section className="hero">
        <h1>
          <Building2 size={24} /> AI Powered Hospital Management System
        </h1>

        <p>
          Book appointments, consult expert doctors, analyze symptoms
          using Artificial Intelligence and manage your healthcare
          digitally.
        </p>
      </section>

      {/* About */}

      <section className="about-section">
        <h2>About Our Hospital</h2>

        <p>
          AI Hospital Management System is a modern healthcare platform
          developed using the MERN Stack with Artificial Intelligence.
          Patients can book appointments, consult doctors, analyze
          symptoms using AI and securely manage medical records.
        </p>
      </section>

      {/* Services */}

      <section className="services">
        <h2>Our Services</h2>

        <div className="service-grid">
          <div className="service-card">
            <Brain size={28} />
            <h3>AI Symptom Checker</h3>
            <p>Analyze your symptoms using AI.</p>
          </div>

          <div className="service-card">
            <CalendarDays size={28} />
            <h3>Appointment Booking</h3>
            <p>Book appointments online.</p>
          </div>

          <div className="service-card">
            <Stethoscope size={28} />
            <h3>Expert Doctors</h3>
            <p>Consult experienced specialists.</p>
          </div>

          <div className="service-card">
            <FileText size={28} />
            <h3>Medical Records</h3>
            <p>Access reports anytime.</p>
          </div>
        </div>
      </section>

      {/* Doctors */}

      <section className="doctor-section">
        <h2>Our Doctors</h2>

        <div className="doctor-grid">
          {doctors.map((doctor, index) => (
            <div className="doctor-card" key={index}>
              <h3>{doctor.name}</h3>

              <p>
                <strong>{doctor.specialization}</strong>
              </p>

              <p>{doctor.qualification}</p>

              <p>Experience : {doctor.experience}</p>

              <p>{doctor.hospital}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}

      <section className="why-us">
        <h2>Why Choose Us?</h2>

       <div className="feature-list">

  {features.map((feature, index) => {

    const Icon = feature.icon;

    return (

      <div
        key={index}
        className={`feature-card ${
          activeIndex === index ? "active" : ""
        }`}
        onClick={() =>
          setActiveIndex(
            activeIndex === index ? null : index
          )
        }
      >

        <div className="feature-header">

          <div className="feature-title">

            <Icon size={22} />

            <span>{feature.title}</span>

          </div>

          <ChevronDown
  size={26}
  className={`feature-arrow ${activeIndex === index ? "rotate" : ""}`}
/>
        </div>

        <div className="feature-content">

          <p>{feature.description}</p>

          <div className="feature-grid">

            {feature.points.map((point, i) => (

              <div key={i} className="feature-point">

                ✓ {point}

              </div>

            ))}

          </div>

        </div>

      </div>

    );

  })}

</div>
      </section>
    </div>
  );
}

export default About;