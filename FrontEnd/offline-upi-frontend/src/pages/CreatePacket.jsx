import { useState } from "react";
import API from "../services/api";
import QRCode from "react-qr-code";

function CreatePacket() {
  const [formData, setFormData] = useState({
    senderUpi: "",
    receiverUpi: "",
    amount: "",
    upiPin: "",
    ttlSeconds: "",
  });
  const [packet, setPacket] = useState(null);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await API.post("/offline-payments/create-packet", {
        ...formData,
        amount: Number(formData.amount),
        ttlSeconds: Number(formData.ttlSeconds),
      });
      console.log("Packet response", response.data);
      setPacket(response.data);
      setMessage("Offline payment packet created successfully");
      setFormData({ senderUpi: "", receiverUpi: "", amount: "", upiPin: "", ttlSeconds: "" });
    } catch (error) {
      console.log(error);
      setMessage("Failed to create offline packet");
      setPacket(null);
    }
  }

  function getStatusClass(status) {
    if (!status) return "badge-processed";
    const s = status.toUpperCase();
    if (s.includes("PENDING")) return "badge-pending";
    if (s.includes("SUCCESS")) return "badge-success";
    if (s.includes("FAIL")) return "badge-failed";
    if (s.includes("EXPIRE")) return "badge-expired";
    return "badge-processed";
  }

  const isSuccess = message && !message.toLowerCase().includes("fail");

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Create Offline Packet</h1>
        <p className="page-subtitle">
          Generate a cryptographically signed offline payment packet with QR token for relay forwarding
        </p>
      </div>

      {message && (
        <div className={`alert ${isSuccess ? "alert-success" : "alert-error"}`} style={{ maxWidth: packet ? "none" : 540, marginBottom: 20 }}>
          <span>{isSuccess ? "✓" : "✕"}</span> {message}
        </div>
      )}

      <div className={packet ? "packet-grid" : ""} style={!packet ? { maxWidth: 540, margin: "0 auto" } : {}}>
        {/* Form */}
        <div className="form-card">
          <h3 style={{
            fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 600,
            color: "var(--text-dark)", marginBottom: 20, paddingBottom: 14,
            borderBottom: "1px solid var(--border-card)",
          }}>
            Packet Parameters
          </h3>

          <form onSubmit={handleSubmit}>
            {[
              { name: "senderUpi",   label: "Sender UPI",    type: "text",     ph: "priyanshu@offline" },
              { name: "receiverUpi", label: "Receiver UPI",  type: "text",     ph: "shopkeeper@offline" },
              { name: "amount",      label: "Amount (₹)",    type: "number",   ph: "e.g. 500" },
              { name: "upiPin",      label: "UPI PIN",       type: "password", ph: "4-6 digit PIN" },
              { name: "ttlSeconds",  label: "TTL (Seconds)", type: "number",   ph: "e.g. 600 = 10 min" },
            ].map((f) => (
              <div className="form-group" key={f.name}>
                <label className="form-label">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  placeholder={f.ph}
                  value={formData[f.name]}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            ))}

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 8 }}>
              ⬡  Generate Offline Packet
            </button>
          </form>
        </div>

        {/* Packet result */}
        {packet && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Details dark card */}
            <div className="dark-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 600, margin: 0 }}>
                  Packet Details
                </h3>
                <span className={`badge ${getStatusClass(packet.status)}`}>{packet.status}</span>
              </div>

              <div>
                {[
                  { label: "Packet ID",   value: packet.packetId,    mono: true },
                  { label: "Sender",      value: packet.senderUpi },
                  { label: "Receiver",    value: packet.receiverUpi },
                  { label: "Amount",      value: `₹${packet.amount}`, accent: true },
                  { label: "TTL",         value: `${packet.ttlSeconds}s` },
                  { label: "Created",     value: packet.createdAt },
                ].map((row) => (
                  <div className="detail-row" key={row.label}>
                    <span className="detail-label">{row.label}</span>
                    <span
                      className="detail-value"
                      style={{
                        fontFamily: row.mono ? "var(--font-mono)" : undefined,
                        fontSize: row.mono ? 11 : undefined,
                        color: row.accent ? "var(--teal)" : undefined,
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Hash box */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  SHA-256 Payload Hash
                </div>
                <div className="code-box">{packet.payLoadHash || "Hash not generated"}</div>
              </div>
            </div>

            {/* QR card */}
            <div className="qr-panel">
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                QR Packet Token
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>
                Scan to Transfer Packet ID
              </h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
                Relay nodes scan this QR to authorize and forward the packet to the bank
              </p>

              <div className="qr-box">
                <QRCode value={packet.packetId} size={170} />
              </div>

              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12 }}>
                Or copy the Packet ID manually to the Relay Dashboard
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePacket;