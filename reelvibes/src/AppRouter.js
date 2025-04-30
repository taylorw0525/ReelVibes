import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App"; // Default home component
import Navbar from "./common/Navbar"; // Navigation bar
import MoodPage from "./MoodSelection/MoodPage"; // Mood selection
import MoviePage from "./MoodSelection/MoviePage"; // Movie details
import Login from "./Forms/Login"; 
import Signup from "./Forms/Signup";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/moodpage" element={<MoodPage />} />
        <Route path="/moviepage" element={<MoviePage />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
