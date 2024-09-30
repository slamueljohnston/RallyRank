import axios from 'axios';

let API_BASE_URL;

// Check if the app is running locally or in production
if(window.location.hostname === 'localhost') {
  API_BASE_URL = 'http://localhost:5000'; // Local Flask backend
} else {
  API_BASE_URL = 'https://rallyrank.onrender.com'; //Production backend on Render
}

// Fetch all players
export const getPlayers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/players`);
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
  }
};

// Fetch player rankings
export const getRankings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rankings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

// Fetch player stats
export const getPlayerStats = async (playerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/players/${playerId}/stats`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stats for player ${playerId}:`, error);
  }
};

// Fetch game history
export const getGameHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/games`);
    return response.data;
  } catch (error) {
    console.error('Error fetching game history:', error);
  }
};

// Add new player
export const addPlayer = async (player) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/players`, player);
    return response.data;
  } catch (error) {
    console.error('Error adding player:', error);
  }
};

// Add new game result
export const addGameResult = async (game) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/games`, game);
    return response.data;
  } catch (error) {
    console.error('Error adding game result:', error);
  }
};