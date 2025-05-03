// File: server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Schemas & Models
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
  password: String,
}));

const Review = mongoose.model('Review', new mongoose.Schema({
  movieId: String,
  userId: String,
  content: String,
  rating: Number
}));

const PlaylistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  playlistName: { type: String, required: true }, // e.g., "Favorites" or "Watch Later"
  movieId: { type: String, required: true },      // IMDb ID
});

// Assign to variable *and* export
const Playlist = mongoose.model("Playlist", PlaylistSchema);

// Mood mapping based on genre
const moodMap = {
  "Comedy": "Happy",
  "Drama": "Sad",
  "Romance": "Romantic",
  "Horror": "Scared",
  "Action": "Excited",
  "Adventure": "Adventurous ",
  "Sci-Fi": "Curious",
  "Fantasy": "Imaginative",
  "Animation": "Playful"
};

app.get('/', (req, res) => {
  res.send('API is running');
});

// Routes
// Register Route
app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Optional: check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = new User({ username, email, password });
  await user.save();
  res.json({ message: 'User registered' });
});

// Login Route
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: 'User not found' });
  if (user.password !== password) return res.status(400).json({ message: 'Invalid password' });

  res.json({ message: 'Login successful', user: { id: user._id, username: user.username, email: user.email } });
});

app.post('/api/reviews', async (req, res) => {
  const { movieId, userId, content, rating } = req.body;
  const review = new Review({ movieId, userId, content, rating });
  await review.save();
  res.json({ message: 'Review submitted' });
});

// Get all saved movies for a user and playlist
app.get('/api/playlist/:userId/:playlistName', async (req, res) => {
  try {
    const { userId, playlistName } = req.params;
    const savedMovies = await Playlist.find({ userId, playlistName });
    res.json(savedMovies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a movie to user's named playlist
app.post('/api/playlist', async (req, res) => {
  try {
    const { userId, playlistName, movieId } = req.body;

    // Prevent duplicates in same playlist
    const existing = await Playlist.findOne({ userId, playlistName, movieId });
    if (existing) {
      return res.status(400).json({ message: 'Movie already saved in this playlist' });
    }

    const newEntry = new Playlist({ userId, playlistName, movieId });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a movie from user's named playlist
app.delete('/api/playlist', async (req, res) => {
  try {
    const { userId, playlistName, movieId } = req.body;
    const deleted = await Playlist.findOneAndDelete({ userId, playlistName, movieId });
    if (!deleted) {
      return res.status(404).json({ message: 'Movie not found in this playlist' });
    }
    res.json({ message: 'Movie removed from playlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Search movies by title
app.get('/api/movies/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
});

// Get mood based on title using genres
app.get('/api/mood/from-title', async (req, res) => {
  const title = req.query.title;
  try {
    // Step 1: Search for the movie
    const searchRes = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: title
      }
    });

    const movie = searchRes.data.results[0];
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    // Step 2: Get full movie details
    const movieDetailsRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });

    const genres = movieDetailsRes.data.genres.map(g => g.name);
    const matchedGenre = genres.find(genre => moodMap[genre]);
    const mood = matchedGenre ? moodMap[matchedGenre] : "Neutral 😐";

    res.json({
      title: movie.title,
      genres,
      mood
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch mood from title' });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
