import React, { useEffect, useState } from 'react';
import { getRankings } from '../services/api';
import { Table, Loader, Title, Text } from '@mantine/core';

interface Player {
  id: number;
  name: string;
  rating: number;
}

interface RankingsListProps {
    refresh: boolean;
}

const RankingsList: React.FC<RankingsListProps> = ({ refresh }) => {
  const [rankings, setRankings] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    return <Loader />;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return (
    <div>
      <Title order={2}>Current Rankings</Title>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Rank</Table.Th>
            <Table.Th>Player Name</Table.Th>
            <Table.Th>Rating</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <tbody>
          {rankings.map((player, index) => (
            <Table.Tr key={player.id}>
              <Table.Td>{index + 1}</Table.Td>
              <Table.Td>{player.name}</Table.Td>
              <Table.Td>{player.rating}</Table.Td>
            </Table.Tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RankingsList;
