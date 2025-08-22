import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Auth.css";
import logo from "../assets/logo1.png";

function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "customer" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      // If user is already logged in, redirect based on their role
      const role = localStorage.getItem("role");
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "customer") {
        navigate("/HeroAfterLogin");
      } else if (role === "technician") {
        navigate("/technician");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const toggleForm = () => {
    setIsRegister((prev) => !prev);
    setIsForgotPassword(false);
    setFormData({ name: "", email: "", password: "", role: "customer" });
    setErrors({});
    setMessage("");
  };

  const validateForm = () => {
    let newErrors = {};

    // Name validation (for registration)
    if (isRegister) {
      if (!formData.name.trim() || formData.name.length < 5) {
        newErrors.name = "Name must be at least 5 characters long.";
      } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
        newErrors.name = "Name must contain only alphabets.";
      }
    }

    // Email validation
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Password validation (excluding forgot password scenario)
    if (!isForgotPassword) {
      const password = formData.password.trim();

      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
      }
      if (!/[A-Z]/.test(password)) {
        newErrors.password = "Password must include at least one uppercase letter.";
      }
      if (!/[a-z]/.test(password)) {
        newErrors.password = "Password must include at least one lowercase letter.";
      }
      if (!/[0-9]/.test(password)) {
        newErrors.password = "Password must include at least one number.";
      }
      if (!/[@$!%*?&#]/.test(password)) {
        newErrors.password = "Password must include at least one special character (@, $, !, %, *, ?, &, #).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      const url = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const { data } = await axios.post(url, formData);
      
      // Check if the user is blocked
      if (data.blocked) {
        setMessage("Your account has been blocked. Please contact support.");
        setLoading(false);
        return; // Prevent further actions if the account is blocked
      }

      // Save user data to local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);

      setMessage("Login Successful! Redirecting...");

      setTimeout(() => {
        // Redirect based on user role after login
        if (data.role === "admin") navigate("/admin");
        else if (data.role === "customer") navigate("/HeroAfterLogin");
        else if (data.role === "technician") navigate("/technician");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
};


  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setErrors({ email: "Email is required" });
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email: formData.email });
      setMessage("Reset link sent to your email.");

      // After successful reset, redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Delay before redirecting to login
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fullscreen-form d-flex align-items-center justify-content-center">
      <div className="form-container shadow-lg">
        <div className="info-panel text-white d-flex flex-column justify-content-center align-items-center">
          <img src={logo} alt="Logo" className="logo" />
          <h1>Welcome</h1>
          <h2 className="text-center">To the Smart Electric Workshop</h2>
          <p className="text-center px-3 mt-3">Join us for seamless experiences and powerful tools.</p>
        </div>
        <div className="center-line"></div>
        <div className="form-panel bg-white p-5">
          <h3 className="text-center mb-4">
            {isForgotPassword
              ? "Reset Password"
              : isRegister
              ? "Create Your Account"
              : "Login"}
          </h3>
          {message && <div className="alert alert-info">{message}</div>}
          <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit}>
            {isRegister && !isForgotPassword && (
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}
              </div>
            )}
            <div className="mb-2">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>
            {!isForgotPassword && (
              <div className="mb-2">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <div className="text-danger">{errors.password}</div>}
              </div>
            )}
            {isRegister && !isForgotPassword && (
              <div className="mb-2">
                <label className="form-label">Select Role</label>
                <select
                  className="form-control"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                  <option value="technician">Technician</option>
                </select>
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : isForgotPassword
                ? "Send Reset Link"
                : isRegister
                ? "Register Now"
                : "Login"}
            </button>
          </form>
          {!isForgotPassword && (
            <p className="text-center">
              {isRegister
                ? "Already have an account? "
                : "Don't have an account? "}
              <span
                className="text-primary text-decoration-underline"
                style={{ cursor: "pointer" }}
                onClick={toggleForm}
              >
                {isRegister ? "Login" : "Register Now"}
              </span>
            </p>
          )}
          {!isForgotPassword && !isRegister && (
            <p className="text-center">
              <span
                className="text-primary text-decoration-underline"
                style={{ cursor: "pointer" }}
                onClick={() => setIsForgotPassword(true)}
              >
                Forgot Password?
              </span>
            </p>
          )}
          {isForgotPassword && (
            <p
              className="text-primary text-decoration-underline"
              style={{ cursor: "pointer" }}
              onClick={() => setIsForgotPassword(false)}
            >
              Back to Login
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
