import React, { useEffect, useState } from 'react';
import { getGameHistory } from './services/api';
import { format } from 'date-fns';

const FullGameHistory = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 10;  // Set the number of games to display per page

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getGameHistory();
        setGames(gamesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch game history');
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Pagination logic
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDateTime = (timestamp) => {
    return format(new Date(timestamp), "MMM d, yyyy h:mm a");
  };

  if (loading) {
    return <p>Loading game history...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Full Game History</h1>
      <table>
        <thead>
          <tr>
            <th>Date and Time</th>
            <th>Player Names and Scores</th>
            <th>Prior Ratings and Rating Changes</th>
          </tr>
        </thead>
        <tbody>
          {currentGames.map((game) => (
            <tr key={game.id}>
              <td>{formatDateTime(game.timestamp)}</td>
              <td>{game.player1_name} ({game.player1_score}) vs {game.player2_name} ({game.player2_score})</td>
              <td>
                Player 1: {game.prior_rating_player1} → {game.new_rating_player1} (+{game.rating_change_player1})<br />
                Player 2: {game.prior_rating_player2} → {game.new_rating_player2} (+{game.rating_change_player2})
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(games.length / gamesPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FullGameHistory;