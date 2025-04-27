import React from 'react';
import './App.css';

import alice from './MoviePosters/Alice in Wonderland.jpg';
import avatar from './MoviePosters/Avatar.jpg';
import avengers from './MoviePosters/Avengers.jpg';
import barbie from './MoviePosters/Barbie.jpg';
import blackPanther from './MoviePosters/Black Panther.jpg';
import captMarvel from './MoviePosters/Capt Marvel.jpg';
import cars from './MoviePosters/Cars.jpg';
import darkNight from './MoviePosters/Dark Night.jpg';
import expandables from './MoviePosters/Expandables.jpg';
import frozen from './MoviePosters/Frozen.jpg';
import harryPotter from './MoviePosters/Harry Potter.jpg';
import hobbit from './MoviePosters/Hobbit.jpg';
import hungerGames from './MoviePosters/Hunger Games.jpg';
import inception from './MoviePosters/Inception.jpg';
import notebook from './MoviePosters/notebook.jpg';
import pirates from './MoviePosters/Pirates of Carib.jpg';
import shining from './MoviePosters/Shining.jpg';
import starWars from './MoviePosters/Star Wars.jpg';
import tangled from './MoviePosters/Tangled.jpg';
import twilight from './MoviePosters/Twilight.jpg';
import us from './MoviePosters/us.jpg';
import logo from './movie reel/logo.png';

const postersUp = [
  alice, avatar, barbie, frozen, harryPotter,
  hobbit, notebook, pirates, tangled, twilight
];

const postersDown = [
  avengers, blackPanther, captMarvel, cars, darkNight,
  expandables, hungerGames, inception, shining, us
];

function App() {
  return (
    <>
      <div className="App">
        <div className="App-background"></div>

        <div className="infinite-poster-right">
          <div className="scroll-column up">
            <div className="poster-track">
              {postersUp.map((src, index) => (
                <img src={src} alt={`Poster up ${index}`} key={`up-${index}`} className="poster" />
              ))}
              {postersUp.map((src, index) => (
                <img src={src} alt={`Poster up duplicate ${index}`} key={`up-dup-${index}`} className="poster" />
              ))}
            </div>
          </div>
          <div className="scroll-column down">
            <div className="poster-track">
              {postersDown.map((src, index) => (
                <img src={src} alt={`Poster down ${index}`} key={`down-${index}`} className="poster" />
              ))}
              {postersDown.map((src, index) => (
                <img src={src} alt={`Poster down duplicate ${index}`} key={`down-dup-${index}`} className="poster" />
              ))}
            </div>
          </div>
        </div>

        <div className="hero-title">
          ReelVibes
          <img src={logo} alt="ReelVibes logo" className="logo-icon" />
        </div>

        <div className="hero-description">
          Your personalized space for discovering movies that match your mood, interests, and vibe.
          
        </div>

        <div className="start-button-container">
          <button className="start-button">Start Now</button>
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
    </>
  );
}

export default App;
