import React, { useState } from 'react';
import { Table, Checkbox, Title, Text, Button, Group, Stack, Modal, Collapse, CheckboxProps } from '@mantine/core';
import { usePlayerManagement } from '@/hooks/usePlayerManagement';
import { getPlayerTitle } from '@/utils/titles';
import { IconPointFilled } from '@tabler/icons-react';
import { Player } from '@/types';  // Import Player from types.ts

interface FullPlayersPageProps {
  setPlayersRefresh: React.Dispatch<React.SetStateAction<boolean>>;  // Add prop for refresh
}

const FullPlayersPage: React.FC<FullPlayersPageProps> = ({ setPlayersRefresh }) => {
  const [removeModalOpened, setRemoveModalOpened] = useState(false);
  const [reactivateModalOpened, setReactivateModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedActivePlayer, setSelectedActivePlayer] = useState<Player | null>(null);  // Track selected active player
  const [selectedInactivePlayer, setSelectedInactivePlayer] = useState<Player | null>(null);  // Track selected inactive player
  const [inactiveVisible, setInactiveVisible] = useState(false);

  const { handleRemovePlayer, handleReactivatePlayer, handleDeletePlayer, players, inactivePlayers } = usePlayerManagement();

  // Sort active players by rating
  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
  const totalPlayers = players.length;

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

  // Handle removing a player with refresh
  const handleRemove = () => {
    if (selectedActivePlayer) {
      handleRemovePlayer(selectedActivePlayer.id, setRemoveModalOpened);
      setPlayersRefresh((prev) => !prev);  // Trigger global refresh after removing a player
    }
  };

  // Handle reactivating a player with refresh
  const handleReactivate = () => {
    if (selectedInactivePlayer) {
      handleReactivatePlayer(selectedInactivePlayer.id, setReactivateModalOpened);
      setPlayersRefresh((prev) => !prev);  // Trigger global refresh after reactivating a player
    }
  };

  // Handle deleting a player with refresh
  const handleDelete = () => {
    if (selectedInactivePlayer) {
      handleDeletePlayer(selectedInactivePlayer.id, setDeleteModalOpened);
      setPlayersRefresh((prev) => !prev);  // Trigger global refresh after deleting a player
    }
  };

  const CheckboxIcon: CheckboxProps['icon'] = ({ ...others }) => <IconPointFilled {...others} />;

  return (
    <>
      <Title>Players</Title>
      <Group>
        <Button onClick={() => setRemoveModalOpened(true)} disabled={!selectedActivePlayer}>
          Remove Player
        </Button>
      </Group>

      <Group>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>Rank</Table.Th>
              <Table.Th>Title</Table.Th>
              <Table.Th>Player Name</Table.Th>
              <Table.Th>Rating</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedPlayers.map((player, index) => (
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
                    radius="xl"
                    icon={CheckboxIcon}
                  />
                </Table.Td>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>{getPlayerTitle(index + 1, totalPlayers)}</Table.Td>
                <Table.Td>{player.name}</Table.Td>
                <Table.Td>{player.rating}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Group>

      <Button onClick={() => setInactiveVisible((prev) => !prev)}>
        {inactiveVisible ? 'Hide Inactive Players' : 'Show Inactive Players'}
      </Button>

      <Collapse in={inactiveVisible}>
        {/* Remove Player Modal */}
        <Modal
          opened={removeModalOpened}
          onClose={() => setRemoveModalOpened(false)}
          title="Remove Player"
        >
          <Text>Are you sure you want to deactivate {selectedActivePlayer?.name}?</Text>
          <Button fullWidth mt="md" onClick={handleRemove}>
            Confirm
          </Button>
        </Modal>

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
                    radius="xl"
                    icon={CheckboxIcon}
                  />
                </Table.Td>
                <Table.Td>{player.name}</Table.Td>
                <Table.Td>{player.rating}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {/* Reactivate Player Modal */}
        <Modal
          opened={reactivateModalOpened}
          onClose={() => setReactivateModalOpened(false)}
          title="Reactivate Player"
        >
          <Text>Are you sure you want to reactivate {selectedInactivePlayer?.name}?</Text>
          <Button fullWidth mt="md" onClick={handleReactivate}>
            Confirm
          </Button>
        </Modal>

        {/* Delete Player Modal */}
        <Modal
          opened={deleteModalOpened}
          onClose={() => setDeleteModalOpened(false)}
          title="Delete Player"
        >
          <Text>Are you sure you want to permanently delete {selectedInactivePlayer?.name} and remove all related games?</Text>
          <Button fullWidth mt="md" color="red" onClick={handleDelete}>
            Confirm
          </Button>
        </Modal>
      </Collapse>
    </>
  );
};

export default FullPlayersPage;