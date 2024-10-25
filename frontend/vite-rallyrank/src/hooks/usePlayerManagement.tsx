import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/AuthContext';
import { addPlayer, removePlayer, reactivatePlayer, getPlayers, deletePlayer } from '../services/api';
import { showNotification } from '@mantine/notifications';
import { Player } from '../types';

export const usePlayerManagement = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [inactivePlayers, setInactivePlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [inactivePlayerId, setInactivePlayerId] = useState<number | null>(null);
  const [playersRefresh, setPlayersRefresh] = useState(false);
  const { setAuthenticated } = useContext(AuthContext);

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
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setAuthenticated(false);
        localStorage.removeItem('authenticated');
        showNotification({ message: 'Session expired. Please log in again.', color: 'red' });
      } else {
        console.error('Error adding player:', error);
      }
    } finally {
      setLoading(false);
    }
    setPlayersRefresh((prev) => !prev);
  };  

  // Handle removing a player
  const handleRemovePlayer = async (playerId: number | undefined, setRemoveModalOpened: (value: boolean) => void) => {
    if (!playerId) return;
    setLoading(true);
    try {
      await removePlayer(playerId);
      showNotification({ message: 'Player removed successfully!', color: 'green' });
      setRemoveModalOpened(false);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setAuthenticated(false);
        localStorage.removeItem('authenticated');
        showNotification({ message: 'Session expired. Please log in again.', color: 'red' });
      } else {
        console.error('Error adding player:', error);
      }
    } finally {
      setLoading(false);
    }
    setPlayersRefresh((prev) => !prev);
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
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setAuthenticated(false);
        localStorage.removeItem('authenticated');
        showNotification({ message: 'Session expired. Please log in again.', color: 'red' });
      } else {
        console.error('Error adding player:', error);
      }
    } finally {
      setLoading(false);
    }
    setPlayersRefresh((prev) => !prev);
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
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          setAuthenticated(false);
          localStorage.removeItem('authenticated');
          showNotification({ message: 'Session expired. Please log in again.', color: 'red' });
        } else {
          console.error('Error adding player:', error);
        }
      } finally {
        setLoading(false);
      }
      setPlayersRefresh((prev) => !prev);
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
