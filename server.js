// File: server.js
require('dotenv').config();

console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

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

const Playlist = mongoose.model('Playlist', new mongoose.Schema({
  userId: String,
  name: String,
  movies: [String]
}));

// Routes
app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  await user.save();
  res.json({ message: 'User registered' });
});

app.post('/api/reviews', async (req, res) => {
  const { movieId, userId, content, rating } = req.body;
  const review = new Review({ movieId, userId, content, rating });
  await review.save();
  res.json({ message: 'Review submitted' });
});

app.get('/api/playlists/:userId', async (req, res) => {
  const playlists = await Playlist.find({ userId: req.params.userId });
  res.json(playlists);
});

// TMDB API Key
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Mood mapping based on genre
const moodMap = {
  "Comedy": "Happy 😊",
  "Drama": "Sad 😢",
  "Romance": "Romantic 💖",
  "Horror": "Scared 😱",
  "Action": "Excited 😆",
  "Adventure": "Adventurous 🧗‍♂️",
  "Sci-Fi": "Curious 🤖",
  "Fantasy": "Imaginative 🧙‍♂️",
  "Animation": "Playful 🎨"
};

// Movie search by title
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

// Mood detection based on title
app.get('/api/mood/from-title', async (req, res) => {
  const title = req.query.title;
  try {
    const searchRes = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: title
      }
    });

    const movie = searchRes.data.results[0];
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const movieId = movie.id;
    const movieDetailsRes = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
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
