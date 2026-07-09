import { useState } from "react";
import API from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    upiId: "",
    password: "",
    upiPin: "",
    balance: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await API.post("/auth/register", {
        ...formData,
        balance: Number(formData.balance),
      });
      setMessage(response.data);
      setFormData({ name: "", email: "", mobile: "", upiId: "", password: "", upiPin: "", balance: "" });
    } catch (error) {
      console.log(error);
      setMessage("Registration failed");
    }
  }

  const isSuccess = message && !message.toLowerCase().includes("fail");

  return (
    <div className="page" style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 32 }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: 52, height: 52,
            background: "linear-gradient(135deg, var(--teal) 0%, var(--sky-dark) 100%)",
            borderRadius: 14, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 24, margin: "0 auto 14px",
            boxShadow: "var(--shadow-teal)",
          }}>⇄</div>
          <h1 style={{
            fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 700,
            color: "var(--text-primary)", marginBottom: 6,
          }}>Create Account</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Register a simulated bank node with UPI credentials
          </p>
        </div>

        <div className="glass-card" style={{ padding: "32px" }}>
          {message && (
            <div className={`alert ${isSuccess ? "alert-success" : "alert-error"}`}>
              <span>{isSuccess ? "✓" : "✕"}</span>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { name: "name",     label: "Full Name",       type: "text",     ph: "e.g. Priyanshu Singh" },
              { name: "email",    label: "Email Address",   type: "email",    ph: "you@example.com" },
              { name: "mobile",   label: "Mobile Number",   type: "text",     ph: "10-digit number" },
              { name: "upiId",    label: "UPI ID",          type: "text",     ph: "priyanshu@offline" },
              { name: "password", label: "Password",        type: "password", ph: "Min 6 characters" },
              { name: "upiPin",   label: "UPI PIN",         type: "password", ph: "4 or 6 digit PIN" },
              { name: "balance",  label: "Initial Balance (₹)", type: "number", ph: "e.g. 10000" },
            ].map((f) => (
              <div className="form-group" key={f.name}>
                <label className="form-label" style={{ color: "var(--text-secondary)" }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  name={f.name}
                  placeholder={f.ph}
                  value={formData[f.name]}
                  onChange={handleChange}
                  className="input"
                  required
                  style={{ background: "var(--bg-700)", border: "1.5px solid var(--border-dark)", color: "var(--text-primary)" }}
                />
              </div>
            ))}

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 8 }}>
              Create Account  →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;