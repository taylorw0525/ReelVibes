import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
import "./Signup.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // 
  const validatePassword = (password) => {

    const hasNumber = /\d/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;
    return (
      password.length >= 8 &&
      hasNumber.test(password) &&
      hasSymbol.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { first, last, email, password, confirmPassword } = formData;
  
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters and include a number and a symbol.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      // Step 1: Signup/Register
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: `${first} ${last}`,
          email,
          password,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log("Account created:", data);
  
        // Step 2: Auto-login after signup
        const loginRes = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        const loginData = await loginRes.json();
  
        if (loginRes.ok) {
          // Save user to localStorage
          localStorage.setItem("user", JSON.stringify(loginData));
        
          // Update Auth Context so Navbar updates immediately
          login(loginData);
        
          // Redirect to home
          navigate("/");
        } else {
          setError(loginData.message || "Auto-login failed");
        }
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="App">
      <div className="background-container">
        <div className="background-overlay"></div>
        <div className="background-image"></div>
      </div>

      <div className="content-layer">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2 className="signup-title">Create Account</h2>

          <input
            type="text"
            name="first"
            placeholder="First Name"
            className="signup-input"
            value={formData.first}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="last"
            placeholder="Last Name"
            className="signup-input"
            value={formData.last}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="signup-input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="signup-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="signup-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && <p className="signup-error">{error}</p>}

          <button type="submit" className="signup-button">
            Create Account
          </button>

          {/* Link to Login Page */}
          <Link to="/login" className="signup-link">
            Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
