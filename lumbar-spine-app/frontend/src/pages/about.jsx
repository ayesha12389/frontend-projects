import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import NavbarWithModal from "./navbar";
const API_BASE_URL = "http://localhost:5000/api";

export default function AboutUsPage() {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("login"); // login or signup
 

  // Handlers for modal open/close
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

 
  
  // 

  return (
    <>
      <NavbarWithModal openModal={openModal} />
      {/* About Us Content */}
      <div className="container">
        <h1 className="section-title">About Us</h1>
        <div className="content mb-5">
          <p>
            At <strong>Lumbar Spine Guide</strong>, we are dedicated to providing
            comprehensive insights into lumbar spine health. Our goal is to empower
            individuals and healthcare professionals with accurate, reliable, and
            easy-to-understand information about lumbar spine conditions. Whether
            you're dealing with disc degeneration, spinal stenosis, or spondylolisthesis,
            our platform offers expert knowledge and tools to support your journey
            to better health.
          </p>
          <p>
            We combine advanced medical knowledge with user-friendly design to ensure
            that every visitor finds valuable information. Our mission is to create
            awareness, support decision-making, and improve overall spine health outcomes
            for individuals worldwide.
          </p>
        </div>
      </div>

     
      {/* Footer */}
      <footer className="footer bg-dark text-light py-5 mt-5">
        <div className="container">
          <div className="row">
            {/* About Section */}
            <div className="col-md-4">
              <h5 className="text-uppercase mb-4">About Us</h5>
              <p>
                At Lumbar Spine Care Services, we are dedicated to providing comprehensive
                insights, advanced tools, and expert care for lumbar spine health. Your
                well-being is our priority.
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-md-2">
              <h5 className="text-uppercase mb-4">Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#services" className="text-light">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-light">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#upload" className="text-light">
                    Upload
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-light">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="col-md-3">
              <h5 className="text-uppercase mb-4">Contact Us</h5>
              <ul className="list-unstyled">
                <li>
                  <i className="bi bi-geo-alt-fill"></i> 123 Spine Care Street, City, Country
                </li>
                <li>
                  <i className="bi bi-telephone-fill"></i> +1 234 567 890
                </li>
                <li>
                  <i className="bi bi-envelope-fill"></i> support@lumbarspine.com
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-md-3">
              <h5 className="text-uppercase mb-4">Newsletter</h5>
              <p>Subscribe to get the latest updates and health tips.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing!");
                }}
              >
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your Email"
                    required
                  />
                  <button className="btn btn-primary" type="submit">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>

          <hr className="bg-light my-4" />

          {/* Social Media & Copyright */}
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <a href="#" className="text-light me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light me-3">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-light me-3">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
            <p className="mb-0">© 2025 Lumbar Spine Care. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
