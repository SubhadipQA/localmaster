import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";

export default function AdminReviews() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [filter, setFilter] = useState("all");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/reviews");
      setReviews(res.data.reviews);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (reviewId) => {
    setActionLoading(reviewId);
    try {
      const res = await axios.put(`/reviews/${reviewId}/toggle`);
      setSuccess(`Review ${res.data.review.isVisible ? "visible ✅" : "hidden ❌"}`);
      fetchReviews();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Toggle failed", err);
    } finally {
      setActionLoading("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Filter reviews
  const filteredReviews = reviews.filter(r => {
    if (filter === "visible") return r.isVisible;
    if (filter === "hidden") return !r.isVisible;
    return true;
  });

  const stats = {
    total: reviews.length,
    visible: reviews.filter(r => r.isVisible).length,
    hidden: reviews.filter(r => !r.isVisible).length,
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? "#F59E0B" : "#E2E8F0" }}>★</span>
    ));
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
        .filter-btn {
          padding: 8px 18px; border-radius: 100px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          border: none; transition: all 0.2s;
        }
        .review-card {
          background: #fff; border-radius: 14px;
          border: 1.5px solid #F1F5F9; padding: 20px;
          transition: all 0.2s;
        }
        .review-card:hover {
          border-color: #93C5FD;
          box-shadow: 0 4px 16px rgba(37,99,235,0.08);
        }
        .btn-toggle-show {
          background: #F0FDF4; color: #15803D;
          border: 1.5px solid #86EFAC;
          padding: 7px 16px; border-radius: 8px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .btn-toggle-show:hover { background: #15803D; color: #fff; }
        .btn-toggle-hide {
          background: #FEF2F2; color: #DC2626;
          border: 1.5px solid #FECACA;
          padding: 7px 16px; border-radius: 8px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .btn-toggle-hide:hover { background: #DC2626; color: #fff; }
        .btn-toggle-show:disabled,
        .btn-toggle-hide:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(3,1fr) !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
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
          }}>Moderate Reviews</h1>
          <p style={{ color: "#64748B", fontSize: 15 }}>
            Show or hide customer reviews
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
            { label: "Total Reviews", value: stats.total, icon: "⭐", color: "#2563EB" },
            { label: "Visible", value: stats.visible, icon: "👁️", color: "#15803D" },
            { label: "Hidden", value: stats.hidden, icon: "🚫", color: "#DC2626" },
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

        {/* Filter */}
        <div style={{
          background: "#fff", borderRadius: 14,
          border: "1px solid #F1F5F9",
          padding: "14px 20px", marginBottom: 20,
          display: "flex", gap: 8, alignItems: "center",
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginRight: 4 }}>
            Filter:
          </span>
          {[
            { key: "all", label: "All Reviews" },
            { key: "visible", label: "👁️ Visible" },
            { key: "hidden", label: "🚫 Hidden" },
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
          <span style={{
            marginLeft: "auto", fontSize: 13,
            color: "#94A3B8",
          }}>
            {filteredReviews.length} reviews
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ padding: 60, textAlign: "center", color: "#94A3B8" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⭐</div>
            <p>Loading reviews...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredReviews.length === 0 && (
          <div style={{
            background: "#fff", borderRadius: 16,
            border: "1px solid #F1F5F9",
            padding: 60, textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>No reviews found</h3>
            <p style={{ color: "#94A3B8" }}>
              Reviews will appear here after customers complete bookings
            </p>
          </div>
        )}

        {/* Reviews Grid */}
        {!loading && filteredReviews.length > 0 && (
          <div className="reviews-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}>
            {filteredReviews.map(review => (
              <div key={review._id} className="review-card" style={{
                opacity: review.isVisible ? 1 : 0.6,
              }}>
                {/* Header */}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", marginBottom: 14,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Customer Avatar */}
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: "#2563EB", color: "#fff",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 16,
                      fontWeight: 700, flexShrink: 0,
                    }}>
                      {review.customer?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {review.customer?.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#94A3B8" }}>
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Visibility Badge */}
                  <span style={{
                    background: review.isVisible ? "#F0FDF4" : "#FEF2F2",
                    color: review.isVisible ? "#15803D" : "#DC2626",
                    fontSize: 11, fontWeight: 700,
                    padding: "4px 10px", borderRadius: 100,
                  }}>
                    {review.isVisible ? "Visible" : "Hidden"}
                  </span>
                </div>

                {/* Stars */}
                <div style={{ fontSize: 20, marginBottom: 10 }}>
                  {renderStars(review.rating)}
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: "#F59E0B", marginLeft: 6,
                  }}>
                    {review.rating}/5
                  </span>
                </div>

                {/* Comment */}
                <p style={{
                  fontSize: 14, color: "#475569",
                  lineHeight: 1.7, marginBottom: 16,
                  background: "#F8FAFC", borderRadius: 10,
                  padding: "12px 14px",
                }}>
                  "{review.comment || "No comment provided"}"
                </p>

                {/* Provider Info */}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 14,
                  borderTop: "1px solid #F1F5F9",
                }}>
                  <div style={{ fontSize: 13, color: "#64748B" }}>
                    Provider: <strong style={{ color: "#0F172A" }}>
                      {review.provider?.user?.name || "Provider"}
                    </strong>
                  </div>

                  {/* Toggle Button */}
                  <button
                    className={review.isVisible ? "btn-toggle-hide" : "btn-toggle-show"}
                    disabled={actionLoading === review._id}
                    onClick={() => handleToggle(review._id)}
                  >
                    {actionLoading === review._id
                      ? "..."
                      : review.isVisible ? "🚫 Hide" : "👁️ Show"
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
