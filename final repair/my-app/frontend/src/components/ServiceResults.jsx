import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ServiceResults({ services }) {
  const [technicians, setTechnicians] = useState({});
  const [expandedService, setExpandedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTechnicians = async () => {
    try {
      const tempTechnicians = {};
      for (const service of services) {
        const response = await axios.get(
          `http://localhost:5000/api/services/technicians?serviceName=${service.name}`
        );
        tempTechnicians[service._id] = response.data;
      }
      setTechnicians(tempTechnicians);
    } catch (error) {
      console.error("Error fetching technicians:", error);
      alert("There was an error fetching technicians.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (services && services.length > 0) {
      setLoading(true);
      fetchTechnicians();
    }
  }, [services]);

  const toggleReadMore = (id) => {
    setExpandedService((prev) => (prev === id ? null : id));
  };

// ServiceResults.js
const handleRepairClick = (service) => {
  const techniciansForService = technicians[service._id];
  if (techniciansForService && techniciansForService.length > 0) {
    const technician = techniciansForService[0]; // Pick first technician
    navigate(`/appointments`, { state: { technician, service } }); // Send technician and service
  } else {
    alert("No technician available for this service.");
  }
};


  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">Recommended Services</h3>

      {loading ? (
        <p className="text-center">Loading technicians...</p>
      ) : services.length > 0 ? (
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
                      style={{ height: '180px', objectFit: 'cover' }}
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
                        fontSize: '0.95rem',
                        color: '#6c757d',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: isExpanded ? 'unset' : 2,
                      }}
                    >
                      {service.description}
                    </p>

                    {showReadMore && (
                      <span
                        onClick={() => toggleReadMore(service._id)}
                        style={{
                          color: 'blue',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                        <span style={{ fontSize: '0.75rem' }}>
                          {isExpanded ? '▲' : '▼'}
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
      ) : (
        <p className="text-center">No services found.</p>
      )}
    </div>
  );
}

export default ServiceResults;
