import React, { useState, useContext } from 'react';
import { AppShell, Burger, Button, Group, Stack, MantineProvider, Image, NavLink } from '@mantine/core';
import { IconPingPong, IconListNumbers, IconHome, IconLogin, IconLogout } from '@tabler/icons-react';
import { AuthContext } from '@/AuthContext';
import axios from 'axios';
import { useForm } from '@mantine/form';
import { Player } from '../types';

// Components
import RankingsList from '../components/RankingsList';
import GameHistory from '../components/GameHistory';
import AddPlayerModal from '../components/modals/AddPlayerModal';
import AddGameResultModal from '../components/modals/AddGameResultModal';
import LoginModal from '@/components/modals/LoginModal';
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

import theme from '../theme';

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
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const { authenticated, setAuthenticated } = useContext(AuthContext);

  // Hooks for player and game management
  const {
    players,
    inactivePlayers,
    loading: playersLoading,
    handleAddPlayer,
    handleRemovePlayer,
    handleDeletePlayer,
    handleReactivatePlayer,
    playersRefresh,
    setPlayersRefresh,
  } = usePlayerManagement();

  const {
    games,
    loading: gamesLoading,
    handleAddGameResult,
    refresh: gamesRefresh,
    setRefresh: setGamesRefresh,
  } = useGameManagement(setPlayersRefresh);

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

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      setAuthenticated(false);
      localStorage.removeItem('authenticated');
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
          <Group h="100%" px="md" justify="space-between" wrap='nowrap'>
            <Group h="100%" px="md" wrap='nowrap'>
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Image src={logo} h={80}/>
            </Group>
            <Group justify="flex-end" wrap='nowrap'>
              <GitHubLink />
              <ColorSchemeToggle />
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Stack gap="xs">
            {authenticated && (
              <Group justify="center" grow>
                <Button onClick={() => setGameModalOpened(true)}>Add Game</Button>
                <Button onClick={() => setAddModalOpened(true)}>Add Player</Button>
              </Group>
            )}
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
          <Stack mt="auto">
            {authenticated ? (
                <NavLink
                  label="Sign Out"
                  leftSection={<IconLogout size="1rem" stroke={1.5} />}
                  onClick={handleLogout}
                />
              ) : (
                <NavLink
                  label="Sign In"
                  leftSection={<IconLogin size="1rem" stroke={1.5} />}
                  onClick={() => setLoginModalOpened(true)}
                  variant="filled"
                  active
                />
              )}
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main>
          <Stack align="stretch">
            {/* Login Modal */}
            <LoginModal
              opened={loginModalOpened}
              onClose={() => setLoginModalOpened(false)}
            />
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
              <FullPlayersPage
                setPlayersRefresh={setPlayersRefresh}
                players={players}
                inactivePlayers={inactivePlayers}
                handleRemovePlayer={handleRemovePlayer}
                handleReactivatePlayer={handleReactivatePlayer}
                handleDeletePlayer={handleDeletePlayer}
                onPlayerClick={handlePlayerProfile}
              />
            </div>
            <div style={{ display: viewGameHistory ? 'block' : 'none'}}>
              <FullGameHistoryPage 
                setGamesRefresh={setGamesRefresh}
                setPlayersRefresh={setPlayersRefresh}
              />
            </div>
            <div style={{ display: viewPlayerProfile ? 'block' : 'none' }}>
              {selectedPlayer && (
                <PlayerProfile
                  player={selectedPlayer}
                  onBack={handleBack}
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