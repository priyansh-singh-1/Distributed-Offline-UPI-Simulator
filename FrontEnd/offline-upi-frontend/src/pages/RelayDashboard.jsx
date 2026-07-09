import { useState, useEffect } from "react";
import API from "../services/api";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

function RelayDashboard() {
  const [packets, setPackets] = useState([]);
  const [relayNodeId, setRelayNodeId] = useState("RELAY_1");
  const [internetAvailable, setInternetAvailable] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchPendingPacket() {
    try {
      const response = await API.get("/offline-payments/pending");
      setPackets(response.data);
      if (response.data.length === 0) {
        setMessage("No pending packets found");
      } else {
        setMessage("");
      }
    } catch (error) {
      console.log(error);
      setMessage("Failed to fetch pending packets");
    }
  }

  useEffect(() => {
    fetchPendingPacket();

    try {
      const socket = new SockJS("http://localhost:8080/ws");
      const stompClient = Stomp.over(socket);
      stompClient.debug = () => {};

      stompClient.connect(
        {},
        () => {
          console.log("Connected to WebSocket");
          stompClient.subscribe("/topic/packets", (message) => {
            console.log("WebSocket event:", message.body);
            fetchPendingPacket();
            setMessage(`Live update: ${message.body}`);
          });
        },
        (error) => {
          console.warn("WebSocket connection failed:", error);
          setMessage("Live updates unavailable");
        }
      );

      return () => {
        if (stompClient && stompClient.connected) {
          stompClient.disconnect();
        }
      };
    } catch (error) {
      console.warn("WebSocket setup failed:", error);
      setMessage("Live updates unavailable");
      return undefined;
    }
  }, []);

  async function authorizePacket(packetId) {
    try {
      const response = await API.post(`/offline-payments/authorize/${packetId}`, {
        relayNodeId: relayNodeId,
        internetAvailable: internetAvailable,
      });
      setMessage(`Packet status: ${response.data.status}`);
      fetchPendingPacket();
    } catch (error) {
      console.log(error);
      setMessage("Failed to authorize packet");
    }
  }

  const isLiveUpdate = message.toLowerCase().includes("live update");
  const isError = message.toLowerCase().includes("fail") || message.toLowerCase().includes("unavailable");

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Relay Node Dashboard</h1>
        <p className="page-subtitle">Simulate a merchant relay node — collect, verify, and forward offline packets to the bank server</p>
      </div>

      {/* Control bar */}
      <div className="relay-control-bar">
        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>
            Relay Node ID
          </label>
          <input
            type="text"
            value={relayNodeId}
            onChange={(e) => setRelayNodeId(e.target.value)}
            placeholder="Relay Node ID"
            className="input"
            style={{ background: "var(--bg-700)", border: "1.5px solid var(--border-dark)", color: "var(--text-primary)" }}
          />
        </div>

        <div
          className="toggle-wrap"
          onClick={() => setInternetAvailable(!internetAvailable)}
          style={{ paddingTop: 20 }}
        >
          <div className={`toggle-track ${internetAvailable ? "on" : ""}`}>
            <div className="toggle-thumb" />
          </div>
          <span className="toggle-label">
            {internetAvailable ? "🌐 Internet Online" : "📡 Offline Mode"}
          </span>
          {/* Hidden checkbox to preserve form data */}
          <input
            type="checkbox"
            checked={internetAvailable}
            onChange={(e) => setInternetAvailable(e.target.checked)}
            style={{ display: "none" }}
          />
        </div>

        <button onClick={fetchPendingPacket} className="btn btn-secondary" style={{ marginTop: 20 }}>
          ⟳  Refresh Queue
        </button>
      </div>

      {/* Live update / message banners */}
      {message && (
        isLiveUpdate ? (
          <div className="live-banner">
            <div className="live-dot" />
            {message}
          </div>
        ) : (
          <div className={`alert ${isError ? "alert-error" : "alert-success"}`}>
            <span>{isError ? "✕" : "✓"}</span>
            {message}
          </div>
        )
      )}

      {/* Pending queue */}
      <div className="section-title">
        Pending Queue
        <span className="badge badge-pending" style={{ marginLeft: 8 }}>{packets.length}</span>
      </div>

      {packets.length === 0 ? (
        <div className="dark-card">
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p className="empty-text">No pending offline packets in the relay queue. Create a packet to begin the simulation flow.</p>
          </div>
        </div>
      ) : (
        <div className="packet-list">
          {packets.map((packet) => (
            <div key={packet.id} className="packet-card">
              <div className="packet-card-header">
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                    Offline Payment Packet
                  </div>
                  <div className="packet-id">{packet.packetId}</div>
                </div>
                <span className="badge badge-pending">{packet.status}</span>
              </div>

              <div className="packet-meta">
                <div className="packet-meta-item">
                  <span className="packet-meta-label">Sender</span>
                  <span className="packet-meta-value">{packet.senderUpi}</span>
                </div>
                <div className="packet-meta-item">
                  <span className="packet-meta-label">Receiver</span>
                  <span className="packet-meta-value">{packet.receiverUpi}</span>
                </div>
                <div className="packet-meta-item">
                  <span className="packet-meta-label">Amount</span>
                  <span className="packet-meta-value amount">₹{packet.amount}</span>
                </div>
                <div className="packet-meta-item">
                  <span className="packet-meta-label">TTL</span>
                  <span className="packet-meta-value">{packet.ttlSeconds}s</span>
                </div>
                <div className="packet-meta-item">
                  <span className="packet-meta-label">Created At</span>
                  <span className="packet-meta-value" style={{ fontSize: 12 }}>{packet.createdAt}</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => authorizePacket(packet.packetId)}
                  className="btn btn-primary"
                  style={{ width: "auto" }}
                >
                  Authorize & Forward  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RelayDashboard;