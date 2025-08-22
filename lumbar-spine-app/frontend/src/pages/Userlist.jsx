import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import { confirmAlert } from "react-confirm-alert";
const apiUrl = 'http://localhost:5000'; // Ensure this is correctly set in your .env file
// Ensure this is correctly set in your .env file
const token = localStorage.getItem('token'); // Retrieve the token from localStorage

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        console.log(token)
        try {
            const response = await axios.get(`${apiUrl}/api/user/`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Correctly set Authorization header
                }
            });
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleEditClick = (user) => {
        setSelectedUserId(user._id);
        setNewRole(user.role);
    };

    const handleRoleChange = (e) => {
        setNewRole(e.target.value);
    };

    const handleRoleUpdate = async (userId) => {
        try {
            await axios.put(`${apiUrl}/api/user/${userId}/role`, { role: newRole }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Correctly set Authorization header
                },
            });
            // Refresh the user list after updating
            fetchUsers();
            setSelectedUserId(null); // Close the edit mode for the user
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const handleDelete = (id) => {
        confirmAlert({
            title: "Confirm Delete",
            message: "Are you sure you want to delete this User?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => { // Removed 'id' from here
                        try {
                            const response = await axios.delete(`${apiUrl}/api/user/${id}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`, // Correctly set Authorization header
                                },
                            });
                            if (response.status === 200) {
                                setUsers(users.filter((blog) => blog._id !== id));
                              
                            } else {
                                alert("Failed to delete User");
                            }
                        } catch (err) {
                            alert("Failed to delete User");
                           
                        }
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };
    
    return (
        <div className="container  p-5">
            <h2 className="mb-4">User List</h2>
            <ul className="list-group">
                {users.map(user => (
                    <li 
                        key={user._id} 
                        className="d-flex align-items-center" 
                        style={{ border: 'none', backgroundColor: 'transparent' }} // Remove background and border
                    >
                        <img 
                            src={`${apiUrl}/uploads/${user.profileImage}`} 
                            alt={user.fullName} 
                            className="rounded-circle me-3"
                            style={{ width: '70px', height: '70px', objectFit: 'cover' }} // Increased size
                        />
                        <div className="flex-grow-1">
                            <p className="mb-1"><strong>Name:</strong> {user.fullName}</p>
                            <p className="mb-1"><strong>Email:</strong> {user.email}</p>
                            {selectedUserId === user._id ? (
                                // Inline editing
                                <div className="d-flex align-items-center">
                                    <select 
                                        className="form-select me-2" 
                                        value={newRole} 
                                        onChange={handleRoleChange}
                                    >
                                        <option value="user">User</option>
                                        <option value="editor">Editor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <button 
                                        onClick={() => handleRoleUpdate(user._id)} 
                                        className="btn btn-success btn-sm me-2"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        onClick={() => setSelectedUserId(null)} 
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                // Display role
                                <p className="mb-1"><strong>Role:</strong> {user.role}</p>
                            )}
                        </div>
                        {selectedUserId !== user._id && (
                            <>
                                <button 
                                    onClick={() => handleEditClick(user)} 
                                    className="btn btn-primary btn-sm me-2"
                                >
                                    <i className="bi bi-pencil-square"></i> Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(user._id)} 
                                    className="btn btn-danger btn-sm"
                                >
                                    <i className="bi bi-trash"></i> Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
