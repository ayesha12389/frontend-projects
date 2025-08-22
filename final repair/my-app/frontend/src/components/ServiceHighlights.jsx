import React, { useEffect, useState } from 'react';
import appliance from '../assets/about-img-1.jpg';
import tool from '../assets/about-img-2.jpg';
import fixes from '../assets/feature-2.jpg';
import './ServiceHighlights.css';
import { NavLink } from 'react-router-dom';
function ServiceHighlights() {
  const services = [
    {
      img: appliance,
      title: 'Appliance Repair',
      description: 'Quick and efficient repair services for all household appliances.',
      rating: '⭐⭐⭐⭐⭐',
      price: '$50 - $150',
      progress: 65,
    },
    {
      img: tool,
      title: 'Tool Maintenance',
      description: 'Ensure your tools stay in top condition with regular maintenance.',
      rating: '⭐⭐⭐⭐',
      price: '$30 - $100',
      progress: 85,
    },
    {
      img: fixes,
      title: 'Electrical Fixes',
      description: 'Comprehensive repairs for all your electrical needs.',
      rating: '⭐⭐⭐⭐⭐',
      price: '$75 - $200',
      progress: 50,
    },
  ];

  // State to store progress values for each card
  const [progressWidths, setProgressWidths] = useState([]);

  // Animate progress bars when the section loads
  useEffect(() => {
    const initialProgress = services.map(service => service.progress);
    setProgressWidths(initialProgress);
  }, []);

  return (
    <section className="service-highlights container my-5 text-center">
      <h2 className="mb-4">Popular Repair Services</h2>
      <div className="row justify-content-center">
        {services.map((service, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card h-100 shadow">
              {/* Image */}
              <img
                src={service.img}
                className="card-img-top"
                alt={service.title}
                style={{
                  height: '270px',
                  width: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Button */}
              <button className="browse-btn">
  <NavLink to="/login" className="text-decoration-none text-white">
    Browse All Services
  </NavLink>
</button>
              {/* Card Content */}
              <div className="card-body">
                <h3 className="card-title">{service.title}</h3>
                <p className="card-text">{service.description}</p>
                <div className="d-flex justify-content-between">
                  <span className="text-warning">{service.rating}</span>
                  <span className="text-success fw-bold">{service.price}</span>
                </div>
                <div className="progress mt-3">
                  <div
                    className="progress-bar bg-custom"
                    style={{
                      width: `${progressWidths[index]}%`, // Dynamically set width
                    }}
                  >
                    {progressWidths[index]}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServiceHighlights;
