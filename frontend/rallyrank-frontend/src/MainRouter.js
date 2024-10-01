import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddGame from './AddGame';
import AddPlayer from './AddPlayer';
import FullGameHistory from './FullGameHistory';
import App from './App';

// Determine if running locally or on GitHub Pages
const basename = process.env.PUBLIC_URL || '/';

function MainRouter() {
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/add-game" element={<AddGame />} />
        <Route path="/add-player" element={<AddPlayer />} />
        <Route path="/full-game-history" element={<FullGameHistory />} />
      </Routes>
    </Router>
  );
}

export default MainRouter;
