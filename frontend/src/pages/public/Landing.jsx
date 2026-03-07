import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { icon: "🔧", name: "Plumbing", count: "120+ Providers" },
  { icon: "⚡", name: "Electrician", count: "95+ Providers" },
  { icon: "🧹", name: "Cleaning", count: "200+ Providers" },
  { icon: "🎨", name: "Painting", count: "80+ Providers" },
  { icon: "❄️", name: "AC Repair", count: "60+ Providers" },
  { icon: "🪛", name: "Carpentry", count: "75+ Providers" },
];

const STEPS = [
  { num: "01", title: "Choose a Service", desc: "Browse from 50+ service categories available in your city.", icon: "🔍" },
  { num: "02", title: "Pick a Provider", desc: "Compare ratings, pricing and availability of professionals.", icon: "👤" },
  { num: "03", title: "Book & Relax", desc: "Schedule at your convenience and track the job in real time.", icon: "📅" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", city: "Mumbai", text: "Found an electrician within minutes. Professional and on time!", rating: 5, avatar: "PS" },
  { name: "Rahul Mehta", city: "Delhi", text: "The plumber fixed everything perfectly. Highly recommended.", rating: 5, avatar: "RM" },
  { name: "Anjali Singh", city: "Bangalore", text: "Cleaning service was outstanding. Will book again for sure.", rating: 5, avatar: "AS" },
];

const STATS = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "500+", label: "Verified Providers" },
  { value: "50+", label: "Service Categories" },
  { value: "4.8★", label: "Average Rating" },
];

const QUICK_PILLS = ["Plumber", "Electrician", "Cleaning", "Painter"];

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    setTimeout(() => setVisible(true), 100);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ FIX 1 — Search works blank or with city
  const handleSearch = () => {
    if (searchCity.trim()) {
      navigate(`/providers?city=${searchCity.trim()}`);
    } else {
      navigate("/providers");
    }
  };

  // ✅ FIX 2 — Quick pill navigates with category filter
  const handlePillClick = (pill) => {
    navigate(`/providers?category=${pill}`);
  };

  // ✅ FIX 3 — Category card click
  const handleCategoryClick = (catName) => {
    navigate(`/providers?category=${catName}`);
  };

  // ✅ FIX 4 — Smooth scroll to section
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#0F172A", background: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.show { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }
        .cat-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(37,99,235,0.13); border-color: #3B82F6 !important; }
        .cat-card { transition: all 0.25s ease; cursor: pointer; }
        .btn-primary { background: #2563EB; color: #fff; border: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s, transform 0.15s; }
        .btn-primary:hover { background: #1D4ED8; transform: translateY(-1px); }
        .btn-outline { background: transparent; color: #2563EB; border: 1.5px solid #2563EB; padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .btn-outline:hover { background: #EFF6FF; }
        .search-input { border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 14px 18px; font-size: 15px; font-family: inherit; outline: none; transition: border 0.2s; background: #fff; }
        .search-input:focus { border-color: #3B82F6; }
        .nav-link { color: #475569; font-size: 14px; font-weight: 500; cursor: pointer; transition: color 0.2s; padding: 6px 2px; position: relative; background: none; border: none; font-family: inherit; }
        .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: #2563EB; transition: width 0.2s; }
        .nav-link:hover { color: #2563EB; }
        .nav-link:hover::after { width: 100%; }
        .pill-tag { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 100px; padding: 6px 14px; font-size: 13px; color: #475569; cursor: pointer; transition: all 0.2s; font-family: inherit; font-weight: 500; }
        .pill-tag:hover { background: #EFF6FF; border-color: #93C5FD; color: #2563EB; transform: translateY(-1px); }
        .testimonial-card:hover { box-shadow: 0 8px 32px rgba(37,99,235,0.10); transform: translateY(-4px); }
        .testimonial-card { transition: all 0.25s ease; }
        .footer-link { font-size: 14px; cursor: pointer; transition: color 0.2s; background: none; border: none; color: #94A3B8; font-family: inherit; }
        .footer-link:hover { color: #fff; }
        @media (max-width: 768px) {
          .hero-title { font-size: 36px !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .hide-mobile { display: none !important; }
          .hero-card { display: none !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #F1F5F9" : "none",
        transition: "all 0.3s ease", padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div style={{ width: 36, height: 36, background: "#2563EB", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔧</div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#0F172A" }}>LocalMaster</span>
          </div>

          {/* ✅ Nav Links — all working */}
          <div className="hide-mobile" style={{ display: "flex", gap: 32 }}>
            <button className="nav-link" onClick={() => scrollTo("categories")}>Services</button>
            <button className="nav-link" onClick={() => scrollTo("how-it-works")}>How it Works</button>
            <button className="nav-link" onClick={() => navigate("/providers")}>Providers</button>
            <button className="nav-link" onClick={() => scrollTo("about")}>About</button>
            <button className="nav-link" onClick={() => navigate("/contact")}>Contact</button>
          </div>

          {/* ✅ Auth Buttons — Login + Get Started */}
          <div className="hide-mobile" style={{ display: "flex", gap: 12 }}>
            <button className="btn-outline" style={{ padding: "9px 20px", fontSize: 14 }}
              onClick={() => navigate("/login")}>Log In</button>
            <button className="btn-primary" style={{ padding: "9px 20px", fontSize: 14 }}
              onClick={() => navigate("/register")}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        background: "linear-gradient(135deg, #EFF6FF 0%, #fff 60%)",
        padding: "100px 24px 60px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #DBEAFE 0%, transparent 70%)", opacity: 0.6 }} />
        <div style={{ position: "absolute", bottom: -50, left: -50, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #DBEAFE 0%, transparent 70%)", opacity: 0.4 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>

            {/* Left */}
            <div>
              <div className={`fade-up ${visible ? "show" : ""}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#DBEAFE", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
                <span style={{ fontSize: 12 }}>✨</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1D4ED8" }}>Trusted by 10,000+ customers</span>
              </div>

              <h1 className={`fade-up delay-1 ${visible ? "show" : ""} hero-title`} style={{ fontFamily: "'DM Serif Display', serif", fontSize: 56, lineHeight: 1.1, color: "#0F172A", marginBottom: 20, letterSpacing: "-0.02em" }}>
                Find Local Experts,<br />
                <span style={{ color: "#2563EB" }}>Book Instantly</span>
              </h1>

              <p className={`fade-up delay-2 ${visible ? "show" : ""}`} style={{ fontSize: 17, color: "#64748B", lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}>
                Connect with verified local service professionals for plumbing, electrical work, cleaning and more — all in one place.
              </p>

              {/* ✅ Search Bar — Enter key + blank search both work */}
              <div className={`fade-up delay-3 ${visible ? "show" : ""}`} style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <input
                  className="search-input"
                  placeholder="🏙️  Enter your city or area..."
                  value={searchCity}
                  onChange={e => setSearchCity(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  style={{ flex: 1, minWidth: 200 }}
                />
                <button className="btn-primary" onClick={handleSearch}>
                  Find Providers
                </button>
              </div>

              {/* ✅ Quick Pills — click to navigate with category filter */}
              <div className={`fade-up delay-4 ${visible ? "show" : ""}`} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {QUICK_PILLS.map(tag => (
                  <button key={tag} className="pill-tag" onClick={() => handlePillClick(tag)}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — Mock Card */}
            <div className={`fade-up delay-3 hero-card ${visible ? "show" : ""}`} style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(37,99,235,0.12)", padding: 28, width: "100%", maxWidth: 360, border: "1px solid #EFF6FF" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #F1F5F9" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🔧</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>Ramesh Kumar</div>
                    <div style={{ color: "#64748B", fontSize: 13 }}>Plumber • Mumbai</div>
                    <div style={{ color: "#F59E0B", fontSize: 12, marginTop: 2 }}>⭐⭐⭐⭐⭐ 4.9</div>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>SERVICE</div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>Pipe leak repair</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>DATE</div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>Mar 6, 2026</div>
                  </div>
                  <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>PRICE</div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#2563EB" }}>₹500</div>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>BOOKING STATUS</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0,1,2,3].map(i => (
                      <div key={i} style={{ height: 6, flex: 1, borderRadius: 10, background: i <= 1 ? "#2563EB" : "#E2E8F0" }} />
                    ))}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: "#2563EB" }}>✅ Confirmed</div>
                </div>
                <button className="btn-primary" style={{ width: "100%" }} onClick={() => navigate("/login")}>
                  Track Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "#2563EB", padding: "48px 24px", width: "100%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, textAlign: "center" }} className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "#fff", marginBottom: 4 }}>{s.value}</div>
              <div style={{ color: "#BFDBFE", fontSize: 14 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ← id added ── */}
      <section id="categories" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#2563EB", fontWeight: 600, fontSize: 13, letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>What We Offer</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: "#0F172A", marginBottom: 14 }}>Browse Service Categories</h2>
            <p style={{ color: "#64748B", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>From home repairs to professional cleaning — find the right expert for every job.</p>
          </div>

          <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="cat-card" style={{ background: "#FAFCFF", border: "1.5px solid #EFF6FF", borderRadius: 16, padding: "28px 24px", display: "flex", alignItems: "center", gap: 18 }}
                onClick={() => handleCategoryClick(cat.name)}>
                <div style={{ width: 56, height: 56, background: "#EFF6FF", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{cat.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{cat.name}</div>
                  <div style={{ color: "#94A3B8", fontSize: 13 }}>{cat.count}</div>
                </div>
                <div style={{ marginLeft: "auto", color: "#CBD5E1", fontSize: 18 }}>→</div>
              </div>
            ))}
          </div>

          {/* ✅ View All — navigates to providers */}
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <button className="btn-outline" onClick={() => navigate("/providers")}>
              View All Providers →
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ← id added ── */}
      <section id="how-it-works" style={{ padding: "80px 24px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#2563EB", fontWeight: 600, fontSize: 13, letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>Simple Process</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: "#0F172A" }}>How LocalMaster Works</h2>
          </div>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ textAlign: "center", padding: "0 16px" }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 52, color: "#DBEAFE", lineHeight: 1, marginBottom: 8 }}>{step.num}</div>
                <div style={{ width: 56, height: 56, background: "#EFF6FF", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 24 }}>{step.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
    <section id="about" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 60, alignItems: "center",
            }} className="hero-grid">

            {/* Left — Text */}
            <div>
                <p style={{
                color: "#2563EB", fontWeight: 600, fontSize: 13,
                letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase",
                }}>Who We Are</p>
                <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 40, color: "#0F172A", marginBottom: 20, lineHeight: 1.2,
                }}>
                India's Trusted Local<br />Services Platform
                </h2>
                <p style={{
                color: "#64748B", fontSize: 16, lineHeight: 1.8, marginBottom: 20,
                }}>
                LocalMaster was built with one mission — to make finding and booking
                trusted home service professionals simple, fast and reliable for
                every Indian household.
                </p>
                <p style={{
                color: "#64748B", fontSize: 16, lineHeight: 1.8, marginBottom: 32,
                }}>
                We connect skilled professionals with customers who need them — from
                plumbers and electricians to cleaners and carpenters — all verified,
                all rated, all just a click away.
                </p>
                <button
                className="btn-primary"
                onClick={() => navigate("/register")}
                >
                Join LocalMaster →
                </button>
            </div>

            {/* Right — Trust Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                {
                    icon: "✅",
                    title: "Verified Professionals",
                    desc: "Every provider is manually reviewed and approved by our team before appearing on the platform.",
                    bg: "#F0FDF4", border: "#86EFAC",
                },
                {
                    icon: "⭐",
                    title: "Ratings & Reviews",
                    desc: "Real reviews from real customers help you choose the best provider with confidence.",
                    bg: "#FFFBEB", border: "#FDE68A",
                },
                {
                    icon: "⚡",
                    title: "Fast & Easy Booking",
                    desc: "Book a service in under 2 minutes. Track your booking status in real time.",
                    bg: "#EFF6FF", border: "#93C5FD",
                },
                ].map((item, i) => (
                <div key={i} style={{
                    background: item.bg,
                    border: `1.5px solid ${item.border}`,
                    borderRadius: 14, padding: "20px 24px",
                    display: "flex", gap: 16, alignItems: "flex-start",
                    transition: "transform 0.2s",
                }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateX(6px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
                >
                    <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
                    <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                        {item.title}
                    </div>
                    <div style={{ color: "#64748B", fontSize: 14, lineHeight: 1.65 }}>
                        {item.desc}
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
    </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#2563EB", fontWeight: 600, fontSize: 13, letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>Customer Stories</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: "#0F172A" }}>What Our Customers Say</h2>
          </div>
          <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card" style={{ background: "#FAFCFF", border: "1.5px solid #EFF6FF", borderRadius: 16, padding: 28 }}>
                <div style={{ color: "#F59E0B", fontSize: 16, marginBottom: 14 }}>{"⭐".repeat(t.rating)}</div>
                <p style={{ color: "#334155", fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2563EB", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: "#94A3B8", fontSize: 12 }}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 42, color: "#fff", marginBottom: 16 }}>Ready to Get Started?</h2>
          <p style={{ color: "#BFDBFE", fontSize: 17, marginBottom: 36, lineHeight: 1.65 }}>
            Join thousands of happy customers who trust LocalMaster for all their home service needs.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ background: "#fff", color: "#2563EB", border: "none", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "transform 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              onClick={() => navigate("/register")}>
              Book a Service
            </button>
            <button style={{ background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.5)", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              onClick={() => navigate("/register")}>
              Become a Provider
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ← id added ── */}
      <footer id="footer" style={{ background: "#0F172A", color: "#94A3B8", padding: "48px 24px 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24, paddingBottom: 28, borderBottom: "1px solid #1E293B", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, background: "#2563EB", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔧</div>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#fff" }}>LocalMaster</span>
            </div>
            <div style={{ display: "flex", gap: 28 }}>
              <button className="footer-link" onClick={() => scrollTo("categories")}>Services</button>
              <button className="footer-link" onClick={() => navigate("/providers")}>Providers</button>
              <button className="footer-link" onClick={() => scrollTo("how-it-works")}>How it Works</button>
              <button className="footer-link" onClick={() => scrollTo("about")}>About</button>
              <button className="footer-link" onClick={() => navigate("/contact")}>Contact</button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 13 }}>
            <span>© 2026 LocalMaster. All Rights Reserved. Built with ❤️</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
