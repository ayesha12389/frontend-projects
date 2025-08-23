import React, { useEffect, useState } from "react";

const History = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // 🔹 Replace with actual API call
    // Example: fetch("/api/reports").then(res => res.json()).then(setReports)
    const dummyReports = [
      {
        _id: "123",
        report_date: "22-Aug-2025",
        diagnosis: "Benign",
        pdf_url: "/reports/123.pdf",
        image_url: "/images/sample1.png",
      },
      {
        _id: "124",
        report_date: "20-Aug-2025",
        diagnosis: "Malignant",
        pdf_url: "/reports/124.pdf",
        image_url: "/images/sample2.png",
      },
    ];
    setReports(dummyReports);
  }, []);

  return (
    <div
      style={{
        flexGrow: 1,
        padding: "40px",
        maxWidth: "1200px",
        margin: "auto",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#004080", marginBottom: "20px" }}>
        Diagnosis History
      </h1>

      {reports.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            margin: "20px 0",
            fontSize: "1em",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Report ID</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Diagnosis</th>
              <th style={thStyle}>Download</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{report._id}</td>
                <td style={tdStyle}>{report.report_date}</td>
                <td style={tdStyle}>{report.diagnosis}</td>
                <td style={tdStyle}>
                  <a
                    href={report.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={btnStyle}
                  >
                    <i className="fas fa-file-download"></i> PDF
                  </a>
                  <a
                    href={report.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...btnStyle, marginLeft: "10px" }}
                  >
                    <i className="fas fa-image"></i> Image
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", fontSize: "1.1em" }}>No reports found.</p>
      )}

      <div
        style={{
          textAlign: "center",
          fontSize: "0.85em",
          color: "#fff",
          padding: "10px 0",
          marginTop: "20px",
          backgroundColor: "#004080",
          borderRadius: "5px",
        }}
      >
        &copy; 2025 Skin Cancer Detection System. All Rights Reserved.
      </div>
    </div>
  );
};

// ✅ Inline styles for table
const thStyle = {
  padding: "12px 15px",
  border: "1px solid #ddd",
  backgroundColor: "#004080",
  color: "#ffffff",
};

const tdStyle = {
  padding: "12px 15px",
  border: "1px solid #ddd",
};

const btnStyle = {
  display: "inline-block",
  padding: "8px 16px",
  fontSize: "0.9em",
  color: "#ffffff",
  backgroundColor: "#004080",
  borderRadius: "4px",
  textDecoration: "none",
  transition: "background-color 0.3s",
};

export default History;
