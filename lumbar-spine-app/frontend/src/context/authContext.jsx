// authContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

const apiUrl = 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      const notExpired = decoded.exp * 1000 > Date.now();
    
      return notExpired ? decoded : null;
    } catch (e) {
      console.error('Token decode error:', e);
      return null;
    }
  };

  const saveAuth = (token, userInfo) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const getRedirectPath = (role) => {
    switch (role) {
      case 'admin':
      case 'doctor':
      case 'patient':
        return '/dashboard';
      default:
        return '/';
    }
  };

  const login = async (username, password) => {
    const { data } = await axios.post(`${apiUrl}/api/auth/login`, { username, password });

    const decoded = decodeToken(data.token);
    if (!decoded) throw new Error('Invalid or expired token received');

    const userInfo = {
      id: data.user.id || decoded.id,
      username: data.user.username || decoded.username,
      role: data.user.role || decoded.role,
      profileImage: data.user.profileImage || decoded.profileImage,
    };

    saveAuth(data.token, userInfo);
    navigate(getRedirectPath(userInfo.role));
  };

  const register = async (username, email, password, role) => {
    const { data } = await axios.post(`${apiUrl}/api/auth/register`, { username, email, password, role });

    const decoded = decodeToken(data.token);
    if (!decoded) throw new Error('Invalid or expired token received');

    const userInfo = {
      id: data.user.id || decoded.id,
      username: data.user.username || decoded.username,
      role: data.user.role || decoded.role,
      profileImage: data.user.profileImage || decoded.profileImage,
    };

    saveAuth(data.token, userInfo);
    navigate(getRedirectPath(userInfo.role));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/home');
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      logout();
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      logout();
      return;
    }

    try {
      const savedUser = JSON.parse(userData);
   
      setUser(savedUser);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
