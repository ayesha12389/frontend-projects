import React, { useEffect, useState, useContext } from 'react'; 
import { Routes, Route, useNavigate, Link, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// --- DoctorQueueList: shows pending applications ---
export function DoctorQueueList() {
  const [apps, setApps] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/doctor-applications', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.apps)
          ? res.data.apps
          : [];
      setApps(list);
    })
    .catch(err => console.error('Error fetching applications:', err));
  }, []);

  const handleDecision = (id, action) => {
    axios.post(`http://localhost:5000/api/${id}/${action}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      toast.success(`Application ${action}ed`);
      setApps(prev => prev.filter(a => a._id !== id));
    })
    .catch(err => {
      console.error(`Failed to ${action}:`, err);
      toast.error(`Failed to ${action}`);
    });
  };

  return (
    <div className="container py-4">
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }} className="mb-4">Doctor Applications Queue</h2>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ fontSize: '0.8rem' }}>Date/Time</th>
              <th style={{ fontSize: '0.8rem' }}>Name</th>
              <th style={{ fontSize: '0.8rem' }}>Preview</th>
              <th style={{ fontSize: '0.8rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted py-5" style={{ fontSize: '0.8rem' }}>
                  No pending applications
                </td>
              </tr>
            ) : (
              apps.map(app => (
                <tr key={app._id} style={{ fontSize: '0.8rem' }}>
                  <td>{new Date(app.submittedAt || app.createdAt).toLocaleString()}</td>
                  <td>
                    <span className="fw-bold" style={{ fontWeight: 600 }}>{app.fullName}</span>
                    <div className="text-muted small" style={{ fontSize: '0.8rem' }}>{app.email}</div>
                  </td>
                  <td>
                    <Link to={`${app._id}`} className="text-primary" style={{ fontSize: '0.8rem' }}>
                      <i className="bi bi-eye" title="View Application" />
                    </Link>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleDecision(app._id, 'approve')}
                        style={{ fontSize: '0.8rem' }}
                      >
                        <i className="bi bi-check-circle me-1" /> Approve
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDecision(app._id, 'reject')}
                        style={{ fontSize: '0.8rem' }}
                      >
                        <i className="bi bi-x-circle me-1" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- DoctorApplicationDetail: detailed view + decision ---
export function DoctorApplicationDetail() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/admin/doctor-applications/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      setApp(res.data);
    })
    .catch(err => console.error('Error fetching application detail:', err));
  }, [id]);

  const handleDecision = action => {
    axios.post(`http://localhost:5000/api/${id}/${action}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      toast.success(`Application ${action}ed`);
      navigate('/admin/doctor-queue');
    })
    .catch(err => {
      console.error(`Failed to ${action}:`, err);
      toast.error(`Failed to ${action}`);
    });
  };

  if (!app) return <div className="container py-4" style={{ fontSize: '0.8rem' }}>Loading...</div>;

  const docs = [
    { label: 'Degree File',         file: app.degreeFile      },
    { label: 'Profile Photo',       file: app.profilePhoto    },
    { label: 'PMDC Certificate',    file: app.documents?.pmdcCert     },
    { label: 'CNIC Front',          file: app.documents?.cnicFront    },
    { label: 'CNIC Back',           file: app.documents?.cnicBack     },
    { label: 'Degree Certificate',  file: app.documents?.degreeCert   },
    { label: 'House Job Letter',    file: app.documents?.houseJobLetter }
  ];

  return (
    <div className="container py-4">
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }} className="mb-3">Application Details</h2>

      <div className="mb-4 border rounded p-3 bg-light" style={{ fontSize: '0.8rem' }}>
        <h5 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Applicant Info</h5>
        <p><strong>Name:</strong> {app.fullName}</p>
        <p><strong>Email:</strong> {app.email}</p>
        <p><strong>Submitted:</strong> {new Date(app.submittedAt || app.createdAt).toLocaleString()}</p>
      </div>

      <h5 style={{ fontSize: '1.2rem', fontWeight: 600 }} className="mt-4 mb-3">Documents</h5>
      <div className="row g-3" style={{ fontSize: '0.8rem', margin: 0 }}>
        {docs.every(d => !d.file) ? (
          <p>No documents available.</p>
        ) : (
          docs.map(({ label, file }) => file && (
  <div key={label} className="col-12 col-sm-6 col-md-3 col-lg-4" style={{ margin: 0 }}>
    <div className="card h-100 shadow-sm">
      <div className="card-header fw-bold" style={{ fontWeight: 600 }}>{label}</div>
      <div className="card-body p-2">
        <a href={`http://localhost:5000${file.path}`} target="_blank" rel="noopener noreferrer">
          <iframe
            src={`http://localhost:5000${file.path}`}
            title={label}
            width="100%"
            height="200"
            className="border rounded"
            style={{ display: 'block', pointerEvents: 'none' }} // disables iframe interaction to ensure click opens link
          />
        </a>
      </div>
    </div>
  </div>
))

        )}
      </div>

      <div className="mt-4 d-flex gap-3" style={{ fontSize: '0.8rem' }}>
        <button className="btn btn-success" onClick={() => handleDecision('approve')} style={{ fontSize: '0.8rem' }}>
          <i className="bi bi-check2-circle me-1" /> Approve
        </button>
        <button className="btn btn-danger" onClick={() => handleDecision('reject')} style={{ fontSize: '0.8rem' }}>
          <i className="bi bi-x-circle me-1" /> Reject
        </button>
      </div>
    </div>
  );
}
