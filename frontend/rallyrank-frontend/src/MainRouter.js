import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AddGame from './AddGame';
import AddPlayer from './AddPlayer';
import FullGameHistory from './FullGameHistory';
import App from './App';

// Determine if running locally or on GitHub Pages
const basename = process.env.PUBLIC_URL || '/';

const DebugRouter = () => {
  const location = useLocation();
  console.log('Basename:', basename);
  console.log('Current location:', location.pathname);
  return null;
};

function MainRouter() {
  return (
    <Router basename={basename}>
      <DebugRouter />  {/* Log the basename and current location */}
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
