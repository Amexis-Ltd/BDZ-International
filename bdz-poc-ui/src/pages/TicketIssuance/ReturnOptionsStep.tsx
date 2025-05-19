import React, { useState } from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { bg } from 'date-fns/locale';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setReturnType, setReturnDate, selectCurrentTicket, startNewTicket } from '../../store/features/ticket/ticketSlice';

// Define time slots
const RETURN_TIMES = [
  '06:10', '07:30', '08:45', '10:15', '11:43', '12:30',
  '14:20', '15:50', '17:15', '18:45', '20:30', '22:10'
];

export const ReturnOptionsStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTicket = useAppSelector(selectCurrentTicket);
  
  // Initialize ticket if needed
  React.useEffect(() => {
    if (!currentTicket) {
      dispatch(startNewTicket());
    }
  }, [currentTicket, dispatch]);
  
  // Get current return type or default
  const returnType = currentTicket?.returnType || 'one-way';
  
  // Local state for date/time
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    currentTicket?.returnDate ? new Date(currentTicket.returnDate) : null
  );
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Min date is departure date or today
  const minDate = currentTicket?.route?.departureDate 
    ? new Date(currentTicket.route.departureDate) 
    : new Date();
    
  // Handle radio button change
  const handleReturnTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.value as 'one-way' | 'round-trip-open' | 'round-trip-fixed';
    dispatch(setReturnType(newType));
    
    // Clear date if not fixed return
    if (newType !== 'round-trip-fixed') {
      setSelectedDate(null);
      setSelectedTime('');
      dispatch(setReturnDate(null));
    }
  };
  
  // Handle date selection
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    
    if (date && returnType === 'round-trip-fixed') {
      // Create a new date to avoid mutating the state
      const dateObj = new Date(date);
      
      if (selectedTime) {
        // Parse time and set hours/minutes
        const [hours, minutes] = selectedTime.split(':').map(Number);
        dateObj.setHours(hours, minutes);
      }
      
      dispatch(setReturnDate(dateObj.toISOString()));
    }
  };
  
  // Handle time selection
  const handleTimeChange = (event: SelectChangeEvent) => {
    const time = event.target.value as string;
    setSelectedTime(time);
    
    if (selectedDate && returnType === 'round-trip-fixed') {
      // Create a new date to avoid mutating the state
      const dateObj = new Date(selectedDate);
      
      if (time) {
        // Parse time and set hours/minutes
        const [hours, minutes] = time.split(':').map(Number);
        dateObj.setHours(hours, minutes);
      }
      
      dispatch(setReturnDate(dateObj.toISOString()));
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Опции за връщане
      </Typography>
      
      <RadioGroup
        value={returnType}
        onChange={handleReturnTypeChange}
      >
        <FormControlLabel value="one-way" control={<Radio />} label="Еднопосочен" />
        <FormControlLabel value="round-trip-open" control={<Radio />} label="Двупосочен отворен" />
        <FormControlLabel value="round-trip-fixed" control={<Radio />} label="Двупосочен с дата за връщане" />
      </RadioGroup>

      {/* Show return date/time options when 'round-trip-fixed' is selected */}
      {returnType === 'round-trip-fixed' && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Детайли за връщане
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
              <DatePicker
                label="Дата на връщане"
                value={selectedDate}
                onChange={handleDateChange}
                minDate={minDate}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
            
            <FormControl fullWidth sx={{ minWidth: 150 }}>
              <InputLabel>Час на връщане</InputLabel>
              <Select
                value={selectedTime}
                onChange={handleTimeChange}
                label="Час на връщане"
              >
                <MenuItem value="">
                  <em>Без конкретен час</em>
                </MenuItem>
                {RETURN_TIMES.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}
    </Box>
  );
}; 