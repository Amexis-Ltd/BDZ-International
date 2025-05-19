import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance based on BDZ website colors.
const theme = createTheme({
  palette: {
    primary: {
      main: '#006837', // BDZ Green
    },
    secondary: {
      main: '#333333', // BDZ Dark Grey (from footer)
    },
    error: {
      main: red.A400, // Keep MUI default red for errors
    },
    background: {
      default: '#ffffff', // White background
      paper: '#ffffff',   // White for paper elements
    },
    text: {
      primary: '#333333', // Dark grey for primary text
      // secondary: 'rgba(0, 0, 0, 0.6)', // Default secondary text color
    }
  },
  typography: {
    // You can further customize fonts if needed
    // fontFamily: 'Arial, sans-serif', // Example: Match site font if known
  },
  // You can add component overrides here if needed
});

export default theme; 