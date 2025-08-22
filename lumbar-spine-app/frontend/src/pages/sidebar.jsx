import React, { useState } from "react";
import { Link } from "react-router-dom";

const MENU_ITEMS = {
  admin: [
    { label: "Dashboard", icon: "bi-speedometer2", path: "/dashboard" },
    { label: "Upload Image", icon: "bi-cloud-upload", path: "upload" },
    { label: "My Reports", icon: "bi-file-earmark-text", path: "/reports" },
    { label: "Appointments", icon: "bi-calendar-check", path: "/appointment" },
    { label: "Doctor Queue", icon: "bi-person-lines-fill", path: "/admin/doctor-queue" },
    { label: "Doctors", icon: "bi-people", path: "/doctorslist" },
    {
      label: "Settings",
      icon: "bi-gear",
      children: [
       
        { label: "Change Password", path: "/settings/change-password" },
        { label: "Profile", path: "/settings/profile" },
        { label: "Edit Profile", path: "/settings/edit-profile" },
        { label: "Manage Roles", path: "/settings/manage-roles" },
      ],
    },
  ],
  doctor: [
    { label: "Dashboard", icon: "bi-speedometer2", path: "/dashboard" },
    { label: "Upload Image", icon: "bi-cloud-upload", path: "/upload" },
    { label: "My Reports", icon: "bi-file-earmark-text", path: "/reports" },
    { label: "Appointments", icon: "bi-calendar-check", path: "/appointment" },
    {
      label: "Settings",
      icon: "bi-gear",
      children: [
        { label: "Register", path: "/register" },
        { label: "Change Password", path: "/settings/change-password" },
        { label: "Profile", path: "/settings/profile" },
        { label: "Edit Profile", path: "/settings/edit-profile" },
        { label: "Manage Roles", path: "/settings/manage-roles" },
      ],
    },
    { label: "Profile Settings", icon: "bi-person-circle", path: "/doctor" },
  ],
  user: [
    { label: "Dashboard", icon: "bi-speedometer2", path: "/dashboard" },
    { label: "Upload Image", icon: "bi-cloud-upload", path: "upload" },
    { label: "My Reports", icon: "bi-file-earmark-text", path: "/reports" },
    { label: "Appointments", icon: "bi-calendar-check", path: "/appointment" },
    { label: "Doctors", icon: "bi-people", path: "/doctorslist" },
    {
      label: "Settings",
      icon: "bi-gear",
      children: [
        { label: "Register", path: "/register" },
        { label: "Change Password", path: "/settings/change-password" },
        { label: "Profile", path: "/settings/profile" },
        { label: "Edit Profile", path: "/settings/edit-profile" },
        { label: "Manage Roles", path: "/settings/manage-roles" },
      ],
    },
  ],
};

export default function Sidebar({ userRole, userName, userAvatar, collapsed, setCollapsed, onLogout }) {
  const menu = MENU_ITEMS[userRole] || [];
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <aside className={collapsed ? "sidebar-collapsed" : "sidebar-expanded"}>
      <div>
        <div className="d-flex align-items-center justify-content-between px-3 py-3">
          <div className={`fs-5 fw-bold text-white ${collapsed ? "d-none" : ""}`} style={{ userSelect: "none" }}>
            Lumbar Spine
          </div>
          <button
            className="btn btn-sm btn-light"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i className={`bi ${collapsed ? "bi-arrow-bar-right" : "bi-arrow-bar-left"}`}></i>
          </button>
        </div>

        {/* Scrollable nav menu */}
        <nav className="sidebar-nav">
          {menu.map(({ label, icon, path, children }) => (
            children ? (
              <div key={label} className="sidebar-nav-link" style={{ flexDirection: "column" }}>
                <div
                  onClick={() => toggleDropdown(label)}
                  className="d-flex align-items-center justify-content-between w-100"
                  style={{ cursor: "pointer" }}
                  tabIndex={0}
                  role="button"
                  aria-expanded={openDropdown === label}
                  aria-controls={`${label}-submenu`}
                >
                  <span className="icon-circle">
                    <i className={`bi ${icon}`} />
                  </span>
                  <span className="sidebar-label flex-grow-1">{label}</span>
                  <i className={`bi ${openDropdown === label ? "bi-chevron-up" : "bi-chevron-down"} ms-auto`} />
                </div>

                {openDropdown === label && (
                  <div id={`${label}-submenu`} className="mt-1">
                    {children.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.path}
                        className="sidebar-nav-link"
                        style={{ fontSize: "14px", paddingLeft: "2.5rem" }}
                      >
                        ▸ {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={path}
                key={`${icon}-${label}`}
                className="sidebar-nav-link"
                title={collapsed ? label : ""}
                tabIndex={0}
                aria-label={label}
              >
                <span className="icon-circle">
                  <i className={`bi ${icon}`} />
                </span>
                <span className="sidebar-label">{label}</span>
              </Link>
            )
          ))}
        </nav>
      </div>

      <div className="sidebar-profile">
        <img
          src={userAvatar ? `http://localhost:5000/uploads/${userAvatar}` : "https://i.pravatar.cc/40"}
          alt="User Avatar"
          title={userName}
          className="mb-2"
        />
        {!collapsed && (
          <>
            <div className="sidebar-profile-name" title={userName}>
              {userName}
            </div>
            <button className="btn btn-sm btn-outline-light" onClick={onLogout} aria-label="Logout" title="Logout">
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
