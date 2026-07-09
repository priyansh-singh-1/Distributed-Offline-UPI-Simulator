import { useState } from "react";
import API from "../services/api";

function PacketStatus() {
  const [packetId, setPacketId] = useState("");
  const [packet, setPacket] = useState(null);
  const [message, setMessage] = useState("");

  async function fetchStatus(e) {
    e.preventDefault();

    try {
      const response = await API.get(`/offline-payments/status/${packetId}`);

      setPacket(response.data);
      setMessage("");
    } catch (error) {
      console.log(error);
      setMessage("Packet not found");
      setPacket(null);
    }
  }

  function getBadgeClass(status) {
    if (!status) return "badge-processed";
    const s = status.toUpperCase();
    if (s.includes("SUCCESS") || s.includes("SETTLED")) return "badge-success";
    if (s.includes("FAIL") || s.includes("TAMPER")) return "badge-failed";
    if (s.includes("PENDING")) return "badge-pending";
    if (s.includes("EXPIRE")) return "badge-expired";
    return "badge-processed";
  }

  // Stepper State helpers
  const isCreated = !!packet;
  const isAuthorized = packet && packet.status !== "PENDING";
  const isProcessed = packet && (packet.status === "SUCCESS" || packet.status === "FAILED" || packet.status === "EXPIRED" || packet.status === "TAMPERED" || !!packet.processedAt);
  const isFailed = packet && (packet.status === "FAILED" || packet.status === "TAMPERED" || packet.status === "EXPIRED");

  const steps = [
    { num: 1, label: "Packet Created" },
    { num: 2, label: "Authorized by Relay" },
    { num: 3, label: "Settled at Bank" },
  ];

  function getStepState(idx) {
    if (idx === 0) return isCreated ? "completed" : "";
    if (idx === 1) {
      if (isAuthorized) return isFailed && !isProcessed ? "step-failed" : "completed";
      return packet ? "active" : "";
    }
    if (idx === 2) {
      if (isProcessed) return isFailed ? "step-failed" : "completed";
      return isAuthorized ? "active" : "";
    }
    return "";
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Packet Status Tracker</h1>
        <p className="page-subtitle">Track offline payment packet lifecycle milestones in real-time</p>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Search */}
        <div className="dark-card" style={{ marginBottom: 24 }}>
          <form onSubmit={fetchStatus}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, display: "block" }}>
              Search Packet ID
            </label>
            <div className="input-row">
              <input
                type="text"
                placeholder="Enter complete Packet ID"
                value={packetId}
                onChange={(e) => setPacketId(e.target.value)}
                className="input"
                required
                style={{ background: "var(--bg-700)", border: "1.5px solid var(--border-dark)", color: "var(--text-primary)" }}
              />
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                Track Packet
              </button>
            </div>
          </form>

          {message && (
            <div className="alert alert-error" style={{ marginTop: 16, marginBottom: 0 }}>
              <span>✕</span> {message}
            </div>
          )}
        </div>

        {packet && (
          <>
            {/* Stepper */}
            <div className="dark-card" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 20, textAlign: "center" }}>
                Lifecycle Milestones
              </div>
              <div className="stepper">
                {steps.map((s, idx) => (
                  <div key={s.num} className={`step ${getStepState(idx)}`}>
                    <div className="step-bubble">
                      {getStepState(idx) === "completed" ? "✓" : getStepState(idx) === "step-failed" ? "✕" : s.num}
                    </div>
                    <div className="step-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packet details */}
            <div className="dark-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>
                    Tracking Telemetry
                  </div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 600, color: "var(--text-primary)", margin: "4px 0 0" }}>
                    Packet Specifications
                  </h3>
                </div>
                <span className={`badge ${getBadgeClass(packet.status)}`} style={{ fontSize: 12, padding: "5px 14px" }}>
                  {packet.status}
                </span>
              </div>

              <div>
                {[
                  { label: "Packet ID",    value: packet.packetId,    mono: true },
                  { label: "Sender UPI",   value: packet.senderUpi },
                  { label: "Receiver UPI", value: packet.receiverUpi },
                  { label: "Amount",       value: `₹${packet.amount}`, accent: true },
                  { label: "TTL Window",   value: `${packet.ttlSeconds} seconds` },
                  { label: "Created At",   value: packet.createdAt },
                  { label: "Processed At", value: packet.processedAt || "Not processed yet" },
                ].map((row) => (
                  <div className="detail-row" key={row.label}>
                    <span className="detail-label">{row.label}</span>
                    <span className="detail-value" style={{
                      fontFamily: row.mono ? "var(--font-mono)" : undefined,
                      fontSize: row.mono ? 11 : undefined,
                      color: row.accent ? "var(--teal)" : undefined,
                    }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!packet && !message && (
          <div className="dark-card">
            <div className="empty-state">
              <span className="empty-icon">⊙</span>
              <p className="empty-text">Enter a Packet ID to view its current lifecycle status, routing milestones, and settlement details.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PacketStatus;