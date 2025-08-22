// src/components/DoctorApplicationForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast }      from 'react-toastify';

export default function DoctorApplicationForm() {
  const { user } = useContext(AuthContext);

  const [form, setForm]     = useState({});
  const [files, setFiles]   = useState({});
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const [pmdcPattern,    setPmdcPattern]    = useState('.*');
  const [pmdcPlaceholder, setPmdcPlaceholder] = useState('');
  const [cnicPattern,    setCnicPattern]    = useState('.*');
  const [cnicPlaceholder, setCnicPlaceholder] = useState('');

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name')
      .then(r => r.json())
      .then(data => {
        setCountries(data.map(c=>c.name.common).sort());
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!form.country) {
      setCities([]);
      setPmdcPattern('.*'); setPmdcPlaceholder('');
      setCnicPattern('.*'); setCnicPlaceholder('');
      return;
    }

    fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ country: form.country })
    })
      .then(r=>r.json())
      .then(json=>json.data && setCities(json.data))
      .catch(console.error);

    switch (form.country) {
      case 'Pakistan':
        setPmdcPattern(`^\\d{5}-\\d{7}-\\d$`); setPmdcPlaceholder('12345-1234567-1');
        setCnicPattern(`^\\d{5}-\\d{7}-\\d$`); setCnicPlaceholder('12345-1234567-1');
        break;
      case 'United States':
        setPmdcPattern(`^[A-Z]{2}-\\d{6}$`); setPmdcPlaceholder('AB-123456');
        setCnicPattern(`^\\d{3}-\\d{2}-\\d{4}$`); setCnicPlaceholder('123-45-6789');
        break;
      default:
        setPmdcPattern('^.+$'); setPmdcPlaceholder('');
        setCnicPattern('^.+$'); setCnicPlaceholder('');
    }
  }, [form.country]);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = e =>
    setFiles(f => ({ ...f, [e.target.name]: e.target.files[0] }));

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k,v])=>fd.append(k,v));
    Object.entries(files).forEach(([k,v])=>v && fd.append(k,v));

    try {
      const res = await fetch(
        `http://localhost:5000/api/doctor/apply`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.token}` },
          body: fd
        }
      );
   
      if (!res.ok) throw new Error(await res.text());

      toast.success('Application submitted successfully!');
      setForm({});
      setFiles({});
    } catch (err) {
      console.error(err);
      toast.error('Submission failed. See console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {/* Country */}
      <div className="mb-2">
        <label className="form-label">Country</label>
        <select
          name="country"
          value={form.country||''}
          onChange={handleChange}
          className="form-select form-select-sm"
          required
        >
          <option value="">Select country</option>
          {countries.map(c=>(
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="mb-2">
        <label className="form-label">City</label>
        <select
          name="city"
          value={form.city||''}
          onChange={handleChange}
          className="form-select form-select-sm"
          required
          disabled={!cities.length}
        >
          <option value="">Select city</option>
          {cities.map(city=>(
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* University (free-text) */}
      <div className="mb-2">
        <label className="form-label">University</label>
        <input
          name="university"
          type="text"
          className="form-control form-control-sm"
          value={form.university||''}
          onChange={handleChange}
          placeholder="Enter medical university name"
          required
        />
      </div>

      {/* PMDC/NMDC Reg. Number */}
      <div className="mb-2">
        <label className="form-label">PMDC / NMDC Reg. Number</label>
        <input
          name="pmdcNumber"
          type="text"
          className="form-control form-control-sm"
          value={form.pmdcNumber||''}
          onChange={handleChange}
          pattern={pmdcPattern}
          placeholder={pmdcPlaceholder}
          title={pmdcPlaceholder ? `Format: ${pmdcPlaceholder}` : ''}
          required
        />
      </div>

      {/* CNIC Number */}
      <div className="mb-2">
        <label className="form-label">CNIC Number</label>
        <input
          name="cnicNumber"
          type="text"
          className="form-control form-control-sm"
          value={form.cnicNumber||''}
          onChange={handleChange}
          pattern={cnicPattern}
          placeholder={cnicPlaceholder}
          title={cnicPlaceholder ? `Format: ${cnicPlaceholder}` : ''}
          required
        />
      </div>

      {/* Other fields */}
      {[
        ['fullName','Full Name'],
        ['fatherName',"Father's Name"],
        ['passingYear','Passing Year'],
        ['email','Email'],
        ['contactNumber','Contact Number'],
        ['address','Address / City']
      ].map(([name,label])=>(
        <div key={name} className="mb-2">
          <label className="form-label">{label}</label>
          <input
            name={name}
            type="text"
            className="form-control form-control-sm"
            value={form[name]||''}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      {/* File uploads */}
      {[
        ['degreeFile','Medical Degree (PDF/Image)'],
        ['profilePhoto','Profile Photo'],
        ['pmdcCert','PMDC/NMDC Certificate'],
        ['cnicFront','CNIC Front'],
        ['cnicBack','CNIC Back'],
        ['degreeCert','Degree Certificate'],
        ['houseJobLetter','House Job Letter']
      ].map(([name,label])=>(
        <div key={name} className="mb-2">
          <label className="form-label">{label}</label>
          <input
            name={name}
            type="file"
            accept="application/pdf,image/*"
            className="form-control form-control-sm"
            onChange={handleFile}
            required={name!=='houseJobLetter'}
          />
        </div>
      ))}

      <button type="submit" className="btn btn-primary mt-3">
        Submit Application
      </button>
    </form>
  );
}
