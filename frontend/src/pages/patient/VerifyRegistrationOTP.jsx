import { useEffect, useRef, useState } from "react";
import { Building2 } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Register.css";

function VerifyRegistrationOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  // Backend now uses phone only
  const phone = location.state?.phone || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputs = useRef([]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (!phone) {
      toast.error("Please register using your mobile number first.");
      navigate("/patient/register", { replace: true });
    }
  }, [phone, navigate]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      return toast.error("Please enter the 6-digit OTP.");
    }

    try {
      setLoading(true);

      const { data } = await api.post(
        "/patient/verify-registration-otp",
        {
          phone,
          otp: otpValue,
        }
      );

      if (data.success) {
        toast.success(data.message);

        navigate("/patient/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "OTP Verification Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);

      const { data } = await api.post(
        "/patient/resend-registration-otp",
        {
          phone,
        }
      );

      if (data.success) {
        toast.success(data.message);

        setTimer(60);
        setOtp(["", "", "", "", "", ""]);

        inputs.current[0]?.focus();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to resend OTP"
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h1>
          <Building2 size={20} />
          AI Hospital
        </h1>

        <h2>Verify Mobile Number</h2>

        <p className="otp-text">
          We've sent a verification code to
          <br />
          <strong>{phone}</strong>
        </p>

        <form onSubmit={handleVerify}>

          <div className="otp-boxes">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                className="otp-box"
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
              />
            ))}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <div className="otp-timer">
          {timer > 0 ? (
            <p>
              Resend OTP in <strong>{timer}s</strong>
            </p>
          ) : (
            <button
              type="button"
              className="resend-btn"
              onClick={handleResend}
              disabled={resendLoading}
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        <div className="login-link">
          <Link to="/patient/register">
            ← Back to Register
          </Link>
        </div>

      </div>
    </div>
  );
}

export default VerifyRegistrationOTP;