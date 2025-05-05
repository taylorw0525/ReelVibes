// backend/server.js
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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(' MongoDB connection error:', err));

// === Schemas & Models ===
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

const Playlist = mongoose.model('Playlist', new mongoose.Schema({
  userId: { type: String, required: true },
  playlistName: { type: String, required: true },
  movieId: { type: String, required: true },
}));

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

// === Routes ===
app.get('/', (req, res) => {
  res.send('🎬 ReelVibes API is running!');
});

// Register
app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const user = new User({ username, email, password });
  await user.save();
  res.json({ message: 'User registered' });
});

// Login
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });
  if (user.password !== password) return res.status(400).json({ message: 'Invalid password' });

  res.json({
    message: 'Login successful',
    user: { id: user._id, username: user.username, email: user.email }
  });
});

// Add Review
app.post('/api/reviews', async (req, res) => {
  const { movieId, userId, content, rating } = req.body;
  const review = new Review({ movieId, userId, content, rating });
  await review.save();
  res.json({ message: 'Review submitted' });
});

// Get Playlist
app.get('/api/playlist/:userId/:playlistName', async (req, res) => {
  const { userId, playlistName } = req.params;
  const list = await Playlist.find({ userId, playlistName });
  res.json(list);
});

// Add to Playlist
app.post('/api/playlist', async (req, res) => {
  const { userId, playlistName, movieId } = req.body;
  const exists = await Playlist.findOne({ userId, playlistName, movieId });
  if (exists) return res.status(400).json({ message: 'Already in playlist' });

  const entry = new Playlist({ userId, playlistName, movieId });
  await entry.save();
  res.status(201).json(entry);
});

// Delete from Playlist
app.delete('/api/playlist', async (req, res) => {
  const { userId, playlistName, movieId } = req.body;
  const deleted = await Playlist.findOneAndDelete({ userId, playlistName, movieId });
  if (!deleted) return res.status(404).json({ message: 'Not found in playlist' });

  res.json({ message: 'Removed from playlist' });
});

// Search Movies
app.get('/api/movies/search', async (req, res) => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query: req.query.q
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
});

// Mood Detection
app.get('/api/mood/from-title', async (req, res) => {
  try {
    const title = req.query.title;
    const searchRes = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: { api_key: process.env.TMDB_API_KEY, query: title }
    });

    const movie = searchRes.data.results[0];
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
      params: { api_key: process.env.TMDB_API_KEY }
    });

    const genres = movieDetails.data.genres.map(g => g.name);
    const matched = genres.find(g => moodMap[g]);
    const mood = matched ? moodMap[matched] : "Neutral 😐";

    res.json({ title: movie.title, genres, mood });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch mood from title' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
