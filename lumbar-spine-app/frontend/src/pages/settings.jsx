import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="list-group">
            {user?.role === 'admin' ? ( // Check if user is an editor
              <>
                <NavLink to="/settings/edit-profile" className="list-group-item">
                  Edit Profile
                </NavLink>
              
                <NavLink to="/settings/change-password" className="list-group-item">
                  Change Password
                </NavLink>
                <NavLink to="/settings/profile" className="list-group-item">
                  Profile
                </NavLink>
              </>
            ) : (
              // Only show Profile link for non-editors
              <NavLink to="/settings/manage-roles" className="list-group-item">
              Manage Roles
            </NavLink>
            )}
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Settings;
