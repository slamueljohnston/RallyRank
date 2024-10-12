import { ActionIcon, Group, useMantineColorScheme, HoverCard } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();  // Toggle between light and dark mode
  const isDark = colorScheme === 'dark';

  return (
    <HoverCard shadow='md' openDelay={500}>
      <HoverCard.Target>
        <ActionIcon
          variant="outline"
          color={isDark ? 'white' : 'black'}
          onClick={() => toggleColorScheme()}
          size="lg"
        >
          {isDark ? <IconSun size="1.2rem" stroke={1.5}/> : <IconMoonStars size="1.2rem" stroke={1.5}/>}  {/* Sun/Moon icons based on mode */}
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}