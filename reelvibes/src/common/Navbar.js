import React from "react";
import { Link } from "react-router-dom";
import "./../App.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">Welcome</div>
      <div className="nav-center">
        <input type="text" placeholder="Search..." className="search-input" />
      </div>
      <div className="nav-right">
      <Link to="/" className="nav-item">
            Home
          </Link>
      <Link to="/moodpage" className="nav-item">
            Mood Selection
          </Link>
        <span className="nav-item">Saved Playlist</span>
        <span className="nav-item">Profile</span>
      </div>
    </nav>
  );
};

export default Navbar;