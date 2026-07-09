import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Register from "./pages/Register";
import SendMoney from "./pages/SendMoney";
import History from "./pages/History";
import CreatePacket from "./pages/CreatePacket";
import RelayDashboard from "./pages/RelayDashboard";
import RelayLogs from "./pages/RelayLogs";
import CheckBalance from "./pages/CheckBalance";
import Login from "./pages/Login";
import Dashboard from "./pages/DashBoard";
import PacketStatus from "./pages/PacketStatus";
import AdminDashboard from "./pages/AdminDashboard";
import Receipt from "./pages/TransactionReceipt";
import API from "./services/api";

const navGroups = [
  {
    label: "Main",
    links: [
      {
        to: "/dashboard",
        icon: "◈",
        label: "Dashboard",
      },
    ],
  },
  {
    label: "Banking",
    links: [
      {
        to: "/send-money",
        icon: "↗",
        label: "Send Money",
      },
      {
        to: "/balance",
        icon: "◎",
        label: "Check Balance",
      },
      {
        to: "/history",
        icon: "≡",
        label: "History",
      },
      {
        to: "/receipt",
        icon: "◻",
        label: "Receipt",
      },
    ],
  },
  {
    label: "Offline Payments",
    links: [
      {
        to: "/create-packet",
        icon: "⬡",
        label: "Create Packet",
      },
      {
        to: "/packet-status",
        icon: "⊙",
        label: "Packet Status",
      },
    ],
  },
  {
    label: "Relay Network",
    links: [
      {
        to: "/relay",
        icon: "⟳",
        label: "Relay Dashboard",
      },
      {
        to: "/logs",
        icon: "⊟",
        label: "Relay Logs",
      },
    ],
  },
  {
    label: "Admin",
    links: [
      {
        to: "/admin",
        icon: "⊞",
        label: "Admin Dashboard",
      },
    ],
  },
  {
    label: "Account",
    links: [
      {
        to: "/login",
        icon: "⊕",
        label: "Login",
      },
      {
        to: "/",
        icon: "⊗",
        label: "Register",
      },
    ],
  },
];

function AppContent() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  /*
   * User details are filled only after the backend
   * verifies the JWT using GET /api/auth/me.
   */
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  const isLoggedIn = Boolean(userEmail);
  const isAdmin = userRole === "ADMIN";

  function clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userUpiId");
    localStorage.removeItem("userRole");

    setUserEmail("");
    setUserName("");
    setUserRole("");
  }

  async function fetchCurrentUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      clearAuthData();
      setAuthLoading(false);
      return;
    }

    try {
      const response = await API.get("/auth/me");

      const { email, name, upiId, role } = response.data;

      localStorage.setItem("userEmail", email ?? "");
      localStorage.setItem("userName", name ?? "");
      localStorage.setItem("userUpiId", upiId ?? "");
      localStorage.setItem("userRole", role ?? "USER");

      setUserEmail(email ?? "");
      setUserName(name ?? "");
      setUserRole(role ?? "USER");
    } catch (error) {
      console.error(
        "Session verification failed:",
        error.response?.data || error.message
      );

      clearAuthData();
    } finally {
      setAuthLoading(false);
    }
  }

  /*
   * Verify the saved token whenever the application starts.
   */
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  /*
   * Login.jsx dispatches "auth-change" after saving the JWT.
   * This causes the application to verify the new token.
   */
  useEffect(() => {
    function handleAuthChange() {
      setAuthLoading(true);
      fetchCurrentUser();
    }

    function handleStorageChange(event) {
      if (
        event.key === "token" ||
        event.key === "userEmail" ||
        event.key === "userRole"
      ) {
        setAuthLoading(true);
        fetchCurrentUser();
      }
    }

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function handleLogout() {
    clearAuthData();
    setSidebarOpen(false);

    navigate("/login", {
      replace: true,
    });
  }

  const visibleNavGroups = navGroups.filter((group) => {
    if (group.label === "Admin") {
      return isLoggedIn && isAdmin;
    }

    if (group.label === "Account") {
      return !isLoggedIn;
    }

    return isLoggedIn;
  });

  if (authLoading) {
    return (
      <div className="auth-loading">
        <div>
          <div className="brand-icon" style={{ margin: "0 auto 16px" }}>
            ⇄
          </div>

          <p>Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">⇄</div>

          <div className="brand-text">
            <span className="brand-name">Offline UPI</span>
            <span className="brand-sub">Simulator v1.0</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {visibleNavGroups.map((group) => (
            <div className="nav-section" key={group.label}>
              <div className="nav-section-title">
                {group.label}
              </div>

              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                  onClick={closeSidebar}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-status">
            <span className="status-dot" />
            Backend: localhost:8080
          </div>

          {isLoggedIn && (
            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              <span className="logout-icon">↪</span>
              Logout
            </button>
          )}
        </div>
      </aside>

      <div className="main-area">
        <header className="top-bar">
          <div className="top-bar-left">
            <button
              type="button"
              className="menu-btn"
              onClick={() =>
                setSidebarOpen((currentValue) => !currentValue)
              }
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>

            <span className="breadcrumb">
              <strong>
                Distributed Offline UPI Payment Simulator
              </strong>
            </span>
          </div>

          <div className="top-bar-right">
            <div className="system-badge">
              <span className="online-dot" />
              System Online
            </div>

            {isLoggedIn ? (
              <div className="user-chip">
                <div className="user-avatar">
                  {(userName || userEmail)
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="user-details">
                  <span className="user-name">
                    {userName || userEmail}
                  </span>

                  <span className="user-role">
                    {userRole}
                  </span>
                </div>
              </div>
            ) : (
              <div className="user-chip">
                <span>Not logged in</span>
              </div>
            )}

            {isLoggedIn && (
              <button
                type="button"
                className="top-logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register />
              )
            }
          />

          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/send-money"
            element={
              isLoggedIn ? (
                <SendMoney />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/history"
            element={
              isLoggedIn ? (
                <History />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/create-packet"
            element={
              isLoggedIn ? (
                <CreatePacket />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/relay"
            element={
              isLoggedIn ? (
                <RelayDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/logs"
            element={
              isLoggedIn ? (
                <RelayLogs />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/balance"
            element={
              isLoggedIn ? (
                <CheckBalance />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/packet-status"
            element={
              isLoggedIn ? (
                <PacketStatus />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/receipt"
            element={
              isLoggedIn ? (
                <Receipt />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/admin"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" replace />
              ) : isAdmin ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to={isLoggedIn ? "/dashboard" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;