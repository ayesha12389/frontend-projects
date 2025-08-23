import React from "react";

function Features() {
  const features = [
    { img: "/images/a.jpg", title: "Asymmetry", desc: "One half of the mole doesn’t match the other." },
    { img: "/images/b.jpg", title: "Border Irregularity", desc: "Edges are uneven or blurred." },
    { img: "/images/c.jpg", title: "Color Variance", desc: "Multiple colors in one mole." },
    { img: "/images/d.jpg", title: "Diameter", desc: "Lesions larger than 6mm." },
    { img: "/images/e.jpg", title: "Evolving", desc: "Changes in size, shape, or color." }
  ];

  return (
    <section id="features" className="p-5">
      <h2 className="text-center mb-5" style={{ color: "#0056b3", fontSize: "2.5rem", fontWeight: "bold" }}>
        Symptoms of Skin Cancer
      </h2>
      <div className="d-flex flex-wrap justify-content-center gap-4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {features.map((f, i) => (
          <div
            key={i}
            className="feature text-center p-4"
            style={{
              border: "1px solid #ddd",
              borderRadius: "15px",
              width: "300px",
              background: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={f.img}
              alt={f.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "15px",
              }}
            />
            <h3 style={{ color: "#0056b3", fontSize: "1.5rem", fontWeight: "600" }}>{f.title}</h3>
            <p style={{ fontSize: "1rem", color: "#555" }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
