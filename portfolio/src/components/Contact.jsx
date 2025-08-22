import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaLinkedin, FaGithub } from 'react-icons/fa';
import './contact.css';

function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <h2>Contact Me</h2>
      <p className="contact-subtitle">Feel free to reach out for collaborations or just a friendly hello 👋</p>
      
      <div className="contact-info">
        <div className="contact-item">
          <FaEnvelope className="contact-icon" />
          <a href="mailto:ayeshazulfqar434@gmail.com">ayeshazulfqar434@gmail.com</a>
        </div>
        <div className="contact-item">
          <FaPhoneAlt className="contact-icon" />
          <span>+92 325 7510841</span>
        </div>
        <div className="contact-item">
          <FaLinkedin className="contact-icon" />
          <a href="https://www.linkedin.com/in/ayesha-zulifqar-11a4162b4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
          LinkedIn</a>
        </div>
        <div className="contact-item">
          <FaGithub className="contact-icon" />
          <a href="https://github.com/ayesha12389/projects" target="_blank" rel="noopener noreferrer">
          GitHub</a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
