// /src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead

const apiUrl = 'http://localhost:5000'; // Adjust the API URL as needed
const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                };
                const response = await axios.get(`${apiUrl}/api/user/profile`, config);
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Token expired, redirect to login
                    localStorage.removeItem('token'); // Remove expired token
                    navigate('/login'); // Redirect to login page using useNavigate
                } else {
                    setError('Error fetching profile');
                }
                setLoading(false);
                console.error('Error fetching profile:', error);
            }
        };

        fetchUserProfile();
    }, [navigate]); // Add navigate to dependencies

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">User Profile</h2>
            {userData && (
                <div className="card mx-auto" style={{ maxWidth: '500px' }}>
                    <div className="card-body text-center">
                        {userData.profileImage && (
                            <div className="d-flex justify-content-center mb-3">
                                <img
                                    src={`${apiUrl}/uploads/${userData.profileImage}`} // Directly use the URL from backend
                                    alt="Profile"
                                    className="rounded-circle"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                        <h5 className="card-title">{userData.fullName}</h5>
                        <p className="card-text"><strong>Email:</strong> {userData.email}</p>
                        
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
