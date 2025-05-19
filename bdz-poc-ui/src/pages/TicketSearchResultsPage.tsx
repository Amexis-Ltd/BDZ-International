import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Slider,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TrainIcon from '@mui/icons-material/Train';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CheckIcon from '@mui/icons-material/Check';
import ChairIcon from '@mui/icons-material/Chair';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


// --- Styled Components (Adapting CSS) ---

const ResultsLayout = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr', // Default: single column
  gap: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '280px 1fr', // Sidebar + Main content
  },
}));

const FiltersSidebar = styled(Box)(({ theme }) => ({
    // On medium+ screens, the card inside will be sticky
   [theme.breakpoints.up('md')]: {
        position: 'relative', // Needed for sticky positioning context
        '& .MuiCard-root': {
            position: 'sticky',
            top: theme.spacing(3), // Adjust spacing from top as needed
        }
   }
}));

const FilterGroup = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  '& .MuiFormLabel-root': { // Target main labels within the group
      fontWeight: theme.typography.fontWeightBold,
      marginBottom: theme.spacing(1),
      display: 'block',
  },
}));

const PriceRangeInputs = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.9em',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

const SearchResultEntryCard = styled(Card)(({ theme }) => ({
   marginBottom: theme.spacing(2.5),
   padding: theme.spacing(2),
   display: 'grid',
   gridTemplateColumns: '1fr', // Default: single column
   gap: theme.spacing(2),
   alignItems: 'start',
   [theme.breakpoints.up('sm')]: {
       gridTemplateColumns: '1fr auto', // Details + Price/Actions side-by-side
   }
}));

const ResultDetails = styled(Box)(({ theme }) => ({
   display: 'grid',
   gridTemplateColumns: 'auto 1fr auto', // Icon, Times, Duration
   gap: theme.spacing(2),
   alignItems: 'center',
   [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr', // Stack on small screens
      textAlign: 'center',
      gap: theme.spacing(1),
   }
}));

const TrainInfo = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
    color: theme.palette.primary.main,
    display: 'block',
    margin: '0 auto 0.25rem auto',
  },
  '& span': {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '0.9rem',
  },
}));

const Times = styled(Box)(({ theme }) => ({
   fontSize: '1.1rem',
   textAlign: 'center',
   '& strong': {
      fontSize: '1.2rem',
      fontWeight: theme.typography.fontWeightBold,
   },
   '& .MuiSvgIcon-root': {
       verticalAlign: 'middle',
       margin: theme.spacing(0, 0.5),
       color: theme.palette.text.secondary,
   }
}));

const DurationTransfers = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  textAlign: 'right',
  '& span': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: theme.spacing(0.5),
       '& .MuiSvgIcon-root': {
         marginRight: theme.spacing(0.5),
         fontSize: '1.1em',
      },
  },
  [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing(1),
  }
}));

const PriceActions = styled(Box)(({ theme }) => ({
   textAlign: 'right',
   [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
   }
}));

const PriceDisplay = styled(Typography)(({ theme }) => ({
    fontSize: '1.6rem',
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
    display: 'block',
}));

const ClassSeatOptions = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
   }
}));

// --- TicketSearchResultsPage Component ---
const TicketSearchResultsPage: React.FC = () => {
  const navigate = useNavigate();

  // TODO: Get search params from location.state or URL
  const searchParams = { from: 'София', to: 'Варна', date: '10.04.2025' };

  // Example state for filters
  const [priceRange, setPriceRange] = useState<number[]>([5, 50]);
  const [timeRange, setTimeRange] = useState<number[]>([6, 23]);

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleTimeChange = (_event: Event, newValue: number | number[]) => {
    setTimeRange(newValue as number[]);
  };

  const handleApplyFilters = () => {
      alert('Прилагане на филтри (не е имплементирано)');
  };

  const handleBuyTicket = (trainId: string, price: string) => {
    alert(`Преминаване към закупуване на билет за ${trainId} на цена ${price}`);
    // In real app: navigate('/purchase', { state: { selectedTrain: trainData, price: priceData } });
    navigate('/purchase');
  };

  // --- Example Result Data --- (Replace with actual data fetching)
  const results = [
    {
        id: 'BV 8631', type: 'БВ', departureTime: '10:15', departureStation: 'София', arrivalTime: '17:50', arrivalStation: 'Варна', duration: '7ч 35м', transfers: 'Директен', price: 30.80, classes: [{value: '2', label: '2-ра'}, {value: '1', label: '1-ва (+10 лв.)'}], seatSelection: true
    },
     {
        id: 'BV 2603', type: 'БВ', departureTime: '07:00', departureStation: 'София', arrivalTime: '14:45', arrivalStation: 'Варна', duration: '7ч 45м', transfers: 'Директен', price: 30.80, classes: [{value: '2', label: '2-ра'}, {value: '1', label: '1-ва (+10 лв.)'}], seatSelection: true
    },
     {
        id: 'PV 20105', type: 'ПВ', departureTime: '08:10', departureStation: 'София', arrivalTime: '18:30', arrivalStation: 'Варна', duration: '10ч 20м', transfers: '1 прекачване', price: 25.50, classes: [{value: '2', label: '2-ра'}], seatSelection: false
    },
    // Add more example results if needed
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
       <Typography variant="h3" component="h1" gutterBottom align="center">
         Резултати от търсенето
       </Typography>
       <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
         {searchParams.from} <ArrowForwardIcon fontSize="inherit" sx={{ verticalAlign: 'middle' }}/> {searchParams.to}, {searchParams.date}
       </Typography>

       <ResultsLayout>
          {/* --- Filters Sidebar --- */}
          <FiltersSidebar>
            <Card variant="outlined">
              <CardContent>
                 <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <FilterAltIcon sx={{ mr: 1 }} /> Филтри
                 </Typography>
                 <Divider sx={{ my: 1 }} />

                 <FilterGroup>
                    <Typography component="label" variant="subtitle2">Цена:</Typography>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100} // Adjust max price as needed
                        sx={{ mx: 1 }} // Add horizontal margin for slider thumbs
                    />
                    <PriceRangeInputs>
                        <span>Мин: {priceRange[0]} лв.</span>
                        <span>Макс: {priceRange[1]} лв.</span>
                    </PriceRangeInputs>
                 </FilterGroup>

                 <FilterGroup>
                    <Typography component="label" variant="subtitle2">Време на тръгване:</Typography>
                     <Slider
                        value={timeRange}
                        onChange={handleTimeChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={24} 
                        step={1}
                        valueLabelFormat={(value) => `${String(value).padStart(2, '0')}:00`}
                        sx={{ mx: 1 }}
                    />
                    <PriceRangeInputs>
                        <span>От: {String(timeRange[0]).padStart(2, '0')}:00</span>
                        <span>До: {String(timeRange[1]).padStart(2, '0')}:00</span>
                    </PriceRangeInputs>
                 </FilterGroup>

                 <FilterGroup>
                    <Typography component="label" variant="subtitle2">Прекачвания:</Typography>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Директен" />
                        <FormControlLabel control={<Checkbox defaultChecked size="small" />} label="1 прекачване" />
                        <FormControlLabel control={<Checkbox size="small" />} label="2+ прекачвания" />
                    </FormGroup>
                 </FilterGroup>

                  <FilterGroup>
                    <Typography component="label" variant="subtitle2">Тип влак:</Typography>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Бърз влак (БВ)" />
                        <FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Пътнически (ПВ)" />
                        <FormControlLabel control={<Checkbox size="small" />} label="Крайградски (КПВ)" />
                    </FormGroup>
                 </FilterGroup>

                 <Button 
                    variant="contained" 
                    startIcon={<CheckIcon />} 
                    fullWidth 
                    onClick={handleApplyFilters}
                    sx={{ mt: 1 }}
                  >
                    Приложи филтри
                 </Button>

              </CardContent>
            </Card>
          </FiltersSidebar>

          {/* --- Results List --- */}
          <Box component="main">
            <Typography variant="h5" component="h2" gutterBottom>
                Намерени влакове ({results.length})
            </Typography>

            {results.map((result) => (
                <SearchResultEntryCard key={result.id} variant="outlined">
                    <ResultDetails>
                       <TrainInfo>
                          <TrainIcon />
                          <span>{result.id}</span>
                       </TrainInfo>
                       <Times>
                          <strong>{result.departureTime}</strong> {result.departureStation}
                          <ArrowForwardIcon fontSize="inherit" />
                          <strong>{result.arrivalTime}</strong> {result.arrivalStation}
                       </Times>
                       <DurationTransfers>
                          <span><AccessTimeIcon /> {result.duration}</span>
                          <span style={result.transfers !== 'Директен' ? { color: 'red' } : {}}>
                             <SwapHorizIcon /> {result.transfers}
                          </span>
                       </DurationTransfers>
                    </ResultDetails>
                    <PriceActions>
                         <PriceDisplay>{result.price.toFixed(2)} лв.</PriceDisplay>
                         <ClassSeatOptions>
                             <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
                                 <InputLabel>Класа</InputLabel>
                                 <Select label="Класа" defaultValue={result.classes[0].value}>
                                    {result.classes.map(cls => (
                                        <MenuItem key={cls.value} value={cls.value}>{cls.label}</MenuItem>
                                    ))}
                                 </Select>
                             </FormControl>
                             <Button 
                                variant="outlined" 
                                size="small" 
                                startIcon={<ChairIcon />} 
                                disabled={!result.seatSelection}
                                onClick={() => alert('Избор на място (не е имплементиран)')}
                            >
                                Избор място
                            </Button>
                         </ClassSeatOptions>
                         <Button 
                            variant="contained" 
                            startIcon={<ShoppingCartIcon />} 
                            fullWidth 
                            onClick={() => handleBuyTicket(result.id, result.price.toFixed(2))}
                         >
                            Купи билет
                         </Button>
                    </PriceActions>
                </SearchResultEntryCard>
            ))}

            {/* TODO: Add Pagination if many results */} 
          </Box>
       </ResultsLayout>
    </Container>
  );
};

export default TicketSearchResultsPage; 