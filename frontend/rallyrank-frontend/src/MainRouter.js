import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddGame from './AddGame';
import AddPlayer from './AddPlayer';
import App from './App';  // The existing App.js

function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />         {/* Main Page */}
        <Route path="/add-game" element={<AddGame />} />  {/* Add Game Form */}
        <Route path="/add-player" element={<AddPlayer />} />  {/* Add Player Form */}
      </Routes>
    </Router>
  );
}

export default MainRouter;