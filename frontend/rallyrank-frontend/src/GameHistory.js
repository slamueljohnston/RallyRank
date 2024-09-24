import React, { useEffect, useState } from 'react';
import { getGameHistory } from './services/api';

const GameHistory = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const gamesData = await getGameHistory();
      setGames(gamesData);
    };

    fetchGames();
  }, []);

  return (
    <div>
      <h1>Game History</h1>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            Player {game.player1_id} vs Player {game.player2_id} - 
            {game.player1_score} : {game.player2_score} - Result: {game.result}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameHistory;