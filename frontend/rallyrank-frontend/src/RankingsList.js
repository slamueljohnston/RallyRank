import React, { useEffect, useState } from 'react';
import { getRankings } from './services/api';

const RankingsList = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);      // Track errors

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const rankingsData = await getRankings();
        setRankings(rankingsData);
        setLoading(false);  // Loading is done
      } catch (err) {
        setError('Failed to fetch rankings');
        setLoading(false);  // Stop loading even if there's an error
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return <p>Loading player rankings...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Player Rankings</h1>
      <ul>
        {rankings.map((player) => (
          <li key={player.id}>
            {player.name} - Rating: {player.rating}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingsList;
