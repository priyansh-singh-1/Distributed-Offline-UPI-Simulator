import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", formData);

      const{
        message,
        email,
        name,
        upiId,
        role,
        token,
      }= response.data;;

      setMessage(message);

      if (response.data.message === "Login successful") {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name);
        localStorage.setItem("userUpiId", upiId);
        localStorage.setItem("userRole", role);
        localStorage.setItem("token",token);

        window.dispatchEvent(new Event("auth-change"));

        if(role === "ADMIN") {
          navigate("/admin-dashboard");
        }
        else{
        navigate("/dashboard");
        }
      }
    } catch (error) {
      console.log(error);

      const errorMessage =
        error.response?.data?.message || "Login failed";

      setMessage(errorMessage);
    }
  }

  const isSuccess = message === "Login successful";

  return (
    <div
      className="page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              background:
                "linear-gradient(135deg, var(--teal) 0%, var(--sky-dark) 100%)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              margin: "0 auto 16px",
              boxShadow: "var(--shadow-teal)",
            }}
          >
            ⇄
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 6,
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            Sign in to access the simulator dashboard
          </p>
        </div>

        <div className="glass-card" style={{ padding: "32px" }}>
          {message && (
            <div
              className={`alert ${
                isSuccess ? "alert-success" : "alert-error"
              }`}
            >
              <span>{isSuccess ? "✓" : "✕"}</span>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label
                className="form-label"
                style={{ color: "var(--text-secondary)" }}
              >
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
                style={{
                  background: "var(--bg-700)",
                  border: "1.5px solid var(--border-dark)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="form-group">
              <label
                className="form-label"
                style={{ color: "var(--text-secondary)" }}
              >
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                required
                style={{
                  background: "var(--bg-700)",
                  border: "1.5px solid var(--border-dark)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: 8 }}
            >
              Sign In →
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          No account? Use the Register page to create one.
        </p>
      </div>
    </div>
  );
}

export default Login;