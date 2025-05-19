import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const TicketConfirmation: React.FC = () => {
  const [ticketNumber, setTicketNumber] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleConfirmTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate input
      if (!ticketNumber) {
        throw new Error("Моля, въведете номер на билет.");
      }
      
      // Simulate API call
      console.log("Confirming ticket:", { ticketNumber });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(`Билет ${ticketNumber} е успешно заверен.`);
      setTicketNumber('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Възникна грешка при заверяването на билета.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Заверяване на билет
      </Typography>
      
      <Box component="form" onSubmit={handleConfirmTicket}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Номер на билет"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            required
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Display messages */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Action Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !ticketNumber}
          >
            {loading ? 'Обработка...' : 'Заверяване на билет'}
          </Button>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default TicketConfirmation; 