import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MovieList from "./MovieList"; // adjust the path if needed
import "../App.css";

const SearchResultPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      fetchMovies(searchQuery).then((result) => {
        setMovies(result);
        setLoading(false);
      });
    }
  }, [searchQuery]);

  return (
    <div className="search-result-page">
      
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
  );
};

export default SearchResultPage;
