import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";

export default function AdminMessages() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("/contact");
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    setActionLoading(id);
    try {
      await axios.put(`/contact/${id}/read`);
      fetchMessages();
      if (selected?._id === id) {
        setSelected({ ...selected, isRead: true });
      }
    } catch (err) {
      console.error("Mark read failed", err);
    } finally {
      setActionLoading("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric", month: "short",
      year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const filteredMessages = messages.filter(m => {
    if (filter === "unread") return !m.isRead;
    if (filter === "read") return m.isRead;
    return true;
  });

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.isRead).length,
    read: messages.filter(m => m.isRead).length,
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
        .msg-card {
          padding: 18px 20px; border-radius: 12px;
          border: 1.5px solid #F1F5F9; cursor: pointer;
          transition: all 0.2s; background: #fff;
        }
        .msg-card:hover { border-color: #93C5FD; }
        .msg-card.active { border-color: #2563EB; background: #EFF6FF; }
        .msg-card.unread { border-left: 4px solid #2563EB; }
        .btn-read {
          background: #EFF6FF; color: #2563EB;
          border: none; padding: 8px 16px;
          border-radius: 8px; font-size: 13px;
          font-weight: 600; cursor: pointer;
          font-family: inherit; transition: all 0.2s;
        }
        .btn-read:hover { background: #2563EB; color: #fff; }
        .btn-read:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(3,1fr) !important; }
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
          }}>Contact Messages</h1>
          <p style={{ color: "#64748B", fontSize: 15 }}>
            Messages submitted through the contact form
          </p>
        </div>

        {/* STATS */}
        <div className="stats-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(3,1fr)",
          gap: 16, marginBottom: 24,
        }}>
          {[
            { label: "Total Messages", value: stats.total, icon: "📨", color: "#2563EB" },
            { label: "Unread", value: stats.unread, icon: "🔵", color: "#D97706" },
            { label: "Read", value: stats.read, icon: "✅", color: "#15803D" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14,
              padding: "20px 24px", border: "1px solid #F1F5F9",
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{
                fontSize: 28, fontWeight: 700, color: stat.color,
                marginBottom: 4, fontFamily: "'DM Serif Display', serif",
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
          display: "flex", gap: 8,
        }}>
          {[
            { key: "all", label: "All Messages" },
            { key: "unread", label: "🔵 Unread" },
            { key: "read", label: "✅ Read" },
          ].map(f => (
            <button key={f.key} className="filter-btn"
              onClick={() => setFilter(f.key)}
              style={{
                background: filter === f.key ? "#2563EB" : "#F1F5F9",
                color: filter === f.key ? "#fff" : "#64748B",
              }}
            >{f.label}</button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 13, color: "#94A3B8", alignSelf: "center" }}>
            {filteredMessages.length} messages
          </span>
        </div>

        {/* Main Grid */}
        <div className="main-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 420px",
          gap: 20, alignItems: "start",
        }}>

          {/* LEFT — Messages List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {loading && (
              <div style={{
                background: "#fff", borderRadius: 14,
                border: "1px solid #F1F5F9",
                padding: 40, textAlign: "center", color: "#94A3B8",
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📨</div>
                <p>Loading messages...</p>
              </div>
            )}

            {!loading && filteredMessages.length === 0 && (
              <div style={{
                background: "#fff", borderRadius: 14,
                border: "1px solid #F1F5F9",
                padding: 60, textAlign: "center",
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>No messages found</h3>
                <p style={{ color: "#94A3B8" }}>Messages from the contact form will appear here</p>
              </div>
            )}

            {!loading && filteredMessages.map(msg => (
              <div
                key={msg._id}
                className={`msg-card ${selected?._id === msg._id ? "active" : ""} ${!msg.isRead ? "unread" : ""}`}
                onClick={() => setSelected(msg)}
              >
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", marginBottom: 8,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Avatar */}
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: msg.isRead ? "#F1F5F9" : "#2563EB",
                      color: msg.isRead ? "#64748B" : "#fff",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 14,
                      fontWeight: 700, flexShrink: 0,
                    }}>
                      {msg.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{
                        fontWeight: 700, fontSize: 14,
                        display: "flex", alignItems: "center", gap: 8,
                      }}>
                        {msg.name}
                        {!msg.isRead && (
                          <span style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: "#2563EB", display: "inline-block",
                          }} />
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#94A3B8" }}>{msg.email}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#94A3B8", flexShrink: 0 }}>
                    {formatDate(msg.createdAt)}
                  </div>
                </div>

                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: "#2563EB", marginBottom: 4,
                }}>
                  {msg.subject}
                </div>
                <div style={{
                  fontSize: 13, color: "#64748B",
                  overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — Message Detail */}
          <div style={{ position: "sticky", top: 84 }}>
            {!selected ? (
              <div style={{
                background: "#fff", borderRadius: 16,
                border: "1px solid #F1F5F9",
                padding: 60, textAlign: "center",
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>👈</div>
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>Select a message</h3>
                <p style={{ color: "#94A3B8", fontSize: 14 }}>
                  Click on any message to read it
                </p>
              </div>
            ) : (
              <div style={{
                background: "#fff", borderRadius: 16,
                border: "1px solid #F1F5F9", padding: "28px",
              }}>
                {/* Header */}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 20,
                  paddingBottom: 20, borderBottom: "1px solid #F1F5F9",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "#2563EB", color: "#fff",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 18, fontWeight: 700,
                    }}>
                      {selected.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{selected.name}</div>
                      <div style={{ fontSize: 13, color: "#94A3B8" }}>{selected.email}</div>
                    </div>
                  </div>
                  <span style={{
                    background: selected.isRead ? "#F0FDF4" : "#EFF6FF",
                    color: selected.isRead ? "#15803D" : "#2563EB",
                    fontSize: 11, fontWeight: 700,
                    padding: "4px 10px", borderRadius: 100,
                  }}>
                    {selected.isRead ? "✅ Read" : "🔵 Unread"}
                  </span>
                </div>

                {/* Details */}
                {[
                  { label: "Subject", value: selected.subject },
                  { label: "Phone", value: selected.phone || "Not provided" },
                  { label: "Received", value: formatDate(selected.createdAt) },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid #F8FAFC",
                  }}>
                    <span style={{ fontSize: 13, color: "#94A3B8" }}>{item.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}

                {/* Message */}
                <div style={{
                  background: "#F8FAFC", borderRadius: 12,
                  padding: "16px", margin: "20px 0",
                }}>
                  <div style={{
                    fontSize: 12, fontWeight: 700, color: "#94A3B8",
                    marginBottom: 8, textTransform: "uppercase",
                  }}>Message</div>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
                    {selected.message}
                  </p>
                </div>

                {/* Mark as Read */}
                {!selected.isRead && (
                  <button
                    className="btn-read"
                    style={{ width: "100%" }}
                    disabled={actionLoading === selected._id}
                    onClick={() => handleMarkRead(selected._id)}
                  >
                    {actionLoading === selected._id ? "..." : "✓ Mark as Read"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
