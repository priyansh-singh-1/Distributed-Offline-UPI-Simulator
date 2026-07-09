import { useState } from "react";
import API from "../services/api";

function SendMoney() {
  const [formData, setFormData] = useState({
    senderUpi: "",
    receiverUpi: "",
    amount: "",
    upiPin: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await API.post("/payments/send", {
        ...formData,
        amount: Number(formData.amount),
      });
      setMessage(response.data?.message || "Payment successful!");
      setFormData({ senderUpi: "", receiverUpi: "", amount: "", upiPin: "" });
    } catch (error) {
      console.error("Payment Error:", error);
      let errorMsg = "Payment failed";
      if (error.response) {
        errorMsg = error.response.data?.message || error.response.data || error.response.status;
      } else if (error.request) {
        errorMsg = "No response from server. Is backend running on http://localhost:8080?";
      } else {
        errorMsg = error.message;
      }
      setMessage(errorMsg);
    }
  }

  const isSuccess = message && (message.toLowerCase().includes("success") || message.toLowerCase().includes("successful"));

  const senderLabel = formData.senderUpi || "Sender";
  const receiverLabel = formData.receiverUpi || "Receiver";

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Send Money</h1>
        <p className="page-subtitle">Transfer funds via online UPI payment rails</p>
      </div>

      <div style={{ maxWidth: 540, margin: "0 auto" }}>
        {/* Transfer flow visualizer */}
        <div className="dark-card" style={{ marginBottom: 20, padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "var(--bg-600)", border: "2px solid var(--teal)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, margin: "0 auto 8px",
              }}>👤</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Sender</div>
              <div style={{ fontSize: 12, color: "var(--teal)", fontFamily: "var(--font-mono)", marginTop: 2, wordBreak: "break-all" }}>
                {senderLabel}
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              {formData.amount && (
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                  ₹{Number(formData.amount).toLocaleString("en-IN")}
                </div>
              )}
              <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg, var(--teal), var(--sky))", borderRadius: 2 }} />
                <span style={{ color: "var(--teal)", fontSize: 14 }}>▶</span>
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 0.5 }}>ONLINE UPI</div>
            </div>

            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "var(--bg-600)", border: "2px solid var(--sky)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, margin: "0 auto 8px",
              }}>🏦</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Receiver</div>
              <div style={{ fontSize: 12, color: "var(--sky)", fontFamily: "var(--font-mono)", marginTop: 2, wordBreak: "break-all" }}>
                {receiverLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="form-card">
          {message && (
            <div className={`alert ${isSuccess ? "alert-success" : "alert-error"}`} style={{ marginBottom: 20 }}>
              <span>{isSuccess ? "✓" : "✕"}</span>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Sender UPI ID</label>
              <input type="text" name="senderUpi" placeholder="e.g. priyanshu@offline"
                value={formData.senderUpi} onChange={handleChange} className="input" required />
            </div>

            <div className="form-group">
              <label className="form-label">Receiver UPI ID</label>
              <input type="text" name="receiverUpi" placeholder="e.g. shopkeeper@bank"
                value={formData.receiverUpi} onChange={handleChange} className="input" required />
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input type="number" name="amount" placeholder="Minimum ₹1"
                value={formData.amount} onChange={handleChange} className="input" required min="1" />
            </div>

            <div className="form-group">
              <label className="form-label">UPI PIN</label>
              <input type="password" name="upiPin" placeholder="Enter your secure PIN"
                value={formData.upiPin} onChange={handleChange} className="input" required />
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 8 }}>
              Send Payment  →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SendMoney;
