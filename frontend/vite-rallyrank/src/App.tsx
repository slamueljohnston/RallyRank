import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import theme from './theme';
import { AuthProvider } from './AuthContext';
import { HomePage } from './pages/HomePage';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <div style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
          <HomePage />
        </div>
      </AuthProvider>
    </MantineProvider>
  );
}