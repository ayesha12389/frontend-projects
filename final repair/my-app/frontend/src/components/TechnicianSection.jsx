import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules"; // Correct import for modules
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./TechnicianSection.css";
import tech1 from '../assets/team-two.jpg'
import tech2 from '../assets/team-seven.jpg'
import tech3 from '../assets/team-four.jpg'
import tech4 from '../assets/team-eight.jpg'
import tech5 from '../assets/about-img-2.jpg'
import tech6 from '../assets/feature-2.jpg'


const technicians = [
  {
    name: "Gerard Butler",
    role: "Installation",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed.",
    image: tech1,
  },
  {
    name: "Jack Nicholson",
    role: "Installation",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed.",
    image:tech2,
  },
  {
    name: "Robert Downey",
    role: "Installation",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed.",
    image: tech3,
  },
  {
    name: "Scarlett Johansson",
    role: "Installation",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed.",
    image: tech4,
  },
  {
    name: "Chris Hemsworth",
    role: "Installation",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed.",
    image: tech5,
  },
  {
    name: "Tom Holland",
    role: "Installation",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed.",
    image: tech6,
  },
];

function TechnicianSection() {
  return (
    <section className="technician-section py-5">
      <div className="container text-center">
        <p className="text-custom mb-2">OUR STAFF</p>
        <h2 className="fw-bold mb-5">Our Professional Technician Staff</h2>

        <Swiper
          spaceBetween={30}
          slidesPerView={3}
          loop={true}
          grabCursor={true}
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: { slidesPerView: 3 },
            576: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
          }}
          modules={[Autoplay, Pagination, Navigation]}
        >
          {technicians.map((tech, index) => (
            <SwiperSlide key={index}>
              <div className="card technician-card">
                <div className="image-container">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="rounded-circle technician-image"
                  />
                  <div className="bulb-design"></div>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{tech.name}</h5>
                  <p className="text-muted">{tech.role}</p>
                  <p className="card-text">{tech.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default TechnicianSection;
