import { useState } from "react";
import API from "../services/api";

function CheckBalance() {
  const [upiId, setUpiId] = useState("");
  const [balanceData, setBalanceData] = useState(null);
  const [message, setMessage] = useState("");

  async function fetchBalance(e) {
    e.preventDefault();
    try {
      const response = await API.get(`/users/balance/${upiId}`);
      setBalanceData(response.data);
      setMessage("");
    } catch (error) {
      console.log(error);
      setMessage("Failed to fetch balance. UPI ID may be incorrect.");
      setBalanceData(null);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Check Balance</h1>
        <p className="page-subtitle">Query live account balance for any registered UPI node</p>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="form-card" style={{ marginBottom: 24 }}>
          <form onSubmit={fetchBalance}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">UPI ID</label>
              <div className="input-row">
                <input
                  type="text"
                  placeholder="e.g. priyanshu@offline"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="input"
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ width: "auto", flexShrink: 0 }}>
                  Check Balance
                </button>
              </div>
            </div>
          </form>

          {message && (
            <div className="alert alert-error" style={{ marginTop: 16, marginBottom: 0 }}>
              <span>✕</span> {message}
            </div>
          )}
        </div>

        {balanceData && (
          <div className="bank-card">
            <span className="bank-card-chip">💳</span>
            <div className="bank-card-upi">{balanceData.upiId}</div>
            <div className="bank-card-name">{balanceData.name}</div>
            <div className="bank-card-balance-label">Available Balance</div>
            <div className="bank-card-balance">
              ₹{Number(balanceData.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>

            <div style={{
              marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>
                Offline UPI Simulator
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, color: "var(--teal)",
                background: "rgba(20,184,166,0.12)", padding: "3px 10px", borderRadius: 20,
                border: "1px solid rgba(20,184,166,0.25)",
              }}>
                ACTIVE
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckBalance;