import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

export default function NavbarWithModal() {
  const [showModal, setShowModal] = useState(false);
  const [loginMode, setLoginMode] = useState('login');
  const [errorMsg, setErrorMsg] = useState(''); // ✅ Correct placement

  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const profileImageRef = useRef();
  const role = 'user';

  const { login: ctxLogin, register: ctxRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    setErrorMsg('');
    setShowModal(false);
  };

  const toggleMode = () => {
    setErrorMsg('');
    setLoginMode(prev => (prev === 'login' ? 'signup' : 'login'));
  };

  const handleLogin = async () => {
    const username = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

 
      await ctxLogin(username, password);
      navigate('/dashboard');
      closeModal();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleSignup = async () => {

    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const profileImage = profileImageRef.current.files[0];


    if (!profileImage) {
      setErrorMsg('Please upload a profile image.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg('Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.');
      return;
    }
 


    try {
      setErrorMsg(''); // Clear error

      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('profileImage', profileImage);
      formData.append('role', role);

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      await ctxLogin(username, password);
      navigate('/dashboard');
      closeModal();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#0056b3' }}>
        <div className="container">
          <a className="navbar-brand" href="/">Lumbar Spine Care</a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/guide">Guide</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About Us</Link>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  style={{ cursor: 'pointer', color: 'white' }}
                  onClick={openModal}
                >
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          role="dialog"
          tabIndex="-1"
          aria-modal="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ boxShadow: '0 6px 15px rgba(0,0,0,0.2)' }}>
              <div className="modal-header" style={{ backgroundColor: '#68d9c7', color: '#fff' }}>
                <h5 className="modal-title">{loginMode === 'login' ? 'Login' : 'Sign Up'}</h5>
                <button type="button" className="btn-close" onClick={closeModal} />
              </div>

              <div className="modal-body d-flex">
                <div className="flex-fill d-none d-md-flex flex-column align-items-center justify-content-center text-white" style={{ background: '#68d9c7', width: '250px', padding: '20px'}}>
                  <h3 className="mb-2">{loginMode === 'login' ? 'Welcome Back!' : 'Create Account'}</h3>
                  <p className="text-center px-3">
                    {loginMode === 'login'
                      ? 'Log in to access your detailed lumbar spine reports and more.'
                      : 'Create your account.'}
                  </p>
                  <button className="btn mt-3" style={{ background: "white" }} onClick={toggleMode}>
                    {loginMode === 'login' ? 'Sign Up' : 'Log In'}
                  </button>
                </div>

                <div className="flex-fill p-4">
                  {loginMode === 'login' ? (
                    <>
                      <h4 className="mb-3">Log In</h4>
                      {errorMsg && (
                        <div className="alert alert-danger py-2" role="alert">
                          {errorMsg}
                        </div>
                      )}
                      <div className="mb-3 input-group">
                        <span className="input-group-text"><i className="bi bi-envelope-fill" /></span>
                        <input ref={emailRef} type="email" className="form-control" placeholder="Email" />
                      </div>
                      <div className="mb-3 input-group">
                        <span className="input-group-text"><i className="bi bi-lock-fill" /></span>
                        <input ref={passwordRef} type="password" className="form-control" placeholder="Password" />
                      </div>
                      <button className="btn w-100" style={{ background: "#68d9c7" }} onClick={handleLogin}>
                        Log In
                      </button>
                    </>
                  ) : (
                    <>
                      <h4 className="mb-3">Sign Up</h4>
                      {errorMsg && (
                        <div className="alert alert-danger py-2" role="alert">
                          {errorMsg}
                        </div>
                      )}
                      <div className="mb-3 input-group">
                        <span className="input-group-text"><i className="bi bi-person-fill" /></span>
                        <input ref={usernameRef} type="text" className="form-control" placeholder="Name" required />
                      </div>
                      <div className="mb-3 input-group">
                        <span className="input-group-text"><i className="bi bi-envelope-fill" /></span>
                        <input ref={emailRef} type="email" className="form-control" placeholder="Email" required />
                      </div>
                      <div className="mb-3 input-group">
                        <span className="input-group-text"><i className="bi bi-lock-fill" /></span>
                        <input ref={passwordRef} type="password" className="form-control" placeholder="Password" required />
                      </div>
                      <div className="mb-3 input-group">
                        <span className="input-group-text"><i className="bi bi-image-fill" /></span>
                        <input ref={profileImageRef} type="file" accept="image/*" className="form-control" required />
                      </div>
                      <button className="btn w-100" style={{ background: "#68d9c7" }} onClick={handleSignup}>
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
