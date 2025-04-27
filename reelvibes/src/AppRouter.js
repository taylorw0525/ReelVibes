import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App"; // Default app component
import Navbar from "./common/Navbar";
import MoodPage from "./MoodSelection/MoodPage"; // Mood page component

const AppRouter = () => {
  return (
    <Router>
        <Navbar /> {/* Navbar component for navigation */}
      <Routes>
        {/* Default route ("/") renders the App component */}
        <Route path="/" element={<App />} />

        {/* "/moodpage" renders the MoodPage component */}
        <Route path="/moodpage" element={<MoodPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;