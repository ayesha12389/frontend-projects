import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const EditProfile = () => {
  const apiUrl = 'http://localhost:5000';
  const { user } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    fullName: '',
    profileImage: null,
  });
  const [loading, setLoading] = useState(true); // loading for fetch
  const [submitting, setSubmitting] = useState(false); // loading for submit
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        };
        const response = await axios.get(`${apiUrl}/api/user/profile`, config);
        setUserData({
          fullName: response.data.fullName,
          profileImage: response.data.profileImage,
        });
        setError('');
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setMessage('');
    setError('');
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setMessage('');
    setError('');
    const file = e.target.files[0];
    if (file && file.size > 1 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File too large',
        text: 'Please select a file smaller than 1 MB.',
      });
      return;
    }
    setUserData((prev) => ({
      ...prev,
      profileImage: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!userData.fullName.trim()) {
      setError('Full Name is required');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('fullName', userData.fullName);
    if (userData.profileImage) {
      formData.append('profileImage', userData.profileImage);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await axios.put(`${apiUrl}/api/user/profile`, formData, config);
      setMessage(response.data.message);

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: response.data.message,
        confirmButtonText: 'Okay',
      }).then(() => {
  onLogout();  // Auto logout after user clicks "Okay"
});;

    
      setUserData((prev) => ({
        ...prev,
        profileImage: response.data.profileImage,
      }));
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile');

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating profile',
        confirmButtonText: 'Okay',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-8">
          <h2 className="mb-4">Edit Profile</h2>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group mb-3">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className={`form-control ${error && !userData.fullName.trim() ? 'is-invalid' : ''}`}
                value={userData.fullName}
                onChange={handleChange}
                disabled={submitting}
              />
              <div className="invalid-feedback">Full Name is required</div>
            </div>

            <div className="form-group mb-3">
              <p style={{ color: 'red' }}>Image must be less than 1MB</p>
              <label htmlFor="profileImage">Profile Image:</label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                className="form-control-file"
                onChange={handleFileChange}
                disabled={submitting}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
