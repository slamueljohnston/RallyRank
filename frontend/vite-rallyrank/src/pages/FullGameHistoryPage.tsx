import React, { useEffect, useState } from 'react';
import { Table, Checkbox, Button, Group, Loader, Skeleton, Stack, Modal, TextInput } from '@mantine/core';
import { format } from 'date-fns';
import { getGameHistory, deleteGame, editGame } from '../services/api';

interface Game {
  id: number;
  new_rating_player1: number;
  new_rating_player2: number;
  player1_name: string;
  player1_score: number;
  player2_name: string;
  player2_score: number;
  prior_rating_player1: number;
  prior_rating_player2: number;
  rating_change_player1: number;
  rating_change_player2: number;
  result: string;
  timestamp: string;
}

const FullGameHistoryPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [gameForm, setGameForm] = useState({ player1: '', player2: '', player1score: 0, player2score: 0});

  useEffect(() => {
    const fetchGames = async () => {
      const gamesData = await getGameHistory();
      setGames(gamesData);
      setLoading(false);
    };

    fetchGames();
  }, []);

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: format(date, 'MMM d, yyyy'),
      time: format(date, 'h:mm a'),
    };
  };  

  const handleGameSelect = (game: Game) => {

    if(selectedGame === game) {
      setSelectedGame(null);
    }
    else {
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
      await editGame(
        selectedGame.id,
        {player1_score: gameForm.player1score, player2_score: gameForm.player2score}
      );
      setEditModalOpened(false);
    }
  };

  const handleDeleteGame = async () => {
    if (selectedGame) {
      await deleteGame(selectedGame.id);
      setEditModalOpened(false);
      setGames(games.filter((game) => game.id !== selectedGame.id));  // Remove game from local state
    }
  };

  return (
    <>
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
          {games.map((game) => (
            <Table.Tr key={game.id} onClick={() => handleGameSelect(game)}>
              <>
                <Table.Td>
                  <Checkbox
                    checked={selectedGame?.id === game.id}
                    onChange={() => handleGameSelect(game)}
                    aria-label="Select row"
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
              </>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>

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
            <Button fullWidth mt="md" color="red" onClick={handleDeleteGame}>
              Delete Game
            </Button>
          </Modal>
          </>
  );
};

export default FullGameHistoryPage;