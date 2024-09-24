import React from 'react';
import { useNavigate } from 'react-router-dom';
import RankingsList from './RankingsList';
import GameHistory from './GameHistory';

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <h1>RallyRank</h1>

      <div className="actions">
        <button onClick={() => navigate('/add-game')}>Add Game Result</button>
        <button onClick={() => navigate('/add-player')}>Add New Player</button>
      </div>

      <h2>Current Rankings</h2>
      <RankingsList compact={true} />

      <h2>Recent Game Results</h2>
      <GameHistory compact={true} />
    </div>
  );
}

export default App;
