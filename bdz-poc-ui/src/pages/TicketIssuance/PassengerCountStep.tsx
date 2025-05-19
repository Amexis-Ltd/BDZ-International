import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPassengerCategories, selectCurrentTicket, startNewTicket, setRouteSelection } from '../../store/features/ticket/ticketSlice';
import type { PassengerCategories } from '../../store/features/ticket/ticketSlice';

const PASSENGER_TYPES: Record<keyof PassengerCategories, { label: string; max: number }> = {
  adults: { label: 'Възрастни', max: 9 },
  children: { label: 'Деца', max: 9 },
  seniors: { label: 'Пенсионери', max: 9 },
  students: { label: 'Студенти', max: 9 }
};

export const PassengerCountStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTicket = useAppSelector(selectCurrentTicket);
  
  // Initialize ticket if needed
  React.useEffect(() => {
    if (!currentTicket) {
      dispatch(startNewTicket());
    }
  }, [currentTicket, dispatch]);

  const handlePassengerChange = (category: keyof PassengerCategories, change: number) => {
    if (!currentTicket) return;

    const newCategories = { ...currentTicket.passengerCategories };
    const currentCount = newCategories[category];
    const newCount = Math.max(0, Math.min(PASSENGER_TYPES[category].max, currentCount + change));
    
    // Update the categories
    newCategories[category] = newCount;
    
    // Calculate total passengers
    const totalPassengers = Object.values(newCategories).reduce((sum, count) => sum + count, 0);
    
    // Only allow the change if we have at least one passenger
    if (totalPassengers > 0) {
      // Update passenger categories in the ticket
      dispatch(setPassengerCategories(newCategories));
    }
  };

  if (!currentTicket) {
    return <Typography>Грешка: Няма активен билет</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Брой пътници
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Изберете броя пътници по категории (максимум 9 от всяка категория)
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        {Object.entries(PASSENGER_TYPES).map(([category, { label, max }]) => (
          <Paper key={category} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1">{label}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => handlePassengerChange(category as keyof PassengerCategories, -1)}
                  disabled={currentTicket.passengerCategories[category as keyof PassengerCategories] <= 0}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                  {currentTicket.passengerCategories[category as keyof PassengerCategories]}
                </Typography>
                <IconButton
                  onClick={() => handlePassengerChange(category as keyof PassengerCategories, 1)}
                  disabled={currentTicket.passengerCategories[category as keyof PassengerCategories] >= max}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
      
      <Typography variant="subtitle1" sx={{ mt: 3, textAlign: 'center' }}>
        Общ брой пътници: {Object.values(currentTicket.passengerCategories).reduce((sum, count) => sum + count, 0)}
      </Typography>
    </Box>
  );
}; 