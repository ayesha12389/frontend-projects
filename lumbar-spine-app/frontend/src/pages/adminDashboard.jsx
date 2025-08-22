import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from 'recharts';

export default function SummarySection() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userRole = user?.role || 'user';
  const userId = user?._id || user?.id || user?.userId;
const [severityTrendData, setSeverityTrendData] = useState([]);
const [confidenceData, setConfidenceData] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [kpis, setKpis] = useState({
    imagesUploaded: 0,
    reportsGenerated: 0,
    activePatients: 0,
    activeDoctors: 0,
    appointments: 0,
  });
const severitySummary = React.useMemo(() => {
  let low = 0, moderate = 0, severe = 0;
  severityTrendData.forEach(item => {
    low += item.lowSeverity || 0;
    moderate += item.moderate || 0;
    severe += item.severe || 0;
  });
  return { lowSeverity: low, moderate, severe };
}, [severityTrendData]);

  // Helpers
  const formatDate = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const buildDateQuery = () => {
    const startDate = formatDate(fromDate);
    const endDate = formatDate(toDate);
    const params = [];
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    return params.length > 0 ? `?${params.join('&')}` : '';
  };

  
  
const buildDateQuerynew = () => {
  const startDate = formatDate(fromDate);
  const endDate = formatDate(toDate);
  const params = [];
  if (startDate) params.push(`start=${startDate}`);
  if (endDate) params.push(`end=${endDate}`);
  if (userId) params.push(`userId=${userId}`);
  return params.length > 0 ? `?${params.join('&')}` : '';
};

const fetchSeverityTrend = async () => {
  try {
    const dateQuery = buildDateQuerynew();
    const url = `http://localhost:5000/api/summary/severity-trend${dateQuery}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch severity trend');
    const data = await res.json();
    setSeverityTrendData(data);
  } catch (error) {
    console.error(error);
    setSeverityTrendData([]);
  }
};
const fetchConfidenceTrend = async () => {
  try {
    let url = '';
    const startDate = formatDate(fromDate);
    const endDate = formatDate(toDate);

    const queryParams = [];
    if (startDate) queryParams.push(`start=${startDate}`);
    if (endDate) queryParams.push(`end=${endDate}`);

    // ❗ Add userId filter only if NOT admin
    if (userRole !== 'admin' && userId) {
      queryParams.push(`userId=${userId}`);
    }

    const finalQuery = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    url = `http://localhost:5000/api/summary/confidence-trend${finalQuery}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch confidence trend');
    const data = await res.json();
    setConfidenceData(data);
  } catch (error) {
    console.error(error);
    setConfidenceData([]);
  }
};


const fetchScansCount = async () => {
  try {
    const dateQuery = buildDateQuery();
    let url = '';
    if (userRole === 'admin') {
      url = `http://localhost:5000/api/scans/count${dateQuery}`;
    } else {
      url = `http://localhost:5000/api/scans/${userId}${dateQuery}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Scans API error:', errorText);
      throw new Error('Failed to fetch scans count');
    }

    const data = await res.json();
   

    return {
      imagesUploaded: data.totalCount || 0,
      reportsGenerated: data.totalCount || 0,
    };

  } catch (error) {
    console.error('Scans Count Error:', error);
    // ✅ FIXED: Return hardcoded default values instead of undefined vars
    return {
      imagesUploaded: 0,
      reportsGenerated: 0
    };
  }
};




  // Fetch counts for active users (patients, doctors)
  const fetchUsersCount = async () => {
    try {
      const dateQuery = buildDateQuery();
      let activePatients = 0;
      let activeDoctors = 0;

      if (userRole === 'admin') {
        // Active patients
        const patientsRes = await fetch(
          `http://localhost:5000/api/user/count?role=user${dateQuery}`
        );
        const patientsData = await patientsRes.json();
        activePatients = patientsData.total || 0;

        // Active doctors
        const doctorsRes = await fetch(
          `http://localhost:5000/api/user/count?role=doctor${dateQuery}`
        );
        const doctorsData = await doctorsRes.json();
      
        activeDoctors = doctorsData.total || 0;
        
      } else if (userRole === 'doctor') {
        // For doctor, no clear API for active patients by doctorId? Skipping or 0
        activePatients = 0;
        activeDoctors = 1; // count self
      } else {
        activePatients = 0;
        activeDoctors = 0;
      }

      return { activePatients, activeDoctors };
    } catch (err) {
      console.error(err);
      return { activePatients: 0, activeDoctors: 0 };
    }
  };

  // Fetch count of appointments
  const fetchAppointmentsCount = async () => {
    try {
      const dateQuery = buildDateQuery();
      let url = '';
      if (userRole === 'admin') {
        url = `http://localhost:5000/api/appointments/count${dateQuery}`;
      } else {
        url = `http://localhost:5000/api/appointments/count/${userId}${dateQuery}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch appointments count');
      const data = await res.json();
      return data.count || 0;
    } catch (err) {
      console.error(err);
      return 0;
    }
  };

  // Fetch all KPIs and update state
  const fetchAllKpis = async () => {
    const scans = await fetchScansCount();
    const users = await fetchUsersCount();
    const appointments = await fetchAppointmentsCount();

    setKpis({
      imagesUploaded: scans.imagesUploaded || 0,
      reportsGenerated: scans.reportsGenerated || 0,
      activePatients: users.activePatients || 0,
      activeDoctors: users.activeDoctors || 0,
      appointments: appointments || 0,
    });
  };

  useEffect(() => {
    fetchAllKpis();
    fetchSeverityTrend();
  fetchConfidenceTrend();
  }, [fromDate, toDate, userRole, userId]);

  // Hide KPIs for certain roles
  function shouldShowKPI(label) {
    const hiddenFor = {
      'Active Patients': ['doctor', 'user'],
      'Active Doctors': ['doctor', 'user'],
    };
    return !hiddenFor[label]?.includes(userRole);
  }

  // Static data (can replace with API data if you want)
 
  const severityColors = {
    lowSeverity: '#3b82f6',
    moderate: '#fbbf24',
    severe: '#ef4444',
  };
  
  const doctorData = {
    pendingRequests: 12,
    verifiedDoctors: 85,
  };
  const appointmentData = {
    booked: 130,
    completed: 95,
  };
  const lastWeekStatus = {
    Sunday: { booked: 9, canceled: 1, capacity: 10 },
    Monday: { booked: 7, canceled: 3, capacity: 10 },
  };
  const latestArticles = [
    'Understanding Disc Degeneration',
    'Preventing Lumbar Strain',
    'Rehabilitation Exercises',
  ];

  const percentBooked = ({ booked, capacity }) => Math.round((booked / capacity) * 100);

  const formatedDate = (date) => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month},${year}`;
  };

  return (
    <>
      {/* Datepicker + KPIs */}
      <div className="d-flex align-items-center flex-wrap gap-2 m-4">
        <DatePicker
          selected={fromDate}
          onChange={setFromDate}
          className="form-control form-control-sm"
          dateFormat="MM/dd/yyyy"
          placeholderText="From"
          isClearable
          style={{ width: '100px' }}
        />
        <DatePicker
          selected={toDate}
          onChange={setToDate}
          className="form-control form-control-sm"
          dateFormat="MM/dd/yyyy"
          placeholderText="To"
          isClearable
          style={{ width: '100px' }}
        />
        {[
          { label: 'Images Uploaded', value: kpis.imagesUploaded },
          { label: 'Reports Generated', value: kpis.reportsGenerated },
          { label: 'Active Patients', value: kpis.activePatients },
          { label: 'Active Doctors', value: kpis.activeDoctors },
          { label: 'Appointments', value: kpis.appointments },
        ]
          .filter(({ label }) => shouldShowKPI(label))
          .map(({ label, value }) => (
            <div
              key={label}
              style={{
                minWidth: '110px',
                textAlign: 'center',
                margin: '0 10px',
                color: 'black',
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>{value}</div>
              <div
                style={{
                  textTransform: 'uppercase',
                  fontSize: '0.6rem',
                  color: '#333',
                  marginTop: '4px',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        {userRole === 'user' && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate('/access-doctor')}
          >
            Request Doctor Access
          </button>
        )}
      </div>

      {/* Severity summary and graphs (admin and doctor) */}
      {(userRole === 'admin' || userRole === 'doctor' || userRole==="user") && (
        <div className="container-fluid px-4 mt-4">
          <div className="row gy-4">
            <div className="col-12 col-md-2">
              <h5>Severity Summary</h5>
              <div style={{ marginTop: '4rem', color: '#222', fontWeight: '600', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '180px' }}>
                  <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>
                    {severitySummary.lowSeverity} <br />
                    <small style={{ fontSize: '0.75rem', fontWeight: '400', color: '#555' }}>Normal / Mild</small>
                  </span>
                  <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>
                    {severitySummary.moderate} <br />
                    <small style={{ fontSize: '0.75rem', fontWeight: '400', color: '#555' }}>Moderate</small>
                  </span>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>
                    {severitySummary.severe} <br />
                    <small style={{ fontSize: '0.75rem', fontWeight: '400', color: '#555' }}>Severe</small>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-5">
              <p style={{ textAlign: 'center' }}>
                From : {formatedDate(fromDate)} | To : {formatedDate(toDate)}
              </p>
          <div
  style={{
    height: 250,
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  }}
>
  {severityTrendData.length > 0 ? (
    <ResponsiveContainer width="90%" height="100%">
      <LineChart data={severityTrendData}>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="monotone"
          dataKey="lowSeverity"
          stroke={severityColors.lowSeverity}
          name="Normal / Mild"
        />
        <Line
          type="monotone"
          dataKey="moderate"
          stroke={severityColors.moderate}
          name="Moderate"
        />
        <Line
          type="monotone"
          dataKey="severe"
          stroke={severityColors.severe}
          name="Severe"
        />
      </LineChart>
    </ResponsiveContainer>
  ) : (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        color: '#666',
        fontSize: '1rem',
      }}
    >
      No data available
    </div>
  )}
</div>

            </div>

            <div className="col-12 col-md-5">
              <p style={{ fontWeight: '600' }}>Confidence Score</p>
             <div style={{ height: 250, marginTop: '1rem', position: 'relative' }}>
  {confidenceData.length > 0 ? (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={confidenceData}>
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="confidence"
          stroke="#2563eb"
          fill="#68d9c7"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  ) : (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        color: '#666',
        fontSize: '1rem',
      }}
    >
      No data available
    </div>
  )}
</div>

            </div>
          </div>
        </div>
      )}

     

      {/* Last section - visible to all */}
      {/* <div className="container-fluid px-4" style={{ marginTop: '2rem' }}>
        <div className="row gy-4" style={{ color: '#222', fontWeight: '600', fontSize: '0.8rem' }}>
          <div className="col-12 col-md-4 d-flex justify-content-between">
           
            <div style={{ width: '48%' }}>
              <h6>Doctor Requests</h6>
              <span style={{ fontSize: '1.6rem', lineHeight: 1, display: 'block', marginBottom: '0.25rem' }}>
                {doctorData.pendingRequests}
              </span>
              <small style={{ fontSize: '0.75rem', fontWeight: '400', color: '#555', display: 'block', marginBottom: '1rem' }}>
                Pending Requests
              </small>

              <span style={{ fontSize: '1.6rem', lineHeight: 1, display: 'block', marginBottom: '0.25rem' }}>
                {doctorData.verifiedDoctors}
              </span>
              <small style={{ fontSize: '0.75rem', fontWeight: '400', color: '#555', display: 'block' }}>
                Verified Doctors
              </small>
            </div>

          
             <div style={{ width: '48%' }}>
              <h6>Appointments</h6>
              <span style={{ fontSize: '1.6rem', lineHeight: 1, display: 'block', marginBottom: '0.25rem' }}>
                {appointmentData.booked}
              </span>
              <small style={{ fontSize: '0.75rem', fontWeight: '400', color: '#555', display: 'block', marginBottom: '1rem' }}>
                Booked
              </small>

              <span style={{ fontSize: '1.6rem', lineHeight: 1, display: 'block', marginBottom: '0.25rem' }}>
                {appointmentData.completed}
              </span>
              <small style={{ fontSize: '0.75rem', fontWeight: '400', color: '#555', display: 'block' }}>
                Completed
              </small>
            </div> 
          </div>

           <div className="col-12 col-md-4 p-0">
            <h6>Last Week Appointment Status</h6>
            {Object.entries(lastWeekStatus).map(([day, { booked, canceled, capacity }]) => {
              const pct = percentBooked({ booked, capacity });
              const shortDay = day.slice(0, 3);

              return (
                <div key={day} className="mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                  <p style={{ minWidth: '35px', marginBottom: '0' }}>{shortDay}</p>

                  <div
                    className="progress flex-grow-1"
                    style={{ height: '18px', borderRadius: '10px', overflow: 'hidden', maxWidth: '60%' }}
                  >
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${pct}%`, backgroundColor: '#3b82f6' }}
                      aria-valuenow={pct}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {booked} booked
                    </div>
                    <div
                      style={{
                        width: `${100 - pct}%`,
                        backgroundColor: '#f87171',
                        display: 'inline-block',
                        height: '18px',
                        textAlign: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        lineHeight: '18px',
                        position: 'relative',
                        top: '-18px',
                        left: `${pct}%`,
                        paddingLeft: '5px',
                        paddingRight: '5px',
                      }}
                    >
                      {canceled} canceled
                    </div>
                  </div>
                </div>
              );
            })}
          </div> 

           <div className="col-12 col-md-4">
            <h6>Latest Articles</h6>
            <ul className="list-unstyled mt-3 mb-0">
              {latestArticles.map((title, i) => (
                <li key={i}>
                  <a href="#" className="text-decoration-none">
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </div> 
        </div>
      </div> */}
    </>
  );
}
