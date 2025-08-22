import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./InfoCards.css";

const InfoCards = () => {
  return (
    <div className="info-cards container position-relative">
      <div className="row text-center g-4">
        {/* Card 1 */}
        <div className="col-lg-3 col-md-6">
          <div className="card h-100 p-3 border-0 shadow-sm">
            <div className="card-body d-flex flex-column align-items-center">
              <i className="bi bi-geo-alt-fill icon"></i>
              <h5 className="card-title mt-3">Location Details</h5>
              <p className="card-text ">
                346 Woodbridge Lane <br />
                Seattle, 3030 Washington <br />
                + (12) 123 - 556 - 7890
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-lg-3 col-md-6">
          <div className="card h-100 p-3 border-0 shadow-sm">
            <div className="card-body d-flex flex-column align-items-center">
              <i className="bi bi-tools icon"></i>
              <h5 className="card-title mt-3">Emergency Repair</h5>
              <p className="card-text">
                Low rates and emergency service available 24 hours a day every
                day of the year.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-lg-3 col-md-6">
          <div className="card h-100 p-3 border-0 shadow-sm">
            <div className="card-body d-flex flex-column align-items-center">
              <i className="bi bi-compass-fill icon"></i>
              <h5 className="card-title mt-3">Get Directions</h5>
              <p className="card-text">
                Get directions to Autolane Repair in Seattle and have your car
                checked today.
              </p>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="col-lg-3 col-md-6">
          <div className="card h-100 p-3 border-0 shadow-sm">
            <div className="card-body d-flex flex-column align-items-center">
              <i className="bi bi-calendar2-check-fill icon"></i>
              <h5 className="card-title mt-3">Make Appointment</h5>
              <p className="card-text">
                Schedule an appointment today through our online calendar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
