import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../api";
import ForgotPasswordModal from "./ForgotPasswordModal";
import "./Auth.css"; // styling

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Error logging in: " + err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-form">
        <h2>Welcome</h2>
        <p className="text-center mb-4">Enter your credentials to continue.</p>

        <input
          type="email"
          className="form-control mb-2"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="form-check mb-3 d-flex justify-content-between">
          <label className="form-check-label">
            <input type="checkbox" className="form-check-input" /> Remember
          </label>
          <ForgotPasswordModal />
        </div>

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          SUBMIT
        </button>

        <div className="toggle-link">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>

      <div className="illustration"></div>
    </div>
  );
}

export default Login;
