import axios from 'axios';

// Determine base URL dynamically
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'  // Use local backend for development
  : 'https://rallyrank.onrender.com';  // Use production backend when deployed

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Fetch Rankings
export const getRankings = async () => {
    try {
      const response = await api.get('/rankings');
      return response.data;
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

// Fetch Players
export const getPlayers = async () => {
    try {
        const response = await api.get('/players');
        return response.data;
    } catch (error) {
        console.error('Error fetching players:', error);
    }
};

// Fetch Game History
export const getGameHistory = async () => {
    try {
        const response = await api.get('/games');
        console.log('Retrieving Games: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching games:', error);
    }
};

// Add a new player
export const addPlayer = async (player: { name: string }) => {
    try {
        const response = await api.post('/players', player);
        return response.data;
    } catch (error) {
        console.error('Error adding player:', error)
    }
};

// Remove a player by ID
export const removePlayer = async (playerId: number) => {
    try {
      const response = await api.delete(`/players/${playerId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing player:', error);
    }
  }

  // Reactivate a previously removed player
  export const reactivatePlayer = async (playerId: number) => {
    try {
      const response = await api.post(`/players/reactivate/${playerId}`);
      return response.data;
    } catch (error) {
      console.error('Error reactivating player:', error)
    }
  }

  // Permanently delete a player and all related games
  export const deletePlayer = async (playerId: number) => {
    try {
      const response = await api.delete(`/players/${playerId}/delete`);
      return response.data;
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  // Adds a game result
  export const addGameResult = async (gameData: { player1_id: string; player2_id: string; player1_score: number; player2_score: number }) => {
    try {
      const response = await api.post('/games', gameData);
      return response.data;
    } catch (error) {
      console.error('Error adding game:', error);
    }
  }

  // Delete a game by ID
  export const deleteGame = async (gameId: number) => {
    try {
      const response = await api.delete(`/games/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  // Edit a game by ID
  export const editGame = async (gameId: number, updatedData: {player1_score: number; player2_score: number}) => {
    try {
      const response = await api.put(`/games/${gameId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error editing game:', error);
    }
  };