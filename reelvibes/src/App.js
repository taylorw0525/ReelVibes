import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import logoReel from './resources/images/logo-reel.png'; // adjust the file extension if it's .jpg or .svg
import { AuthContext } from "./context/AuthContext";


function App() {
  const { user } = useContext(AuthContext);
  return (
    <div className="App">
      
      {/* Fixed background image and overlay */}
      <div className="background-container">
        <div className="background-overlay"></div>
        <div className="background-image"></div>
      </div>

      {/* Foreground content */}
      <div className="content-layer">
      <p className="headline">Feel it. Watch it. Reel it in.</p>
        
          <div className="title-container">
          
            <div className="title-content">
              <h1 className="app-title">Reel Vibes</h1>
              <img src={logoReel} alt="Reel Vibes Logo" className="logo-image" />
            </div>
            <p className="tagline">Discover the perfect movie to match your mood.</p>
          </div>



        <div className="start-button-container">
        {user ? (<Link to="/moodpage">
            <button className="start-button">Select Mood</button>
          </Link>):(
          <Link to="/login">
            <button className="start-button">Start Now</button>
          </Link>)}
        </div>

        <div className="feature-boxes bottom-row">
          <div className="feature-box">
            <span className="feature-icon">✔</span>
            <div>
              <h4 className="feature-title">Free Sign Up</h4>
              <p className="feature-text">Join with your email account.</p>
            </div>
          </div>

          <div className="feature-box">
            <span className="feature-icon">✔</span>
            <div>
              <h4 className="feature-title">Easy to Use</h4>
              <p className="feature-text">Simple UI made for everyone.</p>
            </div>
          </div>

          <div className="feature-box">
            <span className="feature-icon">✔</span>
            <div>
              <h4 className="feature-title">Current Movies</h4>
              <p className="feature-text">Watch trending films anytime.</p>
            </div>
          </div>

          

          <div className="feature-box">
            <span className="feature-icon">✔</span>
            <div>
              <h4 className="feature-title">Real-Time Reviews</h4>
              <p className="feature-text">See what users are saying now.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
