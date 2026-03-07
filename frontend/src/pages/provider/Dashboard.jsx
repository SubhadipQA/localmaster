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

export default function ProviderDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    fetchBookings();
    fetchProfile();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/bookings/provider");
      setBookings(res.data.bookings);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/providers/my/profile");
      setIsAvailable(res.data.provider.isAvailable);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const res = await axios.put("/providers/toggle/availability");
      setIsAvailable(res.data.isAvailable);
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const handleAccept = async (bookingId) => {
    setActionLoading(bookingId + "accept");
    try {
      await axios.put(`/bookings/${bookingId}/accept`);
      fetchBookings();
    } catch (err) {
      console.error("Accept failed", err);
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async (bookingId) => {
    setActionLoading(bookingId + "reject");
    try {
      await axios.put(`/bookings/${bookingId}/reject`, {
        rejectedReason: "Provider unavailable at this time",
      });
      fetchBookings();
    } catch (err) {
      console.error("Reject failed", err);
    } finally {
      setActionLoading("");
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    setActionLoading(bookingId + status);
    try {
      await axios.put(`/bookings/${bookingId}/status`, { status });
      fetchBookings();
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setActionLoading("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Stats
  const stats = {
    total: bookings.length,
    newRequests: bookings.filter(b => b.status === "requested").length,
    active: bookings.filter(b => ["confirmed", "in-progress"].includes(b.status)).length,
    completed: bookings.filter(b => b.status === "completed").length,
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
        .stat-card { transition: all 0.2s; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(37,99,235,0.10); }
        .btn-accept {
          background: #F0FDF4; color: #15803D;
          border: 1.5px solid #86EFAC;
          padding: 6px 14px; border-radius: 8px;
          font-size: 12px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .btn-accept:hover { background: #15803D; color: #fff; border-color: #15803D; }
        .btn-reject {
          background: #FEF2F2; color: #DC2626;
          border: 1.5px solid #FECACA;
          padding: 6px 14px; border-radius: 8px;
          font-size: 12px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .btn-reject:hover { background: #DC2626; color: #fff; border-color: #DC2626; }
        .btn-status {
          background: #EFF6FF; color: #2563EB;
          border: 1.5px solid #93C5FD;
          padding: 6px 14px; border-radius: 8px;
          font-size: 12px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .btn-status:hover { background: #2563EB; color: #fff; border-color: #2563EB; }
        .btn-status:disabled { opacity: 0.5; cursor: not-allowed; }
        .booking-row:hover { background: #F8FAFC !important; }
        .booking-row { transition: background 0.15s; }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hide-mobile { display: none !important; }
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
            <span style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20, color: "#0F172A",
            }}>LocalMaster</span>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

            {/* Availability Toggle */}
            <div
              onClick={handleToggleAvailability}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: isAvailable ? "#F0FDF4" : "#FEF2F2",
                border: `1.5px solid ${isAvailable ? "#86EFAC" : "#FECACA"}`,
                borderRadius: 100, padding: "7px 16px",
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: isAvailable ? "#15803D" : "#DC2626",
              }} />
              <span style={{
                fontSize: 13, fontWeight: 600,
                color: isAvailable ? "#15803D" : "#DC2626",
              }}>
                {isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>

            {/* Profile button */}
            <button
              onClick={() => navigate("/provider/profile")}
              className="hide-mobile"
              style={{
                background: "#EFF6FF", color: "#2563EB",
                border: "none", padding: "8px 16px",
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              My Profile
            </button>

            {/* User avatar */}
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

      {/* MAIN */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {/* Welcome */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28, marginBottom: 4,
          }}>
            Welcome, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p style={{ color: "#64748B", fontSize: 15 }}>
            Manage your bookings and update job status
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
            { label: "New Requests", value: stats.newRequests, icon: "🔔", color: "#D97706" },
            { label: "Active Jobs", value: stats.active, icon: "🔄", color: "#7C3AED" },
            { label: "Completed", value: stats.completed, icon: "✅", color: "#15803D" },
          ].map((stat, i) => (
            <div key={i} className="stat-card" style={{
              background: "#fff", borderRadius: 14,
              padding: "20px 24px", border: "1px solid #F1F5F9",
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

        {/* BOOKINGS */}
        <div style={{
          background: "#fff", borderRadius: 16,
          border: "1px solid #F1F5F9", overflow: "hidden",
        }}>
          <div style={{
            padding: "20px 24px",
            borderBottom: "1px solid #F1F5F9",
          }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>
              Incoming Bookings
            </h2>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ padding: 60, textAlign: "center", color: "#94A3B8" }}>
              Loading bookings...
            </div>
          )}

          {/* Empty */}
          {!loading && bookings.length === 0 && (
            <div style={{ padding: 60, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>No bookings yet</h3>
              <p style={{ color: "#94A3B8" }}>
                Bookings will appear here once customers book you!
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && bookings.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Customer", "Service", "Address", "Date", "Price", "Status", "Actions"].map(h => (
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
                          {booking.customer?.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#94A3B8" }}>
                          {booking.customer?.phone}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14 }}>
                        {booking.category?.name || "Service"}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{
                          fontSize: 13, color: "#64748B",
                          maxWidth: 150, overflow: "hidden",
                          textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {booking.address}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14 }}>
                        {formatDate(booking.scheduledDate)}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{
                          fontSize: 14, fontWeight: 700, color: "#2563EB",
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
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>

                          {/* Accept / Reject for requested */}
                          {booking.status === "requested" && (
                            <>
                              <button
                                className="btn-accept"
                                disabled={actionLoading === booking._id + "accept"}
                                onClick={() => handleAccept(booking._id)}
                              >
                                {actionLoading === booking._id + "accept" ? "..." : "✓ Accept"}
                              </button>
                              <button
                                className="btn-reject"
                                disabled={actionLoading === booking._id + "reject"}
                                onClick={() => handleReject(booking._id)}
                              >
                                {actionLoading === booking._id + "reject" ? "..." : "✕ Reject"}
                              </button>
                            </>
                          )}

                          {/* Start Job for confirmed */}
                          {booking.status === "confirmed" && (
                            <button
                              className="btn-status"
                              disabled={actionLoading === booking._id + "in-progress"}
                              onClick={() => handleStatusUpdate(booking._id, "in-progress")}
                            >
                              {actionLoading === booking._id + "in-progress" ? "..." : "▶ Start Job"}
                            </button>
                          )}

                          {/* Complete for in-progress */}
                          {booking.status === "in-progress" && (
                            <button
                              className="btn-accept"
                              disabled={actionLoading === booking._id + "completed"}
                              onClick={() => handleStatusUpdate(booking._id, "completed")}
                            >
                              {actionLoading === booking._id + "completed" ? "..." : "✓ Complete"}
                            </button>
                          )}

                          {/* Done states */}
                          {["completed", "cancelled", "rejected"].includes(booking.status) && (
                            <span style={{ fontSize: 13, color: "#94A3B8" }}>
                              No actions
                            </span>
                          )}
                        </div>
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
