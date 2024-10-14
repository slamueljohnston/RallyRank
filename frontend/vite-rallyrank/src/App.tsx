import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import theme from './theme';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <div style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
        <Router />
      </div>
    </MantineProvider>
  );
}
