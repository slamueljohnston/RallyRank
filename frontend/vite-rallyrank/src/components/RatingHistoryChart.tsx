import React from 'react';
import { Paper, Text, Group } from '@mantine/core';
import { LineChart, getFilteredChartTooltipPayload } from '@mantine/charts';

interface RatingHistoryChartProps {
  ratings: number[];
  dates: string[];  // Dates for the X-axis (e.g., "Jan 1", "Feb 1", etc.)
}

// Custom Tooltip Component
interface ChartTooltipProps {
  label: string;
  payload: Record<string, any>[] | undefined;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ label, payload }) => {
  if (!payload) return null;

  const filteredPayload = getFilteredChartTooltipPayload(payload);  // Filter the payload for clean display

  return (
    <Paper px="md" py="sm" withBorder shadow="md" radius="md">
      <Text fw={500} mb={5}>{label}</Text>  {/* Display date */}
      {filteredPayload.map((item: any) => (
        <Text key={item.name} fz="sm">  {/* Only display the value */}
          {item.value}
        </Text>
      ))}
    </Paper>
  );
};

const RatingHistoryChart: React.FC<RatingHistoryChartProps> = ({ ratings, dates }) => {
  const data = dates.map((date, index) => ({
    date,
    rating: ratings[index],
  }));

  const minRating = Math.floor(Math.min(...ratings) / 100) * 100;
  const maxRating = Math.ceil(Math.max(...ratings) / 100) * 100;
  const yDomain = [minRating, maxRating];

  return (
    <Paper withBorder p="md" radius="md" style={{ height: 300 }}>
      <Group justify="center" mb="md">
        <Text size="lg">Rating History</Text>
      </Group>
      <LineChart
        h={200}
        data={data}
        dataKey="date"
        withLegend={false}
        series={[{ name: 'rating', color: 'blue.6' }]}
        curveType="natural"
        gridAxis="none"
        yAxisProps={{ domain: yDomain }}
        tooltipProps={{
          content: ({ label, payload }) => <ChartTooltip label={label} payload={payload} />,  // Custom Tooltip
        }}
        tooltipAnimationDuration={200}
      />
    </Paper>
  );
};

export default RatingHistoryChart;