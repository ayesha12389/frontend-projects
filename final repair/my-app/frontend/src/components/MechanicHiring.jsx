import React from "react";
import "./MechanicHiring.css"; // Import CSS
import workshop from "../assets/tech1.avif";
import workshop2 from "../assets/tech2.jpg";
import workshop3 from "../assets/tech3.webp";

const ElectricalRepairSection = () => {
  return (
    <section className="container py-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h4 className="text-warning fw-bold">We're Hiring!</h4>
        <h1 className="fw-bold" style={{color: "#0a3d62"}}>
          Grow as an <span className="text-warning">Electrical Repair Specialist</span>
        </h1>
        <p className="text-muted">
          Join our expert team of electricians and power up homes safely and efficiently. <br />
          We’re hiring skilled professionals for household electrical repairs, wiring, and installations.
        </p>
      </div>

      {/* Image Grid */}
      <div className="row g-4 align-items-stretch">
        {/* Left Large Image */}
        <div className="col-md-6">
          <img
            src={workshop2}
            alt="Electrician fixing household wiring"
            className="img-fluid rounded shadow large-image"
          />
        </div>

        {/* Right Column - Two Stacked Images */}
        <div className="col-md-6 d-flex flex-column justify-content-between">
          <div className="mb-4">
            <img
              src={workshop}
              alt="Technician installing electrical outlet"
              className="img-fluid rounded shadow small-image"
            />
          </div>
          <div>
            <img
              src={workshop3}
              alt="Electrician checking an electrical panel"
              className="img-fluid rounded shadow small-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElectricalRepairSection;
