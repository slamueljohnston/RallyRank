import React, { useState } from 'react';
import { Table, Checkbox, Button, Group, Stack, Modal, TextInput, Pagination, CheckboxProps, Title } from '@mantine/core';
import { format } from 'date-fns';
import { useGameManagement } from '@/hooks/useGameManagement';
import { IconPointFilled } from '@tabler/icons-react';
import { Game } from '../types';  // Import Game from types.ts

const GAMES_PER_PAGE = 25;

interface FullGameHistoryPageProps {
  setGamesRefresh: React.Dispatch<React.SetStateAction<boolean>>;  // Add prop for refresh
}

const FullGameHistoryPage: React.FC<FullGameHistoryPageProps> = ({ setGamesRefresh }) => {
  const { games, loading, handleDeleteGame, handleEditGame } = useGameManagement();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [gameForm, setGameForm] = useState({ player1: '', player2: '', player1score: 0, player2score: 0 });
  const [activePage, setActivePage] = useState<number>(1);

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: format(date, 'MMM d, yyyy'),
      time: format(date, 'h:mm a'),
    };
  };

  const handleGameSelect = (game: Game) => {
    if (selectedGame === game) {
      setSelectedGame(null);
    } else {
      setSelectedGame(game);
      setGameForm({
        player1: game.player1_name,
        player2: game.player2_name,
        player1score: game.player1_score,
        player2score: game.player2_score,
      });
    }
  };

  const handleUpdateGame = async () => {
    if (selectedGame) {
      await handleEditGame(
        selectedGame.id,
        { player1_score: gameForm.player1score, player2_score: gameForm.player2score }
      );
      setEditModalOpened(false);
      setGamesRefresh((prev) => !prev);  // Trigger global refresh after editing a game
    }
  };

  const handleDelete = async () => {
    if (selectedGame) {
      await handleDeleteGame(selectedGame.id);
      setEditModalOpened(false);
      setGamesRefresh((prev) => !prev);  // Trigger global refresh after deleting a game
    }
  };

  const CheckboxIcon: CheckboxProps['icon'] = ({ ...others }) => <IconPointFilled {...others} />;

  const totalPages = Math.ceil(games.length / GAMES_PER_PAGE);
  const paginatedGames = games.slice((activePage - 1) * GAMES_PER_PAGE, activePage * GAMES_PER_PAGE);

  return (
    <>
      <Title order={1}>Game Results</Title>
      <Stack>
        <Group>
          <Button onClick={() => setEditModalOpened(true)} disabled={!selectedGame}>
            Edit Game Result
          </Button>
        </Group>

        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>Date</Table.Th>
              <Table.Th>Time</Table.Th>
              <Table.Th>Player 1 Name</Table.Th>
              <Table.Th>Player 1 Score</Table.Th>
              <Table.Th>Player 2 Name</Table.Th>
              <Table.Th>Player 2 Score</Table.Th>
              <Table.Th>Player 1 Rating Change</Table.Th>
              <Table.Th>Player 2 Rating Change</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedGames.map((game) => (
              <Table.Tr key={game.id} onClick={() => handleGameSelect(game)}>
                <Table.Td>
                  <Checkbox
                    checked={selectedGame?.id === game.id}
                    onChange={() => handleGameSelect(game)}
                    aria-label="Select row"
                    radius="xl"
                    icon={CheckboxIcon}
                  />
                </Table.Td>
                <Table.Td>{formatDateTime(game.timestamp).date}</Table.Td>
                <Table.Td>{formatDateTime(game.timestamp).time}</Table.Td>
                <Table.Td>{game.player1_name}</Table.Td>
                <Table.Td>{game.player1_score}</Table.Td>
                <Table.Td>{game.player2_name}</Table.Td>
                <Table.Td>{game.player2_score}</Table.Td>
                <Table.Td>
                  {game.player1_name}: {game.prior_rating_player1} →{' '}
                  {game.prior_rating_player1 + game.rating_change_player1} (
                  {game.rating_change_player1 >= 0 ? `+${game.rating_change_player1}` : game.rating_change_player1})
                </Table.Td>
                <Table.Td>
                  {game.player2_name}: {game.prior_rating_player2} →{' '}
                  {game.prior_rating_player2 + game.rating_change_player2} (
                  {game.rating_change_player2 >= 0 ? `+${game.rating_change_player2}` : game.rating_change_player2})
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="center" mt="md">
          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={totalPages}
            siblings={1}
            boundaries={1}
          />
        </Group>
      </Stack>

      {/* Edit Game Modal */}
      <Modal opened={editModalOpened} onClose={() => setEditModalOpened(false)} title="Edit Game Result">
        <TextInput
          label={gameForm.player1}
          placeholder="Enter score"
          type="number"
          value={gameForm.player1score}
          onChange={(event) => setGameForm({ ...gameForm, player1score: parseInt(event.currentTarget.value) })}
        />
        <TextInput
          label={gameForm.player2}
          placeholder="Enter score"
          type="number"
          value={gameForm.player2score}
          onChange={(event) => setGameForm({ ...gameForm, player2score: parseInt(event.currentTarget.value) })}
        />
        <Button fullWidth mt="md" onClick={handleUpdateGame}>
          Update Game
        </Button>
        <Button fullWidth mt="md" color="red" onClick={handleDelete}>
          Delete Game
        </Button>
      </Modal>
    </>
  );
};

export default FullGameHistoryPage;