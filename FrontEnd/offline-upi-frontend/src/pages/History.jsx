import { useState } from "react";
import API from "../services/api";

function History() {
  const [upiId, setupiId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  async function fetchHistory(e) {
    e.preventDefault();

    try {
      const response = await API.get(`/payments/history/${upiId}`);
      setTransactions(response.data);

      if (response.data.length === 0) {
        setMessage("No transactions found");
      } else {
        setMessage("");
      }
    } catch (error) {
      console.log(error);
      setMessage("Failed to fetch history");
      setTransactions([]);
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

  function getDotClass(status) {
    if (!status) return "";
    const s = status.toUpperCase();
    if (s.includes("SUCCESS")) return "dot-success";
    if (s.includes("FAIL") || s.includes("TAMPER")) return "dot-failed";
    if (s.includes("PENDING")) return "dot-pending";
    if (s.includes("EXPIRE")) return "dot-expired";
    return "";
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Transaction History</h1>
        <p className="page-subtitle">Inquire all online/offline payment ledger records for a UPI ID</p>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Search */}
        <div className="dark-card" style={{ marginBottom: 24 }}>
          <form onSubmit={fetchHistory}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, display: "block" }}>
              Search UPI ID
            </label>
            <div className="input-row">
              <input
                type="text"
                placeholder="Enter complete UPI ID"
                value={upiId}
                onChange={(e) => setupiId(e.target.value)}
                className="input"
                required
                style={{ background: "var(--bg-700)", border: "1.5px solid var(--border-dark)", color: "var(--text-primary)" }}
              />
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                Search Ledger
              </button>
            </div>
          </form>

          {message && (
            <div className={`alert ${message.toLowerCase().includes("fail") || message.toLowerCase().includes("no") ? "alert-error" : "alert-success"}`} style={{ marginTop: 16, marginBottom: 0 }}>
              <span>{message.toLowerCase().includes("fail") || message.toLowerCase().includes("no") ? "✕" : "✓"}</span>
              {message}
            </div>
          )}
        </div>

        {/* Results as timeline */}
        {transactions.length > 0 && (
          <>
            <div className="section-title">
              Ledger Records
              <span className="badge badge-processed" style={{ marginLeft: 8 }}>{transactions.length}</span>
            </div>

            <div className="timeline">
              {transactions.map((txn) => (
                <div key={txn.id} className="timeline-item">
                  <div className={`timeline-dot ${getDotClass(txn.status)}`}>
                    {txn.status === "SUCCESS" ? "✓" : txn.status === "FAILED" ? "✕" : "●"}
                  </div>
                  <div className="timeline-card">
                    <div className="timeline-meta">
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--teal)", wordBreak: "break-all" }}>
                          TXN: {txn.transactionId}
                        </div>
                        <div className="timeline-time" style={{ marginTop: 2 }}>
                          {txn.createdAt}
                        </div>
                      </div>
                      <span className={`badge ${getBadgeClass(txn.status)}`}>{txn.status}</span>
                    </div>

                    <div className="packet-meta" style={{ marginBottom: 0 }}>
                      <div className="packet-meta-item">
                        <span className="packet-meta-label">Sender</span>
                        <span className="packet-meta-value">{txn.senderUpi}</span>
                      </div>
                      <div className="packet-meta-item">
                        <span className="packet-meta-label">Receiver</span>
                        <span className="packet-meta-value">{txn.receiverUpi}</span>
                      </div>
                      <div className="packet-meta-item">
                        <span className="packet-meta-label">Amount</span>
                        <span className="packet-meta-value amount" style={{ color: txn.status === "SUCCESS" ? "var(--success)" : "var(--text-primary)" }}>
                          ₹{txn.amount}
                        </span>
                      </div>
                    </div>

                    {txn.failureReason && (
                      <div style={{
                        marginTop: 12,
                        fontSize: 12,
                        color: "var(--failed)",
                        background: "var(--failed-bg)",
                        padding: "8px 12px",
                        borderRadius: "var(--radius-sm)",
                        borderLeft: "3px solid var(--failed)",
                      }}>
                        <strong>Rejection:</strong> {txn.failureReason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {transactions.length === 0 && !message && (
          <div className="dark-card">
            <div className="empty-state">
              <span className="empty-icon">📒</span>
              <p className="empty-text">Search for a UPI ID to view its complete transaction history and payment ledger.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;