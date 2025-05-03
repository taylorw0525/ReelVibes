import React, { useState } from "react";
import MovieList from "./MovieList"; 
import "./../styles/MovieList.css"; 
import "./../styles/MoodPage.css";

const MoodPage = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [movies, setMovies] = useState([]); // Movie list
  const [loading, setLoading] = useState(false); // Loading state


  const moods = [
    "Happy", "Sad", "Romantic", "Thrilled",
    "Reflective", "Humorous", "Curious", "Angry",
    "Fearful", "Heartbroken", "Seductive", "Sleepy",
  ];

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    if (mood) {
        setLoading(true); // Set loading before fetching
        fetchMovies(mood); // Fetch movies dynamically
      } else {
          fetchMovies("a"); // defaulting to A fro now
      }
  };

  const fetchMovies = async (searchQuery) => {
    try {
      const API_URL = `https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(API_URL);
      const data = await response.json();
      setMovies(data.description || []); // Update movie list
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  return (
    <div className="mood-page movie-page">
     <div className="overlay">
      <h1 className="mood-title">How are you feeling today?</h1>
      <p className="title-description">Select a mood to see movie recommendations.</p>
      <div className="mood-buttons">
        {moods.map((mood) => (
          <button
            key={mood}
            className={`mood-button ${selectedMood === mood ? "active" : ""}`}
            onClick={() => handleMoodClick(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
      {/* Placeholder: Display related movies */}
      <div className="movies-section">

        </div>
        <section>
        {loading ? (
          <p style={{ textAlign: "center", color: "#fff" }}>Updating...</p>
        ) : (
          <MovieList movies={movies} />
        )}
      </section>
      </div>
    </div>
  );
};

export default MoodPage;