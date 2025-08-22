import React from 'react';

const Resume = () => {
  return (
    <div style={styles.container}>
      <h1>My Resume</h1>

      <iframe
        src="/resume.pdf"
        title="Resume"
        style={styles.iframe}
      ></iframe>

      <a href="/resume.pdf" download="My_Resume.pdf" style={styles.downloadButton}>
        <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
        Download Resume
      </a>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    color: '#f4f4f4',
  },
  iframe: {
    width: '100%',
    height: '600px',
    border: 'none',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  downloadButton: {
    display: 'inline-block',
    padding: '12px 25px',
    backgroundColor: '#203a43',
    color: '#89cff0',
    fontSize: '18px',
    borderRadius: '8px',
    textDecoration: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s ease',
  },
};

export default Resume;
