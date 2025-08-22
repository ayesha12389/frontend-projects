import React, { useState, useRef } from 'react';
import NavbarWithModal from './navbar.jsx';
const API_BASE_URL = 'http://localhost:5000/api';
import spine from '../assets/spine.png';
import tech from '../assets/tech.png';
import AuthModal from'./AuthModal';
import researcher from '../assets/reseracher.jpg';
import './homepage.css'

export default function Homepage() {
  const fileInputRef = useRef();
const [showModal, setShowModal] = useState(false);
const openModal = () => setShowModal(true);
const closeModal = () => setShowModal(false);

 
const handleClick = () => {
  openModal();
};

 
  async function uploadImage() {

const token = localStorage.getItem('token');

 
    if (token===null) {
   
      openModal();
      return;
    }

    const file = fileInputRef.current.files[0];
    if (!file) {
      alert('Please select an image to upload!');
      return;
    }
   

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert('Image uploaded successfully!');
 
      } else {
        alert(result.message || 'Upload failed');
      }
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    }
  }
  

  return (
    <>
      <NavbarWithModal openModal={openModal} />

      {/* Hero Section */}
      <div className="hero">
        <h1 className="hero-title">
          Comprehensive Lumbar Spine Care
        </h1>
        <p className="hero-subtitle">
          Accurate Classification for Lumbar Spine Degeneration
        </p>
        <button className="btn btn-primary hero-button" onClick={handleClick}>
          Get Your Report
        </button>
      </div>
 
      {/* Upload Section */}
      <div className="container py-5">
        <div className="upload-section" id="upload">
          <div className="upload-form">
            <h2 className="section-title upload-title">
              Upload Your Image
            </h2>
            <p className="upload-description">
              Upload an image of your lumbar spine scan to receive a detailed report on its condition.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              id="imageUpload"
              accept="image/*"
              className="form-control image-upload-input"
            />
            <button
              className="btn upload-button"
              onClick={uploadImage}
            >
              Analyze
            </button>
          </div>
          <div className="image-preview">
            <img
              src={spine}
              alt="Lumbar Spine MRI Preview"
              className="image-preview-img"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2 className="section-title features-title">
            Why Choose Our Lumbar Spine Services
          </h2>
          <div className="row">
            {[
              { icon: '🩺', title: 'Expert Diagnostics', text: 'Accurate and reliable diagnostic results tailored for lumbar spine care.' },
              { icon: '🔍', title: 'Detailed Insights', text: 'Get a comprehensive analysis of your lumbar spine condition.' },
              { icon: '💾', title: 'Data Privacy', text: 'Your uploaded images and reports are secure and confidential.' },
              { icon: '🌐', title: 'Accessible Worldwide', text: 'Access our services from anywhere with ease and reliability.' },
              { icon: '📊', title: 'Advanced Reports', text: 'Receive actionable insights and recommendations in your report.' },
            ].map((feature, idx) => (
              <div className="col-md-6 feature" key={idx}>
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-text">
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lumbar Spine Degenerative Classification Section */}
      <div className="container my-5">
        <h2 className="section-title classification-title">
          Lumbar Spine Degenerative Classification System
        </h2>
        <ul className="nav nav-tabs justify-content-center classification-tabs" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" data-bs-toggle="tab" href="#technician" role="tab" aria-selected="true">
              Technicians
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#researcher" role="tab" aria-selected="false">
              Researchers
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#doctors" role="tab" aria-selected="false">
              Doctors
            </a>
          </li>
        </ul>

        <div className="tab-content classification-content">
          {/* Technician Section */}
          <div id="technician" className="tab-pane fade show active" role="tabpanel">
            <div className="card classification-card">
              <div className="row">
                <div className="col-md-6">
                  <img src={tech} alt="Technicians" className="img-fluid classification-image" />
                </div>
                <div className="col-md-6">
                  <h3 className="card-title classification-card-title">Technicians</h3>
                  <ul className="classification-list">
                    <li> Operate imaging systems like MRI and CT scans to identify lumbar spine issues.</li>
                    <li> Assist in the classification and data entry of degenerative spine conditions.</li>
                    <li> Collaborate with doctors and researchers to ensure precise results.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Researcher Section */}
          <div id="researcher" className="tab-pane fade" role="tabpanel">
            <div className="card classification-card">
              <div className="row">
                <div className="col-md-6">
                  <img src="reseracher.jpg" alt="Researchers" className="img-fluid classification-image" />
                </div>
                <div className="col-md-6">
                  <h3 className="card-title classification-card-title">Researchers</h3>
                  <ul className="classification-list">
                    <li> Analyze trends in lumbar spine degeneration using AI-powered systems.</li>
                    <li> Publish findings on degenerative classification for global medical advancement.</li>
                    <li> Develop improved models for early detection and classification of spine conditions.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Doctors Section */}
          <div id="doctors" className="tab-pane fade" role="tabpanel">
            <div className="card classification-card">
              <div className="row">
                <div className="col-md-6">
                  <img src="Doctor.jpg" alt="Doctors" className="img-fluid classification-image" />
                </div>
                <div className="col-md-6">
                  <h3 className="card-title classification-card-title">Doctors</h3>
                  <ul className="classification-list">
                    <li>Interpret diagnostic results to determine the stage of lumbar spine degeneration.</li>
                    <li> Recommend personalized treatments based on classification results.</li>
                    <li> Collaborate with technicians and researchers for comprehensive patient care.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container my-5" id="services">
        <h2 className="section-title services-title">
          Our Services
        </h2>
        <p className="text-center services-description mb-4">
          Explore our comprehensive services designed to support your lumbar spine health and diagnosis.
        </p>
        <div className="row">
          {[
            {
              icon: '🩺',
              title: 'Expert Diagnostics',
              text: 'State-of-the-art diagnostic services using advanced imaging techniques like MRI and CT scans.',
            },
            {
              icon: '📊',
              title: 'Detailed Analysis',
              text: 'Comprehensive reports and actionable insights tailored to your lumbar spine condition.',
            },
            {
              icon: '🌐',
              title: 'Worldwide Access',
              text: 'Access our services from anywhere in the world with our secure and user-friendly platform.',
            },
            {
              icon: '💾',
              title: 'Data Privacy',
              text: 'We prioritize your privacy with robust data security measures for your uploads and reports.',
            },
            {
              icon: '🔍',
              title: 'Early Detection',
              text: 'Leverage AI-powered models for early detection and classification of lumbar spine conditions.',
            },
            {
              icon: '🤝',
              title: 'Collaboration',
              text: 'Work closely with our team of doctors, researchers, and technicians to ensure precise results.',
            },
          ].map((service, idx) => (
            <div className="col-md-4 mb-4" key={idx}>
              <div className="card service-card h-100 text-center">
                <div className="icon mb-3 service-icon">
                  {service.icon}
                </div>
                <h4 className="service-title">
                  {service.title}
                </h4>
                <p className="service-description">
                  {service.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
        <AuthModal showModal={showModal} closeModal={closeModal} />

      {/* Footer */}
      <footer className="footer bg-dark text-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5 className="text-uppercase mb-4">About Us</h5>
              <p>
                At Lumbar Spine Care Services, we are dedicated to providing comprehensive insights, advanced
                tools, and expert care for lumbar spine health. Your well-being is our priority.
              </p>
            </div>
            <div className="col-md-3">
              <h5 className="text-uppercase mb-4">Contact Us</h5>
              <ul className="list-unstyled">
                <li>
                  <i className="bi bi-geo-alt-fill" /> 123 Spine Care Street, City, Country
                </li>
                <li>
                  <i className="bi bi-telephone-fill" /> +1 234 567 890
                </li>
                <li>
                  <i className="bi bi-envelope-fill" /> support@lumbarspine.com
                </li>
              </ul>
            </div>
            <div className="col-md-5">
              <h5 className="text-uppercase mb-4">Newsletter</h5>
              <p>Subscribe to get the latest updates and health tips.</p>
              <form>
                <div className="input-group">
                  <input type="email" className="form-control" placeholder="Your Email" />
                  <button className="btn btn-primary" type="submit">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
          <hr className="bg-light my-4" />
          <p className="text-center mb-0">© 2025 Lumbar Spine Care. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}