import React from 'react';
import { Modal, Select, TextInput, Button } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

interface GameFormValues {
    player1: string;
    player2: string;
    player1score: number;
    player2score: number;
  }

interface AddGameResultModalProps {
  opened: boolean;
  onClose: () => void;
  handleAddGameResult: () => Promise<void>;
  loading: boolean;
  form: UseFormReturnType<GameFormValues>;
  players: { value: string; label: string }[];
}

const AddGameResultModal: React.FC<AddGameResultModalProps> = ({ opened, onClose, handleAddGameResult, loading, form, players }) => (
  <Modal opened={opened} onClose={onClose} title="Add Game Result">
    <form onSubmit={form.onSubmit(handleAddGameResult)}>
      <Select
        label="Player 1"
        placeholder="Select player 1"
        data={players}
        {...form.getInputProps('player1')}
      />
      <TextInput
        label="Player 1 Score"
        placeholder="Enter player 1's score"
        type="number"
        {...form.getInputProps('player1score')}
      />
      <Select
        label="Player 2"
        placeholder="Select player 2"
        data={players}
        {...form.getInputProps('player2')}
      />
      <TextInput
        label="Player 2 Score"
        placeholder="Enter player 2's score"
        type="number"
        {...form.getInputProps('player2score')}
      />
      <Button fullWidth mt="md" type="submit" loading={loading}>
        Submit Game Result
      </Button>
    </form>
  </Modal>
);

export default AddGameResultModal;
