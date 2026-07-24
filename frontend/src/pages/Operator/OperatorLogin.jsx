import { useEffect, useRef, useState } from "react";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./OperatorLogin.css";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://your-backend-url.com";

/* ===========================
   Liquid Chrome Background
=========================== */

const LiquidChrome = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });

    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    const vertex = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position,0.0,1.0);
      }
    `;

    const fragment = `
      precision highp float;

      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec3 uBaseColor;
      uniform float uAmplitude;
      uniform float uFrequencyX;
      uniform float uFrequencyY;
      uniform vec2 uMouse;

      varying vec2 vUv;

      vec4 renderImage(vec2 uvCoord){

        vec2 fragCoord = uvCoord*uResolution.xy;

        vec2 uv=(2.0*fragCoord-uResolution.xy)/min(uResolution.x,uResolution.y);

        for(float i=1.0;i<10.0;i++){
            uv.x+=uAmplitude/i*cos(i*uFrequencyX*uv.y+uTime+uMouse.x*3.14159);
            uv.y+=uAmplitude/i*cos(i*uFrequencyY*uv.x+uTime+uMouse.y*3.14159);
        }

        vec2 diff=uvCoord-uMouse;
        float dist=length(diff);
        float falloff=exp(-dist*20.0);

        float ripple=sin(10.0*dist-uTime*2.0)*0.03;

        uv+=(diff/(dist+0.0001))*ripple*falloff;

        vec3 color=uBaseColor/abs(sin(uTime-uv.y-uv.x));

        return vec4(color,1.0);
      }

      void main(){

        vec4 col=vec4(0.0);

        int samples=0;

        for(int i=-1;i<=1;i++){
          for(int j=-1;j<=1;j++){

            vec2 offset=vec2(float(i),float(j))*(1.0/min(uResolution.x,uResolution.y));

            col+=renderImage(vUv+offset);

            samples++;

          }
        }

        gl_FragColor=col/float(samples);

      }
    `;

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Float32Array([1, 1, 1]) },
        uBaseColor: { value: new Float32Array([0.05, 0.35, 0.95]) },
        uAmplitude: { value: 0.55 },
        uFrequencyX: { value: 2.6 },
        uFrequencyY: { value: 1.7 },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);

      const resolution = program.uniforms.uResolution.value;

      resolution[0] = gl.canvas.width;
      resolution[1] = gl.canvas.height;
      resolution[2] = gl.canvas.width / gl.canvas.height;
    };

    const updateMouse = (x, y) => {
      const mouse = program.uniforms.uMouse.value;

      mouse[0] = x / window.innerWidth;
      mouse[1] = 1 - y / window.innerHeight;
    };

    const handleMouseMove = (e) => updateMouse(e.clientX, e.clientY);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    resize();

    let animationId;

    const update = (time) => {
      animationId = requestAnimationFrame(update);

      program.uniforms.uTime.value = time * 0.00085;

      renderer.render({ scene: mesh });
    };

    container.appendChild(gl.canvas);

    animationId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);

      if (gl.canvas.parentElement) {
        gl.canvas.parentElement.removeChild(gl.canvas);
      }

      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div
      className="liquid-chrome-background"
      ref={containerRef}
    />
  );
};

/* ===========================
   Operator Login
=========================== */

const OperatorLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/operator/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("operatorToken", data.token);

        localStorage.setItem(
          "operator",
          JSON.stringify(data.operator)
        );

        alert("Login Successful");

        navigate("/operator/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <LiquidChrome />

      <div className="login-glass-overlay" />

      <div className="login-card">
        <h1>
          <Building2 size={22} />
          MED-Connect Hospital
        </h1>

        <h2>Operator Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Enter Email or Mobile Number"
            value={formData.identifier}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OperatorLogin;