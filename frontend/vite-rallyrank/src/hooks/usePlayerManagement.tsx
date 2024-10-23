import { useState, useEffect } from 'react';
import { addPlayer, removePlayer, reactivatePlayer, getPlayers, deletePlayer } from '../services/api';
import { showNotification } from '@mantine/notifications';
import { Player } from '../types';

export const usePlayerManagement = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [inactivePlayers, setInactivePlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [inactivePlayerId, setInactivePlayerId] = useState<number | null>(null);
  const [playersRefresh, setPlayersRefresh] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      const playersData: Player[] = await getPlayers();
      const activePlayers = playersData.filter((player) => player.is_active);
      const inactive = playersData.filter((player) => !player.is_active);
      setPlayers(activePlayers);
      setInactivePlayers(inactive);
    };
    fetchPlayers();
  }, [playersRefresh]);

  // Handle adding a player
  const handleAddPlayer = async (
    playerName: string,
     setAddModalOpened: (value: boolean) => void,
     resetForm: () => void
     ) => {
    setLoading(true);
    try {
      const response = await addPlayer({ name: playerName });
      if (response?.message === "An inactive player with this name already exists.") {
        setInactivePlayerId(response.player_id);
        showNotification({ message: 'Player already exists but is inactive', color: 'yellow' });
      } else {
        showNotification({ message: 'Player added successfully!', color: 'green' });
        setAddModalOpened(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding player:', error);
    }
    setLoading(false);
    setPlayersRefresh((prev) => !prev);  // Refresh the player list
  };  

  // Handle removing a player
  const handleRemovePlayer = async (playerId: number | undefined, setRemoveModalOpened: (value: boolean) => void) => {
    if (!playerId) return;
    setLoading(true);
    try {
      await removePlayer(playerId);
      showNotification({ message: 'Player removed successfully!', color: 'green' });
      setRemoveModalOpened(false);
    } catch (error) {
      console.error('Error removing player:', error);
    }
    setLoading(false);
    setPlayersRefresh((prev) => !prev);  // Refresh the player list
  };

  // Handle permanently deleting a player and related games
  const handleDeletePlayer = async (playerId: number | undefined, setDeleteModalOpened: (value: boolean) => void) => {
    if (!playerId) return;

    setLoading(true);
    try {
      await deletePlayer(playerId);
      showNotification({ message: 'Player and related games deleted successfully!', color: 'green' });
      setDeleteModalOpened(false);
      setPlayersRefresh((prev) => !prev);  // Refresh the player list
    } catch (error) {
      console.error('Error deleting player:', error);
      showNotification({ message: 'Error deleting player', color: 'red' });
    }
    setLoading(false);
    setPlayersRefresh((prev) => !prev);  // Refresh the player list
  };

  // Handle reactivating a player
  const handleReactivatePlayer = async (playerId: number | undefined, setReactivateModalOpened: (value: boolean) => void) => {
    console.log('Attempting to reactivate player:', playerId);  // Debug log
    if (playerId) {
      setLoading(true);
      try {
        await reactivatePlayer(playerId);  // Ensure correct API call
        showNotification({ message: 'Player reactivated successfully!', color: 'green' });
        setInactivePlayerId(null);  // Reset after reactivation
        setReactivateModalOpened(false);
      } catch (error) {
        console.error('Error reactivating player:', error);
        showNotification({ message: 'Error reactivating player', color: 'red' });
      }
      setLoading(false);
      setPlayersRefresh((prev) => !prev);  // Refresh the player list
    }
  };

  return {
    players,
    inactivePlayers,
    loading,
    handleAddPlayer,
    handleRemovePlayer,
    handleDeletePlayer,
    handleReactivatePlayer,
    playersRefresh,
    setPlayersRefresh,
  };
};
