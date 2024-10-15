import { ActionIcon, Group, useMantineColorScheme, Tooltip } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';

export function GitHubLink() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

  return (
    <Tooltip label='Source Code' position='bottom'>
      <a
      href="https://github.com/slamueljohnston/RallyRank"
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
      >
      <ActionIcon
        variant="outline"
        color={isDark ? 'white' : 'black'}
        size="lg"
      > 
      <IconBrandGithub size="1.2rem" stroke={1.5}/>
      </ActionIcon>
      </a>   
    </Tooltip>
  );
}