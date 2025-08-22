import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

export default function DoctorProfilePage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    fullName:       '',
    email:          '',
    profileImage:   '',
    bio:            '',
    specialization: '',
    qualifications: [],
    experienceYears: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id && !user?._id) {
        toast.error('Invalid session');
        setLoading(false);
        return;
      }
      const userId = user.id || user._id;

      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/doctor/profile/${userId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setProfile({
          fullName:        data.fullName || '',
          email:           data.email    || '',
          profileImage:    data.profileImage || '',
          bio:             data.bio     || '',
          specialization:  data.specialization || '',
          qualifications:  Array.isArray(data.qualifications) ? data.qualifications : [],
          experienceYears: data.experienceYears || 0
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to load');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  const handleQualificationChange = (idx, value) => {
    setProfile(p => {
      const q = [...p.qualifications];
      q[idx] = value;
      return { ...p, qualifications: q };
    });
  };

  const addQualification = () => {
    setProfile(p => ({ ...p, qualifications: [...p.qualifications, ''] }));
  };

  const removeQualification = idx => {
    setProfile(p => ({
      ...p,
      qualifications: p.qualifications.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user?.id && !user?._id) {
      toast.error('Invalid session');
      return;
    }
    const userId = user.id || user._id;

    try {
      await axios.post(
        `http://localhost:5000/api/doctor/profile/${userId}`,
        {
          fullName:       profile.fullName,
          bio:            profile.bio,
          specialization: profile.specialization,
          qualifications: profile.qualifications,
          experienceYears: profile.experienceYears
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Profile saved');
    } catch (err) {
      console.error(err);
      toast.error('Save failed');
    }
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h2 className="text-2xl mb-4">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Email */}
        <div>
          <label className="form-label">Full Name</label>
          <input
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div>
          <label className="form-label">Email (readonly)</label>
          <input
            type="email"
            value={profile.email}
            className="form-control"
            disabled
          />
        </div>

        {/* Bio */}
        <div>
          <label className="form-label">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="form-control"
            rows={3}
          />
        </div>

        {/* Specialization */}
        <div>
          <label className="form-label">Specialization</label>
          <input
            name="specialization"
            value={profile.specialization}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Qualifications */}
        <div>
          <label className="form-label">Qualifications</label>
          {profile.qualifications.map((q, i) => (
            <div key={i} className="d-flex gap-2 mb-2">
              <input
                value={q}
                onChange={e => handleQualificationChange(i, e.target.value)}
                className="form-control"
                required
              />
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeQualification(i)}
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addQualification}
          >
            Add Qualification
          </button>
        </div>

        {/* Experience */}
        <div>
          <label className="form-label">Years of Experience</label>
          <input
            type="number"
            name="experienceYears"
            value={profile.experienceYears}
            onChange={handleChange}
            className="form-control"
            min={0}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Save Profile
        </button>
      </form>
    </div>
  );
}
