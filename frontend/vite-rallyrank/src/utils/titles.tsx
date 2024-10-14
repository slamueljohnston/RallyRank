import { Badge } from '@mantine/core';

export function getPlayerTitle(rank: number, totalPlayers: number) {
  const percentage = (rank / totalPlayers) * 100;

  if (rank === 1) {
    return <Badge color="yellow">Champion</Badge>;
  } else if (percentage <= 20) {
    return <Badge color="orange">Legend</Badge>;
  } else if (percentage <= 40) {
    return <Badge color="blue">Master</Badge>;
  } else if (percentage <= 60) {
    return <Badge color="green">Pro</Badge>;
  } else {
    return <Badge color="gray">Novice</Badge>;
  }
}