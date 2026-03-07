import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";

export default function AdminProviders() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await axios.get("/providers/admin/all");
      setProviders(res.data.providers);
    } catch (err) {
      console.error("Failed to fetch providers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (providerId) => {
    setActionLoading(providerId + "approve");
    try {
      await axios.put(`/providers/${providerId}/approve`);
      setSuccess("Provider approved successfully! ✅");
      fetchProviders();
      setTimeout(() => setSuccess(""), 3000);
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

  // Filter providers
  const filteredProviders = providers.filter(p => {
    const matchesFilter =
      filter === "all" ||
      (filter === "approved" && p.isApproved) ||
      (filter === "pending" && !p.isApproved);

    const matchesSearch =
      !search ||
      p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: providers.length,
    approved: providers.filter(p => p.isApproved).length,
    pending: providers.filter(p => !p.isApproved).length,
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
        .btn-approve {
          background: #F0FDF4; color: #15803D;
          border: 1.5px solid #86EFAC;
          padding: 7px 16px; border-radius: 8px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .btn-approve:hover:not(:disabled) { background: #15803D; color: #fff; }
        .btn-approve:disabled { opacity: 0.5; cursor: not-allowed; }
        .filter-btn {
          padding: 8px 18px; border-radius: 100px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          border: none; transition: all 0.2s;
        }
        .provider-row:hover { background: #F8FAFC !important; }
        .provider-row { transition: background 0.15s; }
        .search-input {
          border: 1.5px solid #E2E8F0; border-radius: 10px;
          padding: 10px 16px; font-size: 14px;
          font-family: inherit; outline: none;
          transition: border 0.2s; background: #fff;
          color: #0F172A; width: 100%;
        }
        .search-input:focus { border-color: #3B82F6; }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(3,1fr) !important; }
          .hide-mobile { display: none !important; }
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
            <span style={{
              background: "#FEF3C7", color: "#92400E",
              fontSize: 11, fontWeight: 700,
              padding: "3px 10px", borderRadius: 100, marginLeft: 4,
            }}>ADMIN</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => navigate("/admin/dashboard")} style={{
              background: "#EFF6FF", color: "#2563EB",
              border: "none", padding: "8px 16px",
              borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>← Dashboard</button>
            <button onClick={handleLogout} style={{
              background: "#FEF2F2", color: "#DC2626",
              border: "none", padding: "8px 14px",
              borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28, marginBottom: 4,
          }}>Manage Providers</h1>
          <p style={{ color: "#64748B", fontSize: 15 }}>
            Approve or review service providers
          </p>
        </div>

        {/* Success */}
        {success && (
          <div style={{
            background: "#F0FDF4", border: "1px solid #86EFAC",
            borderRadius: 10, padding: "12px 20px", marginBottom: 20,
          }}>
            <span style={{ color: "#15803D", fontSize: 14, fontWeight: 600 }}>
              {success}
            </span>
          </div>
        )}

        {/* STATS */}
        <div className="stats-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16, marginBottom: 24,
        }}>
          {[
            { label: "Total Providers", value: stats.total, icon: "👷", color: "#2563EB" },
            { label: "Approved", value: stats.approved, icon: "✅", color: "#15803D" },
            { label: "Pending", value: stats.pending, icon: "⏳", color: "#D97706" },
          ].map((stat, i) => (
            <div key={i} style={{
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

        {/* Filters + Search */}
        <div style={{
          background: "#fff", borderRadius: 14,
          border: "1px solid #F1F5F9",
          padding: "16px 20px", marginBottom: 20,
          display: "flex", gap: 12,
          alignItems: "center", flexWrap: "wrap",
        }}>
          {/* Filter Buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { key: "all", label: "All" },
              { key: "pending", label: "⏳ Pending" },
              { key: "approved", label: "✅ Approved" },
            ].map(f => (
              <button
                key={f.key}
                className="filter-btn"
                onClick={() => setFilter(f.key)}
                style={{
                  background: filter === f.key ? "#2563EB" : "#F1F5F9",
                  color: filter === f.key ? "#fff" : "#64748B",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            className="search-input"
            placeholder="🔍 Search by name, city or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
        </div>

        {/* Providers Table */}
        <div style={{
          background: "#fff", borderRadius: 16,
          border: "1px solid #F1F5F9", overflow: "hidden",
        }}>
          <div style={{
            padding: "16px 24px",
            borderBottom: "1px solid #F1F5F9",
          }}>
            <span style={{ fontSize: 14, color: "#64748B" }}>
              Showing <strong>{filteredProviders.length}</strong> providers
            </span>
          </div>

          {loading && (
            <div style={{ padding: 60, textAlign: "center", color: "#94A3B8" }}>
              Loading providers...
            </div>
          )}

          {!loading && filteredProviders.length === 0 && (
            <div style={{ padding: 60, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👷</div>
              <p style={{ color: "#64748B" }}>No providers found</p>
            </div>
          )}

          {!loading && filteredProviders.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Provider", "Category", "City", "Price", "Rating", "Status", "Action"].map(h => (
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
                  {filteredProviders.map((provider, i) => (
                    <tr key={provider._id} className="provider-row" style={{
                      borderTop: "1px solid #F1F5F9",
                      background: i % 2 === 0 ? "#fff" : "#FAFCFF",
                    }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: "#EFF6FF", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            fontSize: 16, flexShrink: 0,
                          }}>👷</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>
                              {provider.user?.name}
                            </div>
                            <div style={{ fontSize: 12, color: "#94A3B8" }}>
                              {provider.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14 }}>
                        {provider.category?.name || "—"}
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14 }}>
                        {provider.city || "—"}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontWeight: 700, color: "#2563EB", fontSize: 14 }}>
                          ₹{provider.price}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14 }}>
                        ⭐ {provider.rating || 0}
                        <span style={{ color: "#94A3B8", fontSize: 12 }}>
                          {" "}({provider.totalReviews || 0})
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{
                          background: provider.isApproved ? "#F0FDF4" : "#FFF7ED",
                          color: provider.isApproved ? "#15803D" : "#C2410C",
                          padding: "4px 12px", borderRadius: 100,
                          fontSize: 12, fontWeight: 600,
                        }}>
                          {provider.isApproved ? "✅ Approved" : "⏳ Pending"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        {!provider.isApproved ? (
                          <button
                            className="btn-approve"
                            disabled={actionLoading === provider._id + "approve"}
                            onClick={() => handleApprove(provider._id)}
                          >
                            {actionLoading === provider._id + "approve" ? "..." : "✓ Approve"}
                          </button>
                        ) : (
                          <span style={{ fontSize: 13, color: "#94A3B8" }}>
                            Approved ✅
                          </span>
                        )}
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
