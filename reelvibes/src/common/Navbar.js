import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../App.css"; // Ensure this includes your navbar styles

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-left">
        {user ? (
          <span>Welcome, {user.user.username}</span>
        ) : (
          <span>Welcome</span>
        )}
      </div>

      <div className="nav-center">
        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      <div className="nav-right">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/moodpage" className="nav-item">Mood Selection</Link>
        <Link to="/my-playlist" className="nav-item">Saved Playlist</Link>
        <Link to="/profile" className="nav-item">Profile</Link>
        {user && (
          <button onClick={logout} className="logout-button">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
