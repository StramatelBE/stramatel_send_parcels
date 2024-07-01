import { createTheme } from '@mui/material/styles';

export const clairTheme = createTheme({
  palette: {
    primary: {
      main: '#202020',
      light: '#fe9b19',
    },
    secondary: {
      main: '#fb6a22',
      light: '#c93028',
    },
    background: {
      default: '#E9E9E9',
      paper: '#F5F5F5',
    },
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.54)',
    },
    divider: '#E9E9E9', // Fix the error by assigning a string directly
    error: {
      main: '#EC1C0C',
    },
  },
});
export function switchToClairTheme() {
  document.documentElement.style.setProperty(
    '--primary-main',
    clairTheme.palette.primary.main
  );
  document.documentElement.style.setProperty(
    '--secondary-main',
    clairTheme.palette.secondary.main
  );
  document.documentElement.style.setProperty(
    '--background-default',
    clairTheme.palette.background.default
  );
  document.documentElement.style.setProperty(
    '--text-primary',
    clairTheme.palette.text.primary
  );
}
