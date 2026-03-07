import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";


export default function Providers() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: "",
    category: "",
  });

//   useEffect(() => {
//     fetchCategories();
//     fetchProviders();
//   }, []);

    useEffect(() => {
    fetchCategories().then((cats) => {
        const cityParam = searchParams.get("city");
        const categoryParam = searchParams.get("category");

        let cityVal = cityParam || "";
        let categoryVal = "";

        if (cityVal) setFilters(prev => ({ ...prev, city: cityVal }));

        if (categoryParam && cats) {
        const matched = cats.find(
            c => c.name.toLowerCase() === categoryParam.toLowerCase()
        );
        if (matched) {
            categoryVal = matched._id;
            setFilters(prev => ({ ...prev, category: matched._id }));
        }
        }

        fetchProviders(cityVal, categoryVal);
    });
    }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data.categories);
      return res.data.categories;
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchProviders = async (city = "", category = "") => {
    setLoading(true);
    try {
      let url = "/providers";
      const params = [];
      if (city) params.push(`city=${city}`);
      if (category) params.push(`category=${category}`);
      if (params.length > 0) url += "?" + params.join("&");

      const res = await axios.get(url);
      setProviders(res.data.providers);
    } catch (err) {
      console.error("Failed to fetch providers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProviders(filters.city, filters.category);
  };

  const handleClear = () => {
    setFilters({ city: "", category: "" });
    fetchProviders();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderStars = (rating) => {
    const stars = Math.round(rating);
    return "⭐".repeat(stars) || "No ratings yet";
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
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          padding: 11px 16px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border 0.2s;
          background: #fff;
          color: #0F172A;
        }
        .input-field:focus { border-color: #3B82F6; }
        .provider-card {
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid #F1F5F9;
          padding: 24px;
          transition: all 0.25s;
          cursor: pointer;
        }
        .provider-card:hover {
          border-color: #93C5FD;
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(37,99,235,0.10);
        }
        .btn-book {
          width: 100%;
          background: #2563EB;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
          margin-top: 16px;
        }
        .btn-book:hover { background: #1D4ED8; }
        .btn-search {
          background: #2563EB; color: #fff;
          border: none; padding: 11px 24px;
          border-radius: 10px; font-size: 14px;
          font-weight: 600; cursor: pointer;
          font-family: inherit; transition: background 0.2s;
          white-space: nowrap;
        }
        .btn-search:hover { background: #1D4ED8; }
        .btn-clear {
          background: #F1F5F9; color: #64748B;
          border: none; padding: 11px 20px;
          border-radius: 10px; font-size: 14px;
          font-weight: 600; cursor: pointer;
          font-family: inherit; transition: all 0.2s;
          white-space: nowrap;
        }
        .btn-clear:hover { background: #E2E8F0; }
        @media (max-width: 768px) {
          .providers-grid { grid-template-columns: 1fr !important; }
          .filter-row { flex-direction: column !important; }
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
            {user ? (
              <>
                <button
                  onClick={() => navigate(`/${user.role}/dashboard`)}
                  style={{
                    background: "#EFF6FF", color: "#2563EB",
                    border: "none", padding: "8px 16px",
                    borderRadius: 8, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                  Dashboard
                </button>
                <button onClick={handleLogout} style={{
                  background: "#FEF2F2", color: "#DC2626",
                  border: "none", padding: "8px 14px",
                  borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    background: "transparent", color: "#2563EB",
                    border: "1.5px solid #2563EB", padding: "8px 16px",
                    borderRadius: 8, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  style={{
                    background: "#2563EB", color: "#fff",
                    border: "none", padding: "8px 16px",
                    borderRadius: 8, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO FILTER */}
      <div style={{
        background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)",
        padding: "48px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 36, color: "#fff",
            marginBottom: 8, textAlign: "center",
          }}>
            Find Service Providers
          </h1>
          <p style={{
            color: "#BFDBFE", fontSize: 16,
            textAlign: "center", marginBottom: 32,
          }}>
            Browse verified professionals in your city
          </p>

          {/* Filter Bar */}
          <div className="filter-row" style={{
            background: "#fff", borderRadius: 14,
            padding: 16, display: "flex",
            gap: 12, alignItems: "center",
            maxWidth: 800, margin: "0 auto",
            flexWrap: "wrap",
          }}>
            {/* City Input */}
            <input
              className="input-field"
              placeholder="🏙️ Search by city..."
              value={filters.city}
              onChange={e => setFilters({ ...filters, city: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              style={{ flex: 1, minWidth: 150 }}
            />

            {/* Category Select */}
            <select
              className="input-field"
              value={filters.category}
              onChange={e => setFilters({ ...filters, category: e.target.value })}
              style={{ flex: 1, minWidth: 150 }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button className="btn-search" onClick={handleSearch}>
              Search
            </button>
            <button className="btn-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* PROVIDERS GRID */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>

        {/* Results count */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>
            {loading ? "Searching..." : `${providers.length} Provider${providers.length !== 1 ? "s" : ""} Found`}
          </h2>
          {(filters.city || filters.category) && (
            <div style={{
              background: "#EFF6FF", color: "#2563EB",
              padding: "6px 14px", borderRadius: 100,
              fontSize: 13, fontWeight: 600,
            }}>
              Filtered results
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: 80, color: "#94A3B8" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <p>Finding providers...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && providers.length === 0 && (
          <div style={{ textAlign: "center", padding: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>No providers found</h3>
            <p style={{ color: "#94A3B8", marginBottom: 24 }}>
              Try searching with a different city or category
            </p>
            <button className="btn-clear" onClick={handleClear}
              style={{ padding: "12px 28px", fontSize: 15 }}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Provider Cards */}
        {!loading && providers.length > 0 && (
          <div className="providers-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}>
            {providers.map(provider => (
              <div key={provider._id} className="provider-card">

                {/* Header */}
                <div style={{
                  display: "flex", alignItems: "center",
                  gap: 14, marginBottom: 16,
                  paddingBottom: 16,
                  borderBottom: "1px solid #F1F5F9",
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: "#EFF6FF", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 22, flexShrink: 0,
                  }}>
                    {provider.profileImage ? (
                      <img
                        src={provider.profileImage}
                        alt={provider.user?.name}
                        style={{ width: "100%", height: "100%", borderRadius: 14, objectFit: "cover" }}
                      />
                    ) : "👷"}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {provider.user?.name}
                    </div>
                    <div style={{ color: "#64748B", fontSize: 13 }}>
                      {provider.category?.name} • {provider.city}
                    </div>
                    <div style={{ fontSize: 12, marginTop: 2 }}>
                      {provider.rating > 0
                        ? `${renderStars(provider.rating)} ${provider.rating} (${provider.totalReviews})`
                        : "⭐ New Provider"
                      }
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div style={{
                    background: provider.isAvailable ? "#F0FDF4" : "#FEF2F2",
                    color: provider.isAvailable ? "#15803D" : "#DC2626",
                    fontSize: 11, fontWeight: 700,
                    padding: "4px 10px", borderRadius: 100,
                    flexShrink: 0,
                  }}>
                    {provider.isAvailable ? "✓ Available" : "Busy"}
                  </div>
                </div>

                {/* Details */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: 10, marginBottom: 4,
                }}>
                  <div style={{
                    background: "#F8FAFC", borderRadius: 10,
                    padding: "10px 12px",
                  }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>
                      EXPERIENCE
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {provider.experience || 0} years
                    </div>
                  </div>
                  <div style={{
                    background: "#EFF6FF", borderRadius: 10,
                    padding: "10px 12px",
                  }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>
                      PRICE
                    </div>
                    <div style={{
                      fontWeight: 700, fontSize: 16, color: "#2563EB",
                    }}>
                      ₹{provider.price}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {provider.bio && (
                  <p style={{
                    fontSize: 13, color: "#64748B",
                    lineHeight: 1.6, marginTop: 12,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {provider.bio}
                  </p>
                )}

                {/* Book Button */}
                <button
                  className="btn-book"
                  onClick={() => {
                    if (!user) {
                      navigate("/login");
                    } else if (user.role !== "customer") {
                      alert("Only customers can book services!");
                    } else {
                      navigate(`/customer/book/${provider._id}`);
                    }
                  }}
                >
                  Book Now →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
