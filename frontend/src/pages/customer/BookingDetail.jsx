import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";

const STATUS_STEPS = ["requested", "confirmed", "in-progress", "completed"];

const STATUS_COLORS = {
  requested: { bg: "#FFF7ED", color: "#C2410C", label: "Requested" },
  confirmed: { bg: "#EFF6FF", color: "#1D4ED8", label: "Confirmed" },
  "in-progress": { bg: "#F0FDF4", color: "#15803D", label: "In Progress" },
  completed: { bg: "#F0FDF4", color: "#15803D", label: "Completed ✅" },
  cancelled: { bg: "#FEF2F2", color: "#DC2626", label: "Cancelled ❌" },
  rejected: { bg: "#FEF2F2", color: "#DC2626", label: "Rejected ❌" },
};

export default function BookingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const res = await axios.get(`/bookings/${id}`);
      setBooking(res.data.booking);
    } catch (err) {
      console.error("Failed to fetch booking", err);
      setError("Booking not found!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(true);
    try {
      await axios.put(`/bookings/${id}/cancel`, {
        cancelReason: "Cancelled by customer",
      });
      fetchBooking();
    } catch (err) {
      setError(err.response?.data?.message || "Cancel failed");
    } finally {
      setCancelling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await axios.post(`/reviews/${id}`, review);
      setReviewSubmitted(true);
      setShowReview(false);
      fetchBooking();
    } catch (err) {
      setError(err.response?.data?.message || "Review failed");
    } finally {
      setReviewLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long", day: "numeric",
      month: "long", year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit",
    });
  };

  const getStepIndex = (status) => STATUS_STEPS.indexOf(status);

  if (loading) {
    return (
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh", background: "#F8FAFC",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center", color: "#94A3B8" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh", background: "#F8FAFC",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
          <h3>{error}</h3>
          <button onClick={() => navigate("/customer/dashboard")} style={{
            marginTop: 16, background: "#2563EB", color: "#fff",
            border: "none", padding: "10px 24px", borderRadius: 8,
            cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
          }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isCancelled = ["cancelled", "rejected"].includes(booking?.status);
  const isCompleted = booking?.status === "completed";
  const canCancel = booking?.status === "requested";

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
        .star-btn {
          background: none; border: none;
          font-size: 32px; cursor: pointer;
          transition: transform 0.1s;
          padding: 4px;
        }
        .star-btn:hover { transform: scale(1.2); }
        .btn-cancel {
          background: #FEF2F2; color: #DC2626;
          border: 1.5px solid #FECACA;
          padding: 10px 24px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .btn-cancel:hover { background: #DC2626; color: #fff; }
        .btn-review {
          background: #2563EB; color: #fff;
          border: none; padding: 10px 24px;
          border-radius: 10px; font-size: 14px;
          font-weight: 600; cursor: pointer;
          font-family: inherit; transition: background 0.2s;
        }
        .btn-review:hover { background: #1D4ED8; }
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
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
          <button onClick={() => navigate("/customer/dashboard")} style={{
            background: "#EFF6FF", color: "#2563EB",
            border: "none", padding: "8px 16px",
            borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 28, marginBottom: 4,
            }}>Booking Details</h1>
            <p style={{ color: "#94A3B8", fontSize: 13 }}>
              ID: {booking?._id}
            </p>
          </div>
          <span style={{
            background: STATUS_COLORS[booking?.status]?.bg,
            color: STATUS_COLORS[booking?.status]?.color,
            padding: "8px 18px", borderRadius: 100,
            fontSize: 14, fontWeight: 700,
          }}>
            {STATUS_COLORS[booking?.status]?.label}
          </span>
        </div>

        {/* STATUS TIMELINE */}
        {!isCancelled && (
          <div style={{
            background: "#fff", borderRadius: 16,
            border: "1px solid #F1F5F9",
            padding: "28px 32px", marginBottom: 24,
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 24 }}>
              Booking Progress
            </h2>
            <div style={{ display: "flex", alignItems: "center" }}>
              {STATUS_STEPS.map((step, i) => {
                const currentIndex = getStepIndex(booking?.status);
                const isCompleted = i <= currentIndex;
                const isActive = i === currentIndex;

                return (
                  <div key={step} style={{
                    display: "flex", alignItems: "center", flex: 1,
                  }}>
                    {/* Step Circle */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: isCompleted ? "#2563EB" : "#E2E8F0",
                        display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 14,
                        border: isActive ? "3px solid #93C5FD" : "none",
                        transition: "all 0.3s",
                        color: isCompleted ? "#fff" : "#94A3B8",
                        fontWeight: 700,
                      }}>
                        {isCompleted ? "✓" : i + 1}
                      </div>
                      <div style={{
                        marginTop: 8, fontSize: 11,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "#2563EB" : isCompleted ? "#0F172A" : "#94A3B8",
                        textAlign: "center", whiteSpace: "nowrap",
                        textTransform: "capitalize",
                      }}>
                        {step.replace("-", " ")}
                      </div>
                    </div>

                    {/* Connector Line */}
                    {i < STATUS_STEPS.length - 1 && (
                      <div style={{
                        flex: 1, height: 3,
                        background: i < currentIndex ? "#2563EB" : "#E2E8F0",
                        margin: "0 4px",
                        marginBottom: 24,
                        transition: "background 0.3s",
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="detail-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 20,
        }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Booking Info */}
            <div style={{
              background: "#fff", borderRadius: 16,
              border: "1px solid #F1F5F9", padding: "24px",
            }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>
                📋 Booking Information
              </h2>
              {[
                { label: "Service", value: booking?.category?.name || "Service" },
                { label: "Address", value: booking?.address },
                { label: "Date", value: formatDate(booking?.scheduledDate) },
                { label: "Time", value: formatTime(booking?.scheduledDate) },
                { label: "Price", value: `₹${booking?.price}`, highlight: true },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: i < 4 ? "1px solid #F8FAFC" : "none",
                  gap: 16,
                }}>
                  <span style={{ fontSize: 14, color: "#64748B", flexShrink: 0 }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: 14, fontWeight: item.highlight ? 700 : 500,
                    color: item.highlight ? "#2563EB" : "#0F172A",
                    textAlign: "right",
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}

              {/* Notes */}
              {booking?.notes && (
                <div style={{
                  background: "#F8FAFC", borderRadius: 10,
                  padding: "12px", marginTop: 16,
                }}>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>
                    YOUR NOTES
                  </div>
                  <p style={{ fontSize: 14, color: "#475569" }}>{booking.notes}</p>
                </div>
              )}
            </div>

            {/* Work Notes from Provider */}
            {booking?.workNotes && (
              <div style={{
                background: "#fff", borderRadius: 16,
                border: "1px solid #F1F5F9", padding: "24px",
              }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
                  🔧 Provider Work Notes
                </h2>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
                  {booking.workNotes}
                </p>
              </div>
            )}

            {/* Cancelled/Rejected Reason */}
            {(booking?.cancelReason || booking?.rejectedReason) && (
              <div style={{
                background: "#FEF2F2", borderRadius: 16,
                border: "1px solid #FECACA", padding: "24px",
              }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: "#DC2626" }}>
                  ❌ {booking?.cancelReason ? "Cancellation" : "Rejection"} Reason
                </h2>
                <p style={{ fontSize: 14, color: "#DC2626" }}>
                  {booking?.cancelReason || booking?.rejectedReason}
                </p>
              </div>
            )}

            {/* Review Section */}
            {isCompleted && !reviewSubmitted && (
              <div style={{
                background: "#fff", borderRadius: 16,
                border: "1px solid #F1F5F9", padding: "24px",
              }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
                  ⭐ Rate Your Experience
                </h2>
                <p style={{ color: "#64748B", fontSize: 14, marginBottom: 16 }}>
                  How was the service? Your feedback helps others!
                </p>

                {!showReview ? (
                  <button className="btn-review" onClick={() => setShowReview(true)}>
                    Write a Review
                  </button>
                ) : (
                  <form onSubmit={handleReviewSubmit}>
                    {/* Star Rating */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                        Your Rating
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            className="star-btn"
                            onClick={() => setReview({ ...review, rating: star })}
                          >
                            {star <= review.rating ? "⭐" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                        Your Comment
                      </div>
                      <textarea
                        style={{
                          width: "100%", border: "1.5px solid #E2E8F0",
                          borderRadius: 10, padding: "12px 16px",
                          fontSize: 14, fontFamily: "inherit",
                          outline: "none", resize: "vertical",
                        }}
                        rows={3}
                        placeholder="Share your experience..."
                        value={review.comment}
                        onChange={e => setReview({ ...review, comment: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                      <button type="submit" className="btn-review"
                        disabled={reviewLoading}
                        style={{ flex: 1 }}>
                        {reviewLoading ? "Submitting..." : "Submit Review ✓"}
                      </button>
                      <button type="button"
                        onClick={() => setShowReview(false)}
                        style={{
                          background: "#F1F5F9", color: "#64748B",
                          border: "none", padding: "10px 20px",
                          borderRadius: 10, fontSize: 14, fontWeight: 600,
                          cursor: "pointer", fontFamily: "inherit",
                        }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Review Submitted */}
            {reviewSubmitted && (
              <div style={{
                background: "#F0FDF4", borderRadius: 16,
                border: "1px solid #86EFAC", padding: "24px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#15803D" }}>
                  Review Submitted!
                </h3>
                <p style={{ color: "#64748B", fontSize: 14, marginTop: 4 }}>
                  Thank you for your feedback!
                </p>
              </div>
            )}

            {/* Cancel Button */}
            {canCancel && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="btn-cancel"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelling..." : "Cancel Booking"}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — Provider Card */}
          <div style={{
            background: "#fff", borderRadius: 16,
            border: "1px solid #F1F5F9", padding: "24px",
            height: "fit-content",
            position: "sticky", top: 84,
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>
              👷 Provider
            </h3>
            <div style={{
              display: "flex", alignItems: "center",
              gap: 14, marginBottom: 20,
              paddingBottom: 20,
              borderBottom: "1px solid #F1F5F9",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: "#EFF6FF", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 22,
              }}>👷</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  {booking?.provider?.user?.name}
                </div>
                <div style={{ color: "#64748B", fontSize: 13 }}>
                  {booking?.category?.name}
                </div>
              </div>
            </div>

            {[
              { label: "📍 City", value: booking?.provider?.city },
              { label: "📞 Phone", value: booking?.provider?.user?.phone },
              { label: "💰 Charged", value: `₹${booking?.price}` },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: i < 2 ? "1px solid #F8FAFC" : "none",
              }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
