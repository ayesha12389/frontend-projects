import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./guide.css";
import NavbarWithModal from "./navbar";

// Import all images you use here from assets:
import Left_Neural_Foraminal_Narrowing_L1_L2 from "../assets/Left_Neural_Foraminal_Narrowing_L1_L2.png";
import Left_Neural_Foraminal_Narrowing_L2_L3 from "../assets/Left_Neural_Foraminal_Narrowing_L2_L3.png";
import Left_Neural_Foraminal_Narrowing_L3_L4 from "../assets/Left_Neural_Foraminal_Narrowing_L3_L4.png";

import Left_Subarticular_Stenosis_L1_L2 from "../assets/Left_Subarticular_Stenosis_L1_L2.png";
import Left_Subarticular_Stenosis_L2_L3 from "../assets/Left_Subarticular_Stenosis_L2_L3.png";
import Left_Subarticular_Stenosis_L3_L4 from "../assets/Left_Subarticular_Stenosis_L3_L4.png";
import Left_Subarticular_Stenosis_L4_L5 from "../assets/Left_Subarticular_Stenosis_L4_L5.png";
import Left_Subarticular_Stenosis_L5_S1 from "../assets/Left_Subarticular_Stenosis_L5_S1.png";

import Right_Neural_Foraminal_Narrowing_L1_L2 from "../assets/Right_Neural_Foraminal_Narrowing_L1_L2.png";
import Right_Neural_Foraminal_Narrowing_L2_L3 from "../assets/Right_Neural_Foraminal_Narrowing_L2_L3.png";
import Right_Neural_Foraminal_Narrowing_L3_L4 from "../assets/Right_Neural_Foraminal_Narrowing_L3_L4.png";
import Right_Neural_Foraminal_Narrowing_L4_L5 from "../assets/Right_Neural_Foraminal_Narrowing_L4_L5.png";
import Right_Neural_Foraminal_Narrowing_L5_S1 from "../assets/Right_Neural_Foraminal_Narrowing_L5_S1.png";

import Spinal_Canal_Stenosis_L1_L2 from "../assets/Spinal_Canal_Stenosis_L1_L2.png";
import Spinal_Canal_Stenosis_L2_L3 from "../assets/Spinal_Canal_Stenosis_L2_L3.png";
import Spinal_Canal_Stenosis_L3_L4 from "../assets/Spinal_Canal_Stenosis_L3_L4.png";
import Spinal_Canal_Stenosis_L4_L5 from "../assets/Spinal_Canal_Stenosis_L4_L5.png";
import Spinal_Canal_Stenosis_L5_S1 from "../assets/Spinal_Canal_Stenosis_L5_S1.png";

// Map for dynamically loaded images in loadDynamicContent
const imageMap = {
  Left_Neural_Foraminal_Narrowing_L1_L2,
  Left_Neural_Foraminal_Narrowing_L2_L3,
  Left_Neural_Foraminal_Narrowing_L3_L4,
  Left_Subarticular_Stenosis_L1_L2,
  Left_Subarticular_Stenosis_L2_L3,
  Left_Subarticular_Stenosis_L3_L4,
  Left_Subarticular_Stenosis_L4_L5,
  Left_Subarticular_Stenosis_L5_S1,
  Right_Neural_Foraminal_Narrowing_L1_L2,
  Right_Neural_Foraminal_Narrowing_L2_L3,
  Right_Neural_Foraminal_Narrowing_L3_L4,
  Right_Neural_Foraminal_Narrowing_L4_L5,
  Right_Neural_Foraminal_Narrowing_L5_S1,
  Spinal_Canal_Stenosis_L1_L2,
  Spinal_Canal_Stenosis_L2_L3,
  Spinal_Canal_Stenosis_L3_L4,
  Spinal_Canal_Stenosis_L4_L5,
  Spinal_Canal_Stenosis_L5_S1,
};

const API_BASE_URL = "http://localhost:5000/api";

export default function LumbarSpineGuide() {
  const [showMoreVisible, setShowMoreVisible] = useState({
    // track which "See More" buttons are clicked by condition name
  });
  const [dynamicContent, setDynamicContent] = useState(null);
  const [loginSignupMode, setLoginSignupMode] = useState("login"); // "login" or "signup"
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: null,
  });

  // To show/hide additional images
  function handleShowMore(conditionKey) {
    setShowMoreVisible((prev) => ({ ...prev, [conditionKey]: true }));
  }

  // Load dynamic content on View button click
  function loadDynamicContent(level, condition) {
    if (!level || !condition) {
      alert("Please select both level and condition.");
      return;
    }

    // Compose key for image import lookup
    const imgKey = `${condition}_${level}`;

    const imgSrc = imageMap[imgKey];

    setDynamicContent({
      title: `${condition.replace(/_/g, " ")} (Level: ${level})`,
      description: `Displaying images for ${condition.replace(/_/g, " ")} at level ${level}.`,
      imgSrc: imgSrc || null,
      imgAlt: `${condition.replace(/_/g, " ")} ${level}`,
    });
  }
const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
 


  // State for selects
  const [levelSelect, setLevelSelect] = useState("");
  const [conditionSelect, setConditionSelect] = useState("");

  return (
    <>
    <NavbarWithModal openModal={openModal} />
      <div className="container">
        <h1 className="section-title">Interactive Lumbar Spine Guide</h1>
        <p className="text-center">
          Select a topic, spine level, and severity to view relevant images and information.
        </p>

        {/* Filter Section */}
        <div className="d-flex justify-content-center mb-4">
          <select
            id="levelSelect"
            className="form-select w-auto me-3"
            value={levelSelect}
            onChange={(e) => setLevelSelect(e.target.value)}
          >
            <option value="">Select Level</option>
            <option value="L1_L2">L1-L2</option>
            <option value="L2_L3">L2-L3</option>
            <option value="L3_L4">L3-L4</option>
            <option value="L4_L5">L4-L5</option>
            <option value="L5_S1">L5-S1</option>
          </select>

          <select
            id="condition"
            className="form-select w-auto"
            value={conditionSelect}
            onChange={(e) => setConditionSelect(e.target.value)}
          >
            <option value="">Select Condition</option>
            <option value="Left_Neural_Foraminal_Narrowing">Left Neural Foraminal Narrowing</option>
            <option value="Left_Subarticular_Stenosis">Left Subarticular Stenosis</option>
            <option value="Right_Neural_Foraminal_Narrowing">Right Neural Foraminal Narrowing</option>
            <option value="Spinal_Canal_Stenosis">Spinal Canal Stenosis</option>
          </select>

          <button
            className="btn btn-custom ms-3"
            onClick={() => loadDynamicContent(levelSelect, conditionSelect)}
          >
            View
          </button>
        </div>

        <div className="container">
          

          {/* Sections for conditions */}
          {/* 1. Left Neural Foraminal Narrowing */}
          <div className="section mb-4">
            <h3>Left Neural Foraminal Narrowing</h3>
            <p>
              Left Neural Foraminal Narrowing refers to the narrowing of the spaces through which nerves
              pass on the left side of the spine. This can result in nerve compression, leading to
              symptoms such as pain, numbness, or weakness in the affected area. Treatment may include
              physical therapy, medications, or surgery in severe cases.
            </p>
            <div className="row">
              <div className="col-md-4">
                <img
                  src={Left_Neural_Foraminal_Narrowing_L1_L2}
                  alt="Left Neural Foraminal Narrowing L1-L2"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-4">
                <img
                  src={Left_Neural_Foraminal_Narrowing_L2_L3}
                  alt="Left Neural Foraminal Narrowing L2-L3"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-4">
                <img
                  src={Left_Neural_Foraminal_Narrowing_L3_L4}
                  alt="Left Neural Foraminal Narrowing L3-L4"
                  className="img-fluid"
                />
              </div>

              {!showMoreVisible.Left_Neural_Foraminal_Narrowing && (
                <button
                  className="btn hero-button mt-3"
                  onClick={() => handleShowMore("Left_Neural_Foraminal_Narrowing")}
                >
                  See More
                </button>
              )}

              {showMoreVisible.Left_Neural_Foraminal_Narrowing && (
                <>
                  <div className="col-md-4 additional-images" style={{ display: "block" }}>
                    <img
                      src={Left_Neural_Foraminal_Narrowing_L1_L2}
                      alt="Additional Left Neural Foraminal Narrowing L1-L2"
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-md-4 additional-images" style={{ display: "block" }}>
                    <img
                      src={Left_Neural_Foraminal_Narrowing_L1_L2}
                      alt="Additional Left Neural Foraminal Narrowing L1-L2"
                      className="img-fluid"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 2. Left Subarticular Stenosis */}
          <div className="section mb-4">
            <h3>Left Subarticular Stenosis</h3>
            <p>
              Left Subarticular Stenosis occurs when the subarticular region of the spine narrows,
              compressing the nerves on the left side. Common symptoms include pain radiating down the
              leg and difficulty walking. Treatment options include pain management, physical therapy,
              and decompression surgery.
            </p>
            <div className="row">
              <div className="col-md-4">
                <img
                  src={Left_Subarticular_Stenosis_L1_L2}
                  alt="Left Subarticular Stenosis L1-L2"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-4">
                <img
                  src={Left_Subarticular_Stenosis_L2_L3}
                  alt="Left Subarticular Stenosis L2-L3"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-4">
                <img
                  src={Left_Subarticular_Stenosis_L3_L4}
                  alt="Left Subarticular Stenosis L3-L4"
                  className="img-fluid"
                />
              </div>

              {!showMoreVisible.Left_Subarticular_Stenosis && (
                <button
                  className="btn hero-button mt-3"
                  onClick={() => handleShowMore("Left_Subarticular_Stenosis")}
                >
                  See More
                </button>
              )}

              {showMoreVisible.Left_Subarticular_Stenosis && (
                <>
                  <div className="col-md-4 additional-images" style={{ display: "block" }}>
                    <img
                      src={Left_Subarticular_Stenosis_L4_L5}
                      alt="Additional Left Subarticular Stenosis L4-L5"
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-md-4 additional-images" style={{ display: "block" }}>
                    <img
                      src={Left_Subarticular_Stenosis_L5_S1}
                      alt="Additional Left Subarticular Stenosis L5-S1"
                      className="img-fluid"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 3. Right Neural Foraminal Narrowing */}
          <div className="section mb-4">
            <h3>Right Neural Foraminal Narrowing</h3>
            <p>
              Right Neural Foraminal Narrowing is characterized by the compression of nerves passing
              through the foramen on the right side of the spine. Symptoms often include pain, tingling,
              or muscle weakness on the right side of the body. Management involves conservative
              treatments or surgical decompression.
            </p>
            <div className="row">
              <div className="col-md-4">
                <img
                  src={Right_Neural_Foraminal_Narrowing_L1_L2}
                  alt="Right Neural Foraminal Narrowing L1-L2"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-4">
                <img
                  src={Right_Neural_Foraminal_Narrowing_L2_L3}
                  alt="Right Neural Foraminal Narrowing L2-L3"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-4">
                <img
                  src={Right_Neural_Foraminal_Narrowing_L3_L4}
                  alt="Right Neural Foraminal Narrowing L3-L4"
                  className="img-fluid"
                />
              </div>

              {!showMoreVisible.Right_Neural_Foraminal_Narrowing && (
                <button
                  className="btn hero-button mt-3"
                  onClick={() => handleShowMore("Right_Neural_Foraminal_Narrowing")}
                >
                  See More
                </button>
              )}

              {showMoreVisible.Right_Neural_Foraminal_Narrowing && (
                <>
                  <div className="col-md-4 additional-images" style={{ display: "block" }}>
                    <img
                      src={Right_Neural_Foraminal_Narrowing_L4_L5}
                      alt="Additional Right Neural Foraminal Narrowing L4-L5"
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-md-4 additional-images" style={{ display: "block" }}>
                    <img
                      src={Right_Neural_Foraminal_Narrowing_L5_S1}
                      alt="Additional Right Neural Foraminal Narrowing L5-S1"
                      className="img-fluid"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 4. Spinal Canal Stenosis */}
          <div className="section mb-4">
            <h3>Spinal Canal Stenosis</h3>
            <p>
              Spinal Canal Stenosis is a condition where the central spinal canal narrows, potentially
              compressing the spinal cord and nerves. Symptoms include back pain, numbness, and
              difficulty with balance or walking. Treatment options range from conservative measures to
              surgical decompression.
            </p>
            <div className="row">
              <div className="col-md-4">
                <img
                  src={Spinal_Canal_Stenosis_L1_L2}
                  alt="Spinal Canal Stenosis L1-L2"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-4">
                <img
                  src={Spinal_Canal_Stenosis_L2_L3}
                  alt="Spinal Canal Stenosis L2-L3"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-4">
                <img
                  src={Spinal_Canal_Stenosis_L3_L4}
                  alt="Spinal Canal Stenosis L3-L4"
                  className="img-fluid"
                />
              </div>

              {!showMoreVisible.Spinal_Canal_Stenosis && (
                <button
                  className="btn hero-button mt-3"
                  onClick={() => handleShowMore("Spinal_Canal_Stenosis")}
                >
                  See More
                </button>
              )}

              {showMoreVisible.Spinal_Canal_Stenosis && (
                <>
                  <div className="col-md-4 additional-images" style={{ display: "block" }}>
                    <img
                      src={Spinal_Canal_Stenosis_L4_L5}
                      alt="Additional Spinal Canal Stenosis L4-L5"
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-md-4 additional-images" style={{ display: "block" }}>
                    <img
                      src={Spinal_Canal_Stenosis_L5_S1}
                      alt="Additional Spinal Canal Stenosis L5-S1"
                      className="img-fluid"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Dynamic Content loaded on "View" */}
          {dynamicContent && (
            <div className="section mb-4">
              <h3>{dynamicContent.title}</h3>
              <p>{dynamicContent.description}</p>
              {dynamicContent.imgSrc ? (
                <img
                  src={dynamicContent.imgSrc}
                  alt={dynamicContent.imgAlt}
                  className="img-fluid col-md-4"
                />
              ) : (
                <p>No image available for this selection.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer bg-dark text-light py-5 mt-5">
        <div className="container">
          <div className="row">
            {/* About Section */}
            <div className="col-md-4">
              <h5 className="text-uppercase mb-4">About Us</h5>
              <p>
                At Lumbar Spine Care Services, we are dedicated to providing comprehensive
                insights, advanced tools, and expert care for lumbar spine health. Your well-being
                is our priority.
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-md-2">
              <h5 className="text-uppercase mb-4">Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#services" className="text-light">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-light">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#upload" className="text-light">
                    Upload
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-light">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="col-md-3">
              <h5 className="text-uppercase mb-4">Contact Us</h5>
              <ul className="list-unstyled">
                <li>
                  <i className="bi bi-geo-alt-fill"></i> 123 Spine Care Street, City, Country
                </li>
                <li>
                  <i className="bi bi-telephone-fill"></i> +1 234 567 890
                </li>
                <li>
                  <i className="bi bi-envelope-fill"></i> support@lumbarspine.com
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-md-3">
              <h5 className="text-uppercase mb-4">Newsletter</h5>
              <p>Subscribe to get the latest updates and health tips.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing!");
                }}
              >
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your Email"
                    required
                  />
                  <button className="btn btn-primary" type="submit">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>

          <hr className="bg-light my-4" />

          {/* Social Media & Copyright */}
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <a href="#" className="text-light me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light me-3">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-light me-3">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
            <p className="mb-0">© 2025 Lumbar Spine Care. All rights reserved.</p>
          </div>
        </div>
      </footer>

     
    </>
  );
}
