import React, { useEffect, useState } from 'react';
import { getGameHistory } from './services/api';
import { format } from 'date-fns';  // For formatting date and time

const GameHistory = ({ limit }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);      // Track errors

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getGameHistory();
        // Sort games by timestamp descending
        const sortedGames = gamesData.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
       
        // Limit the games if a limit is provided
        const limitedGames = limit ? sortedGames.slice(0,limit) : sortedGames;
        setGames(limitedGames);
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

  const formatDateTime = (timestamp) => {
    return format(new Date(timestamp), "h:mm a 'on' MMMM d, yyyy");
  };

  const formatGameResult = (game) => {
    const { player1_name, player2_name, player1_score, player2_score, timestamp } = game;

    if (player1_score > player2_score) {
      return `${player1_name} (${player1_score}) defeated ${player2_name} (${player2_score}) at ${formatDateTime(timestamp)}`;
    } else if (player2_score > player1_score) {
      return `${player2_name} (${player2_score}) defeated ${player1_name} (${player1_score}) at ${formatDateTime(timestamp)}`;
    } else {
      return `${player1_name} (${player1_score}) tied with ${player2_name} (${player2_score}) at ${formatDateTime(timestamp)}`;
    }
  };

  return (
    <div>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            {formatGameResult(game)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameHistory;