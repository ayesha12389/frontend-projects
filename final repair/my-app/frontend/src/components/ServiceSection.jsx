import React, { useEffect, useState } from "react";
import "./ServiceSection.css";
import serviceImage1 from "../assets/service1.webp"; // Replace with actual image paths
import serviceImage2 from "../assets/service2.jpg";
import serviceImage3 from "../assets/service3.jpg";

function ServiceSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ count1: 0, count2: 0, count3: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".service-section");
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        setIsVisible(true); // Trigger animations
        window.removeEventListener("scroll", handleScroll); // Run once
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on page load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // Animation duration in milliseconds
      const interval = 10; // Update interval
      const totalSteps = duration / interval;
      const step1 = Math.ceil(1500 / totalSteps);
      const step2 = Math.ceil(3000 / totalSteps);
      const step3 = Math.ceil(100 / totalSteps);

      const counterInterval = setInterval(() => {
        setCounts((prevCounts) => {
          if (
            prevCounts.count1 >= 1500 &&
            prevCounts.count2 >= 3000 &&
            prevCounts.count3 >= 100
          ) {
            clearInterval(counterInterval);
            return prevCounts; // Stop updating when done
          }

          return {
            count1: Math.min(prevCounts.count1 + step1, 1500),
            count2: Math.min(prevCounts.count2 + step2, 3000),
            count3: Math.min(prevCounts.count3 + step3, 100),
          };
        });
      }, interval);
    }
  }, [isVisible]);

  return (
    <section className="service-section container py-5">
      <div className="row align-items-center">
        {/* Left Column: Text Content */}
        <div
          className={`col-lg-6 animate-content ${
            isVisible ? "in-view" : ""
          }`}
        >
          <p className="fw-bold mb-2">Smart Electric Workshop Since 2010</p>
          <h1 className="display-5 fw-bold mb-4">
            We're a Reliable Repair and Maintenance Workshop
          </h1>
          <p className="text-muted mb-4">
            Since 2010, Smart Electric Workshop has been offering exceptional
            repair and maintenance services. Our team ensures your appliances
            and electrical systems run smoothly with quality workmanship and
            personalized solutions.
          </p>
          <ul className="list-unstyled">
            <li className="d-flex align-items-center mb-2">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              Certified and experienced repair technicians
            </li>
            <li className="d-flex align-items-center mb-2">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              Environmentally safe materials and practices
            </li>
            <li className="d-flex align-items-center mb-2">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              Comprehensive equipment and repair solutions
            </li>
          </ul>
          <div className="d-flex align-items-center mt-4">
            <img
              src="https://via.placeholder.com/50"
              alt="CEO"
              className="rounded-circle me-3"
              style={{ width: "50px", height: "50px" }}
            />
            <div>
              <p className="mb-0 fw-bold">John Doe</p>
              <p className="text-custom mb-0">CEO Smart Electric Workshop</p>
            </div>
          </div>
        </div>

        {/* Right Column: Image and Stats */}
        <div className="col-lg-6">
          <div className="row g-3">
            <div className="col-md-6">
              <img
                src={serviceImage1}
                alt="Service 1"
                className="img-fluid rounded shadow-sm"
              />
              <h2 className="text-custom text-center mt-3">
                {counts.count1}+
              </h2>
              <p className="text-center text-muted">
                Devices Repaired this Year
              </p>
            </div>
            <div className="col-md-6">
              <img
                src={serviceImage2}
                alt="Service 2"
                className="img-fluid rounded shadow-sm"
              />
              <h2 className="text-custom text-center mt-3">
                {counts.count2}+
              </h2>
              <p className="text-center text-muted">
                Services Delivered this Year
              </p>
            </div>
            <div className="col-12">
              <img
                src={serviceImage3}
                alt="Service 3"
                className="img-fluid rounded shadow-sm"
              />
              <h2 className="text-custom text-center mt-3">
                {counts.count3}%
              </h2>
              <p className="text-center text-muted">
                Customer Satisfaction Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceSection;
