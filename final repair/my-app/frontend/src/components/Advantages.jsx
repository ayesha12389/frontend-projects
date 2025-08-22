import React from "react";
import "./Advantages.css";

function Advantages() {
  const advantages = [
    {
      icon: "bi-shield-fill-check", // Bootstrap icon class
      title: "Free Diagnostic Check",
      description: "Take advantage of our free diagnostic check offer.",
    },
    {
      icon: "bi-wrench-adjustable-circle", // Bootstrap icon class
      title: "Trained Technicians",
      description: "All our technicians are certified and highly experienced.",
    },
    {
      icon: "bi-tag-fill", // Bootstrap icon class
      title: "Affordable Pricing",
      description: "We offer competitive rates for all repair and maintenance services.",
    },
    {
      icon: "bi-patch-check-fill", // Bootstrap icon class
      title: "Quality Guaranteed",
      description: "We ensure every repair is done right the first time.",
    },
    {
      icon: "bi-award-fill", // Bootstrap icon class
      title: "Warranty on Repairs",
      description: "Enjoy a warranty on our repair services for peace of mind.",
    },
    {
      icon: "bi-speedometer2", // Bootstrap icon class
      title: "Quick Service Times",
      description: "Our services are fast and efficient to minimize your downtime.",
    },
  ];

  return (
    <section className="advantages-section py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <p className="text-custom fw-bold mb-2">Why Choose Us</p>
          <h2 className="display-5 fw-bold">Our Advantages</h2>
        </div>

        {/* Cards */}
        <div className="row g-4">
          {advantages.map((advantage, index) => (
            <div className="col-md-4" key={index}>
              <div className="advantage-card d-flex align-items-center p-4 ">
                <div className="icon-container me-3">
                  <i className={`bi ${advantage.icon} advantage-icon`}></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-2">{advantage.title}</h5>
                  <p className=" mb-0">{advantage.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Advantages;
