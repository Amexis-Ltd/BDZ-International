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

const JourneyInterruption: React.FC = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [interruptionStation, setInterruptionStation] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInterruptJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber || !interruptionStation || !reason) {
      setError("Моля, въведете номер на билет, гара и причина.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      console.log("Interrupting journey:", { ticketNumber, interruptionStation, reason });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(`Пътуването по билет ${ticketNumber} е успешно прекъснато на гара ${interruptionStation}.`);
      console.log(`--- SIMULATING PRINTING Документ за прекъсване for ticket ${ticketNumber} ---`);
      // In real app: update ticket status, potentially issue partial refund later via reclamation
      setTicketNumber('');
      setInterruptionStation('');
      setReason('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Възникна грешка при прекъсването на пътуването.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Прекъсване на пътуване
      </Typography>
      
      <Box component="form" onSubmit={handleInterruptJourney}>
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
           <TextField
            fullWidth
            label="Гара на прекъсване"
            value={interruptionStation}
            onChange={(e) => setInterruptionStation(e.target.value)}
            required
            variant="outlined"
            size="small"
            disabled={loading}
          />
          <StyledTextarea
            aria-label="reason for interruption"
            placeholder="Причина за прекъсване *"
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
            color="info" // Use info color 
            disabled={loading || !ticketNumber || !interruptionStation || !reason}
          >
            {loading ? 'Обработка...' : 'Прекъсни пътуване'}
          </Button>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default JourneyInterruption; 