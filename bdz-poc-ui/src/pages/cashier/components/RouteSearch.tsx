import React, { useState } from 'react';
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  Autocomplete,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { bg } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { setSearchParams } from '../../../store/features/ticket/ticketSlice';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RouteIcon from '@mui/icons-material/Route';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PetsIcon from '@mui/icons-material/Pets';

// Define passenger types
type PassengerType = 'adults' | 'children' | 'seniors' | 'students';

const PASSENGER_TYPES: Record<PassengerType, { label: string; max: number }> = {
  adults: { label: 'Възрастни', max: 9 },
  children: { label: 'Деца', max: 9 },
  seniors: { label: 'Пенсионери', max: 9 },
  students: { label: 'Студенти', max: 9 },
};

// Define additional items types
type AdditionalItemType = 'bicycle' | 'pet';

const ADDITIONAL_ITEMS: Record<AdditionalItemType, { label: string; max: number; icon: React.ReactNode }> = {
  bicycle: { label: 'Велосипед', max: 2, icon: <DirectionsBikeIcon /> },
  pet: { label: 'Домашен любимец', max: 1, icon: <PetsIcon /> },
};

// Mock data for international stations
const INTERNATIONAL_STATIONS = {
  'България': ['София', 'Пловдив', 'Варна', 'Бургас', 'Русе'],
  'Австрия': ['Виена', 'Залцбург', 'Грац', 'Инсбрук', 'Линц'],
  'Германия': ['Берлин', 'Мюнхен', 'Хамбург', 'Франкфурт', 'Кьолн'],
  'Унгария': ['Будапеща', 'Дебрецен', 'Мишколц', 'Сегед', 'Печ'],
  'Румъния': ['Букурещ', 'Клуж-Напока', 'Тимишоара', 'Яш', 'Констанца'],
  'Сърбия': ['Белград', 'Ниш', 'Нови Сад', 'Крагуевац', 'Суботица'],
  'Турция': ['Истанбул', 'Анкара', 'Измир', 'Бурса', 'Анталия'],
};

// Predefined departure times
const DEPARTURE_TIMES = [
  '06:10', '07:30', '08:45', '10:15', '11:43', '12:30',
  '14:20', '15:50', '17:15', '18:45', '20:30', '22:10'
];

// Define European cities with their countries
const EUROPEAN_CITIES = [
  // Bulgaria
  { city: 'София', country: 'България' },
  { city: 'Пловдив', country: 'България' },
  { city: 'Варна', country: 'България' },
  { city: 'Бургас', country: 'България' },
  { city: 'Русе', country: 'България' },
  // Austria
  { city: 'Виена', country: 'Австрия' },
  { city: 'Залцбург', country: 'Австрия' },
  { city: 'Грац', country: 'Австрия' },
  { city: 'Инсбрук', country: 'Австрия' },
  { city: 'Линц', country: 'Австрия' },
  // Germany
  { city: 'Берлин', country: 'Германия' },
  { city: 'Мюнхен', country: 'Германия' },
  { city: 'Хамбург', country: 'Германия' },
  { city: 'Франкфурт', country: 'Германия' },
  { city: 'Кьолн', country: 'Германия' },
  // Hungary
  { city: 'Будапеща', country: 'Унгария' },
  { city: 'Дебрецен', country: 'Унгария' },
  { city: 'Мишколц', country: 'Унгария' },
  { city: 'Сегед', country: 'Унгария' },
  { city: 'Печ', country: 'Унгария' },
  // Romania
  { city: 'Букурещ', country: 'Румъния' },
  { city: 'Клуж-Напока', country: 'Румъния' },
  { city: 'Тимишоара', country: 'Румъния' },
  { city: 'Яш', country: 'Румъния' },
  { city: 'Констанца', country: 'Румъния' },
  // Serbia
  { city: 'Белград', country: 'Сърбия' },
  { city: 'Ниш', country: 'Сърбия' },
  { city: 'Нови Сад', country: 'Сърбия' },
  { city: 'Крагуевац', country: 'Сърбия' },
  { city: 'Суботица', country: 'Сърбия' },
  // Turkey
  { city: 'Истанбул', country: 'Турция' },
  { city: 'Анкара', country: 'Турция' },
  { city: 'Измир', country: 'Турция' },
  { city: 'Бурса', country: 'Турция' },
  { city: 'Анталия', country: 'Турция' },
  // Additional European cities
  { city: 'Париж', country: 'Франция' },
  { city: 'Лондон', country: 'Великобритания' },
  { city: 'Рим', country: 'Италия' },
  { city: 'Мадрид', country: 'Испания' },
  { city: 'Амстердам', country: 'Холандия' },
  { city: 'Брюксел', country: 'Белгия' },
  { city: 'Прага', country: 'Чехия' },
  { city: 'Варшава', country: 'Полша' },
  { city: 'Братислава', country: 'Словакия' },
  { city: 'Загреб', country: 'Хърватия' },
  { city: 'Любляна', country: 'Словения' },
  { city: 'Букурещ', country: 'Румъния' },
  { city: 'Атина', country: 'Гърция' },
  { city: 'Лисабон', country: 'Португалия' },
  { city: 'Дъблин', country: 'Ирландия' },
  { city: 'Осло', country: 'Норвегия' },
  { city: 'Стокхолм', country: 'Швеция' },
  { city: 'Хелзинки', country: 'Финландия' },
  { city: 'Копенхаген', country: 'Дания' },
];

export default function RouteSearch() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [route, setRoute] = useState({
    fromStation: '',
    toStation: '',
    departureDate: new Date(),
    departureTime: '',
    passengers: {
      adults: 1,
      children: 0,
      seniors: 0,
      students: 0,
    } as Record<PassengerType, number>,
    additionalItems: {
      bicycle: 0,
      pet: 0,
    } as Record<AdditionalItemType, number>,
  });

  const handleSwapStations = () => {
    setRoute(prev => ({
      ...prev,
      fromStation: prev.toStation,
      toStation: prev.fromStation,
    }));
  };

  const handlePassengerChange = (type: PassengerType, change: number) => {
    setRoute(prev => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: Math.max(0, Math.min(PASSENGER_TYPES[type].max, prev.passengers[type] + change)),
      },
    }));
  };

  const handleAdditionalItemChange = (type: AdditionalItemType, change: number) => {
    setRoute(prev => ({
      ...prev,
      additionalItems: {
        ...prev.additionalItems,
        [type]: Math.max(0, Math.min(ADDITIONAL_ITEMS[type].max, prev.additionalItems[type] + change)),
      },
    }));
  };

  const handleSearch = () => {
    // Navigate to search results with the route parameters
    navigate('/cashier/routes/results', {
      state: {
        route: {
          ...route,
          departureDateTime: route.departureTime
            ? new Date(route.departureDate.setHours(
                parseInt(route.departureTime.split(':')[0]),
                parseInt(route.departureTime.split(':')[1])
              )).toISOString()
            : route.departureDate.toISOString(),
        },
      },
    });

    // Dispatch the search parameters
    dispatch(setSearchParams({
      fromStation: route.fromStation,
      toStation: route.toStation,
      departureDate: route.departureDate.toISOString(),
      departureTime: route.departureTime,
      passengers: route.passengers,
    }));
  };

  const getTotalPassengers = () => {
    return Object.values(route.passengers).reduce((sum, count) => sum + count, 0);
  };

  const getPassengerSummary = () => {
    const summary = Object.entries(route.passengers)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => `${PASSENGER_TYPES[type as PassengerType].label}: ${count}`)
      .join(', ');
    return summary || 'Изберете пътници';
  };

  const getAdditionalItemsSummary = () => {
    const summary = Object.entries(route.additionalItems)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => `${ADDITIONAL_ITEMS[type as AdditionalItemType].label}: ${count}`)
      .join(', ');
    return summary || 'Добавете допълнителни предмети';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium' }}>
          Намери маршрут
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
            {/* Station Selection Row */}
            <Grid sx={{ display: 'flex', gap: 2, alignItems: 'center', gridColumn: '1 / span 2' }}>
              {/* From Station */}
              <Autocomplete
                fullWidth
                options={EUROPEAN_CITIES}
                getOptionLabel={(option) => (option ? (typeof option === 'string' ? (EUROPEAN_CITIES.find(({ city }) => city === option) || { city: option, country: '' }) : option) : { city: '', country: '' }).city }
                value={EUROPEAN_CITIES.find(city => city.city === route.fromStation) || null}
                onChange={(_, newValue) => {
                  setRoute(prev => ({
                    ...prev,
                    fromStation: newValue ? newValue.city : ''
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="От гара"
                    placeholder="Например: София"
                    variant="outlined"
                  />
                )}
                renderOption={(props, option) => ( <li {...props}> {option.city} </li> )}
                groupBy={(option) => option.country}
                sx={{ minWidth: 150 }}
              />

              {/* Swap Button */}
              <Tooltip title="Размени гарите">
                <IconButton onClick={handleSwapStations} color="primary" sx={{ p: 1 }}>
                  <SwapHorizIcon />
                </IconButton>
              </Tooltip>

              {/* To Station */}
              <Autocomplete
                fullWidth
                options={EUROPEAN_CITIES}
                getOptionLabel={(option) => option.city}
                value={EUROPEAN_CITIES.find(city => city.city === route.toStation) || null}
                onChange={(_, newValue) => {
                  setRoute(prev => ({
                    ...prev,
                    toStation: newValue ? newValue.city : ''
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="До гара"
                    placeholder="Например: Варна"
                    variant="outlined"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>{option.city}</li>
                )}
                groupBy={(option) => option.country}
                sx={{ minWidth: 150 }}
              />
            </Grid>

            {/* Date and Time */}
            <Grid>
              <DatePicker
                label="Дата на заминаване"
                value={route.departureDate}
                onChange={(newValue) => setRoute({ ...route, departureDate: newValue || new Date() })}
                sx={{ 
                  width: '100%', 
                  '& .MuiOutlinedInput-root': { 
                    height: 56, 
                    fontSize: '1.1rem' 
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '1.1rem'
                  }
                }}
                minDate={new Date()}
              />
            </Grid>

            <Grid>
              <FormControl fullWidth size="medium" sx={{ minWidth: 150 }}>
                <InputLabel sx={{ fontSize: '1.1rem' }}>Час на заминаване</InputLabel>
                <Select
                  value={route.departureTime}
                  onChange={(e) => setRoute({ ...route, departureTime: e.target.value })}
                  label="Час на заминаване"
                  sx={{ fontSize: '1.1rem', height: 56 }}
                >
                  <MenuItem value="" sx={{ fontSize: '1.1rem' }}>
                    <em>Без конкретен час</em>
                  </MenuItem>
                  {DEPARTURE_TIMES.map((time) => (
                    <MenuItem key={time} value={time} sx={{ fontSize: '1.1rem' }}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Passenger Selection Dropdown */}
            <Grid sx={{ gridColumn: '1 / span 2' }}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '1.1rem' }}>Пътници</InputLabel>
                <Select
                  value={getTotalPassengers()}
                  label="Пътници"
                  sx={{ fontSize: '1.1rem', height: 56 }}
                  renderValue={() => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon />
                      <Typography sx={{ fontSize: '1.1rem' }}>
                        {getPassengerSummary()}
                      </Typography>
                    </Box>
                  )}
                >
                  {Object.entries(PASSENGER_TYPES).map(([type, { label, max }]) => (
                    <MenuItem key={type} sx={{ py: 1 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        width: '100%',
                        px: 1
                      }}>
                        <Typography sx={{ fontSize: '1.1rem' }}>{label}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePassengerChange(type as PassengerType, -1);
                            }}
                            disabled={route.passengers[type as PassengerType] <= 0}
                            size="small"
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ 
                            fontSize: '1.1rem', 
                            minWidth: 30, 
                            textAlign: 'center' 
                          }}>
                            {route.passengers[type as PassengerType]}
                          </Typography>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePassengerChange(type as PassengerType, 1);
                            }}
                            disabled={route.passengers[type as PassengerType] >= max}
                            size="small"
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Additional Items Dropdown */}
            <Grid sx={{ gridColumn: '1 / span 2' }}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '1.1rem' }}>Добавки</InputLabel>
                <Select
                  value={Object.values(route.additionalItems).reduce((sum, count) => sum + count, 0)}
                  label="Добавки"
                  sx={{ fontSize: '1.1rem', height: 56 }}
                  renderValue={() => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {Object.entries(route.additionalItems).map(([type, count]) => 
                          count > 0 && (
                            <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {ADDITIONAL_ITEMS[type as AdditionalItemType].icon}
                              {count > 0 && (
                                <Typography sx={{ fontSize: '1.1rem' }}>
                                  {count}
                                </Typography>
                              )}
                            </Box>
                          )
                        )}
                      </Box>
                      <Typography sx={{ fontSize: '1.1rem' }}>
                        {getAdditionalItemsSummary()}
                      </Typography>
                    </Box>
                  )}
                >
                  {Object.entries(ADDITIONAL_ITEMS).map(([type, { label, max, icon }]) => {
                    const itemType = type as AdditionalItemType;
                    return (
                      <MenuItem key={itemType} sx={{ py: 1 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          width: '100%',
                          px: 1
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {icon}
                            <Typography sx={{ fontSize: '1.1rem' }}>{label}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdditionalItemChange(itemType, -1);
                              }}
                              disabled={route.additionalItems[itemType] <= 0}
                              size="small"
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ 
                              fontSize: '1.1rem', 
                              minWidth: 30, 
                              textAlign: 'center' 
                            }}>
                              {route.additionalItems[itemType]}
                            </Typography>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdditionalItemChange(itemType, 1);
                              }}
                              disabled={route.additionalItems[itemType] >= max}
                              size="small"
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            {/* Search Button */}
            <Grid sx={{ gridColumn: '1 / span 2' }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={!route.fromStation || !route.toStation}
                  size="large"
                  sx={{ fontSize: '1rem', py: 1.5, px: 4 }}
                >
                  Търси маршрути
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
} 