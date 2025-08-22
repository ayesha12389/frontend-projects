import React from 'react';
import { FaGithub, FaLinkedin, FaWhatsapp, FaFileDownload } from 'react-icons/fa';
import { FaUserAlt } from 'react-icons/fa'; // fallback icon
import './home.css';
import profileImage from './images/ayesha.jpeg'; // place your image in src folder

function Home() {
  const imageFound = true; // Set to false if image is not available

  return (
    <section id="home" className="section home-container">
      <div className="home-left">
        <h2>I'm Ayesha Zulfiqar</h2>
        <h3>Web Developer</h3>
        <p>
          I'm passionate about building responsive and user-friendly web applications.
          I love to explore new technologies and continuously improve my development skills.
        </p>
        <div className="social-icons">
          <a href="https://github.com/ayesha12389/projects" target="_blank" rel="noopener noreferrer">
            <FaGithub size={28} />
          </a>
          <a href="https://wa.me/923257510841" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={28} />
          </a>
          <a href="https://www.linkedin.com/in/ayesha-zulifqar-11a4162b4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={28} />
          </a>
<a href="./resume/Ayesha Zulifqar (web developer).pdf" download target="_blank" rel="noopener noreferrer">
            <FaFileDownload size={28} />
          </a>
        </div>
      </div>
      <div className="home-right">
        {imageFound ? (
          <img src={profileImage} alt="Ayesha Zulfiqar" className="profile-img" />
        ) : (
          <FaUserAlt className="default-icon" />
        )}
      </div>
    </section>
  );
}

export default Home;
