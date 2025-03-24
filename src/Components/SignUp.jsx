import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaSpinner,
  FaUserPlus,
  FaSignInAlt
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import "./AuthForms.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

    if (!Object.values(formData).every(Boolean)) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://alvins.pythonanywhere.com/api/signup", 
        formData
      );

      setSuccess(response.data.message || "Registration successful!");
      setFormData({
        username: "",
        email: "",
        phone: "",
        password: ""
      });
      setTimeout(() => navigate("/signin"), 1500);
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">
          <FaUserPlus className="auth-icon" /> Create Account
        </h2>
        <p className="auth-subtitle">Join us to get started</p>
      </div>
      
      {loading && (
        <div className="auth-loading">
          <FaSpinner className="spinner" /> Creating your account...
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
            <FaUser />
          </span>
          <input
            type="text"
            name="username"
            className="auth-input with-icon"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
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
            <FaPhone />
          </span>
          <input
            type="tel"
            name="phone"
            className="auth-input with-icon"
            placeholder="Phone Number"
            value={formData.phone}
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
            placeholder="Create Password"
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
        
        <button 
          type="submit" 
          className="auth-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="btn-spinner" /> Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span>or sign up with</span>
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
        Already have an account?{" "}
        <Link to="/signin" className="auth-link">
          <FaSignInAlt /> Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUp;