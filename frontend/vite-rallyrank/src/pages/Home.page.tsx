import { ColorSchemeToggle } from '../components/toggles/ColorSchemeToggle';
import React, { useState, useEffect } from 'react';
import { AppShell, Text, Burger, Title, Button, Modal, TextInput, Group, Stack, Select, createTheme, MantineProvider, Image, NavLink } from '@mantine/core';
import { IconPingPong, IconListNumbers, IconHome } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

// Components
import RankingsList from '../components/RankingsList';
import GameHistory from '../components/GameHistory';
import AddPlayerModal from '../components/modals/AddPlayerModal';
import AddGameResultModal from '../components/modals/AddGameResultModal';

// Pages
import FullGameHistoryPage from './FullGameHistoryPage';
import FullPlayersPage from './FullPlayersPage';

import { usePlayerManagement } from '../playerManagement/usePlayerManagement';
import { useDisclosure } from '@mantine/hooks';
import logo from "./RallyRankLogo.png";
import { GitHubLink } from '@/components/toggles/GitHubLink';

interface Player {
  id: number;
  name: string;
  rating: number;
  is_active: boolean;
}

interface GameFormValues {
  player1: string;
  player2: string;
  player1score: number;
  player2score: number;
}

interface AddPlayerFormValues {
  playerName: string;
}

interface RemovePlayerFormValues {
  selectedPlayer: string;
}

const theme = createTheme({
  colors: {
    'ag-turqoise': ["#ebfeff", "#d7fbfd", "#aaf8fc", "#7df6fc", "#62f4fb", "#56f2fb", "#4ef2fb", "#41d7e0", "#2fbfc7", "#00a6ad"],
  },
  fontFamily: '"IBM Plex Mono", system-ui',
  headings: {fontFamily: '"IBM Plex Mono", system-ui'},
  defaultRadius: 'md',
  primaryColor: 'ag-turqoise'
})

export function HomePage() {
  const [viewHome, setViewHome] = useState(true);
  const [viewGameHistory, setViewGameHistory] = useState(false);
  const [viewFullRankings, setViewFullRankings] = useState(false);
  const [opened, { toggle, close }] = useDisclosure();
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [gameModalOpened, setGameModalOpened] = useState(false);

  // Hook for player management
  const {
    players,
    inactivePlayers,
    loading,
    handleAddPlayer,
    handleRemovePlayer,
    handleReactivatePlayer,
    handleAddGameResult,
    refresh,
    setRefresh
  } = usePlayerManagement();

  // Forms for game results and player management
  const gameForm = useForm<GameFormValues>({ initialValues: { player1: '', player2: '', player1score: 0, player2score: 0 } });
  const playerForm = useForm<AddPlayerFormValues>({
    initialValues: {
      playerName: '',
    },
    validate: {
      playerName: (value) => {
        const playerExists = players.concat(inactivePlayers).find((player) => player.name.toLowerCase() === value.toLowerCase());
        return value.trim() === '' ? 'Player name cannot be blank' : playerExists ? 'Player already exists' : null;
      },
    },
  });
  const removeForm = useForm<RemovePlayerFormValues>({ initialValues: { selectedPlayer: '' } });
  
  return (
    <MantineProvider theme={theme}>
      <AppShell
        header={{ height: 80 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group h="100%" px="md">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Image src={logo} h={80}/>
            </Group>
            <Group justify="flex-end">
              <GitHubLink />
              <ColorSchemeToggle />
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
        <NavLink
          label="Home"
          leftSection={<IconHome size="1rem" stroke={1.5} />}
          onClick={() => {
            setViewHome(true);
            setViewGameHistory(false);
            setViewFullRankings(false);
            close();
          }}
          />
          <NavLink
            label="Players"
            leftSection={<IconListNumbers size="1rem" stroke={1.5} />}
            onClick={() => {
              setViewHome(false);
              setViewGameHistory(false);
              setViewFullRankings(true);
              close();
            }}
          />
          <NavLink
            label="Game Results"
            leftSection={<IconPingPong size="1rem" stroke={1.5} />}
            onClick={() => {
              setViewHome(false);
              setViewGameHistory(true);
              setViewFullRankings(false);
              close();
            }}
          />
        </AppShell.Navbar>

        <AppShell.Main>
          <Stack align="flex-start">
            <Group>
              <Button onClick={() => setAddModalOpened(true)}>Add New Player</Button>
              <Button onClick={() => setGameModalOpened(true)}>Add Game Result</Button>
            </Group>

            {/* Modals for player management and game results */}
            <AddPlayerModal
              opened={addModalOpened}
              onClose={() => setAddModalOpened(false)}
              handleAddPlayer={(playerName) => handleAddPlayer(playerName, setAddModalOpened, playerForm.reset)}
              loading={loading}
              form={playerForm}
            />
            <AddGameResultModal
              opened={gameModalOpened}
              onClose={() => setGameModalOpened(false)}
              handleAddGameResult={() => handleAddGameResult(gameForm, setGameModalOpened, gameForm.reset)}
              loading={loading}
              form={gameForm}
              players={players.map(player => ({ value: player.id.toString(), label: player.name }))}
            />
            {viewHome && (
            <Stack align="flex-start">
              <RankingsList refresh={refresh} />
              <GameHistory refresh={refresh} />
            </Stack>
          )}
          {viewGameHistory && <FullGameHistoryPage />}  {/* Show full game history if selected */}

          {viewFullRankings && <FullPlayersPage />}  {/* Show full players if selected */}
          </Stack>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}