import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';

const SignUpPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Basic validation
    if (!username.trim() || !password.trim()) {
        console.warn('Username and password are required.');
        // Add user feedback
        return;
    }
    if (password !== confirmPassword) {
      console.warn('Passwords do not match.');
      // Add user feedback
      return;
    }

    // Simulate successful sign-up for PoC
    console.log('Simulating Sign Up for user:', username);
    // In a real app: call API, handle response, maybe auto-login

    // Navigate to home page after "successful" sign up
    navigate('/');
    // Optionally show a success message (e.g., using a Snackbar)
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          marginTop: theme.spacing(8), 
          padding: theme.spacing(4),
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Typography 
          component="h1" 
          variant="h5" 
          color="text.primary"
          sx={{ mb: theme.spacing(3) }}
        >
          Регистрация
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleSignUp} 
          noValidate 
          sx={{ width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Потребителско име"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputLabelProps={{ required: true }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Парола"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ required: true }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Потвърди парола"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={password !== confirmPassword && confirmPassword !== ''}
            helperText={password !== confirmPassword && confirmPassword !== '' ? 'Паролите не съвпадат' : ''}
            InputLabelProps={{ required: true }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ 
              mt: theme.spacing(3), 
              mb: theme.spacing(2),
              py: theme.spacing(1.5),
              textTransform: 'uppercase'
            }}
          >
            Регистрация
          </Button>
          <Box sx={{ textAlign: 'center', mt: theme.spacing(1) }}>
            <Link 
              component={RouterLink} 
              to="/login" 
              variant="body2" 
              color="primary"
            >
              Вече имате акаунт? Вход
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUpPage; 