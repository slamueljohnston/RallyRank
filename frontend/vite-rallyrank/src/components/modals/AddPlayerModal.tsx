import React from 'react';
import { Modal, TextInput, Button } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

interface AddPlayerFormValues {
  playerName: string;
}

interface AddPlayerModalProps {
  opened: boolean;
  onClose: () => void;
  handleAddPlayer: (playerName: string) => Promise<void>;  // Updated signature
  loading: boolean;
  form: UseFormReturnType<AddPlayerFormValues>;  // Correctly typed form
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ opened, onClose, handleAddPlayer, loading, form }) => (
  <Modal opened={opened} onClose={onClose} title="Add New Player">
    <form
      onSubmit={form.onSubmit(() => handleAddPlayer(form.values.playerName))}  // Pass playerName directly
    >
      <TextInput
        label="Player Name"
        placeholder="Enter player's name"
        {...form.getInputProps('playerName')}
      />
      <Button fullWidth mt="md" type="submit" loading={loading}>
        Add Player
      </Button>
    </form>
  </Modal>
);

export default AddPlayerModal;