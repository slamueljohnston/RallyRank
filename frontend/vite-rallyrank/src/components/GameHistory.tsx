import React, { useEffect, useState } from 'react';
import { getGameHistory } from '../services/api';
import { Table, Loader, Title, Text } from '@mantine/core';
import { format } from 'date-fns';

interface Game {
  id: number;
  player1_name: string;
  player2_name: string;
  player1_score: number;
  player2_score: number;
  result: string;
  timestamp: string;
}

const GameHistory: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getGameHistory();
        setGames(data);
      } catch (err) {
        setError('Failed to fetch game history');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return (
    <div>
      <Title order={2}>Recent Game Results</Title>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Date</Table.Th>
            <Table.Th>Player 1</Table.Th>
            <Table.Th>Player 1 Score</Table.Th>
            <Table.Th>Player 2</Table.Th>
            <Table.Th>Player 2 Score</Table.Th>
            <Table.Th>Result</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {games.map((game) => (
            <Table.Tr key={game.id}>
              <Table.Td>{format(new Date(game.timestamp), "MMM d, yyyy")}</Table.Td>
              <Table.Td>{game.player1_name}</Table.Td>
              <Table.Td>{game.player1_score}</Table.Td>
              <Table.Td>{game.player2_name}</Table.Td>
              <Table.Td>{game.player2_score}</Table.Td>
              <Table.Td>{game.result}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default GameHistory;