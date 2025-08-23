import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const About = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand" href="#">
            Skin Cancer Detection
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/index">
                  Home
                </a>
              </li>
              {/* <li className="nav-item"><a className="nav-link" href="/detection">Detection</a></li> */}
              <li className="nav-item">
                <a className="nav-link active" href="/about">
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact">
                  Contact Us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login">
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* About Us Content */}
      <div className="container my-5">
        <h1 className="section-title">About Us</h1>
        <div className="content">
          <p>
            At <strong>Skin Cancer Detection</strong>, we are committed to
            providing advanced and accurate solutions for early detection of
            skin cancer using AI-powered technology. Our goal is to assist
            individuals and healthcare professionals in diagnosing skin cancer
            at an early stage, enabling better treatment and outcomes.
          </p>
          <p>
            Our platform integrates cutting-edge deep learning models with
            medical expertise to analyze skin lesion images efficiently. We aim
            to make skin cancer detection accessible, reliable, and
            user-friendly, ensuring that everyone can take proactive steps in
            managing their skin health.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="footer text-light py-5"
        style={{ backgroundColor: "#0056b3" }}
      >
        <div className="container">
          <div className="row">
            {/* Quick Links */}
            <div className="col-md-4">
              <h5 className="text-uppercase mb-4">Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="/index" className="text-light text-decoration-none">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-light text-decoration-none">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/guide" className="text-light text-decoration-none">
                    Guide
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-light text-decoration-none"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-md-4">
              <h5 className="text-uppercase mb-4">Contact Us</h5>
              <ul className="list-unstyled">
                <li>
                  <i className="bi bi-geo-alt-fill"></i> 123 Cancer Care Street,
                  City, Country
                </li>
                <li>
                  <i className="bi bi-telephone-fill"></i> +1 234 567 890
                </li>
                <li>
                  <i className="bi bi-envelope-fill"></i> support@skincancer.com
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="col-md-4">
              <h5 className="text-uppercase mb-4">Follow Us</h5>
              <div className="d-flex gap-3">
                <a href="#" className="text-light fs-4">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-light fs-4">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="text-light fs-4">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="text-light fs-4">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
          <hr className="bg-light my-4" />
          <p className="text-center mb-0">
            © 2025 Skin Cancer Detection. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default About;
