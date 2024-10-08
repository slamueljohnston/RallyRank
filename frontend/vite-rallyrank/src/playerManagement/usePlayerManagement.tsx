import { useState, useEffect } from 'react';
import { addPlayer, removePlayer, reactivatePlayer, getPlayers, addGameResult, deletePlayer } from '../services/api';
import { showNotification } from '@mantine/notifications';

interface Player {
  id: number;
  name: string;
  rating: number;
  is_active: boolean;
}

export const usePlayerManagement = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [inactivePlayers, setInactivePlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [inactivePlayerId, setInactivePlayerId] = useState<number | null>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      const playersData: Player[] = await getPlayers();
      const activePlayers = playersData.filter((player) => player.is_active);
      const inactive = playersData.filter((player) => !player.is_active);
      setPlayers(activePlayers);
      setInactivePlayers(inactive);
    };
    fetchPlayers();
  }, [refresh]);

  // Handle adding a player
  const handleAddPlayer = async (playerName: string, setAddModalOpened: (value: boolean) => void) => {
    setLoading(true);
    try {
      const response = await addPlayer({ name: playerName });
      if (response?.message === "An inactive player with this name already exists.") {
        setInactivePlayerId(response.player_id);
        showNotification({ message: 'Player already exists but is inactive', color: 'yellow' });
      } else {
        showNotification({ message: 'Player added successfully!', color: 'green' });
        setAddModalOpened(false);
      }
    } catch (error) {
      console.error('Error adding player:', error);
    }
    setLoading(false);
    setRefresh((prev) => !prev);  // Refresh the player list
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
    setRefresh((prev) => !prev);  // Refresh the player list
  };

  // Handle permanently deleting a player and related games
  const handleDeletePlayer = async (playerId: number | undefined, setDeleteModalOpened: (value: boolean) => void) => {
    if (!playerId) return;

    setLoading(true);
    try {
      await deletePlayer(playerId);
      showNotification({ message: 'Player and related games deleted successfully!', color: 'green' });
      setDeleteModalOpened(false);
      setRefresh((prev) => !prev);  // Refresh the player list
    } catch (error) {
      console.error('Error deleting player:', error);
      showNotification({ message: 'Error deleting player', color: 'red' });
    }
    setLoading(false);
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
      setRefresh((prev) => !prev);  // Refresh the player list
    }
  };

  // Handle adding a game result
  const handleAddGameResult = async (gameForm: any, setGameModalOpened: (value: boolean) => void) => {
    const { player1, player2, player1score, player2score } = gameForm.values;
    if (player1 === player2) {
      showNotification({ message: 'A player cannot play against themselves!', color: 'red' });
      return;
    }

    setLoading(true);
    try {
      await addGameResult({
        player1_id: player1,
        player2_id: player2,
        player1_score: player1score,
        player2_score: player2score,
      });
      showNotification({ message: 'Game added successfully!', color: 'green' });
      setGameModalOpened(false);
    } catch (error) {
      console.error('Error adding game result:', error);
      showNotification({ message: 'Error adding game result', color: 'red' });
    }
    setLoading(false);
    setRefresh((prev) => !prev);  // Refresh the game history
  };

  return {
    players,
    inactivePlayers,
    loading,
    handleAddPlayer,
    handleRemovePlayer,
    handleDeletePlayer,
    handleReactivatePlayer,
    handleAddGameResult,
    refresh,
    setRefresh,
  };
};
