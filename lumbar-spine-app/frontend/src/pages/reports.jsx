// ReportsTable.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const COLORS = {
  'Normal/Mild': 'badge-secondary',
  Moderate: 'badge-warning',
  Severe: 'badge-danger',
};

export default function ReportsTable({ userRole = 'admin' }) {
  const { user } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [perPage, setPer] = useState(15);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const search = params.get('search') || '';
  const severity = params.get('severity');
  const sort = params.get('sort');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = { search, page, perPage };
        
        // Add filters based on URL params
        if (severity) {
          q.severity = severity;
        }
        if (sort === 'newest') {
          q.sort = '-createdAt';
        }
        
        if (user.role !== 'admin') {
          q.userId = user.id || user._id;
        }
        
        const query = new URLSearchParams(q);
        const res = await fetch(`http://localhost:5000/api/scans?${query.toString()}`);
        const json = await res.json();
        setRows(json.scans);
        setTotal(json.total);

        if (json.scans.length === 1) {
          navigate(`/scan/${json.scans[0]._id}`);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [search, page, perPage, user, navigate, severity, sort]);

  const pages = Math.max(1, Math.ceil(total / perPage));

  const computeSeverity = (output) => {
    if (output.severity) return output.severity;
    if (output.results) {
      const sevList = Object.values(output.results).map(r => r.Severity);
      if (sevList.includes('Severe')) return 'Severe';
      if (sevList.includes('Moderate')) return 'Moderate';
      return 'Normal/Mild';
    }
    return '—';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    await fetch(`http://localhost:5000/api/scan/${id}`, { method: 'DELETE' });
    const newTotal = total - 1;
    setTotal(newTotal);
    if ((page - 1) * perPage >= newTotal && page > 1) {
      setPage(p => p - 1);
    } else {
      setPage(p => p);
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex gap-2 mb-2">
        <select
          className="form-select form-select-sm w-auto"
          value={perPage}
          onChange={e => { setPer(+e.target.value); setPage(1); }}
        >
          {[15, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <input
          className="form-control form-control-sm w-auto ms-auto"
          placeholder="Search…"
          value={search}
          onChange={() => { }}
          disabled
        />
      </div>

      <div className="table-responsive">
        <table
          className="table table-borderless align-middle mb-0"
          style={{ fontSize: '0.85rem' }}
        >
          <thead className="text-uppercase small text-muted">
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Model</th>
              <th>Condition</th>
              <th>Severity</th>
              <th>Date</th>
              {userRole === 'admin' && <th>By</th>}
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const idx = (page - 1) * perPage + i + 1;
              const sev = computeSeverity(r.output);
              return (
                <tr key={r._id}>
                  <td className="fw-semibold">{idx}</td>
                  <td>{r.name}</td>
                  <td className="text-capitalize">{r.model}</td>
                  <td>
                    {r.metadata?.condition || '—'}
                    {r.metadata?.level ? ` (${r.metadata.level})` : ''}
                  </td>
                  <td>
                    <span className={`badge rounded-pill ${COLORS[sev] || 'badge-secondary'}`}>
                      {sev}
                    </span>
                  </td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  {userRole === 'admin' && <td>{user.username || '—'}</td>}
                  <td className="text-end">
                    <i
                      className="bi bi-eye-fill mx-1"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/scan/${r._id}`)}
                    />
                    <i
                      className="bi bi-trash-fill mx-1"
                      style={{ cursor: 'pointer', color: '#dc3545' }}
                      onClick={() => handleDelete(r._id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center gap-2 mt-2">
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={page <= 1}
          onClick={() => setPage(p => p - 1)}
        >‹</button>
        <span className="small align-self-center">{page} / {pages}</span>
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={page >= pages}
          onClick={() => setPage(p => p + 1)}
        >›</button>
      </div>
    </div>
  );
}