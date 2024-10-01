import React, { useEffect, useState } from 'react';
import { getGameHistory, deleteGame, editGame } from './services/api';
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

  const handleDelete = async (gameId) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      await deleteGame(gameId);
      setGames(games.filter((game) => game.id !== gameId));
    }
  };

  const handleEdit = async (gameId) => {
    const player1Score = prompt('Enter new score for Player 1');
    const player2Score = prompt('Enter new score for Player 2');

    if (player1Score !== null && player2Score !== null) {
      const updatedData = {
        player1_score: parseInt(player1Score, 10),
        player2_score: parseInt(player2Score, 10),
      };
      await editGame(gameId, updatedData);
      setGames(games.map((game) =>
        game.id === gameId ? { ...game, ...updatedData } : game
      ));
    }
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
            <th>Actions</th>
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
                <td>
                  <button onClick={() => handleEdit(game.id)}>Edit</button>
                  <button onClick={() => handleDelete(game.id)}>Delete</button>
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