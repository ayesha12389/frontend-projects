import React, { useState } from "react";
import './index.css';


function InfoBox({ icon, title, details, highlight }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`info-box ${highlight ? "highlight" : ""}`} style={boxStyle}>
      <div className="icon" style={{ fontSize: "60px" }}>{icon}</div>
      
      {/* Title with styling */}
      <h3 style={titleStyle}>{title}</h3>
      
      {open && <p className="details">{details}</p>}
      <div 
        className="toggle" 
        onClick={() => setOpen(!open)} 
        style={{ cursor: "pointer", fontSize: "20px", marginTop: "10px" }}
      >
        {open ? "⬆" : "⬇"}
      </div>
    </div>
  );
}

const boxStyle = {
  background: "#fff",
  borderRadius: "20px",
  padding: "20px",
  width: "340px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  textAlign: "center",
  margin: "10px",
};

// 🎨 Title style
const titleStyle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#0056b3",
  margin: "15px 0",
  lineHeight: "1.4",
};

function InfoSection() {
  return (
    <div className="container d-flex flex-wrap justify-content-center gap-3 my-5">
      <InfoBox 
        icon="👨‍👩‍👧‍👦" 
        title="Skin Cancer is the most common cancer Worldwide" 
        details="Around 1 in 5 people will face skin cancer at some point." 
      />
      <InfoBox 
        icon="☀️" 
        title="Most Skin Cancer Cases Are Linked to Sun Exposure" 
        details="Excessive UV radiation increases the risk of skin cancer." 
      />
      <InfoBox 
        icon="🔍" 
        title="Most Treatable Cancer When Detected Early" 
        details="Early detection improves the chances of recovery." 
        highlight 
      />
    </div>
  );
}

export default InfoSection;
