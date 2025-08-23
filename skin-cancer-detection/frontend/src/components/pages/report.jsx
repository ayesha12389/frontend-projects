import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function Report() {
  return (
    <>
      <Navbar />

      <div className="report-container" id="report">
        <h1>Skin Cancer Detection Report</h1>

        <div className="report-section">
          <h2>Patient Information</h2>
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Age:</strong> 30</p>
          <p><strong>Gender:</strong> Male</p>
          <p><strong>Report Date:</strong> 22 Aug 2025</p>
          <p><strong>Physician:</strong> Dr. Umer Mushtaq</p>
        </div>

        <div className="report-section">
          <h2>Image Analysis</h2>
          <p><strong>Uploaded Image:</strong></p>
          <img
            src="https://via.placeholder.com/400"
            alt="Skin Lesion"
            className="report-image"
          />
          <p><strong>Diagnosis:</strong> Benign</p>
          <p><strong>Confidence Level:</strong> 92%</p>
          <p><strong>Mitotic Category:</strong> Low</p>
          <p><strong>Anatomical Site:</strong> Arm</p>
        </div>

        <div className="report-section">
          <h2>Recommendations</h2>
          <p>Regular monitoring and annual dermatologist visit recommended.</p>
        </div>

        <div className="report-section benign-extra">
          <h3>Helpful Info for Benign Diagnosis</h3>
          <ul>
            <li>Maintain regular skin checks at home.</li>
            <li>Use sun protection: SPF 30+ daily.</li>
            <li>Hydrate skin and avoid excessive sun exposure.</li>
            <li>Consider visiting a dermatologist once a year.</li>
          </ul>
        </div>

        <div className="report-section disclaimer">
          <strong>Disclaimer:</strong> This report is generated using AI and
          does not replace professional medical diagnosis.
        </div>
      </div>

      <div className="buttons">
        <button onClick={() => window.print()}>Download as PDF</button>
      </div>

      <Footer />
    </>
  );
}

export default Report;
