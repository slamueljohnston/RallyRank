import React, { useEffect, useState } from 'react';
import { getGameHistory } from './services/api';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const FullGameHistory = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 10;  // Set the number of games per page
  const navigate = useNavigate();

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

  if (loading) {
    return <p>Loading game history...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Full Game History</h1>

      {/* Back to Home button */}
      <button onClick={() => navigate('/')}>Back to Home</button>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Player 1 Name</th>
            <th>Player 1 Score</th>
            <th>Player 2 Name</th>
            <th>Player 2 Score</th>
            <th>Player 1 Rating Change</th>
            <th>Player 2 Rating Change</th>
          </tr>
        </thead>
        <tbody>
          {currentGames.map((game) => {
            const player1NewRating = game.prior_rating_player1 + game.rating_change_player1;
            const player2NewRating = game.prior_rating_player2 + game.rating_change_player2;

            return (
              <tr key={game.id}>
                <td>{format(new Date(game.timestamp), "MMM d, yyyy")}</td>
                <td>{format(new Date(game.timestamp), "h:mm a")}</td>
                <td>{game.player1_name}</td>
                <td>{game.player1_score}</td>
                <td>{game.player2_name}</td>
                <td>{game.player2_score}</td>
                <td>
                  {game.player1_name}: {game.prior_rating_player1} → {player1NewRating} (+{game.rating_change_player1})
                </td>
                <td>
                  {game.player2_name}: {game.prior_rating_player2} → {player2NewRating} (+{game.rating_change_player2})
                </td>
              </tr>
            );
          })}
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