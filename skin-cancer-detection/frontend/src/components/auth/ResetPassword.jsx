import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API_BASE_URL from "../../api";
import "./Auth.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [token] = useSearchParams();
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!newPassword || !token.get("token")) {
      alert("Invalid or missing data.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/reset-password/${token.get("token")}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Password reset successful! Please log in.");
        navigate("/login");
      } else {
        alert(result.message || "Reset failed.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-form w-100">
        <h2>Reset Password</h2>
        <p className="text-center mb-4">
          Enter a new password for your account.
        </p>
        <input
          type="password"
          className="form-control mb-3"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100" onClick={handleReset}>
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
