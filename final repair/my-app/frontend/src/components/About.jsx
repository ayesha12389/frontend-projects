import React from 'react';
import './About.css';
import ServiceSection from './ServiceSection';
import Advantages from './Advantages';
import TechnicianSection from './TechnicianSection';
import Testimonials from './Testimonials';
import MechanicHiring from './MechanicHiring';
import Navbar from './Navbar';
import Footer from './FooterSection';

function About() {
  return (
    <div>
    <Navbar/>
      {/* Header Section */}
      <div className="image-section">
        <div className="image-overlay">
          <div className="text-content text-center">
            <h1 className="image-title">Auto Repair since 2024</h1>
            <p className="image-subtitle">Our services</p>
          </div>

        </div>
      </div>
      <ServiceSection/>
      <Advantages/>
      <div className="hero-section d-flex align-items-center text-center">
      <div className="container">
        <p className="subtitle text-warning mb-2">We Value Your Vehicle</p>
        <h1 className="hero-title text-white mb-4">
          Pakistan's Most Trusted <br /> Electrical Repair Experts
        </h1>
        <button className="btn btn-warning btn-lg">Call us Now</button>
      </div>
    </div>
    <TechnicianSection/>
    <MechanicHiring/>
    <Testimonials/>
    <Footer/>
    </div>
  );
}

export default About;
