import React from 'react';
import { Modal, Select, Button } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

interface RemovePlayerFormValues {
  selectedPlayer: string;
}

interface RemovePlayerModalProps {
  opened: boolean;
  onClose: () => void;
  handleRemovePlayer: (selectedPlayer: string) => Promise<void>;  // Updated signature
  loading: boolean;
  form: UseFormReturnType<RemovePlayerFormValues>;
  players: { value: string; label: string }[];
}

const RemovePlayerModal: React.FC<RemovePlayerModalProps> = ({ opened, onClose, handleRemovePlayer, loading, form, players }) => (
  <Modal opened={opened} onClose={onClose} title="Remove a Player">
    <form
      onSubmit={form.onSubmit(() => handleRemovePlayer(form.values.selectedPlayer))}  // Pass selectedPlayer directly
    >
      <Select
        label="Select a player to remove"
        data={players}
        {...form.getInputProps('selectedPlayer')}
      />
      <Button fullWidth mt="md" type="submit" loading={loading}>
        Remove Player
      </Button>
    </form>
  </Modal>
);

export default RemovePlayerModal;