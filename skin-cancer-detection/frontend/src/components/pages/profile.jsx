import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      window.location.href = "/login"; // redirect agar user na ho
    } else {
      setUser(storedUser);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Format current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: "linear-gradient(to right, #1e3c72, #2a5298)",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="card text-center"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(15px)",
          borderRadius: "20px",
          padding: "30px",
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* 🖼️ Profile Pic */}
        <img
          src="/dp.jpg"
          alt="Profile"
          className="profile-img mx-auto"
          style={{
            width: "140px",
            height: "140px",
            objectFit: "cover",
            borderRadius: "50%",
            border: "4px solid white",
            marginBottom: "20px",
          }}
        />

        {/* 👤 User Info */}
        <h3>{user?.username || "Username"}</h3>
        <p>{"Joined on " + formattedDate}</p>

        <button
          className="btn btn-danger btn-logout"
          style={{ marginTop: "20px", backgroundColor: "#ff4d4d", border: "none" }}
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
