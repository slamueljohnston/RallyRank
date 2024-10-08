import React from 'react';
import { Modal, Button, Select } from '@mantine/core';

interface ReactivatePlayerModalProps {
  opened: boolean;
  onClose: () => void;
  handleReactivatePlayer: (playerId: number) => Promise<void>;  // Simplified signature
  loading: boolean;
  inactivePlayers: { value: string; label: string }[];
  inactivePlayerId: string | null;
  setInactivePlayerId: (id: number) => void;
}

const ReactivatePlayerModal: React.FC<ReactivatePlayerModalProps> = ({
  opened,
  onClose,
  handleReactivatePlayer,
  loading,
  inactivePlayers,
  inactivePlayerId,
  setInactivePlayerId,
}) => (
  <Modal opened={opened} onClose={onClose} title="Reactivate a Player">
    <Select
      label="Select an inactive player to reactivate"
      data={inactivePlayers}
      value={inactivePlayerId?.toString() || null}
      onChange={(value) => {
        console.log('Selected player ID:', value);  // Debugging log
        setInactivePlayerId(Number(value));
    }}
    />
    <Button fullWidth mt="md" onClick={() => handleReactivatePlayer(Number(inactivePlayerId))} loading={loading}>
      Reactivate Player
    </Button>
  </Modal>
);

export default ReactivatePlayerModal;