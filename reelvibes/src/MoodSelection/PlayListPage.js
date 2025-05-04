import React, { useEffect, useState, useContext } from 'react';
import MovieList from './MovieList';
import { Link } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";

const PlaylistPage = () => {
  const [groupedPlaylists, setGroupedPlaylists] = useState({});
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const playlistName = 'favourite';
        const userId = user.user.id;

        const res = await fetch(`http://localhost:5000/api/playlist/${userId}/${playlistName}`);
        const data = await res.json();

        // For each item, fetch full movie details
        const movieDetailPromises = data.map(async (item) => {
          const movieRes = await fetch(`https://imdb.iamidiotareyoutoo.com/search?q=${item.movieId}`);
          const movieData = await movieRes.json();
          const movie = movieData.description[0];

          return {
            ...movie,
            playlistName: item.playlistName,
          };
        });

        const moviesWithDetails = await Promise.all(movieDetailPromises);

        // Group by playlistName
        const grouped = moviesWithDetails.reduce((acc, movie) => {
          if (!acc[movie.playlistName]) {
            acc[movie.playlistName] = [];
          }
          acc[movie.playlistName].push(movie);
          return acc;
        }, {});

        setGroupedPlaylists(grouped);
      } catch (err) {
        console.error('Failed to load playlists', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [user.user.id]);

  const isEmpty = Object.keys(groupedPlaylists).length === 0;

  if (loading) return <p style={{ color: '#fff', textAlign: 'center' }}>Loading playlists...</p>;

  return (
    <div className='SavedPlaylistPage saved-playlist-background-image'>
      <h2 style={{ color: '#fff' }}>Your Saved Playlists</h2>
      {isEmpty ? (
        <div style={{ color: '#fff', textAlign: 'center', marginTop: '40px' }}>
          <p>Nothing here yet. Search movies and add them to your playlist!</p>
          <Link to="/" style={{
            backgroundColor: '#4CAF50',
            padding: '10px 20px',
            borderRadius: '8px',
            color: '#fff',
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: '20px'
          }}>
            Go to Home
          </Link>
        </div>
      ) : (
        Object.entries(groupedPlaylists).map(([playlistName, movies]) => (
          <div key={playlistName} style={{ marginBottom: '50px' }}>
            <h2 style={{
              color: '#fff',
              borderBottom: '2px solid #fff',
              paddingBottom: '5px',
              marginBottom: '20px',
              textAlign: 'left',
            }}>
              {playlistName.toUpperCase()}
            </h2>

            <MovieList movies={movies} />
          </div>
        ))
      )}
    </div>
  );
};

export default PlaylistPage;
