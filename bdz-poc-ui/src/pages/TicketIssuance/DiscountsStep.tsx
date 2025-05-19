import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  Button,
  TextField,
  IconButton,
  Paper
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updatePassenger, selectCurrentTicket, startNewTicket } from '../../store/features/ticket/ticketSlice';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

// Available discount types
const DISCOUNTS = [
  'Без намаление',
  'Пенсионер',
  'Студент',
  'Дете до 7 години',
  'Дете от 7 до 10 години',
  'Многодетни майки',
  'Военноинвалид',
  'ТПЛ'
];

// Discounts that require document number
const DISCOUNTS_REQUIRING_DOCUMENT = [
  'Пенсионер',
  'Студент',
  'Многодетни майки',
  'Военноинвалид',
  'ТПЛ'
];

interface DiscountsStepProps {
  onComplete: () => void;
}

export const DiscountsStep: React.FC<DiscountsStepProps> = ({ onComplete }) => {
  const dispatch = useAppDispatch();
  const currentTicket = useAppSelector(selectCurrentTicket);
  const [documentNumbers, setDocumentNumbers] = useState<Record<number, string>>({});
  const [isScanning, setIsScanning] = useState<Record<number, boolean>>({});
  
  // Initialize ticket if needed
  React.useEffect(() => {
    if (!currentTicket) {
      dispatch(startNewTicket());
    }
  }, [currentTicket, dispatch]);
  
  const handleDiscountChange = (index: number, value: string) => {
    if (currentTicket) {
      dispatch(updatePassenger({
        index,
        data: { 
          discount: value,
          documentNumber: DISCOUNTS_REQUIRING_DOCUMENT.includes(value) ? documentNumbers[index] || '' : undefined
        }
      }));
    }
  };

  const handleDocumentNumberChange = (index: number, value: string) => {
    setDocumentNumbers(prev => ({
      ...prev,
      [index]: value
    }));
    
    if (currentTicket) {
      dispatch(updatePassenger({
        index,
        data: { documentNumber: value }
      }));
    }
  };

  const handleScanClick = (index: number) => {
    setIsScanning(prev => ({
      ...prev,
      [index]: true
    }));
    
    // TODO: Implement actual document scanning
    // For now, we'll just simulate a scan after a delay
    setTimeout(() => {
      const mockScannedNumber = `DOC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      handleDocumentNumberChange(index, mockScannedNumber);
      setIsScanning(prev => ({
        ...prev,
        [index]: false
      }));
    }, 1500);
  };

  // Get number of passengers from the ticket
  const passengerCount = currentTicket?.passengerCount || 1;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Информация за пътници
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Изберете намаления за пътниците и въведете необходимите документи
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Generate a discount selector for each passenger */}
        {Array.from({ length: passengerCount }).map((_, index) => (
          <Paper key={index} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'center' } }}>
              {/* Passenger number */}
              <Box sx={{ 
                width: { xs: '100%', sm: '60px' }, 
                textAlign: 'center',
                borderRight: { sm: '1px solid' },
                borderColor: { sm: 'divider' },
                pr: { sm: 2 }
              }}>
                <Typography variant="subtitle1">
                  {index + 1}
                </Typography>
              </Box>

              {/* Discount selection */}
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>Намаление</InputLabel>
                  <Select
                    value={currentTicket?.passengers[index]?.discount || 'Без намаление'}
                    onChange={(e) => handleDiscountChange(index, e.target.value)}
                    label="Намаление"
                  >
                    {DISCOUNTS.map((discount) => (
                      <MenuItem key={discount} value={discount}>
                        {discount}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Document number field and scan button */}
              {currentTicket?.passengers[index]?.discount && 
               DISCOUNTS_REQUIRING_DOCUMENT.includes(currentTicket.passengers[index].discount) && (
                <Box sx={{ flex: 2, display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    label="Номер на документ за намаление"
                    value={documentNumbers[index] || ''}
                    onChange={(e) => handleDocumentNumberChange(index, e.target.value)}
                    size="small"
                    helperText="Въведете или сканирайте номера на документа"
                  />
                  <IconButton 
                    color="primary" 
                    onClick={() => handleScanClick(index)}
                    disabled={isScanning[index]}
                    sx={{ mt: 1 }}
                  >
                    <QrCodeScannerIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Paper>
        ))}
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          onClick={onComplete}
          disabled={!currentTicket?.passengers.every(p => 
            !DISCOUNTS_REQUIRING_DOCUMENT.includes(p.discount || '') || 
            (p.documentNumber && p.documentNumber.length > 0)
          )}
        >
          Продължи
        </Button>
      </Box>
    </Box>
  );
}; 