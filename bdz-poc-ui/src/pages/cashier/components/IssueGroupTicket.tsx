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
  Paper
} from '@mui/material';

// Simulated data structure for a found reservation
interface GroupReservation {
  id: string;
  leaderName: string;
  groupType: string;
  totalPassengers: number;
  route: string;
  departureDateTime: string;
  finalPrice: number;
  status: 'Потвърдена' | 'Платена' | 'Издаден билет' | 'Анулирана'; // Add other relevant statuses
}

// Simulate fetching reservation data (replace with actual API call in real app)
const findReservation = async (reservationId: string): Promise<GroupReservation | null> => {
  console.log(`Simulating search for reservation ID: ${reservationId}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  // For PoC: Always find a valid, paid reservation if ID is not empty
  if (reservationId.trim() !== '') {
    return {
      id: reservationId.toUpperCase(),
      leaderName: 'Тестова Група Водач',
      groupType: 'Учащи',
      totalPassengers: 15,
      route: 'София - Варна',
      departureDateTime: '2024-09-15T08:00:00',
      finalPrice: 350.50,
      status: 'Платена',
    };
  }
  return null;
};

const IssueGroupTicket: React.FC = () => {
  const [reservationId, setReservationId] = useState('');
  const [foundReservation, setFoundReservation] = useState<GroupReservation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isIssued, setIsIssued] = useState(false); // Track if ticket has been issued

  const handleSearch = async () => {
    setError(null);
    setSuccessMessage(null);
    setFoundReservation(null);
    setIsIssued(false);
    if (!reservationId) {
      setError('Моля, въведете номер на резервация.');
      return;
    }
    setIsLoading(true);
    try {
      const reservation = await findReservation(reservationId);
      if (reservation) {
        if (reservation.status === 'Платена') {
            setFoundReservation(reservation);
        } else if (reservation.status === 'Издаден билет') {
            setFoundReservation(reservation);
            setError('Билетът за тази резервация вече е издаден.');
            setIsIssued(true);
        } else if (reservation.status === 'Анулирана') {
            setFoundReservation(reservation);
            setError('Тази резервация е анулирана.');
        } else {
             setFoundReservation(reservation); // Show details even if not payable yet
             setError(`Резервацията е със статус "${reservation.status}". Билет може да се издаде само за "Платена" резервация.`);
        }
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

  const handleIssueTicket = () => {
      if (!foundReservation || foundReservation.status !== 'Платена') return;
      
      setError(null);
      setSuccessMessage(null);
      // Simulate Issuing Ticket
      console.log('--- SIMULATING GROUP TICKET ISSUANCE ---');
      console.log('Issuing ticket for Reservation ID:', foundReservation.id);
      console.log('Details:', foundReservation);
      console.log('Simulating printing/sending group ticket...');
      console.log('--- END SIMULATION ---');

      // Update state to reflect issued status
      setFoundReservation(prev => prev ? { ...prev, status: 'Издаден билет' } : null);
      setIsIssued(true);
      setSuccessMessage(`Групов билет за резервация ${foundReservation.id} е издаден успешно.`);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Издаване на групов билет</Typography>
      
      {error && !successMessage && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ width: { xs: '100%', sm: '70%' } }}>
          <TextField 
            label="Номер на резервация" 
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
            <Typography variant="h6" gutterBottom>Детайли за резервация: {foundReservation.id}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography><b>Водач:</b> {foundReservation.leaderName}</Typography>
            <Typography><b>Тип група:</b> {foundReservation.groupType}</Typography>
            <Typography><b>Брой пътници:</b> {foundReservation.totalPassengers}</Typography>
            <Typography><b>Маршрут:</b> {foundReservation.route}</Typography>
            <Typography><b>Тръгване:</b> {new Date(foundReservation.departureDateTime).toLocaleString('bg-BG')}</Typography>
            <Typography><b>Крайна цена:</b> {foundReservation.finalPrice.toFixed(2)} лв.</Typography>
            <Typography><b>Статус:</b> {foundReservation.status}</Typography>
            
            {foundReservation.status === 'Платена' && !isIssued && (
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleIssueTicket} 
                    sx={{ mt: 2 }}
                >
                    Издай групов билет
                </Button>
            )}
        </Paper>
      )}
    </Box>
  );
};

export default IssueGroupTicket; 