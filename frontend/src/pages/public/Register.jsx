import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    phone: "",
    role: "customer", // default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/auth/register", formData);
      const { token, user } = res.data;

      // Save to context + localStorage
      login(user, token);

      // Redirect based on role
      if (user.role === "provider") navigate("/provider/dashboard");
      else navigate("/customer/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
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
        .role-card {
          flex: 1;
          border: 2px solid #E2E8F0;
          borderRadius: 12px;
          padding: 16px 12px;
          cursor: pointer;
          transition: all 0.2s;
          background: #fff;
          text-align: center;
        }
        .role-card:hover {
          border-color: #93C5FD;
          background: #EFF6FF;
        }
        .role-card.active {
          border-color: #2563EB;
          background: #EFF6FF;
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: 480 }}>

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
            }}>Create Account</h1>
            <p style={{ color: "#64748B", fontSize: 15 }}>
              Join LocalMaster today
            </p>
          </div>

          {/* Role Selection */}
          <div style={{ marginBottom: 24 }}>
            <label className="label" style={{ marginBottom: 10 }}>
              I want to
            </label>
            <div style={{ display: "flex", gap: 12 }}>

              {/* Customer Card */}
              <div
                onClick={() => handleRoleSelect("customer")}
                style={{
                  flex: 1,
                  border: `2px solid ${formData.role === "customer" ? "#2563EB" : "#E2E8F0"}`,
                  borderRadius: 12,
                  padding: "16px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: formData.role === "customer" ? "#EFF6FF" : "#fff",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>👤</div>
                <div style={{
                  fontWeight: 600, fontSize: 14,
                  color: formData.role === "customer" ? "#2563EB" : "#0F172A",
                }}>
                  Book Services
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                  I'm a customer
                </div>
                {formData.role === "customer" && (
                  <div style={{
                    marginTop: 8, fontSize: 12,
                    color: "#2563EB", fontWeight: 600,
                  }}>✓ Selected</div>
                )}
              </div>

              {/* Provider Card */}
              <div
                onClick={() => handleRoleSelect("provider")}
                style={{
                  flex: 1,
                  border: `2px solid ${formData.role === "provider" ? "#2563EB" : "#E2E8F0"}`,
                  borderRadius: 12,
                  padding: "16px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: formData.role === "provider" ? "#EFF6FF" : "#fff",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>🔧</div>
                <div style={{
                  fontWeight: 600, fontSize: 14,
                  color: formData.role === "provider" ? "#2563EB" : "#0F172A",
                }}>
                  Provide Services
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                  I'm a professional
                </div>
                {formData.role === "provider" && (
                  <div style={{
                    marginTop: 8, fontSize: 12,
                    color: "#2563EB", fontWeight: 600,
                  }}>✓ Selected</div>
                )}
              </div>

            </div>
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

            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <label className="label">Full Name</label>
              <input
                className="input-field"
                type="text"
                name="name"
                placeholder="Rahul Kumar"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
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
            <div style={{ marginBottom: 16 }}>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  style={{ paddingRight: 48 }}
                />
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

            {/* City + Phone — 2 columns */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12, marginBottom: 24,
            }}>
              <div>
                <label className="label">City</label>
                <input
                  className="input-field"
                  type="text"
                  name="city"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  className="input-field"
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Provider note */}
            {formData.role === "provider" && (
              <div style={{
                background: "#FFF7ED",
                border: "1px solid #FED7AA",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 20,
                fontSize: 13,
                color: "#92400E",
              }}>
                ⚠️ Provider accounts need admin approval before appearing in listings.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account →"}
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

          {/* Login Link */}
          <p style={{ textAlign: "center", fontSize: 14, color: "#64748B" }}>
            Already have an account?{" "}
            <Link to="/login" style={{
              color: "#2563EB", fontWeight: 600,
              textDecoration: "none",
            }}>
              Login
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14 }}>
          <Link to="/" style={{
            color: "#64748B", textDecoration: "none",
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
