import React from 'react';
import './Hero1.css';
import backgroundImage from '../assets/3.jpg'; // Import your image

function Hero1() {
  return (
    <section
      className="hero-section d-flex align-items-center justify-content-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container text-white text-center hero-content">
        <h2 className="display-4 mb-4">Don't Miss Our Top Repair Services!</h2>
        <p className="lead mb-4">
          Stay informed about exclusive services and discounts available for you!
        </p>
        <div>
          <button type="button" className="btn btn-warning px-4">
            Register Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero1;
