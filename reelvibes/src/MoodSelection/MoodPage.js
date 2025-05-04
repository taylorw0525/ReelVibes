import React, { useState } from "react";
import MovieList from "./MovieList";
import "./../styles/MovieList.css";
import "./../styles/MoodPage.css";

const MoodPage = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const moods = [
    "Happy", "Sad", "Romantic", "Thrilled",
    "Reflective", "Humorous", "Curious", "Angry",
    "Fearful", "Heartbroken", "Seductive", "Sleepy",
  ];

  const moodSynonyms = {
    "Happy": ["Joyful", "Cheerful"],
    "Sad": ["Unhappy", "Downcast"],
    "Romantic": ["Love", "Passionate"],
    "Thrilled": ["Excited", "Exhilarated"],
    "Reflective": ["Thoughtful", "Pensive"],
    "Humorous": ["Funny", "Comical"],
    "Curious": ["Inquisitive", "Interested"],
    "Angry": ["Mad", "Furious"],
    "Fearful": ["Scared", "Afraid"],
    "Heartbroken": ["Brokenhearted", "Devastated"],
    "Seductive": ["Alluring", "Tempting"],
    "Sleepy": ["Drowsy", "Tired"],
  };

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    if (mood) {
      setLoading(true);
      fetchMoviesByMood(mood);
    } else {
      fetchMoviesByMood("a"); // default fallback
    }
  };

  const fetchMovies = async (searchQuery) => {
    try {
      const API_URL = `https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(API_URL);
      const data = await response.json();
      return data.description || [];
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };

  const fetchMoviesByMood = async (mood) => {
    setLoading(true);

    const synonyms = moodSynonyms[mood] || [];
    const searchTerms = [mood, ...synonyms];

    const results = await Promise.all(searchTerms.map(term => fetchMovies(term)));
    const combined = results.flat();
    const shuffled = combined.sort(() => Math.random() - 0.5);

    setMovies(shuffled);
    setLoading(false);
  };

  return (
    <div className="mood-page movie-page">
      <div className="overlay">
        <p className="title-description">Select a mood to see movie recommendations</p>

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

        <div className="movie-list-background">
          {loading ? (
            <p style={{ textAlign: "center", color: "#fff", marginTop: "2rem" }}>Updating...</p>
          ) : (
            <div className="movie-list">
              <MovieList movies={movies} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodPage;
