import React, { useEffect, useState } from 'react';
import { getRankings } from '../services/api';
import { Table, Loader, Title, Text } from '@mantine/core';
import { getPlayerTitle } from '@/utils/titles';
import { Player } from '@/types';

interface RankingsListProps {
    refresh: boolean;
    players: Player[];
    onPlayerClick: (player: Player) => void;
}

const RankingsList: React.FC<RankingsListProps> = ({ refresh, players, onPlayerClick }) => {
  const [rankings, setRankings] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const totalPlayers = players.length;

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const data = await getRankings();
        setRankings(data);
      } catch (err) {
        setError('Failed to fetch player rankings');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [refresh]);

  if (loading) {
    return <Text >RallyRank is loading ... Go play some Ping Pong!</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return (
    <div>
      <Title order={1}>Current Rankings</Title>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Rank</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Player Name</Table.Th>
            <Table.Th>Rating</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rankings.map((player, index) => (
            <Table.Tr key={player.id} onClick={() => onPlayerClick(player)} style={{ cursor: 'pointer' }}>
              <Table.Td>{index + 1}</Table.Td>
              <Table.Td>{getPlayerTitle(index + 1, totalPlayers)}</Table.Td>
              <Table.Td>{player.name}</Table.Td>
              <Table.Td>{player.rating}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default RankingsList;
