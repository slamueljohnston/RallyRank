import React from 'react';
import { Group, Paper, SimpleGrid, Text } from '@mantine/core';
import {
  IconArrowsSort,
  IconTrophy,
  IconChartBar,
  IconArrowUpRight,
  IconArrowDownRight,
} from '@tabler/icons-react';  // Import relevant icons

import { Player } from '../types';  // Import the Player type

interface StatsGridProps {
  rank: number;
  rating: number;
  avgGameScore: string;
  biggestWin: string;
}

const icons = {
  rank: IconArrowsSort,
  rating: IconTrophy,
  avgScore: IconChartBar,
  biggestWin: IconArrowUpRight,
  biggestLoss: IconArrowDownRight,
};

export function StatsGrid({ rank, rating, avgGameScore, biggestWin }: StatsGridProps) {
  const data = [
    { title: 'Rank', icon: 'rank', value: rank.toString() },
    { title: 'Rating', icon: 'rating', value: rating.toString() },
    { title: 'Average Game Score', icon: 'avgScore', value: avgGameScore },
    { title: 'Biggest Win', icon: 'biggestWin', value: biggestWin },
  ];

  const stats = data.map((stat) => {
    const Icon = icons[stat.icon as keyof typeof icons];

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            {stat.title}
          </Text>
          <Icon size="1.4rem" stroke={1.5} />
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text>{stat.value}</Text>
        </Group>
      </Paper>
    );
  });

  return (
    <div>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>
    </div>
  );
}