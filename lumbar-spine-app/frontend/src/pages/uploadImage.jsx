/* src/pages/uploadImage.jsx */
import React, { useState, useRef, useCallback, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../context/AuthContext';
import uploadPlaceholder from '../assets/upload.jpg';
import { useNavigate } from 'react-router-dom';

/* ------- model meta --';-------- */
const MODEL_OPTIONS = [
  {
    value: 'spinaCore',
    label: 'SpinaCore',
    description:
      'Requires preprocessing and meta-data input. Covers levels L1-L2. Predicts severity based on provided meta-data.',
    metadataFields: [
      {
        name: 'condition',
        label: 'Condition',
        options: [
          'Spinal Canal Stenosis',
          'Right Neural Foraminal Narrowing',
          'Left Neural Foraminal Narrowing',
          'Left Subarticular Stenosis',
          'Right Subarticular Stenosis'
        ]
      },
      {
        name: 'level',
        label: 'Level',
        options: ['L1_L2', 'L2_L3', 'L3_L4', 'L4_L5', 'L5_S1']
      }
    ]
  },
  {
    value: 'structura',
    label: 'Structura',
    description:
      'No meta-data required. Automatically checks all levels and conditions. Provides comprehensive analysis.',
    metadataFields: []
  },
  {
    value: 'lumbot',
    label: 'Lumbot',
    description:
      'Uses both image and meta-data. Generates a heat-map with coordinates. Outputs severity for highlighted regions.',
    metadataFields: [
      {
        name: 'condition',
        label: 'Condition',
        options: [
          'Spinal Canal Stenosis',
          'Right Neural Foraminal Narrowing',
          'Left Neural Foraminal Narrowing',
          'Left Subarticular Stenosis',
          'Right Subarticular Stenosis'
        ]
      },
      {
        name: 'level',
        label: 'Level',
        options: ['L1_L2', 'L2_L3', 'L3_L4', 'L4_L5', 'L5_S1']
      }
    ]
  }
];

export default function UploadImage({ userRole = 'patient' }) {
  const [scanName, setScanName]     = useState('');
  const [preview, setPreview]       = useState(null);
  const [fileObj, setFileObj]       = useState(null);
  const [selectedModel, setModel]   = useState(MODEL_OPTIONS[0].value);
  const [metadata, setMetadata]     = useState({});
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState(null);
const { user }                     = useContext(AuthContext);

const role=user?.role;
const filteredModels = role === 'user'
  ? MODEL_OPTIONS.filter(model => model.value === 'spinaCore')
  : MODEL_OPTIONS;

const navigate = useNavigate();

  const fileInputRef = useRef();
  const apiRoot     = 'http://localhost:5001';
  const saveApi     = 'http://localhost:5000/api/reports';

  const handleFiles = useCallback(files => {
    if (!files.length) return;
    const file = files[0];
    if (!file.type.startsWith('image') && !file.name.endsWith('.dcm')) {
      alert('Only images / DICOM files are allowed');
      return;
    }
    setFileObj(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);
const saveScan = async (outputData) => {
    try {
      const payload = {
        name: scanName,
        model: selectedModel,
         user:   user.id,
        metadata,
        output: outputData
      };
      
     const res = await fetch(saveApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Save failed');
     const data = await res.json();
     return data;        // <-- return the JSON back to caller
    } 
    catch (err) {
      console.error('Save scan failed:', err);
    }
  };
  const selectedDef = MODEL_OPTIONS.find(m => m.value === selectedModel);
  const needsMeta   = selectedDef.metadataFields.length > 0 && userRole !== 'patient';

  const handleNext = async () => {
    if (!fileObj) return alert('Please choose an image first');
    if (needsMeta && (!metadata.condition || !metadata.level)) {
      return alert('Please fill both Condition and Level');
    }

    setLoading(true);
    setResult(null);

    try {
      const form = new FormData();
      form.append('file', fileObj);
      if (metadata.condition) form.append('condition', metadata.condition);
      if (metadata.level)     form.append('level', metadata.level);

      let endpoint;
      switch (selectedModel) {
        case 'spinaCore': endpoint = '/spina_core/predict'; break;
        case 'structura': endpoint = '/structura/predict'; break;
        case 'lumbot':    endpoint = '/lumbot/predict'; break;
        default:          endpoint = '/predict';
      }

      const res  = await fetch(`${apiRoot}${endpoint}`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Prediction failed');
 let outputData;
      if (data.prediction) {
        outputData = { severity: data.prediction, confidence: data.confidence };
      } else if (data.results) {
        outputData = { results: data.results };
      } else {
        outputData = { severity: data.severity, coordinates: data.coordinates, heatmapUrl: data.heatmap_url };
      }
      setResult(outputData);
      const saved = await saveScan(outputData);   
      
navigate(`/scan/${saved._id}`);

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMetadataChange = e =>
    setMetadata(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const selectStyle = { padding: '8px 12px', borderColor: '#68d9c7', fontWeight: 400, minWidth: 140 };

  return (
    
    <div className="container my-4">
      <div className="row gx-4">
        {/* LEFT */}
        <div className="col-md-9">
          
            <label className="form-label fw-semibold">Scan Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter a name for this scan"
              value={scanName}
              onChange={e => setScanName(e.target.value)}
            />
          <div className="d-flex flex-wrap align-items-start gap-3">
            <div style={{ width: 220 }}>
              <label className="mb-1 fw-semibold">Select Model</label>
              <select
                className="form-select"
                style={selectStyle}
                value={selectedModel}
                onChange={e => { setModel(e.target.value); setMetadata({}); setResult(null); }}
              >
             {filteredModels.map(({ value, label }) => (
  <option key={value} value={value}>{label}</option>
))}

              </select>
            </div>
            {needsMeta && selectedDef.metadataFields.map(({ name, label, options }) => (
              <div key={name} style={{ flex: 1, minWidth: 150 }}>
                <label className="mb-1 fw-semibold">{label}</label>
                <select
                  name={name}
                  className="form-select form-select-sm"
                  style={selectStyle}
                  value={metadata[name] || ''}
                  onChange={handleMetadataChange}
                >
                  <option value="">Select {label}</option>
                  {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div
            className="border border-2 rounded-3 d-flex justify-content-center align-items-center mt-4"
            style={{ height: 350, cursor: 'pointer', background: preview ? '#e0f2ff' : 'transparent' }}
            onClick={() => fileInputRef.current.click()}
            onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            onDragOver={e => e.preventDefault()}
          >
            {!preview ? (
              <div className="d-flex flex-column align-items-center">
                <img src={uploadPlaceholder} width={220} alt="placeholder" />
                <p className="fw-semibold mt-2">Drag & drop or click to browse</p>
              </div>
            ) : (
              <img src={preview} alt="preview" className="img-fluid h-100" style={{ objectFit: 'contain' }} />
            )}
            <input type="file" accept=".dcm,image/*" hidden ref={fileInputRef} onChange={e => handleFiles(e.target.files)} />
          </div>

          <div className="mt-4 d-flex gap-3">
            <button className="btn btn-primary" onClick={handleNext} disabled={loading}>
              {loading ? 'Processing…' : 'Next'}
            </button>
            <button className="btn btn-outline-primary" onClick={() => { setPreview(null); setFileObj(null); setResult(null); setMetadata({}); }} disabled={loading}>
              Cancel
            </button>
          </div>

        
        </div>

        {/* RIGHT */}
        <div className="col-md-3 ps-md-4">
          <h6 className="fw-bold mb-3">Model Descriptions</h6>
          {filteredModels.map(({ value, label, description }) => (
  <div key={value} className="mb-3">
    <p className="fw-semibold mb-1">{label}</p>
    <p className="small text-muted">{description}</p>
  </div>
))}

        </div>
      </div>
    </div>
  );
}