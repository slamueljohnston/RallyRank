import React, { useState } from 'react';
import { addPlayer } from './services/api';
import { useNavigate } from 'react-router-dom';

const AddPlayer = () => {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPlayer({ name: playerName });
    navigate('/');
  };

  return (
    <div>
      <h1>Add New Player</h1>
      <form onSubmit={handleSubmit}>
        <label>Player Name:</label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
        />
        <button type="submit">Add Player</button>
      </form>
    </div>
  );
};

export default AddPlayer;