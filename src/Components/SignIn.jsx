import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submitForm = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const loginData = { email, password };

      const response = await axios.post("https://alvins.pythonanywhere.com/api/login", loginData);
      console.log("Login API Response:", response.data);

      setLoading(false);
      setSuccess(response.data.message || "Login successful!");

      const { user_id, username, role, token } = response.data.user;
      login(user_id, username, role, token);
      localStorage.setItem("user", JSON.stringify({ user_id, username, role, token }));

      navigate("/offers");

    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-6 card shadow p-4">
        <h2>Login</h2>
        <div className="text-warning">{loading && <span>Loading...</span>}</div>
        <div className="text-success">{success}</div>
        <div className="text-danger">{error}</div>
        <form onSubmit={submitForm}>
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
