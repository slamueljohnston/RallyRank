import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import React, { useState, useEffect } from 'react';
import { AppShell, Text, Burger, Title, Button, Modal, TextInput, Group, Stack, Select } from '@mantine/core';
import RankingsList from '../components/RankingsList';
import GameHistory from '../components/GameHistory';
import { addPlayer, getPlayers, removePlayer } from '../services/api';
import { useDisclosure } from '@mantine/hooks';

interface Player {
  id: number;
  name: string;
}

export function HomePage() {
  const [opened, { toggle }] = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [removeModalOpened, setRemoveModalOpened] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      const playersData = await getPlayers();
      setPlayers(playersData);
    };

    fetchPlayers();
  }, [refresh]);

  const handleAddPlayer = async () => {
    if (playerName.trim() == ''){
      alert('Player name cannot be blank');
      return;
    }

    const existingPlayer = players.find((player) => player.name.toLowerCase() === playerName.toLowerCase());
    if(existingPlayer) {
      alert('A player with this name already exists');
      return;
    }

    setLoading(true);
    await addPlayer({name: playerName});
    setModalOpened(false);
    setLoading(false);
    setRefresh((prev) => !prev);
  };

  const handleRemovePlayer = async () => {
    if (!selectedPlayer) {
      alert('Please select a player to remove');
      return;
    }
    
    setLoading(true);
    await removePlayer(Number(selectedPlayer));
    setRemoveModalOpened(false);
    setLoading(false);
    setRefresh((prev) => !prev)
  };

  return (
    <AppShell
      header={{ height: 60}}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
      <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />
        <Title order={1}> RallyRank </Title>
      </AppShell.Header>

      <AppShell.Navbar p="md">Buttons Here</AppShell.Navbar>

      <AppShell.Main>
        <Stack
          align="flex-start"
        >
          <Group>
            <Button onClick={() => setModalOpened(true)}>Add New Player</Button>
            <Button onClick={() => setRemoveModalOpened(true)}>Remove a Player</Button>
            <Button>Add Game Result</Button>
            <Button>Edit Game Result</Button>
          </Group>

          {/* Modal for adding a player */}
          <Modal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            title="Add New Player"
          >
            <TextInput
              label="Player Name"
              value={playerName}
              onChange={(event) => setPlayerName(event.currentTarget.value)}
            />
            <Button fullWidth mt="md" onClick={handleAddPlayer} loading={loading}>
            Add Player
            </Button>
          </Modal>
          
          {/* Modal for removing a player */}
          <Modal opened={removeModalOpened} onClose={() => setRemoveModalOpened(false)} title="Remove a Player">
            <Select
              label="Select a player to remove"
              data={players.map((player) => ({ value: player.id.toString(), label: player.name }))}
              value={selectedPlayer}
              onChange={setSelectedPlayer}
            />
            <Button fullWidth mt="md" onClick={handleRemovePlayer} loading={loading}>
              Remove Player
            </Button>
          </Modal>
          
          <RankingsList refresh={refresh} />
          <GameHistory />
        </Stack>
      </AppShell.Main>
      
    </AppShell>
  );
}
