import React, { useState } from 'react';
import {
  Table,
  Checkbox,
  CheckboxProps,
  Button,
  Group,
  Stack,
  Modal,
  TextInput,
  Pagination,
  ScrollArea,
  Text,
  Title,
  UnstyledButton,
  Center,
  rem,
} from '@mantine/core';
import { format } from 'date-fns';
import { useGameManagement } from '@/hooks/useGameManagement';
import { IconPointFilled, IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
import { Game } from '../types';

const GAMES_PER_PAGE = 25;

interface FullGameHistoryPageProps {
  setGamesRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

// Sorting table headers
function Th({ children, reversed, sorted, onSort }: any) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort}>
        <Group justify="space-between">
          <Text fw={500} size="sm">{children}</Text>
          <Center>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

// Filter data based on search
function filterData(data: Game[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((game) =>
    game.player1_name.toLowerCase().includes(query) ||
    game.player2_name.toLowerCase().includes(query) ||
    game.player1_score.toString().includes(query) ||
    game.player2_score.toString().includes(query)
  );
}

// Sort data
function sortData(
  data: Game[],
  { sortBy, reversed, search }: { sortBy: keyof Game | null; reversed: boolean; search: string }
) {
  if (!sortBy) {
    return filterData(data, search);
  }

  const sorted = [...data].sort((a, b) => {
    if (reversed) {
      return b[sortBy]?.toString().localeCompare(a[sortBy]?.toString());
    }
    return a[sortBy]?.toString().localeCompare(b[sortBy]?.toString());
  });

  return filterData(sorted, search);
}

const FullGameHistoryPage: React.FC<FullGameHistoryPageProps> = ({ setGamesRefresh }) => {
  const { games, loading, handleDeleteGame, handleEditGame } = useGameManagement();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [gameForm, setGameForm] = useState({ player1: '', player2: '', player1score: 0, player2score: 0 });
  const [activePage, setActivePage] = useState<number>(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof Game | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof Game) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const filteredGames = sortData(games, { sortBy, reversed: reverseSortDirection, search });

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
      setGamesRefresh((prev) => !prev);
    }
  };

  const handleDelete = async () => {
    if (selectedGame) {
      await handleDeleteGame(selectedGame.id);
      setEditModalOpened(false);
      setGamesRefresh((prev) => !prev);
    }
  };

  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);
  const paginatedGames = filteredGames.slice((activePage - 1) * GAMES_PER_PAGE, activePage * GAMES_PER_PAGE);
  const CheckboxIcon: CheckboxProps['icon'] = ({ ...others }) => <IconPointFilled {...others} />;

  return (
    <>
      <Title order={1}>Game Results</Title>
      <Stack>
        <Group>
          <Button onClick={() => setEditModalOpened(true)} disabled={!selectedGame}>
            Edit Game Result
          </Button>
        </Group>

        <TextInput
          placeholder="Search for a Player"
          mb="md"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={handleSearchChange}
        />

        <Table.ScrollContainer minWidth={500}>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th />
                <Th
                  sorted={sortBy === 'timestamp'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('timestamp')}
                >
                  Date
                </Th>
                <Th
                  sorted={sortBy === 'player1_name'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('player1_name')}
                >
                  Player 1 Name
                </Th>
                <Th
                  sorted={sortBy === 'player1_score'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('player1_score')}
                >
                  Player 1 Score
                </Th>
                <Th
                  sorted={sortBy === 'player2_name'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('player2_name')}
                >
                  Player 2 Name
                </Th>
                <Th
                  sorted={sortBy === 'player2_score'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('player2_score')}
                >
                  Player 2 Score
                </Th>
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
                  <Table.Td>{game.player1_name}</Table.Td>
                  <Table.Td>{game.player1_score}</Table.Td>
                  <Table.Td>{game.player2_name}</Table.Td>
                  <Table.Td>{game.player2_score}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

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
