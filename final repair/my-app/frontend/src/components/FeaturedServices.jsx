import React from 'react';
import './FeaturedServices.css';
import ACIcon from '../assets/tool2.png'; // Replace with correct file path
import AirCoolerIcon from '../assets/tool3.png'; // Replace with correct file path

function FeaturedServices() {
  const services = [
    {
      icon: ACIcon, // Icon for AC repair
      title: 'AC Repair',
      description: ' We offer fast, reliable solutions to keep you cool and comfortable all year round.',
    },
    {
      icon: AirCoolerIcon, // Icon for Air Cooler repair
      title: 'Air Cooler Repair',
      description: 'Keep your air cooler in top condition with our professional repair services,.',
    },
  ];

  return (
    <section className="featured-smart-services py-5">
      <div className="container">
        <div className="row">
          {/* Left Column: Vertically Centered */}
          <div className="col-lg-6 d-flex flex-column justify-content-center">
            <h2 className="mb-4 text-white">Featured & Smart Services</h2>
            <p className="text-white">
            Explore our Featured & Smart Services at the Smart Electric Workshop, <br />
             where cutting-edge technology meets expert repairs for all your electrical <br />
             needs.
            </p>
          </div>

          {/* Right Column: Service Boxes */}
          <div className="col-lg-6">
            {services.map((service, index) => (
              <div className="service-box d-flex align-items-center text-white p-3 rounded mb-3" key={index}>
                <div className="icon-container me-3">
                  <img src={service.icon} alt={service.title} className="service-icon" />
                </div>
                <div>
                  <h3 className="mb-2">{service.title}</h3>
                  <p className="mb-0">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedServices;
