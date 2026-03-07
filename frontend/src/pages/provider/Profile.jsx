import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";

export default function ProviderProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    bio: "",
    experience: "",
    price: "",
    city: "",
    area: "",
    category: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/providers/my/profile");
      const p = res.data.provider;
      setProfile(p);
      setFormData({
        bio: p.bio || "",
        experience: p.experience || "",
        price: p.price || "",
        city: p.city || "",
        area: p.area || "",
        category: p.category?._id || "",
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data.categories);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await axios.put("/providers/profile", formData);
      setSuccess(true);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    try {
      const res = await axios.put("/providers/toggle/availability");
      setProfile({ ...profile, isAvailable: res.data.isAvailable });
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh", background: "#F8FAFC",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center", color: "#94A3B8" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>👷</div>
          <p>Loading your profile...</p>
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
        .btn-save {
          background: #2563EB; color: #fff;
          border: none; padding: 13px 32px;
          border-radius: 10px; font-size: 15px;
          font-weight: 600; cursor: pointer;
          font-family: inherit; transition: background 0.2s;
        }
        .btn-save:hover:not(:disabled) { background: #1D4ED8; }
        .btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
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
            <button onClick={() => navigate("/provider/dashboard")} style={{
              background: "#EFF6FF", color: "#2563EB",
              border: "none", padding: "8px 16px",
              borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              ← Dashboard
            </button>
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

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28, marginBottom: 4,
          }}>My Profile</h1>
          <p style={{ color: "#64748B", fontSize: 15 }}>
            Update your professional profile to attract more customers
          </p>
        </div>

        <div className="profile-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 24, alignItems: "start",
        }}>

          {/* LEFT — Edit Form */}
          <div style={{
            background: "#fff", borderRadius: 16,
            border: "1px solid #F1F5F9", padding: "32px",
          }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 24 }}>
              Professional Details
            </h2>

            {/* Success */}
            {success && (
              <div style={{
                background: "#F0FDF4", border: "1px solid #86EFAC",
                borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>✅</span>
                <span style={{ color: "#15803D", fontSize: 14, fontWeight: 600 }}>
                  Profile updated successfully!
                </span>
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

            <form onSubmit={handleSubmit}>

              {/* Category */}
              <div style={{ marginBottom: 20 }}>
                <label className="label">Service Category *</label>
                <select
                  className="input-field"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your service category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: 20 }}>
                <label className="label">Professional Bio</label>
                <textarea
                  className="input-field"
                  name="bio"
                  placeholder="Describe your experience and expertise..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* Experience + Price */}
              <div className="two-col" style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16, marginBottom: 20,
              }}>
                <div>
                  <label className="label">Years of Experience</label>
                  <input
                    className="input-field"
                    type="number"
                    name="experience"
                    placeholder="5"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <label className="label">Price per Visit (₹) *</label>
                  <input
                    className="input-field"
                    type="number"
                    name="price"
                    placeholder="500"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* City + Area */}
              <div className="two-col" style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16, marginBottom: 28,
              }}>
                <div>
                  <label className="label">City *</label>
                  <input
                    className="input-field"
                    type="text"
                    name="city"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="label">Area</label>
                  <input
                    className="input-field"
                    type="text"
                    name="area"
                    placeholder="Andheri West"
                    value={formData.area}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-save"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes ✓"}
              </button>
            </form>
          </div>

          {/* RIGHT — Profile Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Profile Card */}
            <div style={{
              background: "#fff", borderRadius: 16,
              border: "1px solid #F1F5F9", padding: "24px",
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#94A3B8" }}>
                PROFILE PREVIEW
              </h3>

              {/* Avatar */}
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "#2563EB", color: "#fff",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 24,
                  fontWeight: 700, margin: "0 auto 12px",
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.name}</div>
                <div style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>
                  {profile?.category?.name || "Category not set"}
                </div>
                <div style={{ color: "#64748B", fontSize: 13 }}>
                  {profile?.city || "City not set"}
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: 10, marginBottom: 16,
              }}>
                <div style={{
                  background: "#F8FAFC", borderRadius: 10,
                  padding: "10px", textAlign: "center",
                }}>
                  <div style={{
                    fontSize: 18, fontWeight: 700, color: "#2563EB",
                  }}>₹{profile?.price || 0}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>Per Visit</div>
                </div>
                <div style={{
                  background: "#F8FAFC", borderRadius: 10,
                  padding: "10px", textAlign: "center",
                }}>
                  <div style={{
                    fontSize: 18, fontWeight: 700, color: "#2563EB",
                  }}>{profile?.experience || 0}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>Yrs Exp</div>
                </div>
              </div>

              {/* Rating */}
              <div style={{
                background: "#F8FAFC", borderRadius: 10,
                padding: "10px 14px", marginBottom: 16,
                display: "flex", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Rating</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>
                  ⭐ {profile?.rating || 0} ({profile?.totalReviews || 0} reviews)
                </span>
              </div>

              {/* Availability Toggle */}
              <div
                onClick={handleToggle}
                style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  background: profile?.isAvailable ? "#F0FDF4" : "#FEF2F2",
                  border: `1.5px solid ${profile?.isAvailable ? "#86EFAC" : "#FECACA"}`,
                  borderRadius: 10, padding: "12px 16px",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <span style={{
                  fontSize: 14, fontWeight: 600,
                  color: profile?.isAvailable ? "#15803D" : "#DC2626",
                }}>
                  {profile?.isAvailable ? "✅ Available" : "❌ Unavailable"}
                </span>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>
                  Click to toggle
                </span>
              </div>
            </div>

            {/* Approval Status */}
            <div style={{
              background: profile?.isApproved ? "#F0FDF4" : "#FFF7ED",
              borderRadius: 16,
              border: `1px solid ${profile?.isApproved ? "#86EFAC" : "#FED7AA"}`,
              padding: "16px 20px",
            }}>
              <div style={{
                fontSize: 14, fontWeight: 700,
                color: profile?.isApproved ? "#15803D" : "#92400E",
                marginBottom: 4,
              }}>
                {profile?.isApproved ? "✅ Profile Approved" : "⏳ Pending Approval"}
              </div>
              <p style={{
                fontSize: 13,
                color: profile?.isApproved ? "#64748B" : "#92400E",
              }}>
                {profile?.isApproved
                  ? "Your profile is visible to customers"
                  : "Admin needs to approve your profile before you appear in listings"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
