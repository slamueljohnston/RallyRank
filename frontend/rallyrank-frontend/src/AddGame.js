import React, { useState, useEffect } from 'react';
import { getPlayers, addGameResult } from './services/api';
import { useNavigate } from 'react-router-dom';

const AddGame = () => {
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      const playersData = await getPlayers();
      setPlayers(playersData);
    };

    fetchPlayers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addGameResult({
      player1_id: player1,
      player2_id: player2,
      player1_score: player1Score,
      player2_score: player2Score,
    });
    navigate('/');
  };

  return (
    <div>
      <h1>Add Game Result</h1>
      <form onSubmit={handleSubmit}>
        <label>Player 1:</label>
        <select value={player1} onChange={(e) => setPlayer1(e.target.value)}>
          <option value="">Select Player 1</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <label>Player 1 Score:</label>
        <input type="number" value={player1Score} onChange={(e) => setPlayer1Score(e.target.value)} />

        <label>Player 2:</label>
        <select value={player2} onChange={(e) => setPlayer2(e.target.value)}>
          <option value="">Select Player 2</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <label>Player 2 Score:</label>
        <input type="number" value={player2Score} onChange={(e) => setPlayer2Score(e.target.value)} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddGame;
