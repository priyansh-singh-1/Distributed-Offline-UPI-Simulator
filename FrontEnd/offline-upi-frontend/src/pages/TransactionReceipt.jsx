import { useState } from "react";
import API from "../services/api";

function Receipt() {
  const [transactionId, setTransactionId] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState("");

  async function fetchReceipt(e) {
    e.preventDefault();

    try {
      const response = await API.get(`/payments/receipt/${transactionId}`);
      setReceipt(response.data);
      setMessage("");
    } catch (error) {
      console.log(error);
      setMessage("Receipt not found");
      setReceipt(null);
    }
  }

  function printReceipt() {
    window.print();
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

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Transaction Receipt</h1>
        <p className="page-subtitle">Retrieve and print digital payment receipt vouchers</p>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* Search */}
        <div className="dark-card" style={{ marginBottom: 24 }}>
          <form onSubmit={fetchReceipt}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, display: "block" }}>
              Search Transaction ID
            </label>
            <div className="input-row">
              <input
                type="text"
                placeholder="Enter Transaction or Packet ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="input"
                required
                style={{ background: "var(--bg-700)", border: "1.5px solid var(--border-dark)", color: "var(--text-primary)" }}
              />
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                Get Receipt
              </button>
            </div>
          </form>

          {message && (
            <div className="alert alert-error" style={{ marginTop: 16, marginBottom: 0 }}>
              <span>✕</span> {message}
            </div>
          )}
        </div>

        {/* Receipt card */}
        {receipt && (
          <div className="receipt-outer">
            <div className="receipt-card">
              {/* Receipt header / dark top */}
              <div className="receipt-top">
                <span className="receipt-logo-icon">⇄</span>
                <div className="receipt-brand">Offline UPI Payment</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Receipt Voucher</div>
                <div className="receipt-amt">
                  ₹{receipt.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
                <span className={`badge ${getBadgeClass(receipt.status)}`} style={{ fontSize: 12, padding: "5px 14px" }}>
                  {receipt.status}
                </span>
              </div>

              {/* Divider with cutout circles */}
              <div className="receipt-divider">
                <div className="receipt-divider-line" />
              </div>

              {/* Body */}
              <div className="receipt-body">
                <div className="receipt-row">
                  <span className="receipt-key">Transaction ID</span>
                  <span className="receipt-val">{receipt.transactionId}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Sender UPI</span>
                  <span className="receipt-val">{receipt.senderUpi}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Receiver UPI</span>
                  <span className="receipt-val">{receipt.receiverUpi}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Timestamp</span>
                  <span className="receipt-val" style={{ fontFamily: "var(--font-body)" }}>
                    {receipt.createdAt ? new Date(receipt.createdAt).toLocaleString() : "N/A"}
                  </span>
                </div>

                {receipt.failureReason && (
                  <div style={{
                    marginTop: 12,
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--failed-bg)",
                    borderLeft: "3px solid var(--failed)",
                    fontSize: 12,
                    color: "var(--failed)",
                  }}>
                    <strong>Failure Reason:</strong> {receipt.failureReason}
                  </div>
                )}

                <div style={{ marginTop: 20, borderTop: "1px dashed #CBD5E1", paddingTop: 16 }}>
                  <button onClick={printReceipt} className="btn btn-primary btn-full">
                    🖨️  Print Receipt
                  </button>
                </div>
              </div>
            </div>
            <div className="receipt-footer-cut" />
          </div>
        )}

        {!receipt && !message && (
          <div className="dark-card">
            <div className="empty-state">
              <span className="empty-icon">🧾</span>
              <p className="empty-text">Enter a Transaction or Packet ID to retrieve its digital payment receipt voucher.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Receipt;
