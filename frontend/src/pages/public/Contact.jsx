import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";

export default function Contact() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/contact", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SUBJECTS = [
    "General Inquiry",
    "Booking Issue",
    "Provider Complaint",
    "Payment Issue",
    "Become a Provider",
    "Other",
  ];

  const CONTACT_INFO = [
    { icon: "📍", title: "Address", value: "123 LocalMaster Lane, Mumbai, India" },
    { icon: "📧", title: "Email", value: "support@localmaster.in" },
    { icon: "📞", title: "Phone", value: "+91 98765 43210" },
    { icon: "🕐", title: "Working Hours", value: "Mon–Sat, 9AM – 6PM" },
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      minHeight: "100vh",
      background: "#F8FAFC",
      color: "#0F172A",
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
        .label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        .btn-primary {
          width: 100%;
          background: #2563EB; color: #fff;
          border: none; padding: 14px;
          border-radius: 10px; font-size: 15px;
          font-weight: 600; cursor: pointer;
          font-family: inherit; transition: background 0.2s;
        }
        .btn-primary:hover:not(:disabled) { background: #1D4ED8; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .info-card {
          display: flex; align-items: flex-start;
          gap: 14; padding: 18px 20px;
          background: #fff; border-radius: 14px;
          border: 1px solid #F1F5F9;
          transition: all 0.2s;
        }
        .info-card:hover {
          border-color: #93C5FD;
          transform: translateX(4px);
        }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #E2E8F0",
        padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 64,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => navigate("/")}>
            <div style={{
              width: 34, height: 34, background: "#2563EB",
              borderRadius: 8, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🔧</div>
            <span style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20, color: "#0F172A",
            }}>LocalMaster</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user ? (
              <>
                <button onClick={() => navigate(`/${user.role}/dashboard`)} style={{
                  background: "#EFF6FF", color: "#2563EB",
                  border: "none", padding: "8px 16px",
                  borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}>Dashboard</button>
                <button onClick={handleLogout} style={{
                  background: "#FEF2F2", color: "#DC2626",
                  border: "none", padding: "8px 14px",
                  borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/login")} style={{
                  background: "transparent", color: "#2563EB",
                  border: "1.5px solid #2563EB", padding: "8px 16px",
                  borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}>Login</button>
                <button onClick={() => navigate("/register")} style={{
                  background: "#2563EB", color: "#fff",
                  border: "none", padding: "8px 16px",
                  borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}>Register</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)",
        padding: "56px 24px", textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 40, color: "#fff", marginBottom: 12,
        }}>Get In Touch</h1>
        <p style={{ color: "#BFDBFE", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
          Have a question or feedback? We'd love to hear from you.
          Our team is here to help!
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        <div className="contact-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 28, alignItems: "start",
        }}>

          {/* LEFT — Form */}
          <div style={{
            background: "#fff", borderRadius: 16,
            border: "1px solid #F1F5F9", padding: "36px",
          }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 24, marginBottom: 6,
            }}>Send us a Message</h2>
            <p style={{ color: "#64748B", fontSize: 14, marginBottom: 28 }}>
              Fill in the form below and we'll respond within 24 hours.
            </p>

            {/* Success */}
            {success && (
              <div style={{
                background: "#F0FDF4", border: "1px solid #86EFAC",
                borderRadius: 12, padding: "20px 24px",
                marginBottom: 24, textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#15803D", marginBottom: 4 }}>
                  Message Sent Successfully!
                </div>
                <p style={{ color: "#64748B", fontSize: 14 }}>
                  We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  style={{
                    marginTop: 16, background: "#2563EB", color: "#fff",
                    border: "none", padding: "8px 20px", borderRadius: 8,
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Send Another Message
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background: "#FEF2F2", border: "1px solid #FECACA",
                borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>❌</span>
                <span style={{ color: "#DC2626", fontSize: 14 }}>{error}</span>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit}>

                {/* Name + Email */}
                <div className="two-col" style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: 16, marginBottom: 18,
                }}>
                  <div>
                    <label className="label">Full Name *</label>
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
                  <div>
                    <label className="label">Email Address *</label>
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
                </div>

                {/* Phone + Subject */}
                <div className="two-col" style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: 16, marginBottom: 18,
                }}>
                  <div>
                    <label className="label">Phone Number</label>
                    <input
                      className="input-field"
                      type="tel"
                      name="phone"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="label">Subject *</label>
                    <select
                      className="input-field"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select subject...</option>
                      {SUBJECTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: 24 }}>
                  <label className="label">Message *</label>
                  <textarea
                    className="input-field"
                    name="message"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message →"}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT — Contact Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Info Cards */}
            <div style={{
              background: "#fff", borderRadius: 16,
              border: "1px solid #F1F5F9", padding: "24px",
            }}>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 20, marginBottom: 20,
              }}>Contact Information</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {CONTACT_INFO.map((info, i) => (
                  <div key={i} className="info-card" style={{
                    display: "flex", alignItems: "flex-start",
                    gap: 14, padding: "16px 18px",
                    background: "#F8FAFC", borderRadius: 12,
                    border: "1px solid #F1F5F9",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "#93C5FD";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "#F1F5F9";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div style={{ fontSize: 24, flexShrink: 0 }}>{info.icon}</div>
                    <div>
                      <div style={{
                        fontSize: 12, fontWeight: 700,
                        color: "#94A3B8", marginBottom: 2,
                        textTransform: "uppercase", letterSpacing: "0.05em",
                      }}>{info.title}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#0F172A" }}>
                        {info.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div style={{
              background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)",
              borderRadius: 16, padding: "24px",
            }}>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 20, color: "#fff", marginBottom: 8,
              }}>Need Quick Help?</h3>
              <p style={{ color: "#BFDBFE", fontSize: 14, marginBottom: 20 }}>
                Browse our providers or check your booking status directly.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={() => navigate("/providers")}
                  style={{
                    background: "#fff", color: "#2563EB",
                    border: "none", padding: "11px 16px",
                    borderRadius: 10, fontSize: 14, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  Browse Providers →
                </button>
                <button
                  onClick={() => navigate(user ? `/${user.role}/dashboard` : "/login")}
                  style={{
                    background: "rgba(255,255,255,0.15)", color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    padding: "11px 16px", borderRadius: 10,
                    fontSize: 14, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                >
                  Track My Booking →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
