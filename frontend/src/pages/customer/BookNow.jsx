import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";

export default function BookNow() {
  const { providerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    scheduledDate: "",
    scheduledTime: "",
    notes: "",
  });

  useEffect(() => {
    fetchProvider();
  }, [providerId]);

  const fetchProvider = async () => {
    try {
      const res = await axios.get(`/providers/${providerId}`);
      setProvider(res.data.provider);
    } catch (err) {
      console.error("Failed to fetch provider", err);
      setError("Provider not found!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Combine date and time
      const scheduledDate = new Date(
        `${formData.scheduledDate}T${formData.scheduledTime || "10:00"}`
      ).toISOString();

      await axios.post("/bookings", {
        providerId,
        address: formData.address,
        scheduledDate,
        notes: formData.notes,
      });

      setSuccess(true);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/customer/dashboard");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh", background: "#F8FAFC",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center", color: "#94A3B8" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
          <p>Loading provider details...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh", background: "#F8FAFC",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28, marginBottom: 8,
          }}>Booking Requested!</h2>
          <p style={{ color: "#64748B", marginBottom: 4 }}>
            Your booking has been sent to the provider.
          </p>
          <p style={{ color: "#94A3B8", fontSize: 14 }}>
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

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
          background: #2563EB;
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
        }
        .btn-primary:hover:not(:disabled) { background: #1D4ED8; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (max-width: 768px) {
          .book-grid { grid-template-columns: 1fr !important; }
          .date-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
        padding: "0 24px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 64,
        }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
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
            <button
              onClick={() => navigate("/providers")}
              style={{
                background: "#F1F5F9", color: "#475569",
                border: "none", padding: "8px 16px",
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              ← Back to Providers
            </button>
            <button
              onClick={() => navigate("/customer/dashboard")}
              style={{
                background: "#EFF6FF", color: "#2563EB",
                border: "none", padding: "8px 16px",
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28, marginBottom: 4,
          }}>Book a Service</h1>
          <p style={{ color: "#64748B", fontSize: 15 }}>
            Fill in the details to request a booking
          </p>
        </div>

        <div className="book-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 24, alignItems: "start",
        }}>

          {/* LEFT — Booking Form */}
          <div style={{
            background: "#fff", borderRadius: 16,
            border: "1px solid #F1F5F9", padding: "32px",
          }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 24 }}>
              Booking Details
            </h2>

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

            <form onSubmit={handleSubmit}>

              {/* Address */}
              <div style={{ marginBottom: 20 }}>
                <label className="label">Service Address *</label>
                <textarea
                  className="input-field"
                  name="address"
                  placeholder="Enter your full address where service is needed..."
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* Date & Time */}
              <div className="date-grid" style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16, marginBottom: 20,
              }}>
                <div>
                  <label className="label">Preferred Date *</label>
                  <input
                    className="input-field"
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>
                <div>
                  <label className="label">Preferred Time</label>
                  <input
                    className="input-field"
                    type="time"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 28 }}>
                <label className="label">Additional Notes (Optional)</label>
                <textarea
                  className="input-field"
                  name="notes"
                  placeholder="Describe the problem or any special instructions..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* Price Summary */}
              {provider && (
                <div style={{
                  background: "#F8FAFC", borderRadius: 12,
                  padding: "16px 20px", marginBottom: 24,
                  border: "1px solid #E2E8F0",
                }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: 8,
                  }}>
                    <span style={{ fontSize: 14, color: "#64748B" }}>Service Charge</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>₹{provider.price}</span>
                  </div>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", paddingTop: 10,
                    borderTop: "1px solid #E2E8F0",
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Total Amount</span>
                    <span style={{
                      fontSize: 20, fontWeight: 700, color: "#2563EB",
                    }}>₹{provider.price}</span>
                  </div>
                  <p style={{
                    fontSize: 12, color: "#94A3B8", marginTop: 8,
                  }}>
                    💡 Payment is made directly to the provider after service completion
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? "Sending Request..." : "Confirm Booking →"}
              </button>
            </form>
          </div>

          {/* RIGHT — Provider Card */}
          {provider && (
            <div style={{
              background: "#fff", borderRadius: 16,
              border: "1px solid #F1F5F9", padding: "24px",
              position: "sticky", top: 84,
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>
                Provider Details
              </h3>

              {/* Provider Info */}
              <div style={{
                display: "flex", alignItems: "center",
                gap: 14, marginBottom: 20,
                paddingBottom: 20,
                borderBottom: "1px solid #F1F5F9",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "#EFF6FF", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 24, flexShrink: 0,
                }}>👷</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {provider.user?.name}
                  </div>
                  <div style={{ color: "#64748B", fontSize: 13 }}>
                    {provider.category?.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#F59E0B", marginTop: 2 }}>
                    {provider.rating > 0
                      ? `⭐ ${provider.rating} (${provider.totalReviews} reviews)`
                      : "⭐ New Provider"
                    }
                  </div>
                </div>
              </div>

              {/* Details */}
              {[
                { label: "📍 Location", value: `${provider.area ? provider.area + ", " : ""}${provider.city}` },
                { label: "💼 Experience", value: `${provider.experience || 0} years` },
                { label: "💰 Price", value: `₹${provider.price} per visit` },
                { label: "📞 Contact", value: provider.user?.phone || "Not provided" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: i < 3 ? "1px solid #F8FAFC" : "none",
                }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}

              {/* Bio */}
              {provider.bio && (
                <div style={{
                  background: "#F8FAFC", borderRadius: 10,
                  padding: "12px", marginTop: 16,
                }}>
                  <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>
                    "{provider.bio}"
                  </p>
                </div>
              )}

              {/* Availability */}
              <div style={{
                marginTop: 16,
                background: provider.isAvailable ? "#F0FDF4" : "#FEF2F2",
                borderRadius: 10, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: provider.isAvailable ? "#15803D" : "#DC2626",
                }} />
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: provider.isAvailable ? "#15803D" : "#DC2626",
                }}>
                  {provider.isAvailable ? "Currently Available" : "Currently Unavailable"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
