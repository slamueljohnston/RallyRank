import React from 'react';
import { useNavigate } from 'react-router-dom';
import RankingsList from './RankingsList';
import GameHistory from './GameHistory';

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <h1>RallyRank</h1>

      <h2>Current Rankings</h2>
      <RankingsList />

      <h2>Recent Game Results</h2>
      <GameHistory limit={10} />  {/* Limit to 10 games */}

      {/* Link to Full Game History */}
      <button onClick={() => navigate('/full-game-history')}>
        See all games
      </button>
    </div>
  );
}

export default App;
