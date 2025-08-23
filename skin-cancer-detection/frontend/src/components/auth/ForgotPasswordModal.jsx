import { useState } from "react";
import API_BASE_URL from "../../api";
import { Modal, Button } from "react-bootstrap";

function ForgotPasswordModal() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgot = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Reset link sent to your email.");
        setShow(false);
      } else {
        alert(result.message || "Failed to send reset link.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <>
      <span
        className="forgot-pass"
        style={{ cursor: "pointer", color: "#1e3c72" }}
        onClick={() => setShow(true)}
      >
        Forgot Password?
      </span>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="email"
            className="form-control mb-2"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="primary" className="w-100" onClick={handleForgot}>
            Send Reset Link
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ForgotPasswordModal;
