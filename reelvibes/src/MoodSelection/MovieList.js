import React from "react";
import { Link } from "react-router-dom";
import "./../styles/MovieList.css"; // Import the CSS

const MovieList = ({ movies, showDetails }) => {
  return (
    <div className="movie-list">
      {movies.map((movie) => {
        const title = movie["#TITLE"] || "Unknown Title";
        const poster = movie["#IMG_POSTER"] || "https://via.placeholder.com/300x450";
        const year = movie["#YEAR"] || "Unknown Year";
        const actors = movie["#ACTORS"] || "Unknown Actors";
      
        const queryString = `?title=${encodeURIComponent(title)}&poster=${encodeURIComponent(poster)}&year=${encodeURIComponent(year)}&actors=${encodeURIComponent(actors)}`;
      
        return (
          <Link
            key={movie["#IMDB_ID"]}
            to={`/moviepage/${queryString}`}
            className="movie-card-link"
          >
            <div className="movie-card">
              <img
                src={poster}
                alt={title}
                className="movie-poster"
              />
              <div className="movie-details">
                <span className="movie-title">{movie["#TITLE"]}</span>

                {showDetails && (
                    <>
                      <span>Year: {year}</span>
                      <span className="movie-actors">Actors: {actors}</span>
                    </>
                  )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MovieList;
