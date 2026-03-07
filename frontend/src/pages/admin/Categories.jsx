import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";

export default function AdminCategories() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data.categories);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        // Update existing
        await axios.put(`/categories/${editingId}`, formData);
        setSuccess("Category updated successfully! ✅");
      } else {
        // Create new
        await axios.post("/categories", formData);
        setSuccess("Category created successfully! ✅");
      }
      setFormData({ name: "", description: "" });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setError("");
    setSuccess("");
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`/categories/${id}`);
      setSuccess("Category deleted! ✅");
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleToggleActive = async (category) => {
    try {
      await axios.put(`/categories/${category._id}`, {
        ...category,
        isActive: !category.isActive,
      });
      fetchCategories();
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
    setError("");
    setSuccess("");
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
          border: none; padding: 13px 28px;
          border-radius: 10px; font-size: 15px;
          font-weight: 600; cursor: pointer;
          font-family: inherit; transition: background 0.2s;
        }
        .btn-save:hover:not(:disabled) { background: #1D4ED8; }
        .btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-edit {
          background: #EFF6FF; color: #2563EB;
          border: none; padding: 7px 14px;
          border-radius: 8px; font-size: 13px;
          font-weight: 600; cursor: pointer;
          font-family: inherit; transition: all 0.2s;
        }
        .btn-edit:hover { background: #2563EB; color: #fff; }
        .btn-delete {
          background: #FEF2F2; color: #DC2626;
          border: none; padding: 7px 14px;
          border-radius: 8px; font-size: 13px;
          font-weight: 600; cursor: pointer;
          font-family: inherit; transition: all 0.2s;
        }
        .btn-delete:hover { background: #DC2626; color: #fff; }
        .cat-row:hover { background: #F8FAFC !important; }
        .cat-row { transition: background 0.15s; }
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr !important; }
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

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28, marginBottom: 4,
          }}>Manage Categories</h1>
          <p style={{ color: "#64748B", fontSize: 15 }}>
            Add, edit or delete service categories
          </p>
        </div>

        <div className="main-grid" style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: 24, alignItems: "start",
        }}>

          {/* LEFT — Form */}
          <div style={{
            background: "#fff", borderRadius: 16,
            border: "1px solid #F1F5F9", padding: "28px",
            position: "sticky", top: 84,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
              {editingId ? "✏️ Edit Category" : "➕ Add New Category"}
            </h2>

            {/* Success */}
            {success && (
              <div style={{
                background: "#F0FDF4", border: "1px solid #86EFAC",
                borderRadius: 10, padding: "12px 16px", marginBottom: 20,
              }}>
                <span style={{ color: "#15803D", fontSize: 14 }}>{success}</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background: "#FEF2F2", border: "1px solid #FECACA",
                borderRadius: 10, padding: "12px 16px", marginBottom: 20,
              }}>
                <span style={{ color: "#DC2626", fontSize: 14 }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 18 }}>
                <label className="label">Category Name *</label>
                <input
                  className="input-field"
                  type="text"
                  name="name"
                  placeholder="e.g. Plumbing"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="label">Description</label>
                <textarea
                  className="input-field"
                  name="description"
                  placeholder="Brief description of this service..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={saving}
                  style={{ flex: 1 }}
                >
                  {saving ? "Saving..." : editingId ? "Update ✓" : "Add Category →"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      background: "#F1F5F9", color: "#64748B",
                      border: "none", padding: "13px 20px",
                      borderRadius: 10, fontSize: 14, fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT — Categories List */}
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
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>
                All Categories
              </h2>
              <span style={{
                background: "#EFF6FF", color: "#2563EB",
                fontSize: 13, fontWeight: 700,
                padding: "4px 12px", borderRadius: 100,
              }}>{categories.length} total</span>
            </div>

            {loading && (
              <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>
                Loading...
              </div>
            )}

            {!loading && categories.length === 0 && (
              <div style={{ padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
                <p style={{ color: "#64748B" }}>No categories yet. Add one!</p>
              </div>
            )}

            {!loading && categories.length > 0 && (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Category", "Description", "Status", "Actions"].map(h => (
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
                  {categories.map((cat, i) => (
                    <tr key={cat._id} className="cat-row" style={{
                      borderTop: "1px solid #F1F5F9",
                      background: editingId === cat._id ? "#EFF6FF" : i % 2 === 0 ? "#fff" : "#FAFCFF",
                    }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {cat.name}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{
                          fontSize: 13, color: "#64748B",
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {cat.description || "—"}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span
                          onClick={() => handleToggleActive(cat)}
                          style={{
                            background: cat.isActive ? "#F0FDF4" : "#FEF2F2",
                            color: cat.isActive ? "#15803D" : "#DC2626",
                            padding: "4px 12px", borderRadius: 100,
                            fontSize: 12, fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(cat)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(cat._id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
