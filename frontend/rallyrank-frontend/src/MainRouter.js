import React from 'react';
import { Routes, Route } from 'react-router-dom';  // No need to import BrowserRouter here
import AddGame from './AddGame';
import AddPlayer from './AddPlayer';
import App from './App';

function MainRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/add-game" element={<AddGame />} />
      <Route path="/add-player" element={<AddPlayer />} />
    </Routes>
  );
}

export default MainRouter;