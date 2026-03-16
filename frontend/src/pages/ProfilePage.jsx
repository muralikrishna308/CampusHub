import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

const useAuth = () => useContext(AuthContext);

// ─── Normalize backend user → profile shape ───────────────────────────────────
// Handles common field name variations your backend might return.
// Add/rename fields here to match your actual API response.
function normalizeUser(u) {
  if (!u) return null;
  return {
    // Identity
    name:       u.name       || u.fullName    || u.full_name  || u.displayName || u.username || "Unknown",
    username:   u.username   || u.name        || u.email?.split("@")[0] || "user",
    email:      u.email      || "",
    role:       (u.role      || "STUDENT").toUpperCase(),
    avatar:     u.avatar     || u.profilePic  || u.picture    || null,

    // Contact
    phone:      u.phone      || u.phoneNumber || u.mobile     || "",
    location:   u.location   || u.city        || u.address    || "",

    // Academic
    college:    u.college    || u.institution || u.school     || "",
    department: u.department || u.dept        || u.branch     || "",
    year:       u.year       || u.yearOfStudy || u.batch      || "",


    // Profile
    bio:        u.bio        || u.about       || u.description|| "",
    interests:  Array.isArray(u.interests)    ? u.interests
              : Array.isArray(u.skills)       ? u.skills
              : [],

    // Stats — these likely come from separate API calls; using fallbacks for now
    joinedDate:     u.joinedDate    || u.createdAt
                      ? new Date(u.createdAt || u.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                      : "N/A",
    registrations:  u.registrations  ?? u.totalRegistrations  ?? 0,
    eventsAttended: u.eventsAttended ?? u.attendedCount        ?? 0,
  };
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "12px",
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      flex: "1",
      minWidth: "100px",
    }}>
      <span style={{ fontSize: "22px", fontWeight: "700", color: "#fff", fontFamily: "'Syne', sans-serif" }}>{value}</span>
      <span style={{ fontSize: "12px", color: "#6b7280", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "5px" }}>
        {icon} {label}
      </span>
    </div>
  );
}

// ─── Interest Tag ─────────────────────────────────────────────────────────────
function Tag({ label }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "5px 14px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "500",
      background: "rgba(124, 58, 237, 0.15)",
      border: "1px solid rgba(124, 58, 237, 0.35)",
      color: "#a78bfa",
      letterSpacing: "0.02em",
    }}>{label}</span>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoField({ label, value, icon }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "5px" }}>
        {icon} {label}
      </span>
      <span style={{ fontSize: "14px", color: value ? "#e5e7eb" : "#4b5563", fontWeight: value ? "500" : "400" }}>
        {value || "Not provided"}
      </span>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function Section({ title, children, action }) {
  return (
    <div style={{
      background: "#131825",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "16px",
      padding: "24px 28px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#e5e7eb", letterSpacing: "0.03em", fontFamily: "'Syne', sans-serif" }}>
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ ...user });
  const [interestInput, setInterestInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const SUGGESTED_SKILLS = [
    "Web Development", "Mobile Development", "AI/ML", "Data Science", "Cybersecurity",
    "Cloud Computing", "DevOps", "Blockchain", "UI/UX Design", "Game Development",
    "Open Source", "Competitive Programming", "Robotics", "IoT", "AR/VR",
    "Python", "JavaScript", "React", "Node.js", "Java", "C++", "Rust", "Go",
    "Machine Learning", "Deep Learning", "Computer Vision", "NLP",
    "Public Speaking", "Leadership", "Research", "Entrepreneurship", "Design Thinking",
  ];

  const filtered = SUGGESTED_SKILLS.filter(s =>
    s.toLowerCase().includes(interestInput.toLowerCase()) &&
    !form.interests.includes(s)
  );

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const addInterest = (val) => {
    const trimmed = (val || interestInput).trim();
    if (trimmed && !form.interests.includes(trimmed)) {
      set("interests", [...form.interests, trimmed]);
      setInterestInput("");
      setShowDropdown(false);
    }
  };
  const removeInterest = (i) => set("interests", form.interests.filter((_, idx) => idx !== i));

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#e5e7eb",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const labelStyle = {
    fontSize: "12px",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "#0f1623",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "20px",
        padding: "32px",
        width: "100%",
        maxWidth: "560px",
        maxHeight: "85vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#fff", fontFamily: "'Syne', sans-serif" }}>Edit Profile</h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "8px", color: "#9ca3af", cursor: "pointer", padding: "6px 10px", fontSize: "18px" }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {[["Name", "name"], ["Phone", "phone"], ["Location", "location"]].map(([lbl, key]) => (
            <div key={key}>
              <label style={labelStyle}>{lbl}</label>
              <input style={inputStyle} value={form[key] || ""} onChange={e => set(key, e.target.value)} />
            </div>
          ))}
        </div>

        <div>
          <label style={labelStyle}>Bio</label>
          <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={form.bio || ""} onChange={e => set("bio", e.target.value)} />
        </div>

        {/* ── Interests & Skills with suggestions ── */}
        <div>
          <label style={labelStyle}>Interests & Skills</label>

          {/* Search input + dropdown */}
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  style={{ ...inputStyle, paddingRight: "36px" }}
                  value={interestInput}
                  onChange={e => { setInterestInput(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  onKeyDown={e => e.key === "Enter" && addInterest()}
                  placeholder="Search or type a skill..."
                />
                <svg style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>

                {/* Dropdown */}
                {showDropdown && filtered.length > 0 && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200,
                    background: "#0f1623",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "10px",
                    maxHeight: "180px",
                    overflowY: "auto",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}>
                    {filtered.map((s, i) => (
                      <div key={i}
                        onMouseDown={() => addInterest(s)}
                        style={{
                          padding: "9px 14px",
                          fontSize: "13px",
                          color: "#d1d5db",
                          cursor: "pointer",
                          borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                          display: "flex", alignItems: "center", gap: "8px",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.15)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onMouseDown={() => addInterest()}
                style={{ padding: "10px 16px", background: "#7c3aed", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", fontSize: "13px", fontWeight: "600" }}>
                Add
              </button>
            </div>
          </div>

          {/* Quick-pick suggestions */}
          {form.interests.length < 8 && (
            <div style={{ marginBottom: "12px" }}>
              <p style={{ fontSize: "11px", color: "#4b5563", marginBottom: "8px", letterSpacing: "0.04em" }}>POPULAR PICKS</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {SUGGESTED_SKILLS.filter(s => !form.interests.includes(s)).slice(0, 10).map((s, i) => (
                  <button key={i} onClick={() => addInterest(s)} style={{
                    padding: "4px 12px", borderRadius: "999px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#9ca3af", fontSize: "12px", cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.15)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; e.currentTarget.style.color = "#a78bfa"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#9ca3af"; }}
                  >+ {s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Selected tags */}
          {form.interests.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {form.interests.map((t, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "999px", background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.35)", color: "#a78bfa", fontSize: "12px", fontWeight: "500" }}>
                  {t}
                  <button onClick={() => removeInterest(i)} style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer", padding: 0, lineHeight: 1, fontSize: "14px", opacity: 0.7 }}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#9ca3af", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} style={{ padding: "10px 22px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", fontWeight: "600", fontFamily: "inherit" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Profile Page ────────────────────────────────────────────────────────
function ProfilePage() {
  const auth = useAuth();
  const [profile, setProfile] = useState(() => normalizeUser(auth?.user));

  // Keep profile in sync if auth.user changes (e.g. after save-to-backend)
  React.useEffect(() => {
    if (auth?.user) setProfile(normalizeUser(auth.user));
  }, [auth?.user]);
  const [editing, setEditing] = useState(false);

  if (!profile) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0f1a", color: "#6b7280", fontFamily: "'DM Sans', sans-serif" }}>
      Loading profile...
    </div>
  );

  const initials = profile.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>

      <div className="dashboard-container">
        <Sidebar role="student" />

        <main className="main-content" style={{ fontFamily: "'DM Sans', sans-serif", color: "#e5e7eb" }}>

          {/* ── Hero card ── */}
          <div style={{
            background: "#131825",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "28px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* subtle top glow */}
            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
              {/* Avatar */}
              <div style={{ position: "relative" }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "26px", fontWeight: "800", color: "#fff",
                  fontFamily: "'Syne', sans-serif",
                  boxShadow: "0 0 0 3px rgba(124,58,237,0.3)",
                }}>
                  {initials}
                </div>
                <div style={{
                  position: "absolute", bottom: "2px", right: "2px",
                  width: "12px", height: "12px", borderRadius: "50%",
                  background: "#10b981", border: "2px solid #131825",
                }} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: "180px" }}>
                <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#fff", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em", marginBottom: "4px" }}>
                  {profile.name}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "#9ca3af" }}>{profile.department} • Year {profile.year}</span>
                  <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#4b5563" }} />
                  <span style={{ fontSize: "13px", color: "#7c3aed", fontWeight: "600" }}>{profile.college}</span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "999px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", letterSpacing: "0.05em", fontWeight: "500" }}>
                    ● ACTIVE
                  </span>
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "999px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", letterSpacing: "0.05em", fontWeight: "500" }}>
                    {profile.role}
                  </span>
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => setEditing(true)}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "12px", marginTop: "22px", flexWrap: "wrap" }}>
              <StatCard label="Member Since" value={profile.joinedDate} icon={
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              } />
              <StatCard label="Registered Events" value={profile.registrations} icon={
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
              } />
              <StatCard label="Events Attended" value={profile.eventsAttended} icon={
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/></svg>
              } />
            </div>
          </div>

          {/* ── Two column grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

            <Section title="Personal Information">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                <InfoField label="Email" value={profile.email} icon={
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                } />
                <InfoField label="Phone" value={profile.phone} icon={
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                } />
                <InfoField label="Location" value={profile.location} icon={
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                } />
              </div>
            </Section>

            {/* Academic Info */}
            <Section title="Academic Information">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                <InfoField label="College" value={profile.college} icon={
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                } />
                <InfoField label="Department" value={profile.department} icon={
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4"/></svg>
                } />
                <InfoField label="Year" value={profile.year ? `Year ${profile.year}` : null} icon={
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                } />
                <InfoField label="Role" value={profile.role} icon={
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                } />
              </div>
            </Section>
          </div>

          {/* ── About + Interests ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Section title="About Me">
              {profile.bio ? (
                <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: "1.7", margin: 0 }}>{profile.bio}</p>
              ) : (
                <p style={{ fontSize: "14px", color: "#4b5563", fontStyle: "italic", margin: 0 }}>No bio added yet. Tell others about yourself!</p>
              )}
            </Section>

            <Section title="Interests & Skills">
              {profile.interests?.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {profile.interests.map((t, i) => <Tag key={i} label={t} />)}
                </div>
              ) : (
                <p style={{ fontSize: "14px", color: "#4b5563", fontStyle: "italic", margin: 0 }}>No interests added yet.</p>
              )}
            </Section>
          </div>

        </main>
      </div>

      {editing && <EditModal user={profile} onClose={() => setEditing(false)} onSave={setProfile} />}
    </>
  );
}

export default ProfilePage;