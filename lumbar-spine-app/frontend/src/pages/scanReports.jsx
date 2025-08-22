// src/pages/ScanReport.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import instructionImageUrl from '../assets/instruction-image.png'
export default function ScanReport() {
  const { scanId } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiRoot = "http://localhost:5000";

  useEffect(() => {
    async function fetchScan() {
      try {
        const res = await fetch(`${apiRoot}/api/report/${scanId}`);
        if (res.ok) {
          const data = await res.json();
       
          setScan(data);
        } else {
          setScan(null);
        }
      } catch {
        setScan(null);
      } finally {
        setLoading(false);
      }
    }
    fetchScan();
  }, [scanId]);

  if (loading)
    return (
      <div
        className="text-center py-5"
        style={{
          fontSize: "0.8rem",
          color: "#6c757d",
          fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        Loading report...
      </div>
    );

  if (!scan)
    return (
      <div
        className="text-center py-5"
        style={{
          fontSize: "0.8rem",
          color: "#6c757d",
          fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        Report not found.
      </div>
    );

  const prettyTitle = (str) =>
    str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());


  return (
    <div className="container my-5" style={{ maxWidth: 1000 }}>
      <div className="row gx-4">
        {/* Left report column */}
        <section className="col-12 col-md-7 pe-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{ borderRadius: "0.5rem" }}
          >
            <h1
              className="mb-4"
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "#029b86",
                
              }}
            >
              Scan Report
            </h1>

            <p className="mb-1" style={{ fontSize: "0.9rem", color: "#444" }}>
              <strong>Model:</strong>{" "}
              <span style={{ fontWeight: "400" }}>{scan.model}</span>
            </p>
            {scan.metadata?.condition && (
              <p className="mb-1" style={{ fontSize: "0.9rem", color: "#444" }}>
                <strong>Condition:</strong>{" "}
                <span style={{ fontWeight: "400" }}>{scan.metadata.condition}</span>
              </p>
            )}
            {scan.metadata?.level && (
              <p className="mb-1" style={{ fontSize: "0.9rem", color: "#444" }}>
                <strong>Level:</strong>{" "}
                <span style={{ fontWeight: "400" }}>{scan.metadata.level}</span>
              </p>
            )}
            <p className="mb-3" style={{ fontSize: "0.9rem", color: "#444" }}>
              <strong>Created At:</strong>{" "}
              <span style={{ fontWeight: "400" }}>
                {new Date(scan.createdAt).toLocaleString()}
              </span>
            </p>

            <h2
              className="mb-3"
              style={{ fontSize: "1.2rem", fontWeight: 600, color: "#029b86" }}
            >
             Results
            </h2>

            {scan.output.severity && (
              <p style={{ fontSize: "0.9rem", color: "#198754" }}>
                <strong>Severity:</strong> {scan.output.severity}
              </p>
            )}

            {scan.output.results && (
              <table
                className="table table-sm"
                style={{ fontSize: "0.85rem", color: "#444" }}
              >
                <thead>
                  <tr>
                    {["Condition-Level", "Severity", "Confidence"].map((head) => (
                      <th
                        key={head}
                        className="fw-semibold"
                        style={{ borderBottom: "2px solid #dee2e6" }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(scan.output.results).map(
                    ([key, { Severity, Confidence }]) => (
                      <tr key={key}>
                        <td>{prettyTitle(key)}</td>
                        <td>{Severity}</td>
                        <td>{(Confidence * 100).toFixed(1)}%</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}

            {/* Coordinates only if model is lumbot */}
            {scan.model === "lumbot" && scan.output.coordinates && (
              <p style={{ fontSize: "0.85rem", color: "#444" }}>
                <strong>Coordinates:</strong>{" "}
                {scan.output.coordinates.join(", ")}
              </p>
            )}

            {/* Heatmap */}
            {scan.output.heatmapUrl && (
              <img
                src={`http://localhost:5001${scan.output.heatmapUrl}`}
                alt="Heatmap"
                className="img-fluid rounded shadow mt-4"
                style={{ objectFit: "contain" }}
              />
            )}
          </div>
        </section>

        {/* Right instruction column */}
        <aside
          className="col-12 col-md-5 ps-md-4 position-relative d-flex flex-column"
          style={{ minHeight: 500 }}
        >
          <div>
            <h3
              className="fw-semibold"
              style={{ fontSize: "1rem", color: "#212529" }}
            >
              📌 Important Notes
            </h3>
            <ul
              className="list-unstyled ps-3"
              style={{ fontSize: "0.85rem", color: "#6c757d", listStyleType: "disc" }}
            >
              <li>This report is generated by AI models.</li>
              <li>Different models may produce varying results.</li>
              <li>Models can sometimes make mistakes.</li>
              <li>Please do not rely solely on this report.</li>
              <li>Consult a qualified professional for final decisions.</li>
            </ul>
          </div>

          <img
            src={instructionImageUrl}
            alt="Instructions"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              maxHeight: 350,
              objectFit: "cover",
             
              width: "auto",
              maxWidth: "100%",
            }}
          />
        </aside>
      </div>
    </div>
  );
}
