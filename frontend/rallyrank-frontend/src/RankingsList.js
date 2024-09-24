import React, { useEffect, useState } from 'react';
import { getRankings } from './services/api';

const RankingsList = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      const rankingsData = await getRankings();
      setRankings(rankingsData);
    };

    fetchRankings();
  }, []);

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