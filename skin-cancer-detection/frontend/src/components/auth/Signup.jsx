import { useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../api";
import "./Auth.css";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSignup = async () => {
    if (!formData.profileImage) {
      alert("Please upload a profile image.");
      return;
    }

    const body = new FormData();
    body.append("username", formData.username);
    body.append("email", formData.email);
    body.append("password", formData.password);
    body.append("profileImage", formData.profileImage);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        body,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Signup successful!");
        window.location.href = "/login";
      } else {
        alert(result.message || "Signup failed");
      }
    } catch (err) {
      alert("Error signing up: " + err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-form">
        <h2>Sign Up</h2>
        <p className="text-center mb-4">Create your account.</p>

        <input
          type="text"
          name="username"
          className="form-control mb-2"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          className="form-control mb-2"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          className="form-control mb-2"
          placeholder="Password"
          onChange={handleChange}
        />
        <input
          type="file"
          name="profileImage"
          className="form-control mb-3"
          accept="image/*"
          onChange={handleChange}
        />

        <button className="btn btn-primary w-100" onClick={handleSignup}>
          Sign Up
        </button>

        <div className="toggle-link">
          <p>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
      <div className="illustration"></div>
    </div>
  );
}

export default Signup;
