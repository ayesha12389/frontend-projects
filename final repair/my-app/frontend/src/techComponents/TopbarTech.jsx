import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Topbar({ onSearch }) {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);

  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || "https://via.placeholder.com/50"
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      axios
        .get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
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
        .catch((error) => {
          console.error("Error fetching user profile:", error.response?.data || error.message);
        });
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "userName") setUserName(event.newValue);
      if (event.key === "profileImage") setProfileImage(event.newValue);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (onSearch) onSearch(value);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="topbar bg-white shadow-sm d-flex justify-content-between align-items-center p-3">
      <input
        type="text"
        placeholder="Search"
        className="form-control w-50"
        value={searchText}
        onChange={handleChange}
        disabled={!onSearch}
      />

      <div className="dropdown position-relative" ref={dropdownRef}>
        <button
          className="btn btn-light d-flex align-items-center"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img
            src={profileImage}
            alt="Profile"
            className="rounded-circle border me-2"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          <b style={{ color: "#0a3d62" }}>Hello, {userName} 👋</b>
        </button>

        {isDropdownOpen && (
          <ul className="dropdown-menu show position-absolute end-0 mt-2">
            <li>
              <button className="dropdown-item" style={{ color: "#0a3d62" }} onClick={() => navigate("/Profile")}>
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
