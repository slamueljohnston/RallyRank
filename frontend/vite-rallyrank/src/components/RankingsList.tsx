import React, { useEffect } from 'react';
import { Table, Title, Text } from '@mantine/core';
import { getPlayerTitle } from '@/utils/titles';
import { Player } from '@/types';

interface RankingsListProps {
  refresh: boolean;
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

const RankingsList: React.FC<RankingsListProps> = ({ refresh, players, onPlayerClick }) => {
  const totalPlayers = players.length;

  // Sort players by rating in descending order
  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);

  if (players.length === 0) {
    return <Text>RallyRank is loading ... Go play some Ping Pong!</Text>;
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
          {sortedPlayers.map((player, index) => (
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