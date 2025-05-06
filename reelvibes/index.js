// File: index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Check for required .env variables
if (!process.env.MONGO_URI || !process.env.TMDB_API_KEY) {
  console.error("❌ Missing MONGO_URI or TMDB_API_KEY in .env");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

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
  playlistName: { type: String, required: true },
  movieId: { type: String, required: true },
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);

// Mood mapping
const moodMap = {
  "Comedy": "Happy",
  "Drama": "Sad",
  "Romance": "Romantic",
  "Horror": "Scared",
  "Action": "Excited",
  "Adventure": "Adventurous",
  "Sci-Fi": "Curious",
  "Fantasy": "Imaginative",
  "Animation": "Playful"
};

app.get('/', (req, res) => {
  res.send('✅ API is running and healthy!');
});

// Register Route
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login Route
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    res.json({ message: 'Login successful', user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Submit a review
app.post('/api/reviews', async (req, res) => {
  try {
    const { movieId, userId, content, rating } = req.body;
    const review = new Review({ movieId, userId, content, rating });
    await review.save();
    res.json({ message: 'Review submitted' });
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Get all saved movies in a playlist
app.get('/api/playlist/:userId/:playlistName', async (req, res) => {
  try {
    const { userId, playlistName } = req.params;
    const savedMovies = await Playlist.find({ userId, playlistName });
    res.json(savedMovies);
  } catch (err) {
    console.error("Playlist fetch error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Add a movie to a playlist
app.post('/api/playlist', async (req, res) => {
  try {
    const { userId, playlistName, movieId } = req.body;

    const existing = await Playlist.findOne({ userId, playlistName, movieId });
    if (existing) return res.status(400).json({ message: 'Movie already in playlist' });

    const newEntry = new Playlist({ userId, playlistName, movieId });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.error("Playlist add error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Remove a movie from a playlist
app.delete('/api/playlist', async (req, res) => {
  try {
    const { userId, playlistName, movieId } = req.body;
    const deleted = await Playlist.findOneAndDelete({ userId, playlistName, movieId });
    if (!deleted) return res.status(404).json({ message: 'Movie not found in this playlist' });

    res.json({ message: 'Movie removed from playlist' });
  } catch (err) {
    console.error("Playlist delete error:", err);
    res.status(500).json({ message: err.message });
  }
});

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Search movies
app.get('/api/movies/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: { api_key: TMDB_API_KEY, query }
    });
    res.json(response.data);
  } catch (err) {
    console.error("Movie search error:", err);
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
});

// Get mood from movie title
app.get('/api/mood/from-title', async (req, res) => {
  const title = req.query.title;
  try {
    const searchRes = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: { api_key: TMDB_API_KEY, query: title }
    });

    const movie = searchRes.data.results[0];
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const movieDetailsRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
      params: { api_key: TMDB_API_KEY }
    });

    const genres = movieDetailsRes.data.genres.map(g => g.name);
    const matchedGenre = genres.find(genre => moodMap[genre]);
    const mood = matchedGenre ? moodMap[matchedGenre] : "Neutral 😐";

    res.json({ title: movie.title, genres, mood });
  } catch (err) {
    console.error("Mood detection error:", err);
    res.status(500).json({ error: 'Failed to fetch mood from title' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

module.exports = app;
//run this in bash "npm install bcrypt dotenv express mongoose cors axios"

