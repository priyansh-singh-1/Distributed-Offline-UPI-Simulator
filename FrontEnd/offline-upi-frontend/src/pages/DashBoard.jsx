import { Link } from "react-router-dom";

function Dashboard() {
  const userEmail = localStorage.getItem("userEmail") || "Guest User";

  const quickActions = [
    {
      to: "/send-money",
      icon: "↗",
      title: "Send Money",
      desc: "Transfer funds between UPI nodes via standard online banking rails with PIN verification.",
      color: "var(--teal)",
    },
    {
      to: "/create-packet",
      icon: "⬡",
      title: "Create Offline Packet",
      desc: "Generate a signed offline payment packet with custom TTL, SHA-256 hash, and QR token.",
      color: "var(--sky)",
    },
    {
      to: "/relay",
      icon: "⟳",
      title: "Relay Dashboard",
      desc: "Simulate a merchant relay node that collects and forwards offline packets to the bank server.",
      color: "var(--indigo)",
    },
    {
      to: "/admin",
      icon: "⊞",
      title: "Admin Dashboard",
      desc: "Monitor system-wide telemetry: users, transactions, packet states, and total flow.",
      color: "var(--purple)",
    },
    {
      to: "/balance",
      icon: "◎",
      title: "Check Balance",
      desc: "Inquire real-time account ledger balance for any active UPI node in the simulator.",
      color: "var(--teal)",
    },
    {
      to: "/packet-status",
      icon: "⊙",
      title: "Track Packet",
      desc: "Look up packet lifecycle milestones, TTL status, relay authorization, and settlement.",
      color: "var(--sky)",
    },
  ];

  const features = [
    { icon: "🔐", label: "SHA-256 Tamper Detection" },
    { icon: "📡", label: "Relay Node Forwarding" },
    { icon: "⏱", label: "TTL Expiry Enforcement" },
    { icon: "⚡", label: "WebSocket Live Updates" },
    { icon: "📦", label: "QR Packet Sharing" },
    { icon: "📊", label: "Idempotency Checks" },
    { icon: "🛡", label: "Fraud Rule Engine" },
    { icon: "🧾", label: "Digital Receipts" },
  ];

  return (
    <div className="page">
      {/* Hero card */}
      <div className="hero-card">
        <div className="hero-badge">⚡ Advanced Fintech Simulation</div>
        <h1 className="hero-title">
          Distributed Offline UPI<br />Payment Simulator
        </h1>
        <p className="hero-desc">
          A production-grade simulation of India's UPI infrastructure with offline packet generation,
          relay node forwarding, SHA-256 tamper detection, TTL validation, idempotency enforcement,
          fraud rule checks, and WebSocket real-time updates.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/create-packet" className="btn btn-primary">
            Create Offline Packet  →
          </Link>
          <Link to="/relay" className="btn btn-ghost">
            Open Relay Dashboard
          </Link>
        </div>

        {/* Feature chips */}
        <div className="feature-chips" style={{ marginTop: 24 }}>
          {features.map((f) => (
            <div className="feature-chip" key={f.label}>
              <span>{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="section-title">Quick Actions</div>
      <div className="action-grid">
        {quickActions.map((a) => (
          <Link key={a.to} to={a.to} className="action-card">
            <div
              className="action-card-icon"
              style={{
                background: `${a.color}18`,
                border: `1px solid ${a.color}30`,
                color: a.color,
                fontFamily: "var(--font-heading)",
                fontSize: 22,
              }}
            >
              {a.icon}
            </div>
            <div>
              <div className="action-card-title">{a.title}</div>
              <div className="action-card-desc">{a.desc}</div>
            </div>
            <div className="action-card-arrow" style={{ color: a.color }}>
              Launch  →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;