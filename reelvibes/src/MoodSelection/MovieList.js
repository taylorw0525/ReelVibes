import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./../styles/MovieList.css";

const MovieList = ({ movies, showDetails }) => {
  const { user } = useContext(AuthContext)
  const [savedMovies, setSavedMovies] = useState([]); // stores imdb_ids already saved

  const playlistName = "Favorites";  // default playlist name

  // Load user's saved playlist on mount
// Load user's saved playlist on mount
useEffect(() => {
  const fetchPlaylist = async () => {
    if (!user || !user.user || !user.user.id) return;

    try {
      const userId = user.user.id;
      const playlistName = 'favourite';
      console.log("Fetching playlist for user:", user);

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/playlist/${userId}/${playlistName}`);
      const data = await res.json();

      if (res.ok) {
        const movieIds = data.map((entry) => entry.movieId);
        setSavedMovies(movieIds);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Failed to fetch playlist", err);
    }
  };

  fetchPlaylist();
}, [user]);

const handleAddToPlaylist = async (imdbId) => {
  if (!user || !user.user || !user.user.id) return alert("Please login first!");

  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/playlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.user.id,
        playlistName: "favourite",
        movieId: imdbId,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setSavedMovies((prev) => [...prev, imdbId]);
    } else {
      alert(data.message || "Failed to add");
    }
  } catch (err) {
    console.error("Add failed", err);
  }
};

const handleRemoveFromPlaylist = async (imdbId) => {
  if (!user || !user.user || !user.user.id) return alert("Please login first!");

  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/playlist`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.user.id,
        playlistName: "favourite",
        movieId: imdbId,
      }),
    });

    if (res.ok) {
      setSavedMovies((prev) => prev.filter((id) => id !== imdbId));
    } else {
      const data = await res.json();
      alert(data.message || "Failed to remove");
    }
  } catch (err) {
    console.error("Remove failed", err);
  }
};

  return (
    <div className="movie-list">
      {movies.map((movie) => {
        const imdbId = movie["#IMDB_ID"];
        const title = movie["#TITLE"] || "Unknown Title";
        const poster = movie["#IMG_POSTER"] || "https://cdn.pixabay.com/photo/2016/03/07/00/00/cinema-1241422_1280.jpg";
        const year = movie["#YEAR"] || "Unknown Year";
        const actors = movie["#ACTORS"] || "Unknown Actors";

        const queryString = `?title=${encodeURIComponent(title)}&poster=${encodeURIComponent(poster)}&year=${encodeURIComponent(year)}&actors=${encodeURIComponent(actors)}`;

        const isSaved = savedMovies.includes(imdbId);

        return (
          <div key={imdbId} className="movie-card-container">
            
              <div className="movie-card">
              <Link to={`/moviepage/${queryString}`} className="movie-card-link">
                <img src={poster} alt={title} className="movie-poster" />
                <div className="movie-details">
                  <span className="movie-title">{title}</span>

                  {showDetails && (
                    <>
                      <span>Year: {year}</span>
                      <span className="movie-actors">Actors: {actors}</span>
                    </>
                  )}
                </div>
                </Link>
              </div>
           

            {user && (
              <button
                className={`playlist-btn ${isSaved ? "remove" : "add"}`}
                onClick={() =>
                  isSaved ? handleRemoveFromPlaylist(imdbId) : handleAddToPlaylist(imdbId)
                }
              >
                {isSaved ? "Remove from Playlist" : "Add to Playlist"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MovieList;
