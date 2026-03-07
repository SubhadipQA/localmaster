import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // clear error on type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/auth/login", formData);
      const { token, user } = res.data;

      // Save to context + localStorage
      login(user, token);

      // Redirect based on role
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "provider") navigate("/provider/dashboard");
      else navigate("/customer/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #EFF6FF 0%, #fff 60%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .input-field {
          width: 100%;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: border 0.2s;
          background: #fff;
          color: #0F172A;
        }
        .input-field:focus { border-color: #3B82F6; }
        .btn-primary {
          width: 100%;
          background: #2563EB;
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: 0.01em;
        }
        .btn-primary:hover:not(:disabled) {
          background: #1D4ED8;
          transform: translateY(-1px);
        }
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: 10, marginBottom: 32,
        }}>
          <div style={{
            width: 38, height: 38, background: "#2563EB",
            borderRadius: 10, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>🔧</div>
          <span style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 24, color: "#0F172A",
          }}>LocalMaster</span>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 8px 40px rgba(37,99,235,0.10)",
          padding: "40px 36px",
          border: "1px solid #EFF6FF",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 28, color: "#0F172A", marginBottom: 8,
            }}>Welcome Back</h1>
            <p style={{ color: "#64748B", fontSize: 15 }}>
              Login to your LocalMaster account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span>❌</span>
              <span style={{ color: "#DC2626", fontSize: 14 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label className="label">Email Address</label>
              <input
                className="input-field"
                type="email"
                name="email"
                placeholder="rahul@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: 48 }}
                />
                {/* Show/Hide password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    cursor: "pointer", fontSize: 18,
                    color: "#94A3B8",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center",
            gap: 12, margin: "24px 0",
          }}>
            <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
            <span style={{ color: "#94A3B8", fontSize: 13 }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
          </div>

          {/* Register Link */}
          <p style={{ textAlign: "center", fontSize: 14, color: "#64748B" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{
              color: "#2563EB", fontWeight: 600,
              textDecoration: "none",
            }}>
              Create Account
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14 }}>
          <Link to="/" style={{
            color: "#64748B", textDecoration: "none",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.target.style.color = "#2563EB"}
            onMouseLeave={e => e.target.style.color = "#64748B"}
          >
            ← Back to Home
          </Link>
        </p>

      </div>
    </div>
  );
}
