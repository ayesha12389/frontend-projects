import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { token } = useParams(); // Get token from URL params
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage('Invalid or expired token');
    }
  }, [token]);

  // Password validation function
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(password)) errors.push("Must include at least one uppercase letter.");
    if (!/[a-z]/.test(password)) errors.push("Must include at least one lowercase letter.");
    if (!/[0-9]/.test(password)) errors.push("Must include at least one number.");
    if (!/[@$!%*?&#]/.test(password)) errors.push("Must include at least one special character (@, $, !, %, *, ?, &, #).");

    return errors.length ? errors.join(" ") : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password match
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setMessage(passwordError);
      return;
    }

    setLoading(true);
    setMessage(''); // Clear previous messages

    try {
      // Make the request to reset password
      const response = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password: newPassword }
      );

      // Handle success response
      setMessage(response.data.message || 'Password reset successfully!');

      // Redirect after a delay
      setTimeout(() => {
        navigate('/login');  // Redirect to login page
      }, 2000);

    } catch (error) {
      // Error handling
      setMessage(error.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="newPassword" className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
          {loading ? 'Processing...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
