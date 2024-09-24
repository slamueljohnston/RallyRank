import axios from 'axios';

// Base URL for the Flask backend
const API_BASE_URL = 'http://127.0.0.1:5000';

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