import { useState } from "react";
import axios from "../instant/axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/forgetPassword", {
        email,
        newPassword,
      });
      alert("Password reset successfully");
      navigate("/login-admin");
    } catch (error) {
      alert(error.response?.data?.error || "Error resetting password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleForgot}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button className="btn btn-success w-100">Reset Password</button>
        </form>
      </div>
    </div>
  );
}
