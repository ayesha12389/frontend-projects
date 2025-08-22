import React from 'react';
import profileImage from './images/ayesha.jpeg';

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaPhp,
  FaGithub,
  FaDatabase,
  FaUserAstronaut
} from 'react-icons/fa';

import './about.css';
// Comment out or remove if image is not available
// import profileImage from './images/ayesha.jpeg';

function About() {
  const imageFound = false; // Change to true and uncomment image if available

  return (
    <section id="about" className="section about-container">
      <div className="about-left">
        <h2>About Me</h2>
        <p>
          I'm Ayesha Zulfiqar, a detail-oriented web developer with expertise in both front-end and back-end technologies. I am passionate about building dynamic, responsive, and user-friendly web applications.
        </p>

        <h3>🎓 Education</h3>
        <p>
          <strong>BS Software Engineering</strong><br />
          COMSATS University Islamabad, Vehari Campus<br />
          Sep 2021 – Jun 2025
        </p>

        <h3>💼 Experience</h3>
        <p>
          I have worked on multiple academic and personal projects including Hospital Management System, CMS for Al Basit GOC, an Online Clothing Store, and a Skin Cancer Detection app using modern technologies.
        </p>

        <h3>🛠 Skills</h3>
        <div className="skills">
          <span><FaHtml5 /> HTML5</span>
          <span><FaCss3Alt /> CSS3</span>
          <span><FaJs /> JavaScript</span>
          <span><FaReact /> React.js</span>
          <span><FaPhp /> PHP</span>
          <span><FaDatabase /> MySQL / MongoDB</span>
          <span><FaGithub /> Git & GitHub</span>
        </div>
      </div>

      <div className="about-right">
        {imageFound ? (
          <img src={profileImage} alt="Ayesha Zulfiqar" className="about-img" />
        ) : (
          <FaUserAstronaut className="about-icon-fallback" />
        )}
      </div>
    </section>
  );
}

export default About;
