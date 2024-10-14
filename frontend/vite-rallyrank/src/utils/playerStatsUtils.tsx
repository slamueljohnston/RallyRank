import { Game } from '../types';

interface BiggestWin {
    diff: number;
    playerScore: number;
    opponentScore: number;
    opponent: string;
  }

// Filter games for the selected player
const filterGamesForPlayer = (games: Game[], playerName: string) => {
  return games.filter(
    (game) => game.player1_name === playerName || game.player2_name === playerName
  );
};

// Calculate win-loss record using player names
export const calculateWinLossRecord = (games: Game[], playerName: string) => {
  const filteredGames = filterGamesForPlayer(games, playerName);  // Filter games for this player
  const wins = filteredGames.filter(
    (game) => (game.player1_name === playerName && game.result === 'player1win') ||
              (game.player2_name === playerName && game.result === 'player2win')
  ).length;
  const losses = filteredGames.length - wins;

  return { wins, losses };
};

// Calculate average game score for the player and their opponent
export const calculateAverageGameScore = (games: Game[], playerName: string) => {
  const filteredGames = filterGamesForPlayer(games, playerName);  // Filter games for this player
  let totalPlayerScore = 0;
  let totalOpponentScore = 0;

  filteredGames.forEach((game) => {
    if (game.player1_name === playerName) {
      totalPlayerScore += game.player1_score;
      totalOpponentScore += game.player2_score;
    } else if (game.player2_name === playerName) {
      totalPlayerScore += game.player2_score;
      totalOpponentScore += game.player1_score;
    }
  });

  const avgPlayerScore = filteredGames.length > 0 ? totalPlayerScore / filteredGames.length : 0;
  const avgOpponentScore = filteredGames.length > 0 ? totalOpponentScore / filteredGames.length : 0;

  return { avgPlayerScore, avgOpponentScore };
};

// Extract rating history using prior ratings and rating changes
export const getRatingHistory = (games: Game[], playerName: string) => {
    const filteredGames = filterGamesForPlayer(games, playerName);
  
    const ratingHistory = filteredGames.map((game) => {
      const priorRating = game.player1_name === playerName ? game.prior_rating_player1 : game.prior_rating_player2;
      const ratingChange = game.player1_name === playerName ? game.rating_change_player1 : game.rating_change_player2;
  
      return {
        date: game.timestamp,
        rating: priorRating + ratingChange,  // Calculate the rating after the change
      };
    });
  
    // Return rating history sorted by date in ascending order (earliest first)
    return ratingHistory.reverse();  // Reverse the order so earliest dates are on the left
  };

// Get game history for a player using player names
export const getPlayerGameHistory = (games: Game[], playerName: string) => {
  return filterGamesForPlayer(games, playerName);  // Return only the games where the player participated
};

// Calculate biggest win based on point difference
export const calculateBiggestWinLoss = (games: Game[], playerName: string): { biggestWin: BiggestWin | null } => {
    const playerGames = getPlayerGameHistory(games, playerName);
    console.log("Player games for:", playerName);
    console.log(playerGames);

    let biggestWin: BiggestWin | null = null;

    console.log("Calculating Biggest Win for:");
    console.log(playerName);
    
    playerGames.forEach((game) => {

      console.log("Current Biggest Win:");
      console.log(biggestWin);

      const playerScore = game.player1_name === playerName ? game.player1_score : game.player2_score;
      const opponentScore = game.player1_name === playerName ? game.player2_score : game.player1_score;
      const pointDiff = playerScore - opponentScore;
  
      if (pointDiff > 0 && (!biggestWin || pointDiff > biggestWin.diff)) {
        biggestWin = {
          diff: pointDiff,
          playerScore,
          opponentScore,
          opponent: game.player1_name === playerName ? game.player2_name : game.player1_name,
        };
      }
    });
  
    console.log("Returning:")
    console.log(biggestWin);
    return { biggestWin };
  };
  