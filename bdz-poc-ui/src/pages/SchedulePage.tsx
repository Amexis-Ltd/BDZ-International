import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  FormLabel,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { bg } from 'date-fns/locale/bg';
import { styled } from '@mui/material/styles';

// Icons (Include all needed)
import ScheduleIcon from '@mui/icons-material/Schedule';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrainIcon from '@mui/icons-material/Train';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';

// --- Type Definitions ---
interface ScheduleResult {
    id: string;
    trainNumber: string;
    fromStation: string;
    toStation: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    transfers: string;
    transferDetails?: string;
    isFavorite?: boolean;
}

// --- Styled Components (Based on last HTML) ---
const SearchFormCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2, 3),
}));

const FilterSortControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

const TimetableResultsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  marginBottom: theme.spacing(3), // Add margin bottom
}));

const TimetableEntry = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
   [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      textAlign: 'center',
      gap: theme.spacing(1.5),
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

const RouteDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
  }
}));

const TimeStation = styled(Box)(({ theme }) => ({
  fontSize: '1.1rem',
  textAlign: 'center',
  '& strong': {
    display: 'block',
    fontSize: '1.2rem',
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const DurationTransfers = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  '& > span': { // Target direct span children
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing(0.5),
       '& .MuiSvgIcon-root': {
         marginRight: theme.spacing(0.5),
         fontSize: '1.1em',
      },
  },
}));

const Actions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  alignItems: 'flex-end',
   [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      flexWrap: 'wrap', // Allow wrapping
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(1),
      gap: theme.spacing(1), // Add gap for horizontal layout
   }
}));

const ExportSaveSection = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(0), // Remove top margin if results card has bottom margin
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5, 2),
    backgroundColor: theme.palette.grey[50],
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
}));

// --- Dummy Data ---
const dummyScheduleResults: ScheduleResult[] = [
  {
    id: 'res1',
    trainNumber: 'БВ 8631',
    fromStation: 'София',
    toStation: 'Варна',
    departureTime: '10:15',
    arrivalTime: '17:50',
    duration: '7ч 35м',
    transfers: 'Директен',
    isFavorite: false,
  },
  {
    id: 'res2',
    trainNumber: 'БВ 2613',
    fromStation: 'София',
    toStation: 'Бургас',
    departureTime: '13:00',
    arrivalTime: '19:10',
    duration: '6ч 10м',
    transfers: '1 прекачване',
    transferDetails: 'Карлово',
    isFavorite: true,
  },
  {
    id: 'res3',
    trainNumber: 'ПВ 10115',
    fromStation: 'София',
    toStation: 'Пловдив',
    departureTime: '14:45',
    arrivalTime: '17:50',
    duration: '3ч 05м',
    transfers: 'Директен',
    isFavorite: false,
  },
];

// --- SchedulePage Component ---
const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  // Form State
  const [fromStation, setFromStation] = useState<string>('София');
  const [toStation, setToStation] = useState<string>('Варна');
  const [dateValue, setDateValue] = useState<Date | null>(new Date());
  const [timeValue, setTimeValue] = useState<Date | null>(null);
  const [timeType, setTimeType] = useState('departure'); // 'departure' or 'arrival'

  // Results State (using dummy data)
  const [results, setResults] = useState<ScheduleResult[]>(dummyScheduleResults);

  // --- Handlers ---
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Navigate to SearchResultsPage with form data
    const searchData = {
        type: 'journey', // Explicitly journey search
        from: fromStation,
        to: toStation,
        date: dateValue ? dateValue.toLocaleDateString('bg-BG') : null,
        // Optional: Pass time and timeType if SearchResultsPage can use them
        // time: timeValue ? timeValue.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' }) : null,
        // timeType: timeType,
    };
    console.log('Navigating to search results from schedule page form:', searchData);
    navigate('/search-results', { state: searchData });
  };

  const handleTimeTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeType((event.target as HTMLInputElement).value);
  };

  const handleApplyFilters = () => {
    console.log('Apply filters clicked - (Not implemented)');
    // In real app: refetch or filter existing results state
  };

  const toggleFavorite = (resultId: string) => {
      setResults(prevResults => prevResults.map(r =>
          r.id === resultId ? { ...r, isFavorite: !r.isFavorite } : r
      ));
  };

  const handleBuyTicket = (result: ScheduleResult) => {
    // Navigate to SearchResultsPage, passing the specific details of this result
     const searchData = {
        type: 'journey', // Still a journey search
        from: result.fromStation,
        to: result.toStation,
        date: dateValue ? dateValue.toLocaleDateString('bg-BG') : null, // Use date from form
        trainNumber: result.trainNumber // Pass train number
    };
    console.log('Navigating to search results from schedule result button:', searchData);
    navigate('/search-results', { state: searchData });
  };

  const handleShowDetails = (resultId: string) => {
      alert(`Показване на детайли за ${resultId} (не е имплементирано)`);
  };

  // --- Rendering ---
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ScheduleIcon fontSize="inherit" sx={{ mr: 1 }} /> Разписания
      </Typography>

      {/* Search Form */}
      <SearchFormCard variant="outlined">
        <Box component="form" onSubmit={handleSearchSubmit}>
             {/* Refactored Grid with Box for Form Layout */}
             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end' }}>
                 <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '150px' } }}> 
                     <TextField fullWidth required label="От гара" variant="outlined" value={fromStation} onChange={e => setFromStation(e.target.value)} placeholder="Например: София" name="fromStation" />
                 </Box>
                 <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '150px' } }}>
                     <TextField fullWidth required label="До гара" variant="outlined" value={toStation} onChange={e => setToStation(e.target.value)} placeholder="Например: Варна" name="toStation" />
                 </Box>
                 <Box sx={{ width: { xs: 'calc(50% - 8px)', md: 'auto' }, minWidth: { md: 150 } }}>
                     <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
                         <DatePicker
                             label="Дата"
                             value={dateValue}
                             onChange={setDateValue}
                             slotProps={{ textField: { fullWidth: true, variant: 'outlined', required: true } }}
                         />
                     </LocalizationProvider>
                 </Box>
                 <Box sx={{ width: { xs: 'calc(50% - 8px)', md: 'auto' }, minWidth: { md: 150 } }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
                        <TimePicker
                            label="Час"
                            value={timeValue}
                            onChange={setTimeValue}
                            slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                            ampm={false}
                        />
                    </LocalizationProvider>
                 </Box>
                 <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
                     <Button fullWidth type="submit" variant="contained" size="large" startIcon={<SearchIcon />} sx={{ height: '56px' }}>
                         Търсене
                     </Button>
                 </Box>
             </Box>
             {/* Time Type Radio Buttons - Placed below the flex container */}
             <FormControl component="fieldset" sx={{ mt: 2 }}> 
               <FormLabel component="legend" sx={{ fontSize: '0.9rem', mb: 0.5 }}>Посоченият час е за:</FormLabel>
                <RadioGroup row name="timeType" value={timeType} onChange={handleTimeTypeChange}> 
                  <FormControlLabel value="departure" control={<Radio size="small" />} label="Заминаване" />
                  <FormControlLabel value="arrival" control={<Radio size="small" />} label="Пристигане" />
                </RadioGroup>
              </FormControl>
         </Box>
      </SearchFormCard>

      {/* Filter and Sort Controls */}
      <FilterSortControls>
           <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Сортирай по</InputLabel>
                <Select label="Сортирай по" defaultValue="departureTime">
                    <MenuItem value="departureTime">Час на заминаване</MenuItem>
                    <MenuItem value="arrivalTime">Час на пристигане</MenuItem>
                    <MenuItem value="duration">Продължителност</MenuItem>
                </Select>
            </FormControl>
            <FormControlLabel control={<Checkbox size="small" />} label="Само директни" sx={{ mr: 2 }}/>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Тип влак</InputLabel>
                <Select label="Тип влак" defaultValue="all">
                    <MenuItem value="all">Всички</MenuItem>
                    <MenuItem value="fast">Бърз влак (БВ)</MenuItem>
                    <MenuItem value="passenger">Пътнически (ПВ)</MenuItem>
                    <MenuItem value="suburban">Крайградски (КПВ)</MenuItem>
                </Select>
            </FormControl>
            <Button variant="outlined" size="small" startIcon={<FilterListIcon />} onClick={handleApplyFilters}>
                Приложи
            </Button>
      </FilterSortControls>

      {/* Results Area */}
      <TimetableResultsCard variant="outlined">
        <Typography variant="h6" component="h2" sx={{ px: 3, pt: 1, mb: 1 }}>
            Намерени влакове ({results.length})
        </Typography>
        {results.length > 0 ? (
          results.map((result) => (
            <TimetableEntry key={result.id}>
              <TrainInfo>
                <TrainIcon />
                <span>{result.trainNumber}</span>
              </TrainInfo>

              <RouteDetails>
                 <TimeStation>
                    <strong>{result.departureTime}</strong>
                    <span>{result.fromStation}</span>
                 </TimeStation>
                 <DurationTransfers>
                    <span><AccessTimeIcon /> {result.duration}</span>
                    <span><SwapHorizIcon /> {result.transfers}{result.transferDetails ? ` (${result.transferDetails})` : ''}</span>
                 </DurationTransfers>
                 <TimeStation>
                    <strong>{result.arrivalTime}</strong>
                    <span>{result.toStation}</span>
                 </TimeStation>
              </RouteDetails>

              <Actions>
                 <Tooltip title={result.isFavorite ? "Премахни от любими" : "Добави в любими"}>
                     <IconButton size="small" onClick={() => toggleFavorite(result.id)} color={result.isFavorite ? "error" : "default"}>
                         {result.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                     </IconButton>
                 </Tooltip>
                 <Tooltip title="Детайли за влака">
                     <Button size="small" variant="text" onClick={() => handleShowDetails(result.id)} startIcon={<InfoOutlinedIcon fontSize="small"/>}>
                         Детайли
                     </Button>
                 </Tooltip>
                 <Tooltip title="Купи билет за този влак">
                     <Button size="small" variant="contained" onClick={() => handleBuyTicket(result)} startIcon={<ConfirmationNumberIcon fontSize="small"/>}>
                         Купи билет
                     </Button>
                 </Tooltip>
              </Actions>
            </TimetableEntry>
          ))
        ) : (
          <Typography sx={{ p: 3, textAlign: 'center' }}>Няма намерени влакове за избраните критерии.</Typography>
        )}
      </TimetableResultsCard>

    </Container>
  );
};

export default SchedulePage; 