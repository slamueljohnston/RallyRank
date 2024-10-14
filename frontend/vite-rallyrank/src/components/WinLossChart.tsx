import React from 'react';
import { Paper, Text, Group } from '@mantine/core';
import { PieChart, PieChartCell } from '@mantine/charts';

interface WinLossChartProps {
  wins: number;
  losses: number;
}

const WinLossChart: React.FC<WinLossChartProps> = ({ wins, losses }) => {
  const data: PieChartCell[] = [
    { name: 'Wins', value: wins, color: 'teal' },
    { name: 'Losses', value: losses, color: 'red' },
  ];

  return (
    <Paper withBorder p="md" radius="md" style={{ height: 300 }}>
      <Group justify="center" mb="md">
        <Text size="lg">Win-Loss Record</Text>
      </Group>
      <PieChart data={data} style={{ height: 200, width: '100%' }} />
      <Group justify='center'>
        <Text>{wins} Wins - {losses} Losses</Text>
      </Group>
    </Paper>
  );
};

export default WinLossChart;
