import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Topbar({ setSearchQuery }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [searchQuery, setSearchQueryInternal] = useState("");
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "https://via.placeholder.com/50");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          const { name, imageUrl } = response.data;
          if (name) {
            setUserName(name);
            localStorage.setItem("userName", name);
          }
          if (imageUrl) {
            setProfileImage(imageUrl);
            localStorage.setItem("profileImage", imageUrl);
          }
        })
        .catch(error => console.error("Error fetching user profile:", error.response ? error.response.data : error.message));
    }
  }, []);

  // Role detection based on URL
  useEffect(() => {
    const roleFromPath = location.pathname.includes("customer") ? "customer" : 
                         location.pathname.includes("technician") ? "technician" : "";
    setUserRole(roleFromPath);
  }, [location]);

  // Handle search query change and pass it to the parent component (Admin)
  const handleSearch = (query) => {
    setSearchQueryInternal(query); // Update internal state
    setSearchQuery(query); // Pass the search query to the parent component
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="topbar bg-white shadow-sm d-flex justify-content-between align-items-center p-3">
      <div className="position-relative w-50">
        <input
          type="text"
          placeholder="Search"
          className="form-control"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Profile Section */}
      <div className="dropdown position-relative" ref={dropdownRef}>
        <button className="btn btn-light d-flex align-items-center" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <img src={profileImage} alt="Profile" className="rounded-circle border me-2" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
          <b style={{color: "#0a3d62"}}>Hello, {userName} 👋</b>
        </button>

        {isDropdownOpen && (
          <ul className="dropdown-menu show position-absolute end-0 mt-2">
            <li>
              <button className="dropdown-item" onClick={() => navigate("/Profile")}>
                Profile
              </button>
            </li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Topbar;
