import React from 'react';
import './Hero.css';
import backgroundImage from '../assets/3.jpg'; // Import your image
import { Link } from 'react-router-dom';


function Hero() {
  return (
    <section
      className="hero-section d-flex align-items-center justify-content-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container text-white text-center hero-content">
        <h2 className="display-4 mb-4">Don't Miss Our Top Repair Services!</h2>
        <p className="lead mb-4">
          Register now and get exclusive access to our premium repair services.
        </p>
        {/* Single Register Now Button */}
        <div>
        <Link to="/login">
            <button type="button" className="btn btn-warning">
              Login Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
