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
import logo from './movie reel/logo.png'; // your logo

const posters = [
  alice, avatar, avengers, barbie, blackPanther,
  captMarvel, cars, darkNight, expandables, frozen,
  harryPotter, hobbit, hungerGames, inception, notebook,
  pirates, shining, starWars, tangled, twilight, us
];

function App() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-left">Welcome</div>
        <div className="nav-center">
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
        <div className="nav-right">
          <span className="nav-item">Saved Playlist</span>
          <span className="nav-item">Profile</span>
        </div>
      </nav>

      <div className="App">
        <div className="App-background"></div>

        <div className="infinite-poster-right">
          <div className="scroll-column up">
            <div className="poster-track">
              {posters.map((src, index) => (
                <img src={src} alt={`Poster ${index}`} key={`up-${index}`} className="poster" />
              ))}
              {posters.map((src, index) => (
                <img src={src} alt={`Poster duplicate ${index}`} key={`up-dup-${index}`} className="poster" />
              ))}
            </div>
          </div>
          <div className="scroll-column down">
            <div className="poster-track">
              {posters.map((src, index) => (
                <img src={src} alt={`Poster ${index}`} key={`down-${index}`} className="poster" />
              ))}
              {posters.map((src, index) => (
                <img src={src} alt={`Poster duplicate ${index}`} key={`down-dup-${index}`} className="poster" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hero-title">
        ReelVibes
        <img src={logo} alt="ReelVibes logo" className="logo-icon" />
      </div>


      <div className="hero-description">
        Your personalized space for discovering movies that match your mood, interests, and vibe. Whether you're in the mood for something nostalgic, thrilling, feel-good, or unexpected, ReelVibes curates recommendations tailored to how you're feeling.
        <br /><br />
        Explore trending films, save your favorites, build custom playlists, and let the vibe guide your next watch.
      </div>
    </>
  );
}

export default App;
