import React from 'react';
import { FaGithub, FaHtml5, FaCss3Alt, FaJs, FaReact, FaPhp, FaBootstrap, FaNodeJs } from 'react-icons/fa';
import { SiMysql, SiMongodb } from 'react-icons/si';
import './Projects.css';

const projects = [
  {
    name: "Hospital Management System",
    description: "Developed a comprehensive hospital system to manage patient records, appointments, billing, and doctor scheduling. This project streamlined hospital operations and improved patient experience through automation.",
    github: "https://github.com/your-username/hospital-management",
    tech: [<FaHtml5 />, <FaCss3Alt />, <FaJs />, <FaPhp />, <SiMysql />],
  },
  {
    name: "Content Management System (Al Basit GOC)",
    description: "Created a dynamic CMS for Al Basit GOC to manage and publish content efficiently. Integrated with a modern UI using Bootstrap and React for fast content delivery and user experience.",
    github: "https://github.com/your-username/albasit-cms",
    tech: [<FaHtml5 />, <FaCss3Alt />, <FaJs />, <FaReact />, <FaBootstrap />],
  },
  {
    name: "Online Clothing Store",
    description: "Built a full-stack e-commerce platform for clothing products with cart, checkout, and inventory features. Enabled secure user login, order processing, and product management.",
    github: "https://github.com/your-username/clothing-store",
    tech: [<FaHtml5 />, <FaCss3Alt />, <FaJs />, <FaPhp />, <SiMysql />],
  },
  {
    name: "Skin Cancer Detection",
    description: "Implemented a skin cancer detection web app with image upload and prediction. Users can register, upload skin lesion images, and view diagnosis with history tracking to monitor previous results.",
    github: "https://github.com/your-username/skin-cancer-detection",
    tech: [<FaHtml5 />, <FaCss3Alt />, <FaJs />, <FaNodeJs />, <SiMongodb />],
  },
  {
    name: "Portfolio Website",
    description: "Created a modern, responsive personal portfolio to showcase skills, experience, and projects. Highlights web development expertise and includes animations and interactive sections.",
    github: "https://github.com/your-username/portfolio",
    tech: [<FaHtml5 />, <FaCss3Alt />, <FaJs />, <FaBootstrap />],
  },
  // {
  //   name: "To-do App",
  //   description: "A productivity app that allows users to add, remove, and track daily tasks. Supports local storage for persistent task management with a clean and minimal UI.",
  //   github: "https://github.com/your-username/todo-app",
  //   tech: [<FaHtml5 />, <FaCss3Alt />, <FaJs />],
  // },
  // {
  //   name: "Blog Website",
  //   description: "A responsive blog platform where users can read and share articles. Includes category filtering, user-friendly interface, and content organization.",
  //   github: "https://github.com/your-username/blog-site",
  //   tech: [<FaHtml5 />, <FaCss3Alt />, <FaReact />],
  // },
];

function Projects() {
  return (
    <section id="projects" className="projects-section">
      <h2 className="section-title">Projects</h2>
      <div className="projects-container">
        {projects.map((project, index) => (
          <div key={index} className="project-card animate-fade-up">
            <div className="project-header">
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <FaGithub className="github-icon" />
              </a>
              <h3>{project.name}</h3>
            </div>
            <p className="project-desc">{project.description}</p>
            <div className="project-tech">
              {project.tech.map((icon, i) => (
                <span key={i}>{icon}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
