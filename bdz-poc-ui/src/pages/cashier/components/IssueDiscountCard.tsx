import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Mock Data (Replace with actual data/API call)
const DISCOUNT_CARD_TYPES = [
    { value: 'student', label: 'Ученическа/Студентска', price: 5.00 },
    { value: 'senior', label: 'Пенсионерска', price: 0.00 }, // Example free
    { value: 'family', label: 'Семейство', price: 15.00 },
    { value: 'tpl', label: 'ТПЛ', price: 0.00 },
    // Add other types as needed
];

const IssueDiscountCard: React.FC = () => {
  const [cardType, setCardType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [egn, setEgn] = useState(''); // Assuming EGN or similar identifier needed
  // Add fields for discount proof if needed (e.g., student ID upload)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fiscalReceipt, setFiscalReceipt] = useState<string | null>(null);
  const [writeProgress, setWriteProgress] = useState(0);

  const selectedTypeInfo = DISCOUNT_CARD_TYPES.find(t => t.value === cardType);

  const handleIssueCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setFiscalReceipt(null);
    setWriteProgress(0);

    try {
      // 1. Validate input
      if (!cardType || !firstName || !lastName || !egn) {
        throw new Error("Моля, попълнете всички задължителни полета.");
      }
      console.log("Issuing Discount Card:", { cardType, firstName, lastName, egn });
      
      // 2. Calculate price (already available in selectedTypeInfo)
      const price = selectedTypeInfo?.price ?? 0;
      console.log("Calculated Price:", price);

      // 3. TODO: Confirm with client (maybe a separate step/dialog if complex)
      
      // 4. TODO: Register payment (Assume cash for now)
      console.log("Registering payment...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 5. TODO: Integrate with Fiscal Device
      console.log("Printing fiscal receipt...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFiscalReceipt(`FiscalBon_${Date.now()}`);

      // 6. TODO: Generate unique card number (API)
      console.log("Generating card number...");
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCardNumber = `DC_${Math.random().toString(16).substring(2, 10).toUpperCase()}`;

      // 7. TODO: Prepare data for writing (API?)
      console.log("Preparing data for MiFare card...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 8. TODO: Prompt cashier to attach card (Needs hardware interaction logic)
      setError("Моля, прикрепете MiFare картата към четеца..."); // Use error state for prompt
      
      // 9. TODO: Write data to MiFare card (Hardware interaction)
      // Simulate writing progress
      await new Promise(resolve => setTimeout(resolve, 1000)); setWriteProgress(25); setError("Запис на карта... 25%");
      await new Promise(resolve => setTimeout(resolve, 1000)); setWriteProgress(50); setError("Запис на карта... 50%");
      await new Promise(resolve => setTimeout(resolve, 1000)); setWriteProgress(75); setError("Запис на карта... 75%");
      await new Promise(resolve => setTimeout(resolve, 1000)); setWriteProgress(100);setError(null);
      console.log("Write successful.");
      
      // 10. TODO: Verify written data (Hardware interaction)
      console.log("Verifying card data...");
      await new Promise(resolve => setTimeout(resolve, 500)); 
      console.log("Verification successful.");
      
      // 11. TODO: Register transaction (API)
      console.log("Registering transaction...");
      await new Promise(resolve => setTimeout(resolve, 500)); 

      // 12. Set success message
      setSuccess(`Карта намаление (${selectedTypeInfo?.label}) с номер ${newCardNumber} е издадена успешно.`);
      
      // TODO: Print confirmation slip? 

      // Reset form only after full success
      // setCardType(''); setFirstName(''); setLastName(''); setEgn(''); 

    } catch (err: any) {
      console.error(err);
      // Don't clear generated data if error happens mid-process
      if (!success) { // Only show error if not already successful
          setError(err.message || 'Грешка при издаване на карта.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
      return cardType !== '' && firstName.trim() !== '' && lastName.trim() !== '' && egn.trim() !== '';
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Издаване на карта за намаление
      </Typography>
      
      <Box component="form" onSubmit={handleIssueCard}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            <FormControl fullWidth required variant="outlined" size="small">
                <InputLabel id="discount-card-type-label">Вид карта</InputLabel>
                <Select
                labelId="discount-card-type-label"
                value={cardType}
                label="Вид карта"
                onChange={(e: SelectChangeEvent) => setCardType(e.target.value)}
                >
                {DISCOUNT_CARD_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                    {type.label} ({type.price.toFixed(2)} лв.)
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
             <TextField
                fullWidth label="Име" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                required variant="outlined" size="small"
            />
            <TextField
                fullWidth label="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)}
                required variant="outlined" size="small"
            />
            <TextField
                fullWidth label="ЕГН/Идентификатор" value={egn} onChange={(e) => setEgn(e.target.value)}
                required variant="outlined" size="small"
            />
             {/* Add fields for discount proof (e.g., Student ID number/upload) if cardType requires */} 
             {cardType === 'student' && (
                 <TextField 
                    fullWidth label="Номер на студентска/ученическа карта" 
                    variant="outlined" size="small" 
                    helperText="Необходимо за проверка."
                 />
             )}
        </Box>

        {/* Progress/Status Area */} 
        {loading && writeProgress > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                 <CircularProgress variant="determinate" value={writeProgress} size={24} />
                 <Typography variant="body2" color="text.secondary">Запис на карта... {writeProgress}%</Typography>
            </Box>
        )}
        {error && (
          <Alert severity={loading && writeProgress === 0 ? "info" : "error"} sx={{ mb: 2 }}>{error}</Alert> // Show prompt as info
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
            {fiscalReceipt && <Typography variant="caption" display="block">Фискален бон: {fiscalReceipt}</Typography>}
            </Alert>
        )}

        {/* Action Button */} 
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !isFormValid()} 
          >
            {loading ? 'Обработка...' : `Издай карта (${(selectedTypeInfo?.price ?? 0).toFixed(2)} лв.)`}
          </Button>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default IssueDiscountCard; 