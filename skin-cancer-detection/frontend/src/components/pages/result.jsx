import React, { useState } from "react";
import "./Result.css"; // ✅ Saari CSS yahan dal dena (style tag se nikal kar)

function Result({
  diagnosis,
  confidence,
  age,
  sex,
  mitotic_category,
  anatomical_site,
  recommendation,
  image_filename,
}) {
  const [showBenignInfo, setShowBenignInfo] = useState(false);
  const [showMalignantInfo, setShowMalignantInfo] = useState(false);
  const [toast, setToast] = useState(false);

  const reportData = {
    age,
    gender: sex,
    mitoticCount: mitotic_category,
    category: diagnosis,
    anatomicalSite: anatomical_site,
    remarks: recommendation,
    img: image_filename,
  };

  const saveReport = () => {
    fetch("http://localhost:5000/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportData),
    })
      .then((res) => {
        if (res.ok) {
          setToast(true);
          setTimeout(() => setToast(false), 3000);
        } else {
          return res.json().then((err) =>
            alert("Error saving report: " + err.message)
          );
        }
      })
      .catch((err) => alert("Error: " + err.message));
  };

  return (
    <div className="result-container">
      <h1>Analysis Result</h1>

      <div className={`status ${diagnosis === "Malignant" ? "malignant" : "benign"}`}>
        {diagnosis} {diagnosis === "Malignant" ? "(High Risk)" : "(Low Risk)"}
      </div>

      <p className="confidence">
        Confidence Level: <strong>{confidence}%</strong>
      </p>

      <div className="details">
        <p>
          <strong>Age:</strong> {age}
        </p>
        <p>
          <strong>Gender:</strong> {sex}
        </p>
        <p>
          <strong>Mitotic Category:</strong> {mitotic_category}
        </p>
        <p>
          <strong>Anatomical Site:</strong> {anatomical_site}
        </p>
        <p>
          <strong>Remarks:</strong> {recommendation}
        </p>
      </div>

      {image_filename ? (
        <img
          src={`http://localhost:5000/uploads/${image_filename}`} // ✅ Backend ka URL adjust karna hoga
          alt="Uploaded"
          className="uploaded-image"
        />
      ) : (
        <p>
          <strong>No valid ISIC image was uploaded.</strong>
        </p>
      )}

      {diagnosis === "Benign" && (
        <div className="helpful-info">
          <button
            onClick={() => setShowBenignInfo(!showBenignInfo)}
            className="toggle-btn"
          >
            Helpful Info
          </button>
          {showBenignInfo && (
            <div className="info-box">
              <h3>Benign Nevus Care Tips:</h3>
              <ol>
                <li>Monitor changes in mole color, size, or shape.</li>
                <li>Use SPF 30+ sunscreen daily.</li>
                <li>Don’t pick or irritate the mole.</li>
                <li>Consult a dermatologist if any discomfort arises.</li>
                <li>Consider cosmetic removal only after medical advice.</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {diagnosis === "Malignant" && (
        <div className="helpful-info">
          <button
            onClick={() => setShowMalignantInfo(!showMalignantInfo)}
            className="toggle-btn"
          >
            Important Malignant Care Info
          </button>
          {showMalignantInfo && (
            <div className="info-box">
              <h3>Malignant Lesion Care Tips:</h3>
              <ol>
                <li>Consult a dermatologist or oncologist immediately.</li>
                <li>Do not delay any biopsy or surgery.</li>
                <li>Follow up with regular scans or blood tests.</li>
                <li>Avoid trauma and UV exposure to the lesion site.</li>
              </ol>
            </div>
          )}
        </div>
      )}

      <div style={{ textAlign: "center" }}>
        <a href="/" className="home-btn">
          Go Back
        </a>
        <a href="/report" className="home-btn" style={{ backgroundColor: "#28a745" }}>
          View Report
        </a>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button id="saveReportBtn" className="home-btn" onClick={saveReport}>
          Save Report
        </button>
      </div>

      {toast && <div className="toast">Report saved successfully!</div>}
    </div>
  );
}

export default Result;
