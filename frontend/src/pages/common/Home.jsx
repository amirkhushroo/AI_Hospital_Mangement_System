import Navbar from "../../components/Navbar/Navbar";
import BlurText from "../../components/BlurText";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import hospitalBg from "../../assets/about-bg.jpg";
import {
  Activity,
  Ambulance,
  Award,
  Bot,
  BrainCircuit,
  Building2,
  CalendarCheck2,
  Clock3,
  FileText,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Home.css";

const LiquidChrome = ({
  baseColor = [0.1, 0.2, 0.6196078431372549],
  speed = 1,
  amplitude = 0.6,
  frequencyX = 2.5,
  frequencyY = 1.5,
  interactive = true,
  className = "",
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ antialias: true });
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    const vertexShader = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec3 uBaseColor;
      uniform float uAmplitude;
      uniform float uFrequencyX;
      uniform float uFrequencyY;
      uniform vec2 uMouse;
      varying vec2 vUv;

      vec4 renderImage(vec2 uvCoord) {
          vec2 fragCoord = uvCoord * uResolution.xy;
          vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

          for (float i = 1.0; i < 10.0; i++){
              uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
              uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
          }

          vec2 diff = (uvCoord - uMouse);
          float dist = length(diff);
          float falloff = exp(-dist * 20.0);
          float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
          uv += (diff / (dist + 0.0001)) * ripple * falloff;

          vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
          return vec4(color, 1.0);
      }

      void main() {
          vec4 col = vec4(0.0);
          int samples = 0;
          for (int i = -1; i <= 1; i++){
              for (int j = -1; j <= 1; j++){
                  vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
                  col += renderImage(vUv + offset);
                  samples++;
              }
          }
          gl_FragColor = col / float(samples);
      }
    `;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Float32Array([gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height]),
        },
        uBaseColor: { value: new Float32Array(baseColor) },
        uAmplitude: { value: amplitude },
        uFrequencyX: { value: frequencyX },
        uFrequencyY: { value: frequencyY },
        uMouse: { value: new Float32Array([0, 0]) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      const resUniform = program.uniforms.uResolution.value;
      resUniform[0] = gl.canvas.width;
      resUniform[1] = gl.canvas.height;
      resUniform[2] = gl.canvas.width / gl.canvas.height;
    };

    window.addEventListener("resize", resize);
    resize();

    const updateMouse = (x, y) => {
      const mouseUniform = program.uniforms.uMouse.value;
      mouseUniform[0] = x;
      mouseUniform[1] = y;
    };

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      updateMouse(x, y);
    };

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = 1 - (touch.clientY - rect.top) / rect.height;
        updateMouse(x, y);
      }
    };

    if (interactive) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("touchmove", handleTouchMove);
    }

    let animationId;
    const update = (t) => {
      animationId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001 * speed;
      renderer.render({ scene: mesh });
    };
    animationId = requestAnimationFrame(update);

    container.appendChild(gl.canvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      if (interactive) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("touchmove", handleTouchMove);
      }
      if (gl.canvas.parentElement) {
        gl.canvas.parentElement.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [baseColor, speed, amplitude, frequencyX, frequencyY, interactive]);

  return <div ref={containerRef} className={`liquidChrome-container ${className}`.trim()} />;
};

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

      <motion.section
         className="hero-section"
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <LiquidChrome
          className="liquid-chrome-bg"
          baseColor={[0.05, 0.35, 0.95]}
          speed={0.85}
          amplitude={0.55}
          frequencyX={2.6}
          frequencyY={1.7}
          interactive={true}
        />
        <div className="hero-backdrop" aria-hidden="true" />

        <div className="hero-content">
          <div className="hero-left">

            <span className="hero-tag">
              <Sparkles size={16} /> AI Powered Hospital Management System
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
                <Stethoscope size={96} strokeWidth={1.8} />
              </div>

              <h3>AI Healthcare Assistant</h3>

              <p>
                24/7 Intelligent Medical Support
              </p>

            </div>

            <div className="floating-card card-one">
              <span className="floating-icon"><HeartPulse size={16} /></span>
              Heart Monitoring
            </div>

            <div className="floating-card card-two">
              <span className="floating-icon"><Bot size={16} /></span>
              AI Diagnosis
            </div>

          </div>
        </div>

      </motion.section>

      {/* ================= STATS ================= */}

      <section className="hospital-section">

  <div className="hospital-image-container">

    <img
      src={hospitalBg}
      alt="MED Connect Hospital"
      className="hospital-image"
    />

  </div>

</section>

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

        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="section-tag">Our Healthcare Services</span>
          <h2>Everything You Need In One Platform</h2>
          <p>
            AI-powered healthcare with verified doctors, online appointments,
            digital medical records, and secure patient management.
          </p>
        </motion.div>

        <div className="services-grid">

          <motion.div
            className="service-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
            whileHover={{ y: -10, scale: 1.01 }}
          >
            <div className="service-icon"><BrainCircuit size={32} /></div>
            <h3>AI Symptom Checker</h3>
            <p>
              Describe your symptoms and receive AI-powered disease prediction,
              precautions, and doctor recommendations.
            </p>
          </motion.div>

          <motion.div
            className="service-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
            whileHover={{ y: -10, scale: 1.01 }}
          >
            <div className="service-icon"><Users size={32} /></div>
            <h3>Expert Doctors</h3>
            <p>
              Consult experienced doctors from multiple specialties with
              verified profiles.
            </p>
          </motion.div>

          <motion.div
            className="service-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
            whileHover={{ y: -10, scale: 1.01 }}
          >
            <div className="service-icon"><CalendarCheck2 size={32} /></div>
            <h3>Easy Appointments</h3>
            <p>
              Book appointments online without waiting in long hospital queues.
            </p>
          </motion.div>

          <motion.div
            className="service-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
            whileHover={{ y: -10, scale: 1.01 }}
          >
            <div className="service-icon"><FileText size={32} /></div>
            <h3>Medical Records</h3>
            <p>
              Store prescriptions, reports and previous consultations securely.
            </p>
          </motion.div>

          <motion.div
            className="service-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.25, ease: "easeOut" }}
            whileHover={{ y: -10, scale: 1.01 }}
          >
            <div className="service-icon"><Ambulance size={32} /></div>
            <h3>Emergency Support</h3>
            <p>
              Get quick access to emergency healthcare whenever you need it.
            </p>
          </motion.div>

          <motion.div
            className="service-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.3, ease: "easeOut" }}
            whileHover={{ y: -10, scale: 1.01 }}
          >
            <div className="service-icon"><ShieldCheck size={32} /></div>
            <h3>Secure Platform</h3>
            <p>
              Your healthcare data is encrypted and protected using modern
              security practices.
            </p>
          </motion.div>

        </div>

      </section>

      {/* ================= FEATURED DOCTORS ================= */}

      <section className="doctors-section">

        <div className="section-header">
          <span className="section-tag">Meet Our Specialists</span>
          <h2 className="featured-doctors-heading">
            <BlurText text="Featured Doctors" className="featured-doctors-title" />
          </h2>
        </div>

        <div className="doctor-grid">

          <div className="doctor-profile">
            <div className="doctor-avatar">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80"
                alt="Cardiologist portrait"
              />
            </div>
            <div className="doctor-rating" aria-label="4.9 out of 5 stars">
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <span>4.9</span>
            </div>
            <h3>Cardiologist</h3>
            <p>Heart Specialist</p>
            <div className="doctor-badges">
              <span className="doctor-badge">
                <Award size={14} /> 15+ yrs
              </span>
              <span className="doctor-badge">
                <Building2 size={14} /> CityCare Hospital
              </span>
            </div>
            <button onClick={handleAppointment}>
              Book Appointment
            </button>
          </div>

          <div className="doctor-profile">
            <div className="doctor-avatar">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
                alt="Neurologist portrait"
              />
            </div>
            <div className="doctor-rating" aria-label="4.8 out of 5 stars">
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <span>4.8</span>
            </div>
            <h3>Neurologist</h3>
            <p>Brain Specialist</p>
            <div className="doctor-badges">
              <span className="doctor-badge">
                <Clock3 size={14} /> 12+ yrs
              </span>
              <span className="doctor-badge">
                <Building2 size={14} /> Nova Brain Center
              </span>
            </div>
            <button onClick={handleAppointment}>
              Book Appointment
            </button>
          </div>

          <div className="doctor-profile">
            <div className="doctor-avatar">
              <img
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80"
                alt="Dermatologist portrait"
              />
            </div>
            <div className="doctor-rating" aria-label="4.7 out of 5 stars">
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <span>4.7</span>
            </div>
            <h3>Dermatologist</h3>
            <p>Skin Specialist</p>
            <div className="doctor-badges">
              <span className="doctor-badge">
                <Award size={14} /> 10+ yrs
              </span>
              <span className="doctor-badge">
                <Building2 size={14} /> SkinCare Institute
              </span>
            </div>
            <button onClick={handleAppointment}>
              Book Appointment
            </button>
          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section
  className="steps-section"
  style={{
    opacity: 1,
    visibility: "visible",
    background: "#f8fbff",
    padding: "100px 20px",
  }}
>
  <div
    className="section-header"
    style={{
      opacity: 1,
      visibility: "visible",
      textAlign: "center",
    }}
  >
    <span
      className="section-tag"
      style={{
        opacity: 1,
        color: "#2563eb",
        fontWeight: "600",
      }}
    >
      Simple Process
    </span>

    <h2
      style={{
        opacity: 1,
        color: "#111827",
        fontWeight: "800",
      }}
    >
      How It Works
    </h2>
  </div>

  <div
    className="steps-grid"
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "30px",
      maxWidth: "1200px",
      margin: "50px auto 0",
      opacity: 1,
    }}
  >
    <div
      className="step-card"
      style={{
        background: "#fff",
        padding: "35px 25px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0 12px 30px rgba(0,0,0,.12)",
        opacity: 1,
      }}
    >
      <span
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "70px",
          height: "70px",
          margin: "0 auto 20px",
          borderRadius: "50%",
          background: "#2563eb",
          color: "#fff",
          fontSize: "28px",
          fontWeight: "700",
          opacity: 1,
        }}
      >
        1
      </span>

      <h3 style={{ color: "#111827", opacity: 1 }}>
        Describe Symptoms
      </h3>

      <p style={{ color: "#4b5563", opacity: 1 }}>
        Enter your symptoms using natural language.
      </p>
    </div>

    <div
      className="step-card"
      style={{
        background: "#fff",
        padding: "35px 25px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0 12px 30px rgba(0,0,0,.12)",
        opacity: 1,
      }}
    >
      <span
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "70px",
          height: "70px",
          margin: "0 auto 20px",
          borderRadius: "50%",
          background: "#2563eb",
          color: "#fff",
          fontSize: "28px",
          fontWeight: "700",
        }}
      >
        2
      </span>

      <h3 style={{ color: "#111827" }}>
        AI Analysis
      </h3>

      <p style={{ color: "#4b5563" }}>
        Our AI analyzes possible diseases and precautions.
      </p>
    </div>

    <div
      className="step-card"
      style={{
        background: "#fff",
        padding: "35px 25px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0 12px 30px rgba(0,0,0,.12)",
      }}
    >
      <span
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "70px",
          height: "70px",
          margin: "0 auto 20px",
          borderRadius: "50%",
          background: "#2563eb",
          color: "#fff",
          fontSize: "28px",
          fontWeight: "700",
        }}
      >
        3
      </span>

      <h3 style={{ color: "#111827" }}>
        Choose Doctor
      </h3>

      <p style={{ color: "#4b5563" }}>
        Select the most suitable specialist.
      </p>
    </div>

    <div
      className="step-card"
      style={{
        background: "#fff",
        padding: "35px 25px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0 12px 30px rgba(0,0,0,.12)",
      }}
    >
      <span
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "70px",
          height: "70px",
          margin: "0 auto 20px",
          borderRadius: "50%",
          background: "#2563eb",
          color: "#fff",
          fontSize: "28px",
          fontWeight: "700",
        }}
      >
        4
      </span>

      <h3 style={{ color: "#111827" }}>
        Book Appointment
      </h3>

      <p style={{ color: "#4b5563" }}>
        Confirm your appointment in seconds.
      </p>
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

          <h3><Building2 size={20} /> MED-Connect Hospital</h3>

          <p>
            Smart Healthcare Powered by Artificial Intelligence.
          </p>

        </div>

        <div>
  <h4>Quick Links</h4>

  <p
    style={{ cursor: "pointer" }}
    onClick={() => navigate("/")}
  >
    Home
  </p>

  <p
    style={{ cursor: "pointer" }}
    onClick={() => navigate("/about")}
  >
    About
  </p>

  

  <p
    style={{ cursor: "pointer" }}
    onClick={handleAppointment}
  >
    Appointments
  </p>
</div>

        <div>

          <h4>Contact</h4>

          <p>support@medconnect.com</p>
          <p>+91 98765 43210</p>

        </div>

      </footer>

    </>
  );
}

export default Home;