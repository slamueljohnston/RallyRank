import { ActionIcon, Group, useMantineColorScheme, HoverCard } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';

export function GitHubLink() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

  return (
    <HoverCard shadow='md' openDelay={500}>
      <HoverCard.Target>
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
      </HoverCard.Target>
      <HoverCard.Dropdown>
        Source Code
      </HoverCard.Dropdown>
    </HoverCard>
  );
}