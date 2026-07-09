import { useState, useEffect } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");

  async function feetchDashboardStats() {
    try {
      const response = await API.get("/admin/dashboard");
      setStats(response.data);
      setMessage("");
    } catch (error) {
      console.log(error);
      setMessage("Failed to fetch admin dashboard data");
    }
  }

  useEffect(() => {
    feetchDashboardStats();
  }, []);

  const cardDetails = stats
    ? [
        { title: "Total Users",           value: stats.totalUsers,              icon: "👥", color: "var(--teal)" },
        { title: "Total Transactions",    value: stats.totalTransactions,       icon: "💳", color: "var(--sky)" },
        { title: "Successful Txns",       value: stats.successfulTransactions,  icon: "✅", color: "var(--success)" },
        { title: "Failed Txns",           value: stats.failedTransactions,      icon: "❌", color: "var(--failed)" },
        { title: "Pending Packets",       value: stats.pendingPackets,          icon: "📦", color: "var(--pending)" },
        { title: "Success Packets",       value: stats.successPackets,          icon: "🎉", color: "var(--success)" },
        { title: "Failed Packets",        value: stats.failedPackets,           icon: "⚠️", color: "var(--failed)" },
        { title: "Expired Packets",       value: stats.expiredPackets,          icon: "⏰", color: "var(--expired)" },
        { title: "Tampered Packets",      value: stats.tamperedPackets,         icon: "🚨", color: "var(--tampered)" },
      ]
    : [];

  const totalAmount = stats ? `₹${(stats.totalTransferredAmount || 0).toLocaleString("en-IN")}` : "—";

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">System-wide simulation telemetry and audit metrics</p>
        </div>
        <button onClick={feetchDashboardStats} className="btn btn-secondary">
          ⟳  Refresh Telemetry
        </button>
      </div>

      {message && (
        <div className="alert alert-error">
          <span>✕</span> {message}
        </div>
      )}

      {stats && (
        <>
          {/* Highlighted total transfer card */}
          <div className="stats-grid" style={{ marginBottom: 16 }}>
            <div className="stat-card stat-highlight">
              <div className="stat-card-glow" style={{ background: "radial-gradient(circle, var(--teal), transparent)" }} />
              <span className="stat-icon">💰</span>
              <div className="stat-label">Total Transferred Amount</div>
              <div className="stat-value">{totalAmount}</div>
              <div className="stat-footer">Aggregate across all settled transactions</div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="stats-grid">
            {cardDetails.map((card, idx) => (
              <div key={idx} className="stat-card">
                <div
                  className="stat-card-glow"
                  style={{ background: `radial-gradient(circle, ${card.color}, transparent)` }}
                />
                <span className="stat-icon">{card.icon}</span>
                <div className="stat-label">{card.title}</div>
                <div className="stat-value" style={{ borderLeft: `3px solid ${card.color}`, paddingLeft: 12 }}>
                  {card.value}
                </div>
                <div className="stat-footer">Simulated metric</div>
              </div>
            ))}
          </div>
        </>
      )}

      {!stats && !message && (
        <div className="dark-card">
          <div className="empty-state">
            <span className="empty-icon">📊</span>
            <p className="empty-text">Loading admin telemetry...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;