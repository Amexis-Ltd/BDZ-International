import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ChairIcon from '@mui/icons-material/Chair';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RouteIcon from '@mui/icons-material/Route';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrainIcon from '@mui/icons-material/Train';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LuggageIcon from '@mui/icons-material/Luggage';
import PetsIcon from '@mui/icons-material/Pets';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SaveIcon from '@mui/icons-material/Save';

// --- Mock Data (Similar to Cashier) ---
const TRAIN_CARS = ['1', '2', '3', '4', '5'];
const TAKEN_SEATS: Record<string, string[]> = {
  '1': ['3', '5', '12', '14', '27', '38', '45', '51', '60', '69'],
  '2': ['7', '8', '15', '22', '29', '36', '44', '53', '61', '68'],
  '3': ['2', '10', '17', '26', '31', '42', '49', '55', '64', '70'],
  '4': ['1', '9', '18', '25', '33', '40', '47', '58', '66', '67'],
  '5': ['4', '11', '20', '24', '32', '39', '48', '54', '59', '65']
};

// --- Styled Components --- (Re-adding removed definitions)
const ReviewSelectionList = styled('dl')(({ theme }) => ({
  margin: 0,
  '& > div': {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0.75, 0),
    borderBottom: `1px dashed ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  '& dt': {
    color: theme.palette.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  '& dd': {
    fontWeight: theme.typography.fontWeightBold,
    textAlign: 'right',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
}));

const ReviewTotal = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(2),
  borderTop: `2px solid ${theme.palette.text.primary}`,
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '1.4rem',
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.primary.main,
}));

const PassengerCountGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  flexWrap: 'wrap',
  marginBottom: theme.spacing(2),
  '& > div': { // Target each passenger type box
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      '& label': {
          marginBottom: theme.spacing(0.5),
          fontSize: '0.9em',
      },
       '& input': {
           width: '70px',
       }
  }
}));

const SeatMapContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
  overflowX: 'auto',
}));

const SeatLegend = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(1.5),
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const ExtraServiceItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px dashed ${theme.palette.divider}`,
  '&:last-child': {
     borderBottom: 'none',
     paddingBottom: 0,
  },
}));

const ExtraServiceHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
  '& .MuiFormControlLabel-root': { // Target the Checkbox label
      flexGrow: 1,
      marginRight: 0,
  },
}));

const ExtraServicePrice = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.primary.main,
  flexShrink: 0,
}));

const ExtraServiceDetails = styled(Typography)(({ theme }) => ({
  fontSize: '0.9em',
  color: theme.palette.text.secondary,
  paddingLeft: theme.spacing(5), // Indent below icon/checkbox
   '& input': {
     width: '80px',
     fontSize: '0.9em',
     padding: theme.spacing(0.5, 1),
     marginLeft: theme.spacing(1),
  }
}));

const PaymentDeliveryDetails = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.light, 0.05),
  border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
  borderRadius: theme.shape.borderRadius,
}));

// Uncommenting LegendItem and LegendSeatPreview as they are used
const LegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: '0.9em',
}));

const LegendSeatPreview = styled(Box)(() => ({
  width: '20px',
  height: '20px',
  borderRadius: '3px',
  display: 'inline-block',
}));

// --- Types ---
interface PassengerSeatSelection {
    passengerIndex: number;
    carNumber: string | null;
    seatNumber: string | null;
}

// --- PurchasePage Component ---
const steps = [
  'Преглед', 
  'Билети и пътници', 
  'Избор на място', 
  'Допълнителни услуги', 
  'Плащане', 
  'Потвърждение'
];

const PurchasePage: React.FC = () => {
  // const navigate = useNavigate(); // Commented out as unused
  const location = useLocation();
  
  // TODO: Get selected train details from location.state or context
  const selectedTrain = location.state?.selectedTrain || {
      id: 'BV 8631',
      departureTime: '10:15', departureStation: 'София', 
      arrivalTime: '17:50', arrivalStation: 'Варна', 
      date: '10.04.2025',
      duration: '7ч 35м',
      basePrice: 30.80 // Base price per adult
  };

  const [activeStep, setActiveStep] = useState(0);
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, seniors: 0, students: 0 });
  const [seatSelections, setSeatSelections] = useState<PassengerSeatSelection[]>([]); 
  const [activePassengerIndex, setActivePassengerIndex] = useState<number>(0);
  const [selectedCar, setSelectedCar] = useState<string>(TRAIN_CARS[0]);
  const [extras, setExtras] = useState({
      baggageCount: 0,
      pet: false,
      insurance: false,
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryMethod, setDeliveryMethod] = useState('email');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const totalPassengers = passengers.adults + passengers.children + passengers.seniors + passengers.students;

  // --- Effects --- 
  useEffect(() => {
      setSeatSelections(Array.from({ length: totalPassengers }, (_, index) => ({ 
          passengerIndex: index, 
          carNumber: null, 
          seatNumber: null 
      })));
      if (activePassengerIndex >= totalPassengers) {
          setActivePassengerIndex(0);
      }
  }, [totalPassengers]);

  // --- Calculations ---
  const calculateTotalPrice = () => {
      let price = selectedTrain.basePrice * passengers.adults; // Simplistic price logic
      // TODO: Add logic for children/senior/student discounts
      if (extras.baggageCount > 0) price += extras.baggageCount * 5.00;
      if (extras.pet) price += 3.00;
      if (extras.insurance) price += totalPassengers * 2.00;
      return price;
  };

  const finalPrice = calculateTotalPrice();

  // --- Seat Map Logic (Adapted from Cashier) ---

   const handleCarChange = (event: SelectChangeEvent) => {
        setSelectedCar(event.target.value);
    };

  const isSeatTaken = (seatNumber: string): boolean => {
    if (TAKEN_SEATS[selectedCar]?.includes(seatNumber)) {
      return true;
    }
    return seatSelections.some(
      sel => 
        sel.passengerIndex !== activePassengerIndex &&
        sel.carNumber === selectedCar && 
        sel.seatNumber === seatNumber
    );
  };

   const isSeatSelectedByActive = (seatNumber: string): boolean => {
      const currentSelection = seatSelections[activePassengerIndex];
      return currentSelection?.carNumber === selectedCar && currentSelection?.seatNumber === seatNumber;
   };

   const getPassengerIndexForSeat = (seatNumber: string): number => {
       return seatSelections.findIndex(sel => sel.carNumber === selectedCar && sel.seatNumber === seatNumber);
   };

  const handleSeatClick = (seatNumber: string) => {
      if (isSeatTaken(seatNumber)) return; 

      setSeatSelections(prevSelections => {
          const newSelections = [...prevSelections];
          const currentSelection = newSelections[activePassengerIndex];

          if (currentSelection?.carNumber === selectedCar && currentSelection?.seatNumber === seatNumber) {
             newSelections[activePassengerIndex] = { ...currentSelection, carNumber: null, seatNumber: null };
          } else {
             newSelections[activePassengerIndex] = { ...currentSelection, carNumber: selectedCar, seatNumber: seatNumber };
          }
          return newSelections;
      });
  };

  const renderSeatMap = () => {
    const compartments = [];
    for (let compartmentIndex = 0; compartmentIndex < 10; compartmentIndex++) {
        const baseNumber = compartmentIndex * 6;
        const seatsRow1: React.ReactNode[] = [];
        const seatsRow2: React.ReactNode[] = [];

        for (let i = 1; i <= 3; i++) {
            seatsRow1.push(createSeatButton((baseNumber + i).toString()));
            seatsRow2.push(createSeatButton((baseNumber + i + 3).toString()));
        }

        compartments.push(
            <Paper 
                key={`compartment-${compartmentIndex}`}
                elevation={1}
                sx={{ p: 0.5, border: '1px solid #ddd', borderRadius: 0.5 }}
              >
                 <Typography variant="caption" sx={{ textAlign: 'center', mb: 0.25, fontWeight: 'bold', fontSize: '0.65rem' }}>
                   Купе {compartmentIndex + 1}
                 </Typography>
                 <Box sx={{ display: 'flex', mb: 0.5, justifyContent: 'center', gap: 0.25 }}>{seatsRow1}</Box>
                 <Divider />
                 <Box sx={{ display: 'flex', mt: 0.5, justifyContent: 'center', gap: 0.25 }}>{seatsRow2}</Box>
            </Paper>
        );
    }
    return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>{compartments}</Box>; 
  };

  const createSeatButton = (seatNumber: string) => {
      const isTaken = isSeatTaken(seatNumber);
      const isSelectedActive = isSeatSelectedByActive(seatNumber);
      const passengerIndex = getPassengerIndexForSeat(seatNumber);
      
      const getButtonColor = (): "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" => {
        if (isSelectedActive) return 'success';
        if (passengerIndex !== -1) return 'info';
        if (isTaken) return 'inherit';
        return 'primary';
      };
      
      const getButtonVariant = (): "text" | "outlined" | "contained" => {
        if (isSelectedActive || passengerIndex !== -1) return 'contained';
        return 'outlined';
      };
      
      return (
        <Tooltip title={isTaken ? 'Заето' : 
                        passengerIndex !== -1 ? `Пътник ${passengerIndex + 1}` : 
                        `Място ${seatNumber}`}>
          <span>
            <Button
              variant={getButtonVariant()}
              color={getButtonColor()}
              disabled={isTaken}
              onClick={() => handleSeatClick(seatNumber)}
              sx={{ minWidth: '30px', width: '30px', height: '30px', p: 0, m: 0.1, fontSize: '0.65rem', opacity: isTaken ? 0.5 : 1 }}
            >
              {seatNumber}
            </Button>
          </span>
        </Tooltip>
      );
    };

  // --- Step Handling ---
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
        if (!termsAccepted) {
            alert('Моля, приемете Общите условия.');
            return;
        }
        handlePurchase();
    } else {
       setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePassengerChange = (type: keyof typeof passengers, value: string) => {
      const numValue = parseInt(value) || 0;
      setPassengers(prev => ({ ...prev, [type]: Math.max(0, numValue) }));
  };

  const handlePurchase = () => {
      alert('Обработка на плащането и потвърждение... (не е имплементирано)');
      // In real app: call API, handle response, navigate to success/failure page
      // navigate('/purchase-success');
  }

  // --- Component Return ---
  return (
    <Container maxWidth="md" sx={{ py: 4 }}> {/* Use md for stepper */} 
       <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <ShoppingCartIcon fontSize="inherit" sx={{ mr: 1 }} /> Закупуване на Билет
       </Typography>

       <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
                <Typography variant="h6">{index + 1}. {label}</Typography>
            </StepLabel>
            <StepContent>
               <Box sx={{ mb: 3, mt: 1 }}>
                  {/* --- Step Content --- */} 
                  {index === 0 && ( // Преглед
                      <ReviewSelectionList>
                         <div><dt><RouteIcon /> Маршрут:</dt><dd>{selectedTrain.departureStation} <ArrowForwardIcon fontSize="inherit"/> {selectedTrain.arrivalStation}</dd></div>
                         <div><dt><CalendarTodayIcon /> Дата:</dt><dd>{selectedTrain.date}</dd></div>
                         <div><dt><TrainIcon /> Влак:</dt><dd>{selectedTrain.id}</dd></div>
                         <div><dt><AccessTimeIcon /> Заминава:</dt><dd>{selectedTrain.departureTime} ({selectedTrain.departureStation})</dd></div>
                         <div><dt><AccessTimeIcon /> Пристига:</dt><dd>{selectedTrain.arrivalTime} ({selectedTrain.arrivalStation})</dd></div>
                         <div><dt><TimerIcon /> Продълж.:</dt><dd>{selectedTrain.duration}</dd></div>
                         <div><dt><AttachMoneyIcon /> Цена (основна):</dt><dd>{selectedTrain.basePrice.toFixed(2)} лв./възр.</dd></div>
                     </ReviewSelectionList>
                  )}

                  {index === 1 && ( // Билети и пътници
                      <Box>
                          <FormControl component="fieldset" margin="normal">
                              <Typography component="legend" variant="subtitle1" gutterBottom><strong>Тип билет:</strong></Typography>
                              <RadioGroup row name="ticketType" defaultValue="oneWay">
                                  <FormControlLabel value="oneWay" control={<Radio />} label="Еднопосочен" />
                                  <FormControlLabel value="roundTrip" control={<Radio />} label="Двупосочен" disabled />
                                  <FormControlLabel value="group" control={<Radio />} label="Групов" disabled={totalPassengers < 3}/>
                              </RadioGroup>
                          </FormControl>
                          <PassengerCountGroup>
                             <div><TextField label="Възрастни" type="number" InputProps={{ inputProps: { min: 0 } }} value={passengers.adults} onChange={(e) => handlePassengerChange('adults', e.target.value)} size="small"/></div>
                             <div><TextField label="Деца" type="number" InputProps={{ inputProps: { min: 0 } }} value={passengers.children} onChange={(e) => handlePassengerChange('children', e.target.value)} size="small" /></div>
                             <div><TextField label="Пенсионери" type="number" InputProps={{ inputProps: { min: 0 } }} value={passengers.seniors} onChange={(e) => handlePassengerChange('seniors', e.target.value)} size="small" /></div>
                             <div><TextField label="Студенти" type="number" InputProps={{ inputProps: { min: 0 } }} value={passengers.students} onChange={(e) => handlePassengerChange('students', e.target.value)} size="small" /></div>
                          </PassengerCountGroup>
                          <Button variant="outlined" startIcon={<SaveIcon />} disabled sx={{ mr: 1}}>Запази пътници</Button>
                          <Typography variant="caption" color="text.secondary">Запазете данни за по-бързо купуване.</Typography>
                           <TextField label="Име на основен пътник" fullWidth margin="normal" variant="outlined" placeholder="Име и Фамилия"/>
                      </Box>
                  )}

                  {index === 2 && ( // Избор на място
                       <Box>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                            <FormControl sx={{ minWidth: 120 }} size="small">
                                <InputLabel id="car-select-label">Вагон</InputLabel>
                                <Select
                                    labelId="car-select-label"
                                    value={selectedCar}
                                    label="Вагон"
                                    onChange={handleCarChange}
                                >
                                    {TRAIN_CARS.map((car) => (
                                        <MenuItem key={car} value={car}>{car}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Typography variant="body2">Избор за:</Typography>
                            {Array.from({ length: totalPassengers }).map((_, idx) => (
                                <Button
                                    key={idx}
                                    size="small"
                                    variant={activePassengerIndex === idx ? "contained" : "outlined"}
                                    onClick={() => setActivePassengerIndex(idx)}
                                >
                                    Пътник {idx + 1}
                                </Button>
                            ))}
                         </Box>

                         <Typography>Моля, изберете място за <strong>Пътник {activePassengerIndex + 1}</strong> в <strong>Вагон {selectedCar}</strong>.</Typography>
                         <SeatMapContainer>{renderSeatMap()}</SeatMapContainer>
                         <SeatLegend>
                            <LegendItem><LegendSeatPreview sx={{ bgcolor: 'common.white', border: '1px solid grey.400' }}/> Свободно</LegendItem>
                            <LegendItem><LegendSeatPreview sx={{ bgcolor: 'success.main' }}/> Вашето място</LegendItem>
                            <LegendItem><LegendSeatPreview sx={{ bgcolor: 'info.main' }}/> Място на друг</LegendItem>
                            <LegendItem><LegendSeatPreview sx={{ bgcolor: 'grey.500' }}/> Заето</LegendItem>
                         </SeatLegend>
                          <Typography sx={{ mt: 2 }}><strong>Избрани места:</strong></Typography>
                          <List dense>
                             {seatSelections.map((sel, idx) => (
                                <ListItem key={idx} disablePadding>
                                   <ListItemText 
                                     primary={`Пътник ${idx + 1}:`}
                                     secondary={sel.seatNumber ? `Вагон ${sel.carNumber}, Място ${sel.seatNumber}` : 'Не е избрано'}
                                    />
                                </ListItem>
                             ))}
                          </List>
                       </Box>
                  )}

                  {index === 3 && ( // Допълнителни услуги
                     <Box>
                        <ExtraServiceItem>
                            <ExtraServiceHeader>
                               <LuggageIcon color="primary"/>
                               <FormControlLabel 
                                 control={<Checkbox checked={extras.baggageCount > 0} onChange={(e) => setExtras(p => ({...p, baggageCount: e.target.checked ? 1 : 0}))} id="baggage-checkbox" />}
                                 label="Допълнителен багаж"
                                />
                                <ExtraServicePrice>+ 5.00 лв./бр.</ExtraServicePrice>
                            </ExtraServiceHeader>
                             <ExtraServiceDetails>
                                Разрешен е 1 бр. ръчен багаж. Добавете брой допълнителни багажи (до 20кг):
                                <TextField 
                                    type="number" 
                                    InputProps={{ inputProps: { min: 0, max: 3 } }} 
                                    value={extras.baggageCount}
                                    onChange={(e) => setExtras(p => ({...p, baggageCount: Math.max(0, parseInt(e.target.value) || 0)}))} 
                                    size="small"
                                    disabled={extras.baggageCount === 0}
                                />
                             </ExtraServiceDetails>
                        </ExtraServiceItem>
                        <ExtraServiceItem>
                             <ExtraServiceHeader>
                                <PetsIcon color="primary"/>
                                <FormControlLabel control={<Checkbox checked={extras.pet} onChange={(e) => setExtras(p => ({...p, pet: e.target.checked}))} />} label="Място за домашен любимец"/>
                                <ExtraServicePrice>+ 3.00 лв.</ExtraServicePrice>
                             </ExtraServiceHeader>
                             <ExtraServiceDetails>Позволява превоз на малък любимец в клетка.</ExtraServiceDetails>
                        </ExtraServiceItem>
                         <ExtraServiceItem>
                             <ExtraServiceHeader>
                                <HealthAndSafetyIcon color="primary"/>
                                <FormControlLabel control={<Checkbox checked={extras.insurance} onChange={(e) => setExtras(p => ({...p, insurance: e.target.checked}))} />} label="Пътническа застраховка"/>
                                <ExtraServicePrice>+ 2.00 лв./пътник</ExtraServicePrice>
                             </ExtraServiceHeader>
                             <ExtraServiceDetails>Добавете застраховка "Помощ при пътуване".</ExtraServiceDetails>
                        </ExtraServiceItem>
                     </Box>
                  )}

                   {index === 4 && ( // Плащане
                     <Box>
                         <FormControl component="fieldset" margin="normal">
                           <Typography component="legend" variant="subtitle1" gutterBottom><strong>Метод на плащане:</strong></Typography>
                           <RadioGroup row name="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                             <FormControlLabel value="card" control={<Radio />} label="Карта" />
                             <FormControlLabel value="wallet" control={<Radio />} label="Портфейл" disabled/>
                             <FormControlLabel value="mobile" control={<Radio />} label="Мобилно" disabled/>
                           </RadioGroup>
                         </FormControl>
                         {paymentMethod === 'card' && (
                             <PaymentDeliveryDetails>
                                 <Grid container spacing={2}>
                                     <Box sx={{ width: '100%', p: 1}}><TextField label="Номер на карта" fullWidth placeholder="---- ---- ---- ----" size="small"/></Box>
                                     <Box sx={{ width: { xs: '100%', sm: '50%'}, p: 1}}><TextField label="Валидност (ММ/ГГ)" placeholder="ММ/ГГ" size="small" /></Box>
                                     <Box sx={{ width: { xs: '100%', sm: '50%'}, p: 1}}><TextField label="CVC код" placeholder="---" size="small" /></Box>
                                 </Grid>
                             </PaymentDeliveryDetails>
                         )}
                         {/* Other payment details would go here */} 
                     </Box>
                  )}

                   {index === 5 && ( // Потвърждение
                     <Box>
                         <Typography variant="h6" gutterBottom>Обобщение на поръчката:</Typography>
                         <ReviewSelectionList sx={{ mb: 3 }}>
                             <div><dt><RouteIcon /> Маршрут:</dt><dd>{selectedTrain.departureStation} - {selectedTrain.arrivalStation} ({selectedTrain.id})</dd></div>
                             <div><dt><PeopleIcon /> Пътници:</dt><dd>{totalPassengers}</dd></div>
                             <div><dt><ChairIcon /> Места:</dt><dd>{seatSelections.map(sel => sel.seatNumber ? `${sel.carNumber}, ${sel.seatNumber}` : '--').join(', ')}</dd></div>
                             {extras.baggageCount > 0 && <div><dt><LuggageIcon /> Доп. багаж:</dt><dd>{extras.baggageCount} бр. (+{(extras.baggageCount * 5.00).toFixed(2)} лв.)</dd></div>}
                             {extras.pet && <div><dt><PetsIcon /> Любимец:</dt><dd>+3.00 лв.</dd></div>}
                             {extras.insurance && <div><dt><HealthAndSafetyIcon /> Застрах.:</dt><dd>+{(totalPassengers * 2.00).toFixed(2)} лв.</dd></div>}
                         </ReviewSelectionList>
                         <ReviewTotal><span>Крайна сума:</span><span>{finalPrice.toFixed(2)} лв.</span></ReviewTotal>

                        <Divider sx={{ my: 3 }}/>

                         <FormControl component="fieldset" margin="normal">
                           <Typography component="legend" variant="subtitle1" gutterBottom><strong>Доставка на билета:</strong></Typography>
                           <RadioGroup row name="deliveryMethod" value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
                             <FormControlLabel value="email" control={<Radio />} label="Имейл" />
                             <FormControlLabel value="sms" control={<Radio />} label="SMS" disabled/>
                             <FormControlLabel value="app" control={<Radio />} label="В приложението" disabled/>
                           </RadioGroup>
                         </FormControl>
                           {deliveryMethod === 'email' && (
                             <PaymentDeliveryDetails>
                                <TextField label="Имейл адрес" type="email" fullWidth placeholder="your.email@example.com" size="small"/>
                             </PaymentDeliveryDetails>
                         )}
                         {/* Other delivery details */} 

                         <FormControlLabel 
                            control={<Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} name="terms" />} 
                            label={<span>Прочетох и съм съгласен/на с <Link href="#" target="_blank">Общите условия</Link>.</span>} 
                            sx={{ mt: 2 }}
                          />
                     </Box>
                  )}

                  {/* --- Step Actions --- */} 
                  <Box sx={{ mt: 2 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Назад
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      startIcon={activeStep === steps.length - 1 ? <LockIcon /> : null}
                      disabled={activeStep === 2 && seatSelections.some(s => !s.seatNumber)}
                    >
                      {activeStep === steps.length - 1 ? 'Потвърди и плати' : 'Напред'}
                    </Button>
                  </Box>
               </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

    </Container>
  );
};

export default PurchasePage; 