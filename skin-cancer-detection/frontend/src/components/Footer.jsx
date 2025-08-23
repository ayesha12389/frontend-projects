import React from "react";

function Footer() {
  return (
    <footer className="text-light py-5" style={{ backgroundColor: "#0056b3" }}>
      <div className="container">
        <div className="row">
          {/* Quick Links */}
          <div className="col-md-4">
            {/* <h5 className="mb-3">Quick Links</h5> */}
            <ul className="list-unstyled">
              {/* <li><a href="#" className="text-light">Home</a></li>
              <li><a href="about.html" className="text-light">About Us</a></li>
              <li><a href="contact.html" className="text-light">Contact</a></li>
              <li><a href="templates/login.html" className="text-light">Login</a></li> */}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4">
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li><i className="bi bi-geo-alt-fill"></i> 123 Vehari, Pakistan</li>
              <li><i className="bi bi-telephone-fill"></i> +92 3257510841</li>
              <li><i className="bi bi-envelope-fill"></i> support@skincancer.com</li>
            </ul>
          </div>
        </div>
        <hr className="bg-light" />
        <p className="text-center mb-0">© 2025 Skin Cancer Detection. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
