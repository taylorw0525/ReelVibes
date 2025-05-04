import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App"; // Default home component
import Navbar from "./common/Navbar"; // Navigation bar
import MoodPage from "./MoodSelection/MoodPage"; // Mood selection
import MoviePage from "./MoodSelection/MoviePage"; // Movie details
import Login from "./Forms/Login"; 
import Signup from "./Forms/Signup";
import PlaylistPage from "./MoodSelection/PlayListPage";
import Profile from "./Forms/Profile"; // Add this at the top
import SearchResultPage from "./MoodSelection/SearchResultPage";


const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/moodpage" element={<MoodPage />} />
        <Route path="/my-playlist" element={<PlaylistPage />} />
        <Route path="/moviepage" element={<MoviePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search-result" element={<SearchResultPage />} />

      </Routes>
    </Router>
  );
};

export default AppRouter;
