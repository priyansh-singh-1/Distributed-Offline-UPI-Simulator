import { useState } from "react";
import API from "../services/api";

function RelayLogs() {
  const [packetId, setPacketId] = useState("");
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");

  async function fetchLogs(e) {
    e.preventDefault();

    if (!packetId.trim()) {
      setMessage("Please enter packet ID");
      return;
    }

    try {
      const response = await API.get(
        `/offline-payments/logs/${packetId.trim()}`
      );

      setLogs(response.data);

      if (response.data.length === 0) {
        setMessage("No logs found for this packet");
      } else {
        setMessage("");
      }
    } catch (error) {
      console.log(error);
      setMessage("Failed to fetch relay logs");
      setLogs([]);
    }
  }

  function getDotClass(action) {
    if (!action) return "";
    const a = action.toUpperCase();
    if (a.includes("FORWARD")) return "dot-forwarded";
    if (a.includes("SUCCESS") || a.includes("SETTLE")) return "dot-success";
    if (a.includes("FAIL") || a.includes("REJECT")) return "dot-failed";
    if (a.includes("EXPIRE")) return "dot-expired";
    if (a.includes("TAMPER")) return "dot-tampered";
    return "";
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Relay Logs</h1>
        <p className="page-subtitle">Inspect audit trail and relay routing events for a specific offline packet</p>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Search */}
        <div className="dark-card" style={{ marginBottom: 24 }}>
          <form onSubmit={fetchLogs}>
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
                Fetch Logs
              </button>
            </div>
          </form>

          {message && (
            <div className={`alert ${message.toLowerCase().includes("fail") || message.toLowerCase().includes("no") ? "alert-error" : "alert-warning"}`} style={{ marginTop: 16, marginBottom: 0 }}>
              <span>⚠</span> {message}
            </div>
          )}
        </div>

        {/* Timeline */}
        {logs.length > 0 && (
          <>
            <div className="section-title">
              Relay Audit Trail
              <span className="badge badge-forwarded" style={{ marginLeft: 8 }}>{logs.length} events</span>
            </div>

            <div className="timeline">
              {logs.map((log) => (
                <div key={log.id} className="timeline-item">
                  <div className={`timeline-dot ${getDotClass(log.action)}`}>
                    {log.action?.includes("FORWARD") ? "↗" : "●"}
                  </div>
                  <div className="timeline-card">
                    <div className="timeline-meta">
                      <span className="timeline-node">
                        {log.relayNodeId}
                      </span>
                      <span className="timeline-time">{log.createdAt}</span>
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <span className="badge badge-forwarded" style={{ fontSize: 10 }}>{log.action}</span>
                    </div>
                    <div className="timeline-msg">{log.message}</div>
                    <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      PKT: {log.packetId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {logs.length === 0 && !message && (
          <div className="dark-card">
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p className="empty-text">Enter a Packet ID above to view its relay routing audit trail and lifecycle events.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RelayLogs;