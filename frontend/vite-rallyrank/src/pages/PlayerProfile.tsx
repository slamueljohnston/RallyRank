import React from 'react';
import { Avatar, Badge, Title, Text, Group, Stack, CloseButton, SimpleGrid } from '@mantine/core';
import { Player, Game } from '../types';
import { StatsGrid } from '@/components/StatsGrid';
import WinLossChart from '@/components/WinLossChart';
import RatingHistoryChart from '@/components/RatingHistoryChart';
import WinRateChart from '@/components/WinRateChart';
import { calculateWinLossRecord, calculateAverageGameScore, calculateBiggestWinLoss, getRatingHistory } from '@/utils/playerStatsUtils';
import { format } from 'date-fns';
import { getPlayerTitle } from '@/utils/titles';

interface PlayerProfileProps {
  player: Player;
  onBack: () => void;
  players: Player[];
  games: Game[];
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ player, onBack, players, games }) => {
  // Calculate stats using the utility functions
  const { wins, losses } = calculateWinLossRecord(games, player.name);
  const { avgPlayerScore, avgOpponentScore } = calculateAverageGameScore(games, player.name);
  const { biggestWin } = calculateBiggestWinLoss(games, player.name);
  const ratingHistory = getRatingHistory(games, player.name);

  // Calculate the player's actual rank by sorting players based on rating
  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
  const playerRank = sortedPlayers.findIndex((p) => p.id === player.id) + 1;  // Get the player's rank

  // Get the player's actual category badge (Champion, Master, etc.)
  const playerTitle = getPlayerTitle(playerRank, players.length);

  return (
    <Stack gap="lg">
      <Group justify="space-between" wrap='nowrap'>
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
      <WinRateChart player={player} games={games} />
    </Stack>
  );
};

export default PlayerProfile;