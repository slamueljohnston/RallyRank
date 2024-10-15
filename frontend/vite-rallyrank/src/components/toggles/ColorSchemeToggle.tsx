import { ActionIcon, Group, useMantineColorScheme, Tooltip } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();  // Toggle between light and dark mode
  const isDark = colorScheme === 'dark';

  return (
    <Tooltip label={isDark ? 'Light Mode' : 'Dark Mode'} position='bottom'>
      <ActionIcon
        variant="outline"
        color={isDark ? 'white' : 'black'}
        onClick={() => toggleColorScheme()}
        size="lg"
      >
        {isDark ? <IconSun size="1.2rem" stroke={1.5}/> : <IconMoonStars size="1.2rem" stroke={1.5}/>}  {/* Sun/Moon icons based on mode */}
      </ActionIcon>
    </Tooltip>
  );
}