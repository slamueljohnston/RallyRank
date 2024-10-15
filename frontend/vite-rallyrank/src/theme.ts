import { createTheme } from '@mantine/core';

const theme = createTheme({
  colors: {
    'ag-turqoise': ["#ebfeff", "#d7fbfd", "#aaf8fc", "#7df6fc", "#62f4fb", "#56f2fb", "#4ef2fb", "#41d7e0", "#2fbfc7", "#00a6ad"],
  },
  fontFamily: '"IBM Plex Mono", system-ui',
  headings: { 
    fontFamily: '"IBM Plex Mono", system-ui',
    sizes: {
      h1: { fontSize: '2rem', lineHeight: '1.3' },
      h2: { fontSize: '1.75rem', lineHeight: '1.3' },
      h3: { fontSize: '1.5rem', lineHeight: '1.3' },
      // You can add more size adjustments for mobile here
    },
  },
  defaultRadius: 'md',
  primaryColor: 'ag-turqoise',

  // Add responsive styles for mobile, small screens, etc.
  other: {
    responsiveStyles: {
      base: {
        fontSize: '14px',  // Default for mobile
        padding: '10px',
      },
      sm: {
        fontSize: '16px',  // Adjust for small screens
        padding: '15px',
      },
      md: {
        fontSize: '18px',
        padding: '20px',
      },
      lg: {
        fontSize: '20px',
        padding: '25px',
      },
    },
  },
});

export default theme;