import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";


export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get all providers (approved)
      const res = await axios.get("/providers");
      setProviders(res.data.providers);

      // Get pending providers from reviews
      //const allRes = await axios.get("/admin/providers");
      const allRes = await axios.get("/providers/admin/all");
      setPendingProviders(allRes.data.providers.filter(p => !p.isApproved));
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (providerId) => {
    setActionLoading(providerId + "approve");
    try {
      await axios.put(`/providers/${providerId}/approve`);
      fetchData();
    } catch (err) {
      console.error("Approve failed", err);
    } finally {
      setActionLoading("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
        .btn-approve {
          background: #F0FDF4; color: #15803D;
          border: 1.5px solid #86EFAC;
          padding: 7px 16px; border-radius: 8px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .btn-approve:hover { background: #15803D; color: #fff; }
        .btn-approve:disabled { opacity: 0.5; cursor: not-allowed; }
        .quick-card {
          background: #fff; border-radius: 14px;
          border: 1.5px solid #EFF6FF;
          padding: 24px; cursor: pointer;
          transition: all 0.2s; text-align: center;
        }
        .quick-card:hover {
          border-color: #2563EB;
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(37,99,235,0.10);
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .quick-grid { grid-template-columns: repeat(2,1fr) !important; }
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
            <span style={{
              background: "#FEF3C7", color: "#92400E",
              fontSize: 11, fontWeight: 700,
              padding: "3px 10px", borderRadius: 100,
              marginLeft: 4,
            }}>ADMIN</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="hide-mobile" style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>Administrator</div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#7C3AED", color: "#fff",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 14, fontWeight: 700,
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout} style={{
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
            Admin Dashboard 🛡️
          </h1>
          <p style={{ color: "#64748B", fontSize: 15 }}>
            Manage providers, categories and reviews
          </p>
        </div>

        {/* STATS */}
        <div className="stats-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16, marginBottom: 32,
        }}>
          {[
            { label: "Approved Providers", value: providers.length, icon: "👷", color: "#2563EB" },
            { label: "Pending Approvals", value: pendingProviders.length, icon: "⏳", color: "#D97706" },
            { label: "Total Services", value: "6", icon: "🔧", color: "#7C3AED" },
            { label: "Platform Status", value: "Live", icon: "✅", color: "#15803D" },
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

        {/* QUICK LINKS */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
            Quick Actions
          </h2>
          <div className="quick-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}>
            {[
              { icon: "🔧", title: "Manage Categories", desc: "Add, edit or delete service categories", path: "/admin/categories" },
              { icon: "👷", title: "All Providers", desc: "View and approve service providers", path: "/admin/providers" },
              { icon: "⭐", title: "Moderate Reviews", desc: "Show or hide customer reviews", path: "/admin/reviews" },
              { icon: "📨", title: "Contact Messages", desc: "View messages from contact form", path: "/admin/messages" },
            ].map((item, i) => (
              <div
                key={i}
                className="quick-card"
                onClick={() => navigate(item.path)}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                  {item.title}
                </div>
                <div style={{ color: "#64748B", fontSize: 13 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PENDING PROVIDERS */}
        <div style={{
          background: "#fff", borderRadius: 16,
          border: "1px solid #F1F5F9", overflow: "hidden",
        }}>
          <div style={{
            padding: "20px 24px",
            borderBottom: "1px solid #F1F5F9",
            display: "flex", justifyContent: "space-between",
            alignItems: "center",
          }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>
              Pending Provider Approvals
              {pendingProviders.length > 0 && (
                <span style={{
                  background: "#FEF3C7", color: "#92400E",
                  fontSize: 12, fontWeight: 700,
                  padding: "2px 10px", borderRadius: 100,
                  marginLeft: 10,
                }}>{pendingProviders.length} pending</span>
              )}
            </h2>
            <button
              onClick={() => navigate("/admin/providers")}
              style={{
                background: "#EFF6FF", color: "#2563EB",
                border: "none", padding: "8px 16px",
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              View All →
            </button>
          </div>

          {loading && (
            <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>
              Loading...
            </div>
          )}

          {!loading && pendingProviders.length === 0 && (
            <div style={{ padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <p style={{ color: "#64748B" }}>No pending approvals!</p>
            </div>
          )}

          {!loading && pendingProviders.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Provider", "Category", "City", "Price", "Action"].map(h => (
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
                  {pendingProviders.map((provider, i) => (
                    <tr key={provider._id} style={{
                      borderTop: "1px solid #F1F5F9",
                      background: i % 2 === 0 ? "#fff" : "#FAFCFF",
                    }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {provider.user?.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#94A3B8" }}>
                          {provider.user?.email}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14 }}>
                        {provider.category?.name || "Not set"}
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14 }}>
                        {provider.city}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{
                          fontSize: 14, fontWeight: 700, color: "#2563EB",
                        }}>₹{provider.price}</span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <button
                          className="btn-approve"
                          disabled={actionLoading === provider._id + "approve"}
                          onClick={() => handleApprove(provider._id)}
                        >
                          {actionLoading === provider._id + "approve" ? "..." : "✓ Approve"}
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
