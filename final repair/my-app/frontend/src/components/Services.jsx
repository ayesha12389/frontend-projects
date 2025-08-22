import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarUser from './NavbarUser';
import Footer from './FooterSection';
import "./Services.css";

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [technicians, setTechnicians] = useState({});
  const [expandedService, setExpandedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Services and Technicians
  const fetchServicesAndTechnicians = async () => {
    try {
      const serviceResponse = await axios.get("http://localhost:5000/api/services");  // Fetch all services from API
      const fetchedServices = serviceResponse.data;
      setServices(fetchedServices);

      const tempTechnicians = {};
      for (const service of fetchedServices) {
        const technicianResponse = await axios.get(
          `http://localhost:5000/api/services/technicians?serviceName=${service.name}`
        );
        tempTechnicians[service._id] = technicianResponse.data;
      }
      setTechnicians(tempTechnicians);
    } catch (error) {
      console.error("Error fetching services or technicians:", error);
      alert("There was an error fetching services or technicians.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesAndTechnicians(); // Fetch data when the page loads
  }, []);

  const handleRepairClick = (service) => {
    const techniciansForService = technicians[service._id];
    if (techniciansForService && techniciansForService.length > 0) {
      const technician = techniciansForService[0]; // Pick first technician
      navigate(`/appointments`, { state: { technician, service } });
    } else {
      alert("No technician available for this service.");
    }
  };

  const toggleReadMore = (id) => {
    setExpandedService((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <NavbarUser />
      <div className="image-section">
        <div className="image-overlay">
          <div className="text-content text-center">
            <h1 className="image-title">Recommended Services</h1>
            <p className="image-subtitle">Check out our top-rated services and technicians, handpicked based on customer feedback.</p>
          </div>
        </div>
      </div>

      <div className="services-page">
        {/* Loading State */}
        {loading ? (
          <p className="text-center">Loading services...</p>
        ) : (
          <div className="container my-5">
           

            {/* Service Cards */}
            <div className="row justify-content-center g-4">
              {services.map((service) => {
                const isExpanded = expandedService === service._id;
                const showReadMore = service.description.length > 120;

                return (
                  <div className="col-md-4" key={service._id}>
                    <div className="card service-card h-100">
                      {service.image && (
                        <img
                          src={`http://localhost:5000${service.image}`}
                          alt={service.name}
                          className="card-img-top"
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{service.name}</h5>
                        <p className="card-text">Category: {service.category}</p>

                        {technicians[service._id]?.length > 0 && (
                          <p className="card-text">
                            Technician: <strong>{technicians[service._id][0].name}</strong>
                          </p>
                        )}

                        <p
                          className="card-text text-muted"
                          style={{
                            fontSize: "0.95rem",
                            color: "#6c757d",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: isExpanded ? "unset" : 2,
                          }}
                        >
                          {service.description}
                        </p>

                        {showReadMore && (
                          <span
                            onClick={() => toggleReadMore(service._id)}
                            style={{
                              color: "blue",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {isExpanded ? "Read less" : "Read more"}
                            <span style={{ fontSize: "0.75rem" }}>
                              {isExpanded ? "▲" : "▼"}
                            </span>
                          </span>
                        )}

                        <button
                          className="btn btn-primary rounded-pill px-4 py-2 fw-bold mt-3"
                          onClick={() => handleRepairClick(service)}
                        >
                          Repair Request
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ServicesPage;
