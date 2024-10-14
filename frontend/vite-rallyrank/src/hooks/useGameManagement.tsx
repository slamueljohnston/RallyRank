import { useState, useEffect } from 'react';
import { getGameHistory, addGameResult, editGame, deleteGame } from '../services/api';
import { showNotification } from '@mantine/notifications';
import { Game } from '../types';

export const useGameManagement = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const gamesData = await getGameHistory();
        setGames(gamesData);
      } catch (error) {
        console.error('Error fetching game history:', error);
        showNotification({ message: 'Failed to fetch game history', color: 'red' });
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [refresh]);

  // Handle adding a game result
  const handleAddGameResult = async (gameForm: any, setGameModalOpened: (value: boolean) => void, resetForm: () => void) => {
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
      resetForm();
      setRefresh((prev) => !prev);  // Trigger refresh after adding game
    } catch (error) {
      console.error('Error adding game result:', error);
      showNotification({ message: 'Error adding game result', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a game result
  const handleEditGame = async (gameId: number, updatedGame: any) => {
    setLoading(true);
    try {
      await editGame(gameId, updatedGame);
      showNotification({ message: 'Game updated successfully!', color: 'green' });
      setRefresh((prev) => !prev);  // Trigger refresh after editing game
    } catch (error) {
      console.error('Error updating game result:', error);
      showNotification({ message: 'Error updating game result', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a game
  const handleDeleteGame = async (gameId: number) => {
    setLoading(true);
    try {
      await deleteGame(gameId);
      showNotification({ message: 'Game deleted successfully!', color: 'green' });
      setRefresh((prev) => !prev);  // Trigger refresh after deleting game
    } catch (error) {
      console.error('Error deleting game:', error);
      showNotification({ message: 'Error deleting game', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return {
    games,
    loading,
    handleAddGameResult,
    handleEditGame,
    handleDeleteGame,
    refresh,
    setRefresh,
  };
};