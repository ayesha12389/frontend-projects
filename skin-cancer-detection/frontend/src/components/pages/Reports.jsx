import React, { useEffect, useState } from "react";

function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch("http://localhost:5000/api/reports");
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error(err);
        alert("Error loading reports: " + err.message);
      }
    }
    loadReports();
  }, []);

  return (
    <div className="container" style={styles.container}>
      <h1 style={styles.title}>All Skin Cancer Reports</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Age</th>
            <th style={styles.th}>Gender</th>
            <th style={styles.th}>Diagnosis</th>
            <th style={styles.th}>Mitotic Category</th>
            <th style={styles.th}>Anatomical Site</th>
            <th style={styles.th}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <tr key={index} style={styles.tr}>
                <td style={styles.td}>{report.age}</td>
                <td style={styles.td}>{report.gender}</td>
                <td style={styles.td}>{report.category}</td>
                <td style={styles.td}>{report.mitoticCount}</td>
                <td style={styles.td}>{report.anatomicalSite}</td>
                <td style={styles.td}>{report.remarks || ""}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={styles.td} colSpan="6">No reports available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ✅ Inline Styles (same as your HTML/CSS)
const styles = {
  container: {
    maxWidth: "1100px",
    margin: "40px auto",
    backgroundColor: "#fff",
    color: "#333",
    padding: "30px 40px",
    borderRadius: "15px",
    boxShadow: "0 6px 25px rgba(0,0,0,0.3)",
  },
  title: {
    textAlign: "center",
    color: "#004080",
    marginBottom: "30px",
    fontSize: "2.5em",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  th: {
    backgroundColor: "#004080",
    color: "#fff",
    padding: "16px",
    textAlign: "left",
  },
  td: {
    padding: "16px",
    fontSize: "0.95em",
    verticalAlign: "middle",
  },
  tr: {
    transition: "background-color 0.3s ease",
  },
};

export default Reports;
