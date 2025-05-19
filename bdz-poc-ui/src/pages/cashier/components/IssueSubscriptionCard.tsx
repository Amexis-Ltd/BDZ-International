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
  Divider,
  // Add Date Picker components
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'; // Use V3 for date-fns v3
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { bg } from 'date-fns/locale/bg'; // Import Bulgarian locale

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Mock Data (Replace with actual data/API call)
const SUBSCRIPTION_TYPES = [
    { value: 'city', label: 'Вътрешноградска', price: 30.00, requiresRoute: false, requiresPeriod: true },
    { value: 'route', label: 'По маршрут', price: 50.00, requiresRoute: true, requiresPeriod: true },
    { value: 'network', label: 'Цяла мрежа', price: 150.00, requiresRoute: false, requiresPeriod: true },
];
const SUBSCRIPTION_PERIODS = [
    { value: '1w', label: '1 Седмица' },
    { value: '1m', label: '1 Месец' },
    { value: '3m', label: '3 Месеца' },
    { value: '1y', label: '1 Година' },
];

const IssueSubscriptionCard: React.FC = () => {
  const [cardType, setCardType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [egn, setEgn] = useState('');
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [validityPeriod, setValidityPeriod] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fiscalReceipt, setFiscalReceipt] = useState<string | null>(null);
  const [writeProgress, setWriteProgress] = useState(0);

  const selectedTypeInfo = SUBSCRIPTION_TYPES.find(t => t.value === cardType);

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
        throw new Error("Моля, попълнете личните данни.");
      }
      if (selectedTypeInfo?.requiresRoute && (!routeFrom || !routeTo)) {
          throw new Error("Моля, въведете начална и крайна гара за маршрута.");
      }
      if (selectedTypeInfo?.requiresPeriod && (!validityPeriod || !startDate)) {
          throw new Error("Моля, изберете период и начална дата.");
      }
      
      console.log("Issuing Subscription Card:", { cardType, firstName, lastName, egn, routeFrom, routeTo, validityPeriod, startDate });
      
      // 2. Calculate price
      const price = selectedTypeInfo?.price ?? 0;
      console.log("Calculated Price:", price);
      
      // ... (Steps 3-12 similar to Discount Card issuance: Confirm, Payment, Fiscal, Generate#, Prepare, Prompt, Write, Verify, Register) ...
      console.log("Simulating steps 3-11...");
      await new Promise(resolve => setTimeout(resolve, 500)); setFiscalReceipt(`FiscalBon_${Date.now()}`);
      const newCardNumber = `SC_${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
      setError("Моля, прикрепете MiFare картата към четеца...");
      await new Promise(resolve => setTimeout(resolve, 1000)); setWriteProgress(25); setError("Запис на карта... 25%");
      await new Promise(resolve => setTimeout(resolve, 1000)); setWriteProgress(50); setError("Запис на карта... 50%");
      await new Promise(resolve => setTimeout(resolve, 1000)); setWriteProgress(75); setError("Запис на карта... 75%");
      await new Promise(resolve => setTimeout(resolve, 1000)); setWriteProgress(100);setError(null);
      await new Promise(resolve => setTimeout(resolve, 500)); // Verify
      await new Promise(resolve => setTimeout(resolve, 500)); // Register

      setSuccess(`Абонаментна карта (${selectedTypeInfo?.label}) с номер ${newCardNumber} е издадена успешно.`);
      // Reset form needed here
      // setCardType(''); setFirstName(''); ... etc.

    } catch (err: any) {
      console.error(err);
      if (!success) {
          setError(err.message || 'Грешка при издаване на карта.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
      const baseValid = cardType !== '' && firstName.trim() !== '' && lastName.trim() !== '' && egn.trim() !== '';
      const routeValid = selectedTypeInfo?.requiresRoute ? (routeFrom.trim() !== '' && routeTo.trim() !== '') : true;
      const periodValid = selectedTypeInfo?.requiresPeriod ? (validityPeriod !== '' && startDate !== null) : true;
      return baseValid && routeValid && periodValid;
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Издаване на абонаментна карта
      </Typography>
      
      <Box component="form" onSubmit={handleIssueCard}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            {/* Personal Details */} 
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Лични данни</Typography>
            <TextField fullWidth label="Име" value={firstName} onChange={(e) => setFirstName(e.target.value)} required variant="outlined" size="small"/>
            <TextField fullWidth label="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} required variant="outlined" size="small"/>
            <TextField fullWidth label="ЕГН/Идентификатор" value={egn} onChange={(e) => setEgn(e.target.value)} required variant="outlined" size="small"/>
            
            <Divider sx={{ my: 1 }} />

            {/* Card Type and Details */} 
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Детайли за картата</Typography>
            <FormControl fullWidth required variant="outlined" size="small">
                <InputLabel id="subs-card-type-label">Вид абонамент</InputLabel>
                <Select
                    labelId="subs-card-type-label"
                    value={cardType}
                    label="Вид абонамент"
                    onChange={(e: SelectChangeEvent) => setCardType(e.target.value)}
                >
                    {SUBSCRIPTION_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                            {type.label} ({type.price.toFixed(2)} лв.)
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedTypeInfo?.requiresRoute && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField sx={{ flex: 1 }} label="Начална гара" value={routeFrom} onChange={(e) => setRouteFrom(e.target.value)} required variant="outlined" size="small"/>
                    <TextField sx={{ flex: 1 }} label="Крайна гара" value={routeTo} onChange={(e) => setRouteTo(e.target.value)} required variant="outlined" size="small"/>
                </Box>
            )}

            {selectedTypeInfo?.requiresPeriod && (
                 <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl sx={{ minWidth: 150 }} required variant="outlined" size="small">
                        <InputLabel id="subs-period-label">Период</InputLabel>
                        <Select
                            labelId="subs-period-label"
                            value={validityPeriod}
                            label="Период"
                            onChange={(e: SelectChangeEvent) => setValidityPeriod(e.target.value)}
                        >
                            {SUBSCRIPTION_PERIODS.map((period) => (
                                <MenuItem key={period.value} value={period.value}>{period.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                     <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
                        <DatePicker
                            label="Начална дата"
                            value={startDate}
                            onChange={(newValue) => {
                                setStartDate(newValue);
                            }}
                            slotProps={{ textField: { size: "small" } }}
                        />
                    </LocalizationProvider>
                </Box>
            )}
            {/* TODO: Add discount selection if applicable */} 
        </Box>

        {/* Progress/Status Area */} 
        {loading && writeProgress > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                 <CircularProgress variant="determinate" value={writeProgress} size={24} />
                 <Typography variant="body2" color="text.secondary">Запис на карта... {writeProgress}%</Typography>
            </Box>
        )}
        {error && (
          <Alert severity={loading && writeProgress === 0 ? "info" : "error"} sx={{ mb: 2 }}>{error}</Alert>
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

export default IssueSubscriptionCard; 