import React from "react";
import './index.css';

function WhyDetection() {
  return (
    <div className="d-flex flex-wrap align-items-center justify-content-center p-5">
      {/* Left Image */}
      <div style={{ flex: 1, minWidth: "300px", textAlign: "center" }}>
        <img src="/images/abc.jpeg" alt="Skin Check" style={{ width: "100%", maxWidth: "500px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }} />
      </div>

      {/* Right Info */}
      <div style={{ flex: 1, minWidth: "300px", padding: "1rem 2rem" }}>
        <h2 style={{ fontSize: "2rem", color: "#003366", marginBottom: "2rem" }}>Why Skin Cancer Detection?</h2>

        <div className="mb-3 p-3 d-flex align-items-center" style={infoBox}>
          <div style={circle}>✔️</div>
          <div>
            <h3>Clinically Validated Accuracy</h3>
            <p>Over 90% accuracy when detected early.</p>
          </div>
        </div>

        <div className="mb-3 p-3 d-flex align-items-center" style={infoBox}>
          <div style={circle}>🌍</div>
          <div>
            <h3>Trusted by Millions Worldwide</h3>
            <p>3 million people rely on AI tools regularly.</p>
          </div>
        </div>

        <div className="p-3 d-flex align-items-center" style={infoBox}>
          <div style={circle}>🔎</div>
          <div>
            <h3>Clear Insights at Your Fingertips</h3>
            <p>Fast, 24/7 access to skin insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const infoBox = {
  background: "#fff",
  borderLeft: "6px solid #0056b3",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  marginBottom: "1rem"
};

const circle = {
  width: "50px", height: "50px",
  background: "#e6f0ff", color: "#0056b3",
  borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center",
  fontSize: "24px", marginRight: "10px"
};

export default WhyDetection;
