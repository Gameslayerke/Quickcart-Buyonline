import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaUserPlus,
  FaSpinner,
  FaSignInAlt
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import "./AuthForms.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://alvins.pythonanywhere.com/api/login", 
        formData
      );
      
      setSuccess(response.data.message || "Login successful!");
      
      const { user_id, username, role, token } = response.data.user;
      login(user_id, username, role, token);
      localStorage.setItem("user", JSON.stringify({ user_id, username, role, token }));

      setTimeout(() => navigate("/offers"), 1000);
    } catch (error) {
      setError(error.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">
          <FaSignInAlt className="auth-icon" /> Welcome Back
        </h2>
        <p className="auth-subtitle">Sign in to access your account</p>
      </div>
      
      {loading && (
        <div className="auth-loading">
          <FaSpinner className="spinner" /> Authenticating...
        </div>
      )}
      {success && (
        <div className="auth-alert auth-success">
          {success}
        </div>
      )}
      {error && (
        <div className="auth-alert auth-error">
          {error}
        </div>
      )}

      <form onSubmit={submitForm}>
        <div className="input-group">
          <span className="input-icon">
            <FaEnvelope />
          </span>
          <input
            type="email"
            name="email"
            className="auth-input with-icon"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="input-group">
          <span className="input-icon">
            <FaLock />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="auth-input with-icon"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button 
            type="button" 
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        
        <div className="auth-options">
          <Link to="/forgot-password" className="auth-link">
            Forgot Password?
          </Link>
        </div>
        
        <button 
          type="submit" 
          className="auth-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="btn-spinner" /> Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <div className="social-auth">
        <button type="button" className="social-btn google">
          <FcGoogle /> Google
        </button>
        <button type="button" className="social-btn facebook">
          <BsFacebook /> Facebook
        </button>
      </div>

      <p className="auth-footer">
        Don't have an account?{" "}
        <Link to="/signup" className="auth-link">
          <FaUserPlus /> Create Account
        </Link>
      </p>
    </div>
  );
};

export default Login;