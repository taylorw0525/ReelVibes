import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  function capitalizeWords(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const displayName = user && user.user && user.user.username 
    ? capitalizeWords(user.user.username) 
    : "Guest";

  const playlistLink = user ? "/my-playlist" : "/login";

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-result?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // clear search input
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {user ? (
          <span>Welcome, {displayName}</span>
        ) : (
          <span>Welcome</span>
        )}
      </div>

      <div className="nav-center">
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-input"
            style={{ width: "100%", minWidth: "200px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="nav-right">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/moodpage" className="nav-item">Mood Selection</Link>
        <Link to={playlistLink} className="nav-item">Saved Playlist</Link>
        <Link to="/profile" className="nav-item">Profile</Link>
        {user && (
          <button onClick={logout} className="logout-button">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
