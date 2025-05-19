import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  TextareaAutosize,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  fontFamily: theme.typography.fontFamily,
  fontSize: '0.875rem',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  borderColor: theme.palette.divider,
  resize: 'vertical',
  minRows: 3,
}));

const TicketReturn: React.FC = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleReturnTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber || !reason) {
      setError("Моля, въведете номер на билет и причина.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      console.log("Returning ticket:", { ticketNumber, reason });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const penalty = 1.50; // Simulate penalty calculation
      const returnedAmount = 10.00 - penalty; // Simulate original price and calculation
      
      setSuccess(`Билет ${ticketNumber} е приет за връщане. Неустойка: ${penalty.toFixed(2)} лв. Сума за връщане: ${returnedAmount.toFixed(2)} лв.`);
      console.log(`--- SIMULATING PRINTING СТОРНО (Return) for ticket ${ticketNumber} ---`);
      console.log(`--- SIMULATING PRINTING НЕУСТОЙКА (Penalty) ${penalty.toFixed(2)} лв. ---`);
      // In real app: return funds (minus penalty), update ticket status
      setTicketNumber('');
      setReason('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Възникна грешка при връщането на билета.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Връщане на билет
      </Typography>
      
      <Box component="form" onSubmit={handleReturnTicket}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Номер на билет"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            required
            variant="outlined"
            size="small"
            disabled={loading}
          />
          <StyledTextarea
            aria-label="reason for return"
            placeholder="Причина за връщане *"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            disabled={loading}
          />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="warning" // Use warning color for return
            disabled={loading || !ticketNumber || !reason}
          >
            {loading ? 'Обработка...' : 'Върни билет'}
          </Button>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default TicketReturn; 