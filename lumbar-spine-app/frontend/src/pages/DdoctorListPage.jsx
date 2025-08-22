import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchDoctors();
  }, []);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Meet Our Doctors</h1>

      <div className="row">
        {doctors.map(doc => (
          <div
            className="col-md-4 mb-4"
            key={doc.id}
            onClick={() => navigate(`/doctor/${doc.userId}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <img
                  src={doc.profileImage ? `http://localhost:5000/uploads/${doc.profileImage}` : 'https://i.pravatar.cc/150'}
                  alt={doc.fullName}
                  className="rounded-circle mb-3"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid #ccc' }}
                />
                <h5 className="card-title">{doc.fullName}</h5>
                <p className="card-text text-muted fst-italic">{doc.specialization}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
