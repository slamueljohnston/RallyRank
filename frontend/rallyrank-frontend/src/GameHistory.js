import React, { useEffect, useState } from 'react';
import { getGameHistory } from './services/api';

const GameHistory = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);      // Track errors

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getGameHistory();
        setGames(gamesData);
        setLoading(false);  // Loading is done
      } catch (err) {
        setError('Failed to fetch game history');
        setLoading(false);  // Stop loading even if there's an error
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <p>Loading game history...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Game History</h1>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            {game.player1_name} vs {game.player2_name} - 
            {game.player1_score} : {game.player2_score} - Result: {game.result}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameHistory;
