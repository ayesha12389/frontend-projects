import React from "react";
import './index.css';


function Hero() {
  return (
    <section id="home" className="hero text-center p-5" style={{ backgroundColor: "#f5f8fa" }}>
      <h1 style={{ color: "#0056b3", fontSize: "3rem" }}>Understanding Skin Cancer</h1>
      <p style={{ maxWidth: "600px", margin: "auto" }}>
        Skin cancer is one of the most common types of cancer. Learn more about its symptoms, causes, 
        and prevention to protect yourself and your loved ones.
      </p>
      <a href="learnmore.html" target="_blank" rel="noreferrer">
        <button className="btn btn-primary mt-3">Learn More</button>
      </a>
    </section>
  );
}

export default Hero;
