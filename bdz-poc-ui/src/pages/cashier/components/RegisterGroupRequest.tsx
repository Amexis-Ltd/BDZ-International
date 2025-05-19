import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Paper,
  Stack
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const MIN_GROUP_SIZE = 11;

// Hardcoded station list for PoC
const STATIONS = [
  'София', 'Пловдив', 'Варна', 'Бургас', 'Русе', 
  'Стара Загора', 'Плевен', 'Велико Търново', 'Горна Оряховица', 'Перник'
];

const RegisterGroupRequest: React.FC = () => {
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [totalPassengers, setTotalPassengers] = useState('');
  const [childrenUnder7, setChildrenUnder7] = useState('');
  const [discountPassengers, setDiscountPassengers] = useState('');
  const [groupType, setGroupType] = useState('');
  const [departureDate, setDepartureDate] = useState(''); // Consider using DatePicker later
  const [departureTime, setDepartureTime] = useState('');
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Basic Validation
    const numTotalPassengers = Number(totalPassengers);
    if (!leaderName || !leaderEmail || !leaderPhone || !totalPassengers || !groupType || !departureDate || !departureTime || !fromStation || !toStation) {
      setError('Моля, попълнете всички задължителни полета (отбелязани с *).');
      return;
    }
    if (fromStation === toStation && fromStation !== '') {
      setError('Начална и крайна гара не могат да бъдат еднакви.');
      return;
    }
    if (isNaN(numTotalPassengers) || numTotalPassengers < MIN_GROUP_SIZE) {
      setError(`Минималният брой пътници за група е ${MIN_GROUP_SIZE}.`);
      return;
    }
    if (isRoundTrip && (!returnDate || !returnTime)) {
      setError('Моля, въведете дата и час за връщане при двупосочно пътуване.');
      return;
    }

    const requestId = uuidv4().substring(0, 8).toUpperCase(); // Generate unique ID
    const requestData = {
      id: requestId,
      leaderName,
      leaderEmail,
      leaderPhone,
      totalPassengers: numTotalPassengers,
      childrenUnder7: Number(childrenUnder7) || 0,
      discountPassengers: Number(discountPassengers) || 0,
      groupType,
      departureDate,
      departureTime,
      route: `${fromStation} - ${toStation}`,
      fromStation,
      toStation,
      isRoundTrip,
      returnDate: isRoundTrip ? returnDate : null,
      returnTime: isRoundTrip ? returnTime : null,
      notes,
      status: 'Чака обработка',
      timestamp: new Date().toISOString()
    };

    // Simulate submission
    console.log('--- SIMULATING GROUP TRIP REQUEST REGISTRATION ---');
    console.log('Request Data:', requestData);
    console.log(`Generated Request ID: ${requestId}`);
    console.log('Simulating printing request document with QR code...');
    console.log('--- END SIMULATION ---');

    setSuccessMessage(`Заявка ${requestId} е регистрирана успешно със статус "Чака обработка".`);

    // Reset form
    setLeaderName('');
    setLeaderEmail('');
    setLeaderPhone('');
    setTotalPassengers('');
    setChildrenUnder7('');
    setDiscountPassengers('');
    setGroupType('');
    setDepartureDate('');
    setDepartureTime('');
    setFromStation('');
    setToStation('');
    setIsRoundTrip(false);
    setReturnDate('');
    setReturnTime('');
    setNotes('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ '& .MuiTextField-root': { mb: 2 } }}>
      <Typography variant="h5" gutterBottom>Регистрация на заявка за групова резервация</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      
      {/* Group 1: Leader Info */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Информация за водача/отговорника</Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Box sx={{ width: { xs: '100%', sm: '32%' } }}>
            <TextField label="Име *" value={leaderName} onChange={(e) => setLeaderName(e.target.value)} fullWidth required size="small"/>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '32%' } }}>
            <TextField label="Имейл *" type="email" value={leaderEmail} onChange={(e) => setLeaderEmail(e.target.value)} fullWidth required size="small"/>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '32%' } }}>
            <TextField label="Телефон *" value={leaderPhone} onChange={(e) => setLeaderPhone(e.target.value)} fullWidth required size="small"/>
          </Box>
        </Stack>
      </Paper>
      
      {/* Group 2: Group Details */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Данни за групата</Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Box sx={{ width: { xs: '100%', sm: '32%' } }}>
            <TextField label="Общ брой пътници *" type="number" value={totalPassengers} onChange={(e) => setTotalPassengers(e.target.value)} fullWidth required inputProps={{ min: MIN_GROUP_SIZE }} size="small"/>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '32%' } }}>
            <TextField label="Деца до 7г." type="number" value={childrenUnder7} onChange={(e) => setChildrenUnder7(e.target.value)} fullWidth inputProps={{ min: 0 }} size="small"/>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '32%' } }}>
            <TextField label="Пътници с намаление" type="number" value={discountPassengers} onChange={(e) => setDiscountPassengers(e.target.value)} fullWidth inputProps={{ min: 0 }} size="small"/>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Box sx={{ width: { xs: '100%', sm: '32%' } }}>
            <TextField
              select
              label="Тип група *"
              value={groupType}
              onChange={(e) => setGroupType(e.target.value)}
              fullWidth
              required
              size="small"
            >
              <MenuItem value="Учащи">Учащи</MenuItem>
              <MenuItem value="Детски градини">Детски градини</MenuItem>
              <MenuItem value="Други">Други</MenuItem>
            </TextField>
          </Box>
        </Stack>
      </Paper>

      {/* Group 3: Trip Details */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Данни за пътуването</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
            <Box sx={{ width: { xs: '100%', sm: '48%', md: '24%' } }}>
              <TextField label="Дата на тръгване *" type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} size="small"/>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '48%', md: '24%' } }}>
              <TextField label="Час на тръгване *" type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} size="small"/>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <TextField
                select
                label="Начална гара *"
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                fullWidth
                required
                size="small"
              >
                {STATIONS.map((station) => (
                  <MenuItem key={station} value={station}>
                    {station}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <TextField
                select
                label="Крайна гара *"
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                fullWidth
                required
                size="small"
              >
                {STATIONS.map((station) => (
                  <MenuItem key={station} value={station}>
                    {station}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
            <Box sx={{ width: '100%' }}>
                <FormControlLabel control={<Checkbox checked={isRoundTrip} onChange={(e) => setIsRoundTrip(e.target.checked)} />} label="Двупосочно пътуване" />
            </Box>
            {isRoundTrip && (
              <>
                <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                  <TextField label="Дата на връщане *" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} disabled={!isRoundTrip} size="small"/>
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                  <TextField label="Час на връщане *" type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} fullWidth required InputLabelProps={{ shrink: true }} disabled={!isRoundTrip} size="small"/>
                </Box>
              </>
            )}
          </Stack>
      </Paper>

      {/* Group 4: Notes */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Допълнителни изисквания / Забележки</Typography>
        <TextField 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            fullWidth 
            multiline 
            rows={3} 
            size="small"
            placeholder="Въведете допълнителни изисквания или забележки тук..."
        />
      </Paper>

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained" color="primary" size="large">
          Регистрирай заявка
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterGroupRequest; 