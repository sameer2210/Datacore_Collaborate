import { useState } from "react";
import axios from "../instant/axios"; // make sure this exists
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", { name, email, password });
      if (res.status === 201 || res.status === 200) {
        alert("Admin registered successfully!");
        navigate("/login-admin");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || " Registration failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Admin Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Register
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary w-100 mb-2"
            onClick={() => navigate("/change-password-admin")}
          >
            Change Password
          </button>

          <button
            type="button"
            className="btn btn-outline-danger w-100"
            onClick={() => navigate("/forgot-password-admin")}
          >
            Forgot Password
          </button>
        </form>
      </div>
    </div>
  );
}
