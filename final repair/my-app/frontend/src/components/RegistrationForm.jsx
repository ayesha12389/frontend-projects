import React, { useState } from "react";
import "./RegistrationForm.css";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
    contact: "",
    address: "",
    specialization: "",
    profilePicture: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Name Validation
    if (!formData.name || formData.name.length < 3 || !/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name must be at least 3 characters and alphabets only.";
    }

    // Email Validation
    if (
      !formData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password Validation
    if (
      !formData.password ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
    }

    // Confirm Password Validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Contact Number Validation (if provided)
    if (
      formData.contact &&
      !/^\+923\d{9}$/.test(formData.contact)
    ) {
      newErrors.contact =
        "Contact number must be in format: +923xxxxxxxxx.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Registration successful!");
      console.log(formData);
    }
  };

  return (
    <section className="registration-section container py-5">
      <h2 className="text-center mb-4">Register for Smart Electric Workshop</h2>
      <form className="bg-white p-4 shadow rounded" onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Name */}
          <div className="col-md-12">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={formData.name}
              onChange={handleChange}
            />
            <div className="invalid-feedback">{errors.name}</div>
          </div>

          {/* Email */}
          <div className="col-md-12">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
            />
            <div className="invalid-feedback">{errors.email}</div>
          </div>

          {/* Password */}
          <div className="col-md-6">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={formData.password}
              onChange={handleChange}
            />
            <div className="invalid-feedback">{errors.password}</div>
          </div>

          {/* Confirm Password */}
          <div className="col-md-6">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          </div>

          {/* Role */}
          <div className="col-md-12">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Customer">Customer</option>
              <option value="Technician">Technician</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Contact Number */}
          <div className="col-md-12">
            <label htmlFor="contact" className="form-label">Contact Number (Optional)</label>
            <input
              type="text"
              id="contact"
              name="contact"
              className={`form-control ${errors.contact ? "is-invalid" : ""}`}
              value={formData.contact}
              onChange={handleChange}
            />
            <div className="invalid-feedback">{errors.contact}</div>
          </div>

          {/* Address */}
          <div className="col-md-12">
            <label htmlFor="address" className="form-label">Address (Optional)</label>
            <textarea
              id="address"
              name="address"
              className="form-control"
              rows="3"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Specialization */}
          {formData.role === "Technician" && (
            <div className="col-md-12">
              <label htmlFor="specialization" className="form-label">
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                className="form-control"
                value={formData.specialization}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Profile Picture */}
          <div className="col-md-12">
            <label htmlFor="profilePicture" className="form-label">Profile Picture (Optional)</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              className="form-control"
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4 py-2">Register</button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default RegistrationForm;
