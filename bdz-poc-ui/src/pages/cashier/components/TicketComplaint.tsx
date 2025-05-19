import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Use a similar StyledPaper as in PurchasePage
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

interface ComplaintDetails {
  reclamationId: string;
  ticketNumber: string;
  refundAmount: number;
  penalty: number;
  finalAmount: number;
}

const TicketComplaint: React.FC = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [complaintDetails, setComplaintDetails] = useState<ComplaintDetails | null>(null);

  const handleSearchComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber) {
      setError("Моля, въведете номер на билет.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    setComplaintDetails(null);

    try {
      // Simulate API call to find approved complaint
      console.log("Searching for complaint for ticket:", ticketNumber);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate finding an approved complaint - ALWAYS succeed for PoC
      setComplaintDetails({
          reclamationId: `R-${Math.random().toString(16).substring(2, 6).toUpperCase()}`, // Generate random ID
          ticketNumber: ticketNumber, // Use the entered ticket number
          refundAmount: 8.00,       // Keep example amounts
          penalty: 0.00, 
          finalAmount: 8.00, 
      });
      
    } catch (err: any) {
      // This catch block might not be reached now, but keep for safety
      console.error(err);
      setError(err.message || 'Грешка при търсене на рекламация.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayout = async () => {
    if (!complaintDetails) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
        console.log("Processing complaint payout:", complaintDetails);
        await new Promise(resolve => setTimeout(resolve, 1000));

        setSuccess(`Рекламация ${complaintDetails.reclamationId} за билет ${complaintDetails.ticketNumber} е изплатена (${complaintDetails.finalAmount.toFixed(2)} лв.).`);
        console.log(`--- SIMULATING PRINTING РАЗПИСКА (Payout Receipt) for ${complaintDetails.finalAmount.toFixed(2)} лв. ---`);
        // In real app: Mark complaint as paid, record transaction
        setComplaintDetails(null); // Clear details after payout
        setTicketNumber('');
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'Грешка при изплащане на рекламация.');
    }
    finally {
        setLoading(false);
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Рекламация по билет (Изплащане)
      </Typography>
      
      {!complaintDetails ? (
        <Box component="form" onSubmit={handleSearchComplaint}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Номер на билет за рекламация"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              required
              variant="outlined"
              size="small"
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !ticketNumber}
              sx={{ height: '40px' }}
            >
              {loading ? 'Търсене...' : 'Търси'}
            </Button>
          </Box>
          {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
        </Box>
      ) : (
        <Box>
          <Typography variant="subtitle1" gutterBottom>Одобрена рекламация:</Typography>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography>Рекламация №: <strong>{complaintDetails.reclamationId}</strong></Typography>
              <Typography>Билет №: <strong>{complaintDetails.ticketNumber}</strong></Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>Сума за изплащане: <strong>{complaintDetails.finalAmount.toFixed(2)} лв.</strong></Typography>
          </Paper>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
             <Button 
                variant="outlined" 
                onClick={() => { setComplaintDetails(null); setTicketNumber(''); setError(null); setSuccess(null); }} 
                disabled={loading}
             >
                Ново търсене
             </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handlePayout}
              disabled={loading}
            >
              {loading ? 'Изплащане...' : 'Изплати'}
            </Button>
          </Box>
        </Box>
      )}
    </StyledPaper>
  );
};

export default TicketComplaint; 