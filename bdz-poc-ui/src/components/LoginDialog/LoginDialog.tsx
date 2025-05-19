import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch } from '../../store/hooks';
import { customerLoginSuccess } from '../../store/features/auth/authSlice';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // In a real app, you'd have error handling state too

  const handleLogin = () => {
    // Basic validation (can be expanded)
    if (username.trim() && password.trim()) {
      // Simulate successful login by dispatching the action
      // In a real app, you'd call an API here first
      dispatch(customerLoginSuccess(username));
      handleClose(); // Close dialog on successful login
    } else {
      // Handle validation error (e.g., show a message)
      console.warn('Username and password cannot be empty');
    }
  };

  const handleClose = () => {
    // Reset fields when closing
    setUsername('');
    setPassword('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Вход за касиер</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Моля, въведете потребителско име и парола за достъп до модул Стационарна каса.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="username"
          name="username"
          label="Потребителско име"
          type="text"
          fullWidth
          variant="standard"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          required
          margin="dense"
          id="password"
          name="password"
          label="Парола"
          type="password"
          fullWidth
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отказ</Button>
        <Button type="submit" onClick={handleLogin} variant="contained">Вход</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog; 