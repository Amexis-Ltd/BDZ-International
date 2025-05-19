import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

// Use the same simulated data structure
interface GroupReservation {
  id: string;
  leaderName: string;
  groupType: string;
  totalPassengers: number;
  route: string;
  departureDateTime: string;
  finalPrice: number;
  status: 'Потвърдена' | 'Платена' | 'Издаден билет' | 'Анулирана';
}

// Simulate fetching reservation data (adapt for cancellation context)
const findCancellableReservation = async (reservationId: string): Promise<GroupReservation | null> => {
  console.log(`Simulating search for cancellable reservation ID: ${reservationId}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  // For PoC: Simulate different statuses based on ID pattern or just return one type
  if (reservationId.trim() === '') return null;

  const upperId = reservationId.toUpperCase();
  let status: GroupReservation['status'] = 'Потвърдена'; // Default to cancellable
  
  // Example logic: If ID ends with 'ISSUED', simulate an issued ticket
  if (upperId.endsWith('ISSUED')) {
      status = 'Издаден билет'; 
  } else if (upperId.endsWith('CANCELLED')) {
      status = 'Анулирана';
  } else if (upperId.endsWith('PAID')) {
      status = 'Платена';
  }

  return {
    id: upperId,
    leaderName: 'Водач за Анулация',
    groupType: 'Други',
    totalPassengers: 12,
    route: 'Пловдив - Бургас',
    departureDateTime: '2024-10-01T10:30:00',
    finalPrice: 280.00,
    status: status,
  };
};

const CancelGroupReservation: React.FC = () => {
  const [reservationId, setReservationId] = useState('');
  const [foundReservation, setFoundReservation] = useState<GroupReservation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const isCancellationAllowed = foundReservation && 
                                foundReservation.status !== 'Анулирана';
                                // Add more complex logic based on time-to-departure if needed for PoC

  const handleSearch = async () => {
    setError(null);
    setSuccessMessage(null);
    setFoundReservation(null);
    setIsCancelled(false);
    setCancellationReason('');
    if (!reservationId) {
      setError('Моля, въведете номер на резервация.');
      return;
    }
    setIsLoading(true);
    try {
      const reservation = await findCancellableReservation(reservationId);
      if (reservation) {
        setFoundReservation(reservation);
        if (reservation.status === 'Анулирана') {
            setError('Тази резервация вече е анулирана.');
            setIsCancelled(true);
        }
        // Optionally add checks for time if cancellation is time-sensitive
      } else {
        setError('Резервация с този номер не е намерена.');
      }
    } catch (err) {
      setError('Грешка при търсене на резервация.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirmDialog = () => {
    if (!cancellationReason) {
        setError('Моля, въведете причина за анулиране.');
        return;
    }
    setError(null);
    setConfirmDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (!foundReservation || !isCancellationAllowed) return;

    setConfirmDialogOpen(false);
    setError(null);
    setSuccessMessage(null);

    // Simulate Cancellation
    console.log('--- SIMULATING GROUP RESERVATION/TICKET CANCELLATION ---');
    console.log('Cancelling Reservation ID:', foundReservation.id);
    console.log('Reason:', cancellationReason);
    if (foundReservation.status === 'Потвърдена' || foundReservation.status === 'Платена' || foundReservation.status === 'Издаден билет') {
        console.log('Simulating releasing blocked seats...');
    }
    if (foundReservation.status === 'Платена' || foundReservation.status === 'Издаден билет') {
        console.log('Simulating initiating refund process...');
    }
    console.log('Simulating generating cancellation document...');
    console.log('--- END SIMULATION ---');

    // Update state
    setFoundReservation(prev => prev ? { ...prev, status: 'Анулирана' } : null);
    setIsCancelled(true);
    setSuccessMessage(`Резервация ${foundReservation.id} е анулирана успешно.`);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Анулиране на групова резервация/билет</Typography>
      
      {error && !successMessage && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ width: { xs: '100%', sm: '70%' } }}>
          <TextField 
            label="Номер на резервация/билет" 
            value={reservationId} 
            onChange={(e) => setReservationId(e.target.value)} 
            fullWidth 
            disabled={isLoading}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: '30%' } }}>
          <Button 
            variant="contained" 
            onClick={handleSearch} 
            disabled={isLoading || !reservationId}
            fullWidth
          >
            {isLoading ? <CircularProgress size={24} /> : 'Търсене'}
          </Button>
        </Box>
      </Stack>

      {foundReservation && (
        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Детайли за резервация: {foundReservation.id}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography><b>Водач:</b> {foundReservation.leaderName}</Typography>
            <Typography><b>Маршрут:</b> {foundReservation.route}</Typography>
            <Typography><b>Тръгване:</b> {new Date(foundReservation.departureDateTime).toLocaleString('bg-BG')}</Typography>
            <Typography><b>Статус:</b> {foundReservation.status}</Typography>
            
            {isCancellationAllowed && !isCancelled && (
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Причина за анулиране *"
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        fullWidth
                        required
                        multiline
                        rows={2}
                        sx={{ mb: 1 }}
                    />
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={openConfirmDialog} 
                        disabled={!cancellationReason} // Disable if no reason
                    >
                        Анулирай резервацията
                    </Button>
                </Box>
            )}
             {!isCancellationAllowed && foundReservation.status !== 'Анулирана' && (
                 <Alert severity="warning" sx={{ mt: 2 }}>Анулирането не е възможно за този статус или период.</Alert>
             )}
        </Paper>
      )}
      
      {/* Confirmation Dialog */}
       <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Потвърждение за анулиране"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Сигурни ли сте, че искате да анулирате резервация {foundReservation?.id}?
            Причина: {cancellationReason}
            Това действие е необратимо.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Отказ</Button>
          <Button onClick={handleCancelConfirm} color="error" autoFocus>
            Потвърди анулиране
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default CancelGroupReservation; 