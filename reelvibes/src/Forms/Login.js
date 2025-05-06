import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../App.css";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login successful:", data);
        login(data); // store user globally
        navigate("/"); // Redirect to home
      } else {
        setError(data.message || "Username or password is incorrect.");
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
        <form className="login-form" onSubmit={handleLogin}>
          <h2 className="login-title">Login</h2>

          {error && <p className="login-error">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>

          <Link to="/signup" className="signup-link">
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
