import React, { useState } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Paper, Divider, SelectChangeEvent, Tooltip, Switch, FormControlLabel } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updatePassenger, selectCurrentTicket, startNewTicket } from '../../store/features/ticket/ticketSlice';

// Mock data for train cars and seats
const TRAIN_CARS = ['1', '2', '3', '4', '5'];

// Pre-defined taken seats per car (hardcoded)
const TAKEN_SEATS: Record<string, string[]> = {
  '1': ['3', '5', '12', '14', '27', '38', '45', '51', '60', '69'],
  '2': ['7', '8', '15', '22', '29', '36', '44', '53', '61', '68'],
  '3': ['2', '10', '17', '26', '31', '42', '49', '55', '64', '70'],
  '4': ['1', '9', '18', '25', '33', '40', '47', '58', '66', '67'],
  '5': ['4', '11', '20', '24', '32', '39', '48', '54', '59', '65']
};

interface SeatSelectionStepProps {
  onComplete: () => void;
}

export const SeatSelectionStep: React.FC<SeatSelectionStepProps> = ({ onComplete }) => {
  const dispatch = useAppDispatch();
  const currentTicket = useAppSelector(selectCurrentTicket);
  const [selectedCar, setSelectedCar] = useState('1');
  const [activePassenger, setActivePassenger] = useState<number>(0);
  const [isAutomaticSelection, setIsAutomaticSelection] = useState(false);
  
  // Initialize ticket if needed
  React.useEffect(() => {
    if (!currentTicket) {
      dispatch(startNewTicket());
    }
  }, [currentTicket, dispatch]);
  
  const handleCarChange = (event: SelectChangeEvent) => {
    setSelectedCar(event.target.value);
  };
  
  const handleSeatSelect = (seat: string) => {
    if (currentTicket) {
      dispatch(updatePassenger({
        index: activePassenger,
        data: { 
          carNumber: selectedCar,
          seatNumber: seat 
        }
      }));
    }
  };

  // Get number of passengers from the ticket
  const passengerCount = currentTicket?.passengerCount || 1;
  
  // Function to check if a seat is taken (either by pre-defined list or by another passenger)
  const isSeatTaken = (seat: string): boolean => {
    if (!currentTicket) return false;
    
    // Check if it's in the pre-defined taken seats
    if (TAKEN_SEATS[selectedCar]?.includes(seat)) {
      return true;
    }
    
    // Check if it's taken by another passenger in our group
    return currentTicket.passengers.some(
      (p, i) => p.carNumber === selectedCar && p.seatNumber === seat && i !== activePassenger
    );
  };
  
  // Check if seat is selected by active passenger
  const isSeatSelected = (seat: string): boolean => {
    if (!currentTicket || !currentTicket.passengers[activePassenger]) {
      return false;
    }
    
    return (
      currentTicket.passengers[activePassenger].carNumber === selectedCar && 
      currentTicket.passengers[activePassenger].seatNumber === seat
    );
  };
  
  // Function to get the passenger index who selected this seat (for color coding)
  const getPassengerForSeat = (seat: string): number => {
    if (!currentTicket) return -1;
    
    const index = currentTicket.passengers.findIndex(
      p => p.carNumber === selectedCar && p.seatNumber === seat
    );
    
    return index;
  };

  const handleAutomaticSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isAutomatic = event.target.checked;
    setIsAutomaticSelection(isAutomatic);
    
    if (isAutomatic && currentTicket) {
      // Find available seats for all passengers
      const availableSeats = new Map<string, string[]>();
      TRAIN_CARS.forEach(car => {
        availableSeats.set(car, Array.from({ length: 60 }, (_, i) => (i + 1).toString())
          .filter(seat => !TAKEN_SEATS[car]?.includes(seat)));
      });

      // Assign seats to passengers
      currentTicket.passengers.forEach((_, index) => {
        // Find the car with the most available seats
        let bestCar = '1';
        let maxAvailable = 0;
        
        availableSeats.forEach((seats, car) => {
          if (seats.length > maxAvailable) {
            maxAvailable = seats.length;
            bestCar = car;
          }
        });

        if (availableSeats.get(bestCar)?.length) {
          const seat = availableSeats.get(bestCar)?.shift();
          if (seat) {
            dispatch(updatePassenger({
              index,
              data: { 
                carNumber: bestCar,
                seatNumber: seat 
              }
            }));
          }
        }
      });
    }
  };

  // Generate seats in a layout that resembles a real train car with compartments
  const renderSeats = () => {
    // BDZ train wagon with compartments of 6 seats each (2 rows of 3 seats facing each other)
    // We'll create a layout with 10 compartments (6 seats each)
    // This gives a total of 60 seats per wagon
    
    // Create labels for compartments and corridor sides
    const windowLabel = (
      <Box sx={{ position: 'absolute', left: 8, top: 10, transform: 'translateY(-50%)' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
          Прозорец
        </Typography>
      </Box>
    );
    
    const corridorLabel = (
      <Box sx={{ position: 'absolute', right: 8, top: 10, transform: 'translateY(-50%)' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
          Коридор
        </Typography>
      </Box>
    );
    
    // Create a seat button with appropriate styling and state
    const createSeatButton = (seatNumber: string) => {
      const isTaken = isSeatTaken(seatNumber);
      const isSelected = isSeatSelected(seatNumber);
      const passengerIndex = getPassengerForSeat(seatNumber);
      
      const getButtonColor = () => {
        if (isSelected) return 'success';
        if (passengerIndex >= 0) return 'info';
        if (isTaken) return 'inherit';
        return 'primary';
      };
      
      const getButtonVariant = () => {
        if (isSelected || passengerIndex >= 0) return 'contained';
        return 'outlined';
      };
      
      return (
        <Tooltip title={isTaken ? 'Това място е заето' : 
                        passengerIndex >= 0 ? `Пътник ${passengerIndex + 1}` : 
                        `Място ${seatNumber}`}>
          <span>
            <Button
              variant={getButtonVariant()}
              color={getButtonColor()}
              disabled={isTaken}
              onClick={() => handleSeatSelect(seatNumber)}
              sx={{
                minWidth: '30px',
                width: '30px',
                height: '30px',
                p: 0,
                m: 0.1,
                fontSize: '0.65rem',
                opacity: isTaken ? 0.5 : 1,
              }}
            >
              {seatNumber}
            </Button>
          </span>
        </Tooltip>
      );
    };
    
    // Render the train car layout
    return (
      <Box sx={{ width: '100%', maxWidth: '340px', mx: 'auto' }}>
        {windowLabel}
        {corridorLabel}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {/* Compartment rows */}
          {Array.from({ length: 10 }).map((_, compartmentIndex) => {
            // Calculate seat numbers for this compartment (6 seats per compartment)
            const baseNumber = compartmentIndex * 6;
            
            return (
              <Paper 
                key={`compartment-${compartmentIndex}`}
                elevation={1}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 0.5,
                  border: '1px solid #ddd',
                  borderRadius: 0.5
                }}
              >
                {/* Compartment number */}
                <Typography variant="caption" sx={{ textAlign: 'center', mb: 0.25, fontWeight: 'bold', fontSize: '0.65rem' }}>
                  Купе {compartmentIndex + 1}
                </Typography>
                
                {/* First row - 3 seats facing forward */}
                <Box sx={{ display: 'flex', mb: 0.5, justifyContent: 'center', gap: 0.25 }}>
                  {createSeatButton((baseNumber + 1).toString())}
                  {createSeatButton((baseNumber + 2).toString())}
                  {createSeatButton((baseNumber + 3).toString())}
                </Box>
                
                {/* Small divider showing this is the facing seats area */}
                <Box sx={{ position: 'relative', height: '4px', mb: 0.5 }}>
                  <Divider sx={{ position: 'absolute', left: 0, right: 0 }} />
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      left: '50%', 
                      top: '50%', 
                      transform: 'translate(-50%, -50%)',
                      bgcolor: 'white',
                      px: 0.25,
                      fontSize: '0.55rem',
                      color: 'text.secondary'
                    }}
                  >
                    лице в лице
                  </Box>
                </Box>
                
                {/* Second row - 3 seats facing backward */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.25 }}>
                  {createSeatButton((baseNumber + 4).toString())}
                  {createSeatButton((baseNumber + 5).toString())}
                  {createSeatButton((baseNumber + 6).toString())}
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Избор на места
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Изберете места за всеки пътник
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isAutomaticSelection}
              onChange={handleAutomaticSelectionChange}
              color="primary"
            />
          }
          label="Автоматичен избор на места"
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 2 }}>
          Системата ще избере автоматично място за всеки пътник
        </Typography>
      </Paper>
      
      {!isAutomaticSelection && (
        <>
          <Box mt={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="car-select-label">Вагон</InputLabel>
                <Select
                  labelId="car-select-label"
                  id="car-select"
                  value={selectedCar}
                  label="Вагон"
                  onChange={handleCarChange}
                >
                  {TRAIN_CARS.map((car) => (
                    <MenuItem key={car} value={car}>
                      {car}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Typography variant="body1" sx={{ ml: 2 }}>
                Избирате за: 
              </Typography>
              
              {Array.from({ length: passengerCount }).map((_, index) => (
                <Button
                  key={index}
                  variant={activePassenger === index ? "contained" : "outlined"}
                  onClick={() => setActivePassenger(index)}
                  sx={{ ml: 1 }}
                >
                  Пътник {index + 1}
                </Button>
              ))}
            </Box>
            
            <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: '#f5f5f5' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Вагон {selectedCar}
                </Typography>
              </Box>
              
              <Box sx={{ 
                border: '1px solid #ccc', 
                borderRadius: 1,
                backgroundColor: 'white', 
                p: 1.5,
                position: 'relative', 
                display: 'flex'
              }}>
                {/* Direction of travel indicator - vertical arrow */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    left: -16, 
                    top: 0, 
                    bottom: 0, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 16
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      transform: 'rotate(-90deg)', 
                      whiteSpace: 'nowrap',
                      position: 'absolute',
                      color: 'text.secondary',
                      fontSize: '0.65rem'
                    }}
                  >
                    Посока на движение
                  </Typography>
                  <Box sx={{ fontSize: '1.2rem', mt: 'auto', mb: 1 }}>↑</Box>
                </Box>

                {renderSeats()}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button variant="contained" color="success" size="small" disabled sx={{ mr: 1, minWidth: '30px', height: '30px' }}></Button>
                  <Typography variant="body2">Вашето място</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button variant="contained" color="info" size="small" disabled sx={{ mr: 1, minWidth: '30px', height: '30px' }}></Button>
                  <Typography variant="body2">Място на друг пътник от групата</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button variant="outlined" color="inherit" size="small" disabled sx={{ mr: 1, minWidth: '30px', height: '30px', opacity: 0.5 }}></Button>
                  <Typography variant="body2">Заето място</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </>
      )}

      {/* Selected seats summary */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Избрани места:
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {currentTicket?.passengers.map((passenger, index) => (
            <Paper key={index} sx={{ p: 2, flex: '1 1 200px' }}>
              <Typography variant="subtitle1">
                Пътник {index + 1}
              </Typography>
              <Typography variant="body1">
                {passenger.carNumber && passenger.seatNumber
                  ? `Вагон ${passenger.carNumber}, Място ${passenger.seatNumber}`
                  : 'Не е избрано място'}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={onComplete}
          color="primary"
          variant="contained"
          size="large"
          sx={{ fontSize: '1rem', py: 1.5, px: 4 }}
          disabled={!currentTicket?.passengers.every(p => p.seatNumber)}
        >
          Продължи
        </Button>
      </Box>
    </Box>
  );
};