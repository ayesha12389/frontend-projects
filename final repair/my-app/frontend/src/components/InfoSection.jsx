import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import professional from "../assets/feature-2.jpg";
import './InfoSection.css'

const InfoSection = () => {
  return (
    <div className="info-section container my-5">
      <div className="row align-items-center">
        {/* Left Section: Image */}
        <div className="col-lg-6">
          <img
            src={professional}
            alt="Caravan Service"
            className="img-fluid rounded shadow w-100"
            style={{
              height: "420px",
              
              objectFit: "cover", // Ensures image covers the container
              borderRadius: "8px", // Smooth edges
            }}
          />
        </div>

        {/* Right Section: Text */}
        <div className="col-lg-6">
          <h1 className="display-5 mb-3">
            Book Professional Repairmen in Few Seconds
          </h1>
          <p className=" mb-4">
            our electric Repair workshop takes pride in all our work. Our
            qualified staff are highly trained in all areas, ensuring your peace
            of mind. We use the latest equipment, genuine parts, and quality
            materials to repair your electronics to its original condition.
          </p>
          <p className="">
          Regular maintenance is crucial for the optimal performance of your
           electrical systems. Ensure your electrical systems are professionally
            and regularly serviced by our Electrical Repair Workshop, so you can 
            enjoy a hassle-free experience on your next project or journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
