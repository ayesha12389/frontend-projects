import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Testimonials.css";
import testimonial from '../assets/testimonials-.png'

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "Smart Electric Workshop is exactly what other business has been lacking. Wow what great service, I love it! Dude, your stuff is the bomb! Very easy to use. We're loving it. The best on the market.",
      author: "George Taylor",
      role: "AC Repair",
      background: null, // No background for the first testimonial
    },
    {
      quote:
        "Thank you for making it painless, pleasant and most of all hassle-free! I would gladly pay over 600 dollars for AC Repair. You won’t regret it. Thanks for the great service.",
      author: "Thomas Sanderson",
      role: "Audi RS7",
      background: testimonial,
    },
  ];

  return (
    <div className="testimonials-section bg-light py-5">
      <div className="container">
        <h2 className=" text-center mb-3">What People Say</h2>
        <h3 className="text-center mb-5">Our Testimonials</h3>

        <div className="row">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-md-6">
              <div
                className={`testimonial-card p-4 rounded ${
                  index === 0 ? "bg-white shadow" : "text-white"
                }`}
                style={
                  testimonial.background
                    ? {
                        backgroundImage: `url(${testimonial.background})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: "white",
                      }
                    : {}
                }
              >
                <blockquote className="blockquote mb-4">
                  <p className="mb-0">"{testimonial.quote}"</p>
                </blockquote>
                <div className="d-flex justify-content-start align-items-center mt-3">
                  <span className="author-name  text-white px-3 py-1 rounded me-2">
                    {testimonial.author}
                  </span>
                  <span className="author-role bg-warning text-white px-3 py-1 rounded">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
