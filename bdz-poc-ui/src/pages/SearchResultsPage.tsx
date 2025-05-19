import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  Divider,
  Card,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrainIcon from '@mui/icons-material/Train';
import ScheduleIcon from '@mui/icons-material/Schedule'; // Clock icon
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'; // Arrows for transfers/direction
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChairIcon from '@mui/icons-material/Chair'; // Seat icon
import CheckIcon from '@mui/icons-material/Check';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate
import { useAppSelector } from '../store/hooks'; // Import Redux hook
import { selectIsCustomerLoggedIn } from '../store/features/auth/authSlice'; // Import selector

// --- Styled Components (Adapting CSS) ---

const PageSubtitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '1.1rem',
  marginBottom: theme.spacing(4), // Increased spacing
}));

const ResultsLayout = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  gap: theme.spacing(3),
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '220px 1fr',
    gap: theme.spacing(2),
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr', // Stack on medium screens and below
  },
}));

const FiltersCard = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: theme.spacing(10), // Adjust based on AppBar height + desired gap
  padding: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    position: 'static', // Unstick when stacked
    marginBottom: theme.spacing(3),
  },
}));

const FilterGroup = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
}));

const FilterLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  display: 'block',
}));

const ResultEntryCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

const ResultDetails = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: theme.spacing(1.5),
  alignItems: 'center',
  [theme.breakpoints.down('xs')]: { // Adjust breakpoint if needed earlier
    gridTemplateColumns: '1fr', // Stack train/time/duration fully on extra small
    textAlign: 'center',
    gap: theme.spacing(1),
  },
}));

const TrainInfo = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '1.8rem',
    color: theme.palette.primary.main,
    display: 'block',
    marginBottom: theme.spacing(0.5),
  },
  '& span': {
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
}));

const TimesInfo = styled(Box)(({ theme }) => ({
  fontSize: '1.1rem',
  textAlign: 'center', // Center align by default, adjust if needed
  '& strong': {
    fontSize: '1.2rem',
  },
  '& .arrow': {
    margin: theme.spacing(0, 1),
    color: theme.palette.text.secondary,
    verticalAlign: 'middle',
  },
   [theme.breakpoints.down('xs')]: {
       fontSize: '1rem',
       '& strong': { fontSize: '1.1rem' },
   }
}));

const DurationTransfersInfo = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  textAlign: 'right',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem', // Smaller icon
    marginRight: theme.spacing(0.5),
    verticalAlign: 'middle',
  },
  '& span': {
    display: 'block',
    marginBottom: theme.spacing(0.5),
    '&:last-child': {
        marginBottom: 0,
    },
  },
    [theme.breakpoints.down('xs')]: {
        textAlign: 'center',
        marginTop: theme.spacing(1),
    },
}));

const PriceActions = styled(Box)(({ theme }) => ({
  textAlign: 'right',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end', // Align items to the right
   [theme.breakpoints.down('sm')]: {
       textAlign: 'center',
       alignItems: 'center', // Center items when stacked
       marginTop: theme.spacing(2),
   },
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
  display: 'block',
  [theme.breakpoints.down('xs')]: {
      fontSize: '1.4rem',
  }
}));

const ClassSeatOptions = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  alignItems: 'center',
  '& .MuiInputLabel-root, & .MuiSelect-select': { // Target label and select text
      fontSize: '0.9em',
  },
   '& .MuiSelect-select': {
       paddingTop: theme.spacing(0.5), // Adjust padding if needed
       paddingBottom: theme.spacing(0.5),
   },
  '& .MuiOutlinedInput-root': { // Target the input outline
      fontSize: '0.9em',
  },
  '& .MuiButton-root': { // Target the button
       padding: theme.spacing(0.5, 1),
       fontSize: '0.9em',
       minWidth: 'auto',
   },
   [theme.breakpoints.down('sm')]: {
       justifyContent: 'center',
   },
}));

// --- Dummy Data ---
const dummyResults = [
  {
    id: 1,
    trainNumber: 'БВ 8631',
    departureTime: '10:15',
    departureStation: 'София',
    arrivalTime: '17:50',
    arrivalStation: 'Варна',
    duration: '7ч 35м',
    transfers: 'Директен',
    price: '30.80',
    classes: [{ value: 2, label: '2-ра' }, { value: 1, label: '1-ва (+10 лв.)' }],
    seatSelectionAvailable: true,
  },
  {
    id: 2,
    trainNumber: 'БВ 2603',
    departureTime: '07:00',
    departureStation: 'София',
    arrivalTime: '14:45',
    arrivalStation: 'Варна',
    duration: '7ч 45м',
    transfers: 'Директен',
    price: '30.80',
    classes: [{ value: 2, label: '2-ра' }, { value: 1, label: '1-ва (+10 лв.)' }],
    seatSelectionAvailable: true,
  },
  {
    id: 3,
    trainNumber: 'ПВ 20105',
    departureTime: '08:10',
    departureStation: 'София',
    arrivalTime: '18:30',
    arrivalStation: 'Варна',
    duration: '10ч 20м',
    transfers: '1 прекачване',
    transferColor: 'error.main', // Indicate transfer with color
    price: '25.50',
    classes: [{ value: 2, label: '2-ра' }],
    seatSelectionAvailable: false,
  },
    {
    id: 4,
    trainNumber: 'МБВ 461',
    departureTime: '07:50',
    departureStation: 'София',
    arrivalTime: '17:35',
    arrivalStation: 'Букурещ (Nord)', // Example international
    duration: '9ч 45м',
    transfers: 'Директен',
    price: '~ 65.00', // Approximate price
    classes: [
        { value: 2, label: '2-ра' },
        { value: 1, label: '1-ва' },
        { value: 'couchette', label: 'Кушет' }
    ],
    seatSelectionAvailable: true,
  },
];

// --- SearchResultsPage Component ---
const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const isCustomerLoggedIn = useAppSelector(selectIsCustomerLoggedIn); // Get login state

  // Expect journey details in state (from HomePage or SchedulePage's "Билети" button)
  const searchState = location.state || { from: 'Неизвестно', to: 'Неизвестно', date: '' };

  // Always display Journey search results title and subtitle
  const pageTitle = 'Резултати от търсенето';
  const pageSubtitle = `${searchState.from || 'От?'} <SwapHorizIcon sx={{ verticalAlign: 'middle', mx: 0.5 }} /> ${searchState.to || 'До?'}, ${searchState.date || ''}`;

  const handleBuyTicketClick = (result: any) => {
      console.log(`Initiating purchase for ${result.trainNumber}...`);
      if (isCustomerLoggedIn) {
          // User is logged in, proceed to purchase flow
          console.log('Customer is logged in. Navigating to purchase page...');
          // Pass the specific result as 'trainDetails' in the state
          navigate('/purchase', { state: { trainDetails: result } }); 
      } else {
          // User is not logged in, redirect to customer login
          alert('Моля, влезте в своя клиентски профил, за да закупите билет.'); // Optional feedback
          navigate('/customer-login', {
              replace: true, // Replace history entry
              state: { 
                  from: location.pathname + location.search, // Remember where they came from
                  purchaseIntent: result // Pass train details 
              }
          });
      }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom color="primary">
        {pageTitle}
      </Typography>
      <PageSubtitle dangerouslySetInnerHTML={{ __html: pageSubtitle }} />

      <ResultsLayout>
        {/* Filters Sidebar - Keep as is for journey results */}
        <Box component="aside">
           <FiltersCard>
             <Typography variant="h6" component="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
               <FilterListIcon /> Филтри
             </Typography>
             <Divider sx={{ mb: 2 }} />

             <FilterGroup>
               <FilterLabel variant="body1">Цена:</FilterLabel>
               {/* Replace with actual MUI Slider */}
               <Slider
                   defaultValue={30} // Example value
                   aria-labelledby="price-slider"
                   valueLabelDisplay="auto"
                   min={5}
                   max={50}
                    sx={{ mb: 0 }}
                 />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9em', color: 'text.secondary', px: 0.5 }}>
                     <span>5 лв.</span>
                     <span>50 лв.</span>
                 </Box>
             </FilterGroup>

             <FilterGroup>
               <FilterLabel variant="body1">Време на тръгване:</FilterLabel>
               {/* Replace with actual MUI Slider */}
                <Slider
                   defaultValue={[6, 23]} // Example range value
                   aria-labelledby="time-slider"
                   valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}:00`}
                   min={0}
                   max={24}
                    sx={{ mb: 0 }}
                    marks={[ { value: 6, label: '06:00'}, { value: 12, label: '12:00'}, { value: 18, label: '18:00'}, { value: 24, label: '24:00'} ]}
                 />
             </FilterGroup>

             <FilterGroup>
               <FilterLabel variant="body1">Прекачвания:</FilterLabel>
               <FormControlLabel control={<Checkbox defaultChecked size="small"/>} label="Директен" />
               <FormControlLabel control={<Checkbox defaultChecked size="small"/>} label="1 прекачване" />
               <FormControlLabel control={<Checkbox size="small"/>} label="2+ прекачвания" />
             </FilterGroup>

             <FilterGroup>
               <FilterLabel variant="body1">Тип влак:</FilterLabel>
               <FormControlLabel control={<Checkbox defaultChecked size="small"/>} label="Бърз влак (БВ)" />
               <FormControlLabel control={<Checkbox defaultChecked size="small"/>} label="Пътнически (ПВ)" />
               <FormControlLabel control={<Checkbox size="small"/>} label="Крайградски (КПВ)" />
             </FilterGroup>

             <Button variant="contained" fullWidth startIcon={<CheckIcon />} onClick={() => console.log('Apply filters clicked')}>
               Приложи филтри
             </Button>
           </FiltersCard>
        </Box>

        {/* Results List - Always show journey results */}
        <Box component="main">
          <>
            <Typography variant="h5" component="h2" gutterBottom>
              Намерени влакове ({dummyResults.length})
            </Typography>
            {dummyResults.map((result) => (
              <ResultEntryCard key={result.id} elevation={2}>
                <ResultDetails>
                  <TrainInfo>
                    <TrainIcon />
                    <span>{result.trainNumber}</span>
                  </TrainInfo>
                  <TimesInfo>
                    <strong>{result.departureTime}</strong> {result.departureStation}
                    <span className="arrow"><SwapHorizIcon fontSize="small"/></span>
                    <strong>{result.arrivalTime}</strong> {result.arrivalStation}
                  </TimesInfo>
                  <DurationTransfersInfo>
                    <span><ScheduleIcon /> {result.duration}</span>
                     <span style={{ color: result.transferColor || 'inherit' }}>
                         <SwapHorizIcon /> {result.transfers}
                     </span>
                  </DurationTransfersInfo>
                </ResultDetails>

                <PriceActions>
                  <PriceTypography>{result.price} лв.</PriceTypography>
                  <ClassSeatOptions>
                     <Typography variant="caption" component="label" htmlFor={`class-${result.id}`} sx={{ mr: 0.5 }}>Класа:</Typography>
                    <Select
                      id={`class-${result.id}`}
                      name={`class-${result.id}`}
                      defaultValue={result.classes[0].value}
                      size="small"
                      variant="outlined"
                      sx={{ minWidth: 80 }} // Adjust width as needed
                    >
                      {result.classes.map(cls => (
                          <MenuItem key={cls.value} value={cls.value}>{cls.label}</MenuItem>
                      ))}
                    </Select>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ChairIcon />}
                      disabled={!result.seatSelectionAvailable}
                      onClick={() => console.log(`Seat selection for ${result.trainNumber}`)}
                     >
                      Избор място
                    </Button>
                  </ClassSeatOptions>
                  <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleBuyTicketClick(result)}
                      sx={{ width: {xs: 'auto', sm: '100%'} }}
                  >
                    Купи билет
                  </Button>
                </PriceActions>
              </ResultEntryCard>
            ))}
          </>
        </Box>
      </ResultsLayout>
    </Container>
  );
};

export default SearchResultsPage; 