import React from 'react';
import { Avatar, Badge, Title, Text, Group, Stack, CloseButton, SimpleGrid } from '@mantine/core';
import { Player, Game } from '../types';
import { StatsGrid } from '@/components/StatsGrid';
import WinLossChart from '@/components/WinLossChart';
import RatingHistoryChart from '@/components/RatingHistoryChart';
import { calculateWinLossRecord, calculateAverageGameScore, calculateBiggestWinLoss, getRatingHistory } from '@/utils/playerStatsUtils';
import { format } from 'date-fns';
import { getPlayerTitle } from '@/utils/titles';

interface PlayerProfileProps {
  player: Player;
  rank: number;
  onBack: () => void;
  players: Player[];  // Pass all players to calculate the rank dynamically
  games: Game[];  // Pass the full list of games
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ player, rank, onBack, players, games }) => {
  // Calculate stats using the utility functions
  const { wins, losses } = calculateWinLossRecord(games, player.name);
  const { avgPlayerScore, avgOpponentScore } = calculateAverageGameScore(games, player.name);
  const { biggestWin } = calculateBiggestWinLoss(games, player.name);
  const ratingHistory = getRatingHistory(games, player.name);

  console.log("Player Profile for:");
  console.log(player.name);
  console.log(biggestWin?.playerScore);
  console.log(biggestWin?.opponent);
  console.log(biggestWin?.opponentScore);

  // Calculate the player's actual rank by sorting players based on rating
  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
  const playerRank = sortedPlayers.findIndex((p) => p.id === player.id) + 1;  // Get the player's rank

  // Get the player's actual category badge (Champion, Master, etc.)
  const playerTitle = getPlayerTitle(playerRank, players.length);

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Group>
          <Avatar color="blue" size="lg">{player.name.charAt(0)}</Avatar>
          <Title>{player.name}</Title>
          {playerTitle}
        </Group>
        <CloseButton size="xl" onClick={onBack}></CloseButton>
      </Group>

      <StatsGrid
        rank={playerRank}  // Display the player's actual rank
        rating={player.rating}
        avgGameScore={`${avgPlayerScore.toFixed(0)} - ${avgOpponentScore.toFixed(0)}`}
        biggestWin={biggestWin ? `${biggestWin.playerScore}-${biggestWin.opponentScore} vs ${biggestWin.opponent}` : 'N/A'}
      />

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <WinLossChart wins={wins} losses={losses} />
        <RatingHistoryChart
          ratings={ratingHistory.map(({ rating }) => rating)}
          dates={ratingHistory.map(({ date }) => format(new Date(date), 'MMM d'))}
        />
      </SimpleGrid>

      {/* TODO: Add game history table */}
    </Stack>
  );
};

export default PlayerProfile;