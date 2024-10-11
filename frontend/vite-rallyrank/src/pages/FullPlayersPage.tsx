import React, { useEffect, useState } from 'react';
import { Table, Checkbox, Loader, Title, Text, Button, Group, Stack, Modal, Collapse } from '@mantine/core';
import { format } from 'date-fns';
import { getRankings, getPlayers } from '@/services/api';
import { usePlayerManagement } from '@/playerManagement/usePlayerManagement';

interface Player {
    id: number;
    name: string;
    rating: number;
  }
  
  const FullPlayersPage: React.FC = () => {
    const [removeModalOpened, setRemoveModalOpened] = useState(false);
    const [reactivateModalOpened, setReactivateModalOpened] = useState(false);
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [selectedActivePlayer, setSelectedActivePlayer] = useState<Player | null>(null);  // Track selected active player
    const [selectedInactivePlayer, setSelectedInactivePlayer] = useState<Player | null>(null);  // Track selected inactive player
    const [inactiveVisible, setInactiveVisible] = useState(false);
    const { handleRemovePlayer, handleReactivatePlayer, handleDeletePlayer, players, inactivePlayers } = usePlayerManagement();
  
    // Sort active players by rating
    const sortedPlayers = [...players].sort((a,b) => b.rating - a.rating);

    // Deactivate Confirmation Modal
    const RemovePlayerModal: React.FC<{ player: Player | null; opened: boolean; onClose: () => void; handleRemovePlayer: () => void }> = ({
      player,
      opened,
      onClose,
      handleRemovePlayer,
    }) => (
      <Modal opened={opened} onClose={onClose} title="Remove Player">
        <Text>Are you sure you want to deactivate {player?.name}?</Text>
        <Button fullWidth mt="md" onClick={handleRemovePlayer}>
          Confirm
        </Button>
      </Modal>
    );

    // Reactivate Confirmation Modal
    const ReactivatePlayerModal: React.FC<{ player: Player | null; opened: boolean; onClose: () => void; handleReactivatePlayer: () => void }> = ({
      player,
      opened,
      onClose,
      handleReactivatePlayer,
    }) => (
      <Modal opened={opened} onClose={onClose} title="Reactivate Player">
        <Text>Are you sure you want to reactivate {player?.name}?</Text>
        <Button fullWidth mt="md" onClick={handleReactivatePlayer}>
          Confirm
        </Button>
      </Modal>
    );

    // Delete Confirmation Modal
    const DeletePlayerModal: React.FC<{ player: Player | null; opened: boolean; onClose: () => void; handleDeletePlayer: () => void }> = ({
      player,
      opened,
      onClose,
      handleDeletePlayer,
    }) => (
      <Modal opened={opened} onClose={onClose} title="Delete Player">
        <Text>Are you sure you want to permanently delete {player?.name} and remove all related games?</Text>
        <Button fullWidth mt="md" color="red" onClick={handleDeletePlayer}>
          Confirm
        </Button>
      </Modal>
    );

    // Handle row selection for active players
    const handleSelectActivePlayer = (player: Player) => {
      if (selectedActivePlayer?.id === player.id) {
        setSelectedActivePlayer(null);
      } else {
        setSelectedActivePlayer(player);
      }
    };

    // Handle row selection for inactive players
    const handleSelectInactivePlayer = (player: Player) => {
      if (selectedInactivePlayer?.id === player.id) {
        setSelectedInactivePlayer(null);
      } else {
        setSelectedInactivePlayer(player);
      }
    };

    return (
      <>
        <Title>Players</Title>
        <Group>
          <Button onClick={() => setRemoveModalOpened(true)} disabled={!selectedActivePlayer}>
            Remove Player
          </Button>
        </Group>
  
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>Player Name</Table.Th>
              <Table.Th>Rating</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedPlayers.map((player) => (
              <Table.Tr
                key={player.id}
                onClick={() => handleSelectActivePlayer(player)}
                bg={selectedActivePlayer?.id === player.id ? 'var(--mantine-color-blue-light)' : undefined}
              >
                <Table.Td>
                  <Checkbox
                    checked={selectedActivePlayer?.id === player.id}
                    aria-label="Select row"
                    onChange={() => {}}
                  />
                </Table.Td><Table.Td>{player.name}</Table.Td><Table.Td>{player.rating}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Button onClick={() => setInactiveVisible((prev) => !prev)}>
          {inactiveVisible ? 'Hide Inactive Players' : 'Show Inactive Players'}
        </Button>

        <Collapse in={inactiveVisible}>
          <RemovePlayerModal
            player={selectedActivePlayer}
            opened={removeModalOpened}
            onClose={() => setRemoveModalOpened(false)}
            handleRemovePlayer={() => handleRemovePlayer(selectedActivePlayer?.id, setRemoveModalOpened)}
          />

          <Title mt="lg">Inactive Players</Title>

          <Group>
            <Button onClick={() => setReactivateModalOpened(true)} disabled={!selectedInactivePlayer}>
              Reactivate Player
            </Button>
            <Button color="red" onClick={() => setDeleteModalOpened(true)} disabled={!selectedInactivePlayer}>
              Delete Player
            </Button>
          </Group>

          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th />
                <Table.Th>Player Name</Table.Th>
                <Table.Th>Rating</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {inactivePlayers.map((player) => (
                <Table.Tr
                  key={player.id}
                  onClick={() => handleSelectInactivePlayer(player)}
                  bg={selectedInactivePlayer?.id === player.id ? 'var(--mantine-color-blue-light)' : undefined}
                >
                  <Table.Td>
                    <Checkbox
                      checked={selectedInactivePlayer?.id === player.id}
                      aria-label="Select row"
                      onChange={() => {}}
                    />
                  </Table.Td><Table.Td>{player.name}</Table.Td><Table.Td>{player.rating}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <ReactivatePlayerModal
            player={selectedInactivePlayer}
            opened={reactivateModalOpened}
            onClose={() => setReactivateModalOpened(false)}
            handleReactivatePlayer={() => handleReactivatePlayer(selectedInactivePlayer?.id, setReactivateModalOpened)}
          />
          
          <DeletePlayerModal
            player={selectedInactivePlayer}
            opened={deleteModalOpened}
            onClose={() => setDeleteModalOpened(false)}
            handleDeletePlayer={() => handleDeletePlayer(selectedInactivePlayer?.id, setDeleteModalOpened)}
          />
        </Collapse>
      </>
    );
  };
  
  export default FullPlayersPage;