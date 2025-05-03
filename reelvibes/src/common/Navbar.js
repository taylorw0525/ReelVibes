import React, { useContext }  from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./../App.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  console.log("User in Navbar:", user); // Debugging line
  return (
    <nav className="navbar">
      {user ? (
        <>
          <span><div className="nav-left">Welcome, {user.user.username} </div></span>
          <button onClick={logout} className="logout-button" >Logout</button>
        </>
      ) : (
        <span>Welcome User <Link to="/login" className="nav-item">Please Login</Link></span>
        
      )}
      
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
          <Link to="/my-playlist" className="nav-item">
          Saved Playlist
          </Link>
        <span className="nav-item">Profile</span>
      </div>
    </nav>
  );
};

export default Navbar;