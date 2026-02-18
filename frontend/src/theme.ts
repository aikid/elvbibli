import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2C1810',
      light: '#4A2F23',
      dark: '#1A0F0A',
    },
    secondary: {
      main: '#C17C4C',
      light: '#D4956F',
      dark: '#A66438',
    },
    background: {
      default: '#F5F1EC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C1810',
      secondary: '#6B5F55',
    },
  },
  typography: {
    fontFamily: '"Crimson Text", "Playfair Display", Georgia, serif',
    h1: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
      fontSize: '2.5rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
      fontSize: '1.8rem',
    },
    h4: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
      fontSize: '1.4rem',
    },
    body1: {
      fontFamily: '"Crimson Text", Georgia, serif',
      fontSize: '1.1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: '"Crimson Text", Georgia, serif',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 2,
  },
});
