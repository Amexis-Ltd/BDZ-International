// This is just a placeholder edit to trigger the rename operation.
// The actual content doesn't matter here.
console.log('Renaming file...');

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
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { bg } from 'date-fns/locale/bg';
import { styled } from '@mui/material/styles';

// Icons
import ScheduleIcon from '@mui/icons-material/Schedule';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrainIcon from '@mui/icons-material/Train';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite'; // For active favorite
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Details
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'; // Buy Ticket
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EventIcon from '@mui/icons-material/Event'; // Add to Calendar
import StarIcon from '@mui/icons-material/Star'; // Favorite Routes


// --- Styled Components (Adapting CSS) ---

const SearchFormCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2, 3),
}));

const TimetableSearchForm = styled('form')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr', // Default mobile: 1 column
  gap: theme.spacing(2),
  alignItems: 'end',
  [theme.breakpoints.up('md')]: {
      // Medium screens: 2 columns for inputs, full for options/button
      gridTemplateColumns: '1fr 1fr',
  },
  [theme.breakpoints.up('lg')]: {
      // Large screens: 5 columns as per HTML example
       gridTemplateColumns: '1fr 1fr 0.8fr 0.5fr auto',
       '& .form-group-options': {
            gridColumn: '1 / -1',
            marginTop: theme.spacing(1),
       },
       '& .form-group-submit': {
            gridColumn: '5 / 6', 
            alignSelf: 'end',
       }
  },
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
  '& span': {
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
  gap: theme.spacing(1),
  alignItems: 'flex-end',
   [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(1),
   }
}));

const ExportSaveSection = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(3),
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

// --- TimetableSearchPage Component ---
const TimetableSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [dateValue, setDateValue] = useState<Date | null>(new Date());
  const [timeValue, setTimeValue] = useState<Date | null>(null);
  const [timeType, setTimeType] = useState('departure');
  const [favorites, setFavorites] = useState<string[]>(['BV 2613']); // Example favorite

  // Placeholder handlers
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Търсенето на разписание все още не е имплементирано.');
    // In real app: fetch results based on form values
  };

  const handleApplyFilters = () => {
    alert('Филтрирането все още не е имплементирано.');
    // In real app: refetch or filter existing results
  };

  const toggleFavorite = (trainId: string) => {
      setFavorites(prev => 
          prev.includes(trainId) 
          ? prev.filter(id => id !== trainId) 
          : [...prev, trainId]
      );
  };

  const handleBuyTicket = (/* trainId: string */) => { 
      // trainId is unused
      navigate('/purchase');
   };

  const handleShowDetails = (trainId: string) => {
      alert(`Показване на детайли за ${trainId} (не е имплементирано)`);
      // In real app: show modal or navigate to details page
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ScheduleIcon fontSize="inherit" sx={{ mr: 1 }} /> Разписания
      </Typography>

      <SearchFormCard variant="outlined">
        <TimetableSearchForm onSubmit={handleSearchSubmit}>
            <TextField label="От гара" variant="outlined" placeholder="Например: София" name="fromStation" />
            <TextField label="До гара" variant="outlined" placeholder="Например: Варна" name="toStation" />

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
                <DatePicker
                    label="Дата"
                    value={dateValue}
                    onChange={setDateValue}
                    slotProps={{ textField: { variant: 'outlined' } }}
                />
                <TimePicker
                    label="Час"
                    value={timeValue}
                    onChange={setTimeValue}
                    slotProps={{ textField: { variant: 'outlined' } }}
                    ampm={false} // Use 24-hour format
                />
            </LocalizationProvider>

            <Box className="form-group-options">
                <RadioGroup row name="timeType" value={timeType} onChange={(e) => setTimeType(e.target.value)}>
                    <FormControlLabel value="departure" control={<Radio />} label="Заминаване" />
                    <FormControlLabel value="arrival" control={<Radio />} label="Пристигане" />
                </RadioGroup>
            </Box>

            <Box className="form-group-submit">
                <Button type="submit" variant="contained" size="large" startIcon={<SearchIcon />} fullWidth sx={{ height: '56px' /* Match textfield height */ }}>
                    Търсене
                </Button>
            </Box>
        </TimetableSearchForm>
      </SearchFormCard>

      <FilterSortControls>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Сортирай по</InputLabel>
              <Select label="Сортирай по" defaultValue="departureTime">
                  <MenuItem value="departureTime">Час на заминаване</MenuItem>
                  <MenuItem value="arrivalTime">Час на пристигане</MenuItem>
                  <MenuItem value="duration">Продължителност</MenuItem>
              </Select>
          </FormControl>
          <Box>
              <Typography variant="caption" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>Филтри:</Typography>
              <FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Само директни" />
          </Box>
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

      {/* --- Results (Example Data) --- */}
      <TimetableResultsCard variant="outlined">
         <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            Намерени влакове (Пример)
          </Typography>
          <Divider sx={{ mb: 2 }}/>

          {/* Example Entry 1 */}
          <TimetableEntry>
            <TrainInfo>
               <TrainIcon />
               <span>БВ 8631</span>
            </TrainInfo>
            <RouteDetails>
               <TimeStation><strong>10:15</strong> София</TimeStation>
               <DurationTransfers>
                  <span><AccessTimeIcon /> 7ч 35м</span>
                  <span><SwapHorizIcon /> Директен</span>
               </DurationTransfers>
               <TimeStation><strong>17:50</strong> Варна</TimeStation>
            </RouteDetails>
            <Actions>
              <Tooltip title={favorites.includes('BV 8631') ? "Премахни от любими" : "Добави в любими"}>
                 <IconButton size="small" onClick={() => toggleFavorite('BV 8631')} color={favorites.includes('BV 8631') ? "error" : "default"}>
                   {favorites.includes('BV 8631') ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                 </IconButton>
              </Tooltip>
               <Button variant="outlined" size="small" startIcon={<InfoOutlinedIcon />} onClick={() => handleShowDetails('BV 8631')}>Детайли</Button>
               <Button variant="contained" size="small" startIcon={<ConfirmationNumberIcon />} onClick={() => handleBuyTicket()}>Купи билет</Button>
            </Actions>
          </TimetableEntry>

          {/* Example Entry 2 */}
          <TimetableEntry>
            <TrainInfo>
               <TrainIcon />
               <span>БВ 2613</span>
            </TrainInfo>
            <RouteDetails>
               <TimeStation><strong>13:00</strong> София</TimeStation>
               <DurationTransfers>
                  <span><AccessTimeIcon /> 6ч 10м</span>
                  <span style={{ color: 'red' }}><SwapHorizIcon /> 1 прекачване</span>
               </DurationTransfers>
               <TimeStation><strong>19:10</strong> Бургас</TimeStation>
            </RouteDetails>
            <Actions>
               <Tooltip title={favorites.includes('BV 2613') ? "Премахни от любими" : "Добави в любими"}>
                 <IconButton size="small" onClick={() => toggleFavorite('BV 2613')} color={favorites.includes('BV 2613') ? "error" : "default"}>
                   {favorites.includes('BV 2613') ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                 </IconButton>
               </Tooltip>
               <Button variant="outlined" size="small" startIcon={<InfoOutlinedIcon />} onClick={() => handleShowDetails('BV 2613')}>Детайли</Button>
               <Button variant="contained" size="small" startIcon={<ConfirmationNumberIcon />} onClick={() => handleBuyTicket()}>Купи билет</Button>
            </Actions>
          </TimetableEntry>
          
          {/* ... more entries ... */}

      </TimetableResultsCard>

      <ExportSaveSection>
           <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="outlined" startIcon={<PictureAsPdfIcon />}>Експорт PDF</Button>
                <Button variant="outlined" startIcon={<EventIcon />}>Добави в календар</Button>
           </Box>
            <Box>
                 <Button variant="contained" color="secondary" startIcon={<StarIcon />}>Моите любими маршрути</Button>
            </Box>
      </ExportSaveSection>

    </Container>
  );
};

export default TimetableSearchPage; 