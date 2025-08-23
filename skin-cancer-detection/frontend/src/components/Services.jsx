import React from "react";
import './index.css';


function Services() {
  const services = [
    { icon: "bi-robot", title: "AI-Powered Diagnosis", desc: "Analyze skin patterns with AI." },
    { icon: "bi-person-check", title: "Dermatologist Consultation", desc: "Get expert advice." },
    { icon: "bi-map", title: "Mole Mapping", desc: "Track mole changes over time." },
    { icon: "bi-search-heart", title: "Early Detection Screening", desc: "Identify skin cancer early." },
    { icon: "bi-file-earmark-medical", title: "Skin Health Reports", desc: "Detailed health reports." },
    { icon: "bi-shield-plus", title: "Preventive Care", desc: "Learn best prevention strategies." }
  ];

  return (
    <section id="services" className="py-5" style={{ background: "#f8faff" }}>
      <div className="container">
        <h2 className="text-center mb-5 fw-bold" style={{ color: "#0056b3", fontSize: "2.2rem" }}>
          Our Skin Cancer Detection Services
        </h2>
        <div className="row g-4 justify-content-center">
          {services.map((s, i) => (
            <div key={i} className="col-md-4 col-sm-6">
              <div
                className="service-box text-center p-4 h-100"
                style={{
                  background: "#fff",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease-in-out",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                }}
              >
                <div
                  className="d-flex justify-content-center align-items-center mx-auto mb-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #0056b3, #00bcd4)",
                    color: "#fff",
                    fontSize: "2rem",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  }}
                >
                  <i className={`bi ${s.icon}`}></i>
                </div>
                <h4 className="fw-bold" style={{ color: "#0056b3" }}>{s.title}</h4>
                <p className="text-muted">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
