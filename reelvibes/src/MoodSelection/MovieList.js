import React from "react";
import "./../styles/MovieList.css"; // Import the CSS

const MovieList = ({ movies }) => {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <a
          key={movie["#IMDB_ID"]}
          href={movie["#IMDB_URL"]}
          target="_blank"
          rel="noopener noreferrer"
          className="movie-card-link"
        >
          <div className="movie-card">
            <img
              src={movie["#IMG_POSTER"]}
              alt={movie["#TITLE"]}
              className="movie-poster"
            />
            <div className="movie-details">
              <span className="movie-title">{movie["#TITLE"]}</span>
              <span>Year: {movie["#YEAR"]}</span>
              <span className="movie-actors">Actors: {movie["#ACTORS"]}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default MovieList;
