import React from "react";
import "./FooterSection.css";

function FooterSection() {
  return (
    <footer className="footer-section py-5  text-white">
      <div className="container">
        <div className="row">
          {/* Left Section */}
          <div className="col-md-4">
            <h5>About Smart Electric Workshop</h5>
            <p>
              Smart Electric Workshop offers top-quality repair services
              tailored to your needs. From appliance repairs to electrical
              fixes, we provide exceptional care.
            </p>
          </div>

          {/* Middle Section: Services Menu */}
          <div className="col-md-4">
            <h5>Services Menu</h5>
            <ul className="list-unstyled">
              <li>
                <i className="bi bi-arrow-right me-2"></i> All Services
              </li>
              <li>
                <i className="bi bi-arrow-right me-2"></i> Switch or Socket Repair
              </li>
              <li>
                <i className="bi bi-arrow-right me-2"></i> AC Electrical Repair
              </li>
              <li>
                <i className="bi bi-arrow-right me-2"></i> Washing Machine Wiring
              </li>
            </ul>
          </div>

          {/* Right Section: Contact Details */}
          <div className="col-md-4">
            <h5>Contact Details</h5>
            <ul className="list-unstyled">
              <li>
                <i className="bi bi-geo-alt-fill me-2"></i>COMSATS University Islamabad <br /> Vehari Campus,
              </li>
              <li>
                <i className="bi bi-telephone-fill me-2"></i> +92 300 1234567
              </li>
              <li>
                <i className="bi bi-envelope-fill me-2"></i>{" "}
                iramf1420@gmail.com
              </li>
              <li>
                <i className="bi bi-clock-fill me-2"></i> Mon-Sun: 9:00 AM - 5:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-4">
          <p>
            &copy; {new Date().getFullYear()} Smart Electric Workshop | All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
