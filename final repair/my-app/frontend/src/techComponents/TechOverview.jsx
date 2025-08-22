import React from "react";
import { Link } from "react-router-dom";
import "./TechOverview.css";

function TechOverview({ searchText }) {
  const technicians = [
    { title: "Repair Technician", description: "AI-based Workload Management", action: "Assign Jobs", path: "/workload" },
    { title: "Update Job Status", description: "Completed Repairs", action: "Job Status", path: "/update" },
    { title: "Customer Communication", description: "Discuss Repair Issues", action: "Communication", path: "/communicate" },
    { title: "Service Reports Submission", description: "Parts Used Information", action: "Upload Report", path: "/report" },
    { title: "Appointment Management", description: "Scheduled Requests Handling", action: "Availability", path: "/availability" },
  ];

  const filteredTechnicians = technicians.filter(tech =>
    tech.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div className="technician-overview bg-white mt-4 p-4 rounded shadow-sm">
        <h4 className="mb-3">Technician Overview</h4>
        <div className="table-responsive">
          <table className="table">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTechnicians.map((tech, index) => (
                <tr key={index}>
                  <td>{tech.title}</td>
                  <td>{tech.description}</td>
                  <td className="text-end">
                    <Link to={tech.path} className="btn btn-sm">
                      {tech.action}
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredTechnicians.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-muted">No matches found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TechOverview;
