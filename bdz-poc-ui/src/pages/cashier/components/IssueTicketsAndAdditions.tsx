import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  SelectChangeEvent,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

interface AdditionItem {
    type: string;
    label: string; // Store label for display
    count: number;
    requiresGender: boolean;
    gender?: string | null;
}

const ADDITION_TYPES = [
  { value: 'sleeping', label: 'Спално място', requiresGender: true },
  { value: 'seating', label: 'Седящо място', requiresGender: false },
  { value: 'class_change', label: 'Смяна на клас', requiresGender: false },
  { value: 'pet', label: 'Превоз на домашно животно', requiresGender: false },
  { value: 'bicycle', label: 'Превоз на велосипед', requiresGender: false },
];

const IssueTicketsAndAdditions: React.FC = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  
  // State for the currently selected addition to be added
  const [currentAdditionType, setCurrentAdditionType] = useState('');
  const [currentPassengerGender, setCurrentPassengerGender] = useState<string | null>(null);
  const [currentAdditionCount, setCurrentAdditionCount] = useState('1'); 

  // State for the list of additions added so far
  const [stagedAdditions, setStagedAdditions] = useState<AdditionItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedAdditionInfo = ADDITION_TYPES.find(t => t.value === currentAdditionType);

  // Handler to add the currently selected addition to the list
  const handleAddAdditionToList = () => {
      setError(null); // Clear previous errors specific to adding
      if (!selectedAdditionInfo) {
          setError("Моля, изберете тип добавка.");
          return;
      }
      if (selectedAdditionInfo.requiresGender && !currentPassengerGender) {
          setError("Моля, изберете пол на пътника за спално място.");
          return;
      }
      const count = parseInt(currentAdditionCount);
      if (isNaN(count) || count <= 0) {
           setError("Моля, въведете валиден брой добавки.");
          return;
      }

      // Check if this type already exists (optional: could allow merging or replacing)
      // For now, let's allow duplicates or different counts of same type

      const newAddition: AdditionItem = {
          type: selectedAdditionInfo.value,
          label: selectedAdditionInfo.label,
          count: count,
          requiresGender: selectedAdditionInfo.requiresGender,
          gender: selectedAdditionInfo.requiresGender ? currentPassengerGender : null,
      };

      setStagedAdditions(prev => [...prev, newAddition]);

      // Reset selection fields
      setCurrentAdditionType('');
      setCurrentPassengerGender(null);
      setCurrentAdditionCount('1');
  };
  
  // Handler to remove an addition from the staged list
  const handleRemoveAddition = (indexToRemove: number) => {
      setStagedAdditions(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Handler for the final submission
  const handleSubmitAllAdditions = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (stagedAdditions.length === 0) {
        setError("Моля, добавете поне една добавка към списъка.");
        setLoading(false);
        return;
    }
     if (ticketNumber.trim() === '') {
        setError("Моля, въведете номер на билет.");
        setLoading(false);
        return;
    }

    try {
      // TODO: Implement API call to add ALL additions from stagedAdditions to the existing ticket
      console.log("Adding Multiple Additions: ", { ticketNumber, additions: stagedAdditions });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate longer delay
      setSuccess(`Успешно добавени ${stagedAdditions.length} вида добавки към билет ${ticketNumber}`);
      // Reset form completely
      setTicketNumber('');
      setStagedAdditions([]);
      setCurrentAdditionType('');
      setCurrentPassengerGender(null);
      setCurrentAdditionCount('1');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Възникна грешка при записването на добавките.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdditionTypeChange = (event: SelectChangeEvent) => {
    const newType = event.target.value;
    setCurrentAdditionType(newType);
    const requiresGender = ADDITION_TYPES.find(t => t.value === newType)?.requiresGender;
    if (!requiresGender) {
        setCurrentPassengerGender(null);
    }
  };

  // Validation for the main submit button
  const isFinalSubmitValid = () => {
      return ticketNumber.trim() !== '' && stagedAdditions.length > 0;
  };

  return (
    <StyledPaper>
      <Box component="form" onSubmit={handleSubmitAllAdditions}> 
        <Typography variant="h6" gutterBottom>
          Добавяне на талони/добавки към билет
        </Typography>

         <TextField
            sx={{ mb: 3 }} // Add margin bottom
            fullWidth
            label="Номер на съществуващ билет"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            required
            variant="outlined"
            size="small"
          />
          
        {/* Section for selecting and adding ONE addition at a time */} 
        <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary' }}>Избор на добавка:</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <FormControl fullWidth required variant="outlined" size="small">
            <InputLabel id="addition-type-label">Тип добавка</InputLabel>
            <Select
              labelId="addition-type-label"
              value={currentAdditionType}
              label="Тип добавка"
              onChange={handleAdditionTypeChange}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 250,
                    minWidth: '250px',
                  },
                },
              }}
            >
              {ADDITION_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value} disabled={stagedAdditions.some(a => a.type === type.value)}> {/* Optional: Disable already added types */}
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {selectedAdditionInfo?.requiresGender && (
             <FormControl component="fieldset" size="small">
                  <FormLabel component="legend" sx={{ fontSize: '0.8rem', mb: -0.5 }}>Пол на пътника</FormLabel>
                  <RadioGroup
                    row
                    aria-label="passenger-gender"
                    name="passengerGender"
                    value={currentPassengerGender || ''}
                    onChange={(e) => setCurrentPassengerGender(e.target.value)}
                  >
                    <FormControlLabel value="male" control={<Radio size="small" />} label="Мъж" />
                    <FormControlLabel value="female" control={<Radio size="small" />} label="Жена" />
                  </RadioGroup>
                </FormControl>
          )}

          <TextField
              label="Брой"
              type="number"
              value={currentAdditionCount}
              onChange={(e) => setCurrentAdditionCount(e.target.value)}
              InputProps={{
                inputProps: { min: 1 }
              }}
              required
              variant="outlined"
              size="small"
              sx={{ width: '100px' }} // Smaller width for count
            />
            
           <Button 
              variant="outlined" 
              size="small" 
              onClick={handleAddAdditionToList}
              startIcon={<AddCircleOutlineIcon />}
              disabled={!currentAdditionType || (selectedAdditionInfo?.requiresGender && !currentPassengerGender)}
              sx={{ alignSelf: 'flex-start' }}
           >
               Добави към списъка
           </Button>
        </Box>
        
        {/* Display error related to adding to list */} 
        {error && !loading && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>} 

        {/* List of Staged Additions */} 
        {stagedAdditions.length > 0 && (
            <Box sx={{ mb: 3 }}>
                 <Typography variant="subtitle1" gutterBottom>Добавки за запис:</Typography>
                 <List dense sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    {stagedAdditions.map((addition, index) => (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveAddition(index)} size="small">
                                <DeleteIcon fontSize="small"/>
                                </IconButton>
                            }
                        >
                             <ListItemText
                                primary={`${addition.label} (x${addition.count})`}
                                secondary={addition.gender ? `Пол: ${addition.gender === 'male' ? 'Мъж' : 'Жена'}` : null}
                            />
                        </ListItem>
                    ))}
                 </List>
            </Box>
        )}

        {/* Display final submission success/error */} 
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>} 
        {error && loading && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} {/* Show error during final submit loading */}

        {/* Final Submit Button */} 
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !isFinalSubmitValid()}
          >
            {loading ? 'Записване...' : 'Запази добавките към билет'}
          </Button>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default IssueTicketsAndAdditions; 