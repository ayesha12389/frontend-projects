import React, { useState, useRef } from 'react';
import './Hero.css';
import backgroundImage from '../assets/3.jpg';
import NavbarUser from './NavbarUser';
import axios from 'axios';
import ServiceResults from './ServiceResults';
import FooterSection from './FooterSection';

function HeroUser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const resultsRef = useRef(null);

  const handleSearch = async () => {
    setLoading(true);
    setShowResults(false);

    setTimeout(async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/services");
        const filtered = response.data.filter(service =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setServices(filtered);
        setShowResults(true);

        // Smooth scroll after setting services
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }, 2000); // ⏳ 2-second delay before showing results
  };

  return (
    <>
      <NavbarUser />
      <section
        className="hero-section d-flex align-items-center justify-content-center"
        style={{ backgroundImage: `url(${backgroundImage})`, minHeight: '80vh' }}
      >
        <div className="container text-white text-center hero-content">
          <h2 className="display-4 mb-4 single-line-heading">
            Welcome to our Smart Electric Workshop
          </h2>
          <p className="lead mb-4">Don't Miss Our Top Repair Services!</p>

          {/* Search Box */}
          <div className="position-relative w-75 mx-auto mb-60 d-flex">
            <input
              type="text"
              className="form-control"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                borderRadius: '30px 0 0 30px',
                border: '1px solid #ddd',
              }}
            />
            <button
              className="btn btn-primary"
              onClick={handleSearch}
              style={{
                borderRadius: '0 30px 30px 0',
                padding: '10px 20px',
                fontSize: '1rem',
              }}
            >
              <b>Search</b>
            </button>
          </div>

          {loading && <p className="mt-3 text-white">Searching services...</p>}
        </div>
      </section>

      {/* Services Rendered Below Hero Section */}
      <div ref={resultsRef}>
        {showResults && !loading && <ServiceResults services={services} />}
      </div>

      <FooterSection />
    </>
  );
}

export default HeroUser;
