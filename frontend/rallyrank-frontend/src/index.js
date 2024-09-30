import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainRouter from './MainRouter';  // Import MainRouter
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <MainRouter />
  </React.StrictMode>
);
