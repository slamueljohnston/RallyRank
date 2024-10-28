import React from 'react';
import { BarChart } from '@mantine/charts';
import { Game, Player } from '../types';
import { Paper, Group, Text } from '@mantine/core';

interface WinRateChartProps {
  player: Player;
  games: Game[];
}

interface ChartData {
  opponent: string;
  winRate: number;
  totalGames: number;
}

// Custom Tooltip Component
interface ChartTooltipProps {
  label: string;
  payload: Record<string, any>[] | undefined;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ label, payload }) => {
  if (!payload) return null;

  return (
    <Paper px="md" py="sm" withBorder shadow="md" radius="md">
      <Text fw={500} mb={5}>{label}</Text>  {/* Display opponent name */}
      {payload.map((item: any) => (
        <Text key={item.name} fz="sm">  {/* Only display the value */}
          {item.value.toFixed(0)}%
        </Text>
      ))}
    </Paper>
  );
};

const WinRateChart: React.FC<WinRateChartProps> = ({ player, games }) => {
  // Calculate the win rates against each opponent
  const opponentStats: { [opponent: string]: { wins: number; losses: number } } = {};

  games.forEach((game) => {
    if (game.player1_name === player.name || game.player2_name === player.name) {
      const opponent = game.player1_name === player.name ? game.player2_name : game.player1_name;
      const didWin = (game.player1_name === player.name && game.player1_score > game.player2_score) ||
                     (game.player2_name === player.name && game.player2_score > game.player1_score);

      if (!opponentStats[opponent]) {
        opponentStats[opponent] = { wins: 0, losses: 0 };
      }

      if (didWin) {
        opponentStats[opponent].wins += 1;
      } else {
        opponentStats[opponent].losses += 1;
      }
    }
  });

  console.log('Opponent Stats:', opponentStats);

  // Prepare data for the bar chart
  const data: ChartData[] = Object.entries(opponentStats)
    .map(([opponent, stats]) => {
      const totalGames = stats.wins + stats.losses;
      const winRate = (stats.wins / totalGames) * 100;
      return { opponent, winRate, totalGames };
    })
    .sort((a, b) => b.totalGames - a.totalGames); // Sort by total games played

  console.log('Chart Data:', data);

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="center" mb="md">
        <Text size="lg">Win Rate by Opponent</Text>
      </Group>
      <BarChart
        h={300}
        data={data}
        dataKey="opponent"
        series={[
          {
            name: 'winRate',
          },
        ]}
        tickLine="y"
        tooltipProps={{
          content: ({ label, payload }) => <ChartTooltip label={label} payload={payload} />,  // Custom Tooltip
        }}
      />
    </Paper>
  );
};

export default WinRateChart;