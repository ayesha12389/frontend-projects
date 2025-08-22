import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
// import Resume from './components/resume';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css'; // Make sure App.css includes icon-background styles

function App() {
  return (
    <>
      {/* Floating Background Icons */}
      <div className="icon-background">
        <i className="fas fa-code"></i>
        <i className="fas fa-laptop-code"></i>
        <i className="fas fa-terminal"></i>
        <i className="fas fa-cogs"></i>
        <i className="fas fa-database"></i>
      </div>

      {/* App Content */}
      <div>
        <Navbar />
        <Home />
        <About />
        <Projects />
        <Contact />
        {/* <Resume /> */}
      </div>
    </>
  );
}

export default App;
