import React, { useEffect } from "react";
import './index.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Carousel() {
  useEffect(() => {
    const bootstrap = require("bootstrap/dist/js/bootstrap.bundle.min.js");
    const element = document.querySelector("#mainCarousel");
    new bootstrap.Carousel(element, { interval: 3000 });
  }, []);

  const imageStyle = {
    height: "500px", // fixed height
    objectFit: "cover", // crop and fit
  };

  const captionStyle = {
    position: 'absolute',
    bottom: '20px',      // bottom se thoda upar
    left: '50%',
    transform: 'translateX(-50%)', // horizontally center
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '10px',
    padding: '15px 25px',
    textAlign: 'center',
    color: '#fff',
    maxWidth: '90%',
    whiteSpace: 'normal',  // line break allow
    wordWrap: 'break-word',
  };

  return (
    <div
      id="mainCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      style={{ marginTop: "70px" }} // navbar overlap fix
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="/images/a.jfif" className="d-block w-100" alt="Skin Awareness" style={imageStyle} />
          <div className="carousel-caption" style={captionStyle}>
            <h5>Detect Skin Cancer Early</h5>
            <p>Early detection saves lives. Use our AI-powered tool today.</p>
          </div>
        </div>

        <div className="carousel-item">
          <img src="/images/b.jfif" className="d-block w-100" alt="Prevention Tips" style={imageStyle} />
          <div className="carousel-caption" style={captionStyle}>
            <h5>Protect Your Skin</h5>
            <p>Learn how to prevent skin damage and cancer effectively.</p>
          </div>
        </div>

        <div className="carousel-item">
          <img src="/images/c.jfif" className="d-block w-100" alt="Professional Care" style={imageStyle} />
          <div className="carousel-caption" style={captionStyle}>
            <h5>Expert Support</h5>
            <p>Consult dermatologists and get personalized care reports.</p>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#mainCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#mainCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
}

export default Carousel;
