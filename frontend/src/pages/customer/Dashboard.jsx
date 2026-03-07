import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";

const STATUS_COLORS = {
  requested: { bg: "#FFF7ED", color: "#C2410C", label: "Requested" },
  confirmed: { bg: "#EFF6FF", color: "#1D4ED8", label: "Confirmed" },
  "in-progress": { bg: "#F0FDF4", color: "#15803D", label: "In Progress" },
  completed: { bg: "#F0FDF4", color: "#15803D", label: "Completed ✅" },
  cancelled: { bg: "#FEF2F2", color: "#DC2626", label: "Cancelled" },
  rejected: { bg: "#FEF2F2", color: "#DC2626", label: "Rejected" },
};

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/bookings/my");
      setBookings(res.data.bookings);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Stats calculation
  const stats = {
    total: bookings.length,
    active: bookings.filter(b => ["requested", "confirmed", "in-progress"].includes(b.status)).length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => ["cancelled", "rejected"].includes(b.status)).length,
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

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
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(37,99,235,0.10); }
        .stat-card { transition: all 0.2s; }
        .booking-row:hover { background: #F8FAFC !important; }
        .booking-row { transition: background 0.15s; }
        .btn-view {
          background: #EFF6FF; color: #2563EB;
          border: none; padding: 7px 16px;
          border-radius: 8px; font-size: 13px;
          font-weight: 600; cursor: pointer;
          font-family: inherit; transition: all 0.2s;
        }
        .btn-view:hover { background: #2563EB; color: #fff; }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hide-mobile { display: none !important; }
          .nav-title { font-size: 18px !important; }
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
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, background: "#2563EB",
              borderRadius: 8, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🔧</div>
            <span className="nav-title" style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20, color: "#0F172A",
            }}>LocalMaster</span>
          </div>

          {/* Nav Links */}
          <div className="hide-mobile" style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => navigate("/providers")}
              style={{
                background: "#2563EB", color: "#fff",
                border: "none", padding: "9px 20px",
                borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              + Book Service
            </button>
          </div>

          {/* User Info */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="hide-mobile" style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>Customer</div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#2563EB", color: "#fff",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 14, fontWeight: 700,
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "#FEF2F2", color: "#DC2626",
                border: "none", padding: "8px 14px",
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {/* Welcome */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28, marginBottom: 4,
          }}>
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p style={{ color: "#64748B", fontSize: 15 }}>
            Here's an overview of your bookings
          </p>
        </div>

        {/* STATS */}
        <div className="stats-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16, marginBottom: 32,
        }}>
          {[
            { label: "Total Bookings", value: stats.total, icon: "📋", color: "#2563EB" },
            { label: "Active", value: stats.active, icon: "🔄", color: "#D97706" },
            { label: "Completed", value: stats.completed, icon: "✅", color: "#15803D" },
            { label: "Cancelled", value: stats.cancelled, icon: "❌", color: "#DC2626" },
          ].map((stat, i) => (
            <div key={i} className="stat-card" style={{
              background: "#fff",
              borderRadius: 14,
              padding: "20px 24px",
              border: "1px solid #F1F5F9",
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{
                fontSize: 28, fontWeight: 700,
                color: stat.color, marginBottom: 4,
                fontFamily: "'DM Serif Display', serif",
              }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: "#64748B" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* BOOKINGS LIST */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #F1F5F9",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "20px 24px",
            borderBottom: "1px solid #F1F5F9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>
              My Bookings
            </h2>
            <button
              onClick={() => navigate("/providers")}
              style={{
                background: "#EFF6FF", color: "#2563EB",
                border: "none", padding: "8px 16px",
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              + New Booking
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ padding: 60, textAlign: "center", color: "#94A3B8" }}>
              Loading your bookings...
            </div>
          )}

          {/* Empty state */}
          {!loading && bookings.length === 0 && (
            <div style={{ padding: 60, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>No bookings yet</h3>
              <p style={{ color: "#94A3B8", marginBottom: 24 }}>
                Book your first service to get started!
              </p>
              <button
                onClick={() => navigate("/providers")}
                style={{
                  background: "#2563EB", color: "#fff",
                  border: "none", padding: "12px 28px",
                  borderRadius: 10, fontSize: 15, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                Browse Providers
              </button>
            </div>
          )}

          {/* Bookings Table */}
          {!loading && bookings.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Provider", "Service", "Date", "Price", "Status", "Action"].map(h => (
                      <th key={h} style={{
                        padding: "12px 20px", textAlign: "left",
                        fontSize: 12, fontWeight: 700,
                        color: "#94A3B8", letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, i) => (
                    <tr key={booking._id} className="booking-row" style={{
                      borderTop: "1px solid #F1F5F9",
                      background: i % 2 === 0 ? "#fff" : "#FAFCFF",
                    }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {booking.provider?.user?.name || "Provider"}
                        </div>
                        <div style={{ fontSize: 12, color: "#94A3B8" }}>
                          {booking.provider?.city}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontSize: 14 }}>
                          {booking.category?.name || "Service"}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontSize: 14 }}>
                          {formatDate(booking.scheduledDate)}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{
                          fontSize: 14, fontWeight: 700,
                          color: "#2563EB",
                        }}>
                          ₹{booking.price}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{
                          background: STATUS_COLORS[booking.status]?.bg,
                          color: STATUS_COLORS[booking.status]?.color,
                          padding: "4px 12px", borderRadius: 100,
                          fontSize: 12, fontWeight: 600,
                        }}>
                          {STATUS_COLORS[booking.status]?.label}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <button
                          className="btn-view"
                          onClick={() => navigate(`/customer/bookings/${booking._id}`)}
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
