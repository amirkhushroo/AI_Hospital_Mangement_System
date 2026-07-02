import "./About.css";

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

  return (
    <div className="about-container">

      <section className="hero">

        <h1>🏥 AI Powered Hospital Management System</h1>

        <p>
          Book appointments, consult expert doctors, analyze symptoms
          using Artificial Intelligence and manage your healthcare
          digitally.
        </p>

      </section>

      <section className="about-section">

        <h2>About Our Hospital</h2>

        <p>
          AI Hospital Management System is a modern healthcare platform
          developed using the MERN Stack with Artificial Intelligence.
          Patients can book appointments, consult doctors, analyze
          symptoms using AI and securely manage medical records.
        </p>

      </section>

      <section className="services">

        <h2>Our Services</h2>

        <div className="service-grid">

          <div className="service-card">
            🤖
            <h3>AI Symptom Checker</h3>
            <p>Analyze your symptoms using AI.</p>
          </div>

          <div className="service-card">
            📅
            <h3>Appointment Booking</h3>
            <p>Book appointments online.</p>
          </div>

          <div className="service-card">
            👨‍⚕️
            <h3>Expert Doctors</h3>
            <p>Consult experienced specialists.</p>
          </div>

          <div className="service-card">
            📄
            <h3>Medical Records</h3>
            <p>Access reports anytime.</p>
          </div>

        </div>

      </section>

      <section className="doctor-section">

        <h2>Our Doctors</h2>

        <div className="doctor-grid">

          {doctors.map((doctor, index) => (

            <div className="doctor-card" key={index}>

              <h3>{doctor.name}</h3>

              <p><strong>{doctor.specialization}</strong></p>

              <p>{doctor.qualification}</p>

              <p>Experience : {doctor.experience}</p>

              <p>{doctor.hospital}</p>

            </div>

          ))}

        </div>

      </section>

      <section className="why-us">

        <h2>Why Choose Us?</h2>

        <ul>
          <li>✅ AI Based Diagnosis</li>
          <li>✅ Easy Appointment Booking</li>
          <li>✅ Expert Doctors</li>
          <li>✅ Secure Medical Records</li>
          <li>✅ Modern Healthcare</li>
          <li>✅ 24×7 Support</li>
        </ul>

      </section>

    </div>
  );
}

export default About;