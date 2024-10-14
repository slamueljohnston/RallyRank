import React, { useState } from 'react';
import { AppShell, Burger, Button, Group, Stack, createTheme, MantineProvider, Image, NavLink } from '@mantine/core';
import { IconPingPong, IconListNumbers, IconHome } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { Player } from '../types';

// Components
import RankingsList from '../components/RankingsList';
import GameHistory from '../components/GameHistory';
import AddPlayerModal from '../components/modals/AddPlayerModal';
import AddGameResultModal from '../components/modals/AddGameResultModal';
import { ColorSchemeToggle } from '../components/toggles/ColorSchemeToggle';
import { GitHubLink } from '@/components/toggles/GitHubLink';

// Pages
import FullGameHistoryPage from './FullGameHistoryPage';
import FullPlayersPage from './FullPlayersPage';
import PlayerProfile from './PlayerProfile';

import { usePlayerManagement } from '../hooks/usePlayerManagement';
import { useGameManagement } from '@/hooks/useGameManagement';
import { useDisclosure } from '@mantine/hooks';
import logo from "./RallyRankLogo.png";

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
  const [viewPlayerProfile, setViewPlayerProfile] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [previousView, setPreviousView] = useState<string | null>(null);
  const [opened, { toggle, close }] = useDisclosure();
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [gameModalOpened, setGameModalOpened] = useState(false);

  // Hooks for player and game management
  const {
    players,
    inactivePlayers,
    loading: playersLoading,
    handleAddPlayer,
    refresh: playersRefresh,
    setRefresh: setPlayersRefresh,
  } = usePlayerManagement();

  const {
    games,
    loading: gamesLoading,
    handleAddGameResult,
    refresh: gamesRefresh,
    setRefresh: setGamesRefresh,
  } = useGameManagement();

  // Forms for game results and player management
  const gameForm = useForm({ initialValues: { player1: '', player2: '', player1score: 0, player2score: 0 } });
  const playerForm = useForm({ initialValues: { playerName: '' } });
  
  // Function to navigate to player profile
  const handlePlayerProfile = (player: Player) => {
    setSelectedPlayer(player);
    setPreviousView(viewHome ? 'home' : viewFullRankings ? 'rankings' : 'gameHistory');
    setViewHome(false);
    setViewGameHistory(false);
    setViewFullRankings(false);
    setViewPlayerProfile(true);
  };

  // Function to navigate back from player profile
  const handleBack = () => {
    setViewPlayerProfile(false);
    if (previousView === 'home') {
      setViewHome(true);
    } else if (previousView === 'rankings') {
      setViewFullRankings(true);
    } else if (previousView === 'gameHistory') {
      setViewGameHistory(true);
    }
    setPreviousView(null);  // Clear previous view state
  };

  // Function to navigate to other pages and reset the player profile view
  const navigateToPage = (view: string) => {
    setSelectedPlayer(null);  // Close player profile when navigating
    setViewPlayerProfile(false);
    if (view === 'home') {
      setViewHome(true);
      setViewGameHistory(false);
      setViewFullRankings(false);
    } else if (view === 'rankings') {
      setViewHome(false);
      setViewGameHistory(false);
      setViewFullRankings(true);
    } else if (view === 'gameHistory') {
      setViewHome(false);
      setViewGameHistory(true);
      setViewFullRankings(false);
    }
    close();  // Close the burger menu
  };

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
          <Stack gap="xs">
            <Group justify="center" grow>
              <Button onClick={() => setGameModalOpened(true)}>Add Game</Button>
              <Button onClick={() => setAddModalOpened(true)}>Add Player</Button>
            </Group>

            <NavLink
              label="Home"
              leftSection={<IconHome size="1rem" stroke={1.5} />}
              onClick={() => { navigateToPage('home') }}
            />
            <NavLink
              label="Players"
              leftSection={<IconListNumbers size="1rem" stroke={1.5} />}
              onClick={() => { navigateToPage('rankings') }}
            />
            <NavLink
              label="Game Results"
              leftSection={<IconPingPong size="1rem" stroke={1.5} />}
              onClick={() => { navigateToPage('gameHistory') }}
            />
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main>
          <Stack align="stretch">
            {/* Modals for player management and game results */}
            <AddPlayerModal
              opened={addModalOpened}
              onClose={() => setAddModalOpened(false)}
              handleAddPlayer={(playerName) => handleAddPlayer(playerName, setAddModalOpened, playerForm.reset)}
              loading={playersLoading}
              form={playerForm}
            />
            <AddGameResultModal
              opened={gameModalOpened}
              onClose={() => setGameModalOpened(false)}
              handleAddGameResult={() => handleAddGameResult(gameForm, setGameModalOpened, gameForm.reset)}
              loading={gamesLoading}
              form={gameForm}
              players={players.map(player => ({ value: player.id.toString(), label: player.name }))}
            />
            <div style={{ display: viewHome ? 'block' : 'none'}}>
              <RankingsList refresh={playersRefresh} players={players} onPlayerClick={handlePlayerProfile} />
              <GameHistory refresh={gamesRefresh} />
            </div>
            <div style={{ display: viewFullRankings ? 'block' : 'none'}}>
              <FullPlayersPage setPlayersRefresh={setPlayersRefresh} players={players} onPlayerClick={handlePlayerProfile}/>
            </div>
            <div style={{ display: viewGameHistory ? 'block' : 'none'}}>
              <FullGameHistoryPage setGamesRefresh={setGamesRefresh} />
            </div>
            <div style={{ display: viewPlayerProfile ? 'block' : 'none' }}>
              {selectedPlayer && (
                <PlayerProfile
                  player={selectedPlayer}
                  onBack={handleBack}
                  rank={1}  // Example rank, this would be dynamic
                  players={players}  // Pass the players array to calculate rank
                  games={games}  // Pass the full list of games for calculating player stats
                />
                )}  {/* Pass the onBack function */}
            </div>
          </Stack>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}