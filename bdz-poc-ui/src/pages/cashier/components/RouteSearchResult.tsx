import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  Pagination,
  Stack,
  Checkbox,
  FormGroup,
  FormControlLabel,
  useTheme,
  SelectChangeEvent,
} from '@mui/material';
import {
  Train,
  AccessTime,
  SwapHoriz,
  ExpandMore,
  ExpandLess,
  Restaurant,
  Wifi,
  Bed,
  DirectionsBike,
  Pets,
  FilterList,
  Clear,
  ArrowBack,
  ArrowForward,
  DirectionsTransit,
  Hotel,
  Star,
  StarBorder,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO, differenceInMinutes, addMinutes } from 'date-fns';
import { bg } from 'date-fns/locale';
import { useAppDispatch } from '../../../store/hooks';
import { setRouteSelection } from '../../../store/features/ticket/ticketSlice';

// Types
type Carrier = 'BDZ' | 'DB' | 'OBB' | 'MAV' | 'CFR' | 'TCDD' | 'ZSSK' | 'SBB' | 'SNCF' | 'RENFE';

type TrainType = 'high-speed' | 'night' | 'regional';

type Amenity = 'restaurant' | 'wifi' | 'sleeper' | 'bicycle' | 'pet';

type TimeOfDay = 'morning' | 'afternoon' | 'evening';

type TrainClass = 'first' | 'second';
type WagonType = 'standard' | 'compartment' | 'sleeper' | 'couchette';

interface WagonInfo {
  type: WagonType;
  number: string;
  class: TrainClass;
  amenities: Amenity[];
}

interface RouteSegment {
  id: string;
  carrier: Carrier;
  trainNumber: string;
  trainType: TrainType;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  amenities: Amenity[];
  platform?: string;
  occupancy: 'low' | 'medium' | 'high';
  price: number;
  availableSeats: number;
  wagons: WagonInfo[];
  class: TrainClass;
  notes?: string;
}

interface Route {
  id: string;
  segments: RouteSegment[];
  totalDuration: number;
  totalPrice: number;
  transfers: number;
  departureTime: string;
  arrivalTime: string;
  amenities: Amenity[];
  occupancy: 'low' | 'medium' | 'high';
  availableSeats: number;
  isPromo: boolean;
}

// Mock data for carriers
const CARRIERS: Record<Carrier, { name: string; logo: string; color: string; country: string }> = {
  BDZ: { 
    name: 'БДЖ', 
    logo: '/logos/bdz.png', 
    color: '#1B4B82',
    country: 'България'
  },
  DB: { 
    name: 'Deutsche Bahn', 
    logo: '/logos/db.png', 
    color: '#E30613',
    country: 'Германия'
  },
  OBB: { 
    name: 'ÖBB', 
    logo: '/logos/oebb.png', 
    color: '#E2001A',
    country: 'Австрия'
  },
  MAV: { 
    name: 'MÁV', 
    logo: '/logos/mav.png', 
    color: '#0066B3',
    country: 'Унгария'
  },
  CFR: { 
    name: 'CFR', 
    logo: '/logos/cfr.png', 
    color: '#003B7A',
    country: 'Румъния'
  },
  TCDD: { 
    name: 'TCDD', 
    logo: '/logos/tcdd.png', 
    color: '#E30A17',
    country: 'Турция'
  },
  ZSSK: { 
    name: 'ZSSK', 
    logo: '/logos/zssk.png', 
    color: '#0066B3',
    country: 'Словакия'
  },
  SBB: { 
    name: 'SBB CFF FFS', 
    logo: '/logos/sbb.png', 
    color: '#E2001A',
    country: 'Швейцария'
  },
  SNCF: { 
    name: 'SNCF', 
    logo: '/logos/sncf.png', 
    color: '#003B7A',
    country: 'Франция'
  },
  RENFE: { 
    name: 'Renfe', 
    logo: '/logos/renfe.png', 
    color: '#E30613',
    country: 'Испания'
  }
};

// Mock data for amenities
const AMENITIES: Record<Amenity, { label: string; icon: React.ReactNode }> = {
  restaurant: { label: 'Вагон-ресторант', icon: <Restaurant /> },
  wifi: { label: 'WiFi', icon: <Wifi /> },
  sleeper: { label: 'Спален вагон', icon: <Bed /> },
  bicycle: { label: 'Велосипед', icon: <DirectionsBike /> },
  pet: { label: 'Домашен любимец', icon: <Pets /> },
};

// Mock data for train types
const TRAIN_TYPES: Record<TrainType, { label: string; icon: React.ReactNode }> = {
  'high-speed': { label: 'Високоскоростен', icon: <Train /> },
  'night': { label: 'Нощен', icon: <Hotel /> },
  'regional': { label: 'Регионален', icon: <DirectionsTransit /> },
};

// Mock data for time periods
const TIME_PERIODS: Record<TimeOfDay, { label: string; start: number; end: number }> = {
  morning: { label: 'Сутрин (06:00 - 12:00)', start: 6, end: 12 },
  afternoon: { label: 'Обед (12:00 - 18:00)', start: 12, end: 18 },
  evening: { label: 'Вечер (18:00 - 24:00)', start: 18, end: 24 },
};

// Add wagon type labels
const WAGON_TYPES: Record<WagonType, { label: string; icon: React.ReactNode }> = {
  standard: { label: 'Стандартен вагон', icon: <DirectionsTransit /> },
  compartment: { label: 'Купе', icon: <Hotel /> },
  sleeper: { label: 'Спален вагон', icon: <Bed /> },
  couchette: { label: 'Кушетка', icon: <Hotel /> },
};

// Add train class labels
const TRAIN_CLASSES: Record<TrainClass, { label: string; icon: React.ReactNode }> = {
  first: { label: 'Първа класа', icon: <Star /> },
  second: { label: 'Втора класа', icon: <StarBorder /> },
};

// Mock data for routes
const MOCK_ROUTES: Route[] = [
  // Direct route with BDZ (Bulgaria)
  {
    id: '1',
    segments: [{
      id: '1-1',
      carrier: 'BDZ',
      trainNumber: 'IC 123',
      trainType: 'high-speed',
      fromStation: 'София',
      toStation: 'Бургас',
      departureTime: '2024-03-20T08:00:00',
      arrivalTime: '2024-03-20T12:30:00',
      duration: 270,
      amenities: ['restaurant', 'wifi'],
      platform: '1',
      occupancy: 'low',
      price: 45.00,
      availableSeats: 120,
      class: 'second',
      wagons: [
        {
          type: 'standard',
          number: '51-22-80-70-123-4',
          class: 'second',
          amenities: ['wifi']
        },
        {
          type: 'standard',
          number: '51-22-80-70-123-5',
          class: 'second',
          amenities: ['wifi']
        },
        {
          type: 'compartment',
          number: '51-22-80-70-123-6',
          class: 'first',
          amenities: ['wifi', 'restaurant']
        }
      ],
      notes: 'Влакът спира на всички междинни гари'
    }],
    totalDuration: 270,
    totalPrice: 45.00,
    transfers: 0,
    departureTime: '2024-03-20T08:00:00',
    arrivalTime: '2024-03-20T12:30:00',
    amenities: ['restaurant', 'wifi'],
    occupancy: 'low',
    availableSeats: 120,
    isPromo: false,
  },
  // Route with one transfer (BDZ + OBB)
  {
    id: '2',
    segments: [
      {
        id: '2-1',
        carrier: 'BDZ',
        trainNumber: 'IC 456',
        trainType: 'high-speed',
        fromStation: 'София',
        toStation: 'Виена',
        departureTime: '2024-03-20T06:30:00',
        arrivalTime: '2024-03-20T14:45:00',
        duration: 495,
        amenities: ['restaurant', 'wifi'],
        platform: '2',
        occupancy: 'medium',
        price: 85.00,
        availableSeats: 45,
        class: 'second',
        wagons: [
          {
            type: 'standard',
            number: '51-22-80-70-123-7',
            class: 'second',
            amenities: ['wifi']
          },
          {
            type: 'standard',
            number: '51-22-80-70-123-8',
            class: 'second',
            amenities: ['wifi']
          },
          {
            type: 'compartment',
            number: '51-22-80-70-123-9',
            class: 'first',
            amenities: ['wifi', 'restaurant']
          }
        ],
        notes: 'Влакът спира на всички междинни гари'
      },
      {
        id: '2-2',
        carrier: 'OBB',
        trainNumber: 'RJ 789',
        trainType: 'high-speed',
        fromStation: 'Виена',
        toStation: 'Мюнхен',
        departureTime: '2024-03-20T15:30:00',
        arrivalTime: '2024-03-20T18:45:00',
        duration: 195,
        amenities: ['restaurant', 'wifi', 'bicycle'],
        platform: '5',
        occupancy: 'high',
        price: 65.00,
        availableSeats: 12,
        class: 'second',
        wagons: [
          {
            type: 'standard',
            number: 'OBB-123-4',
            class: 'second',
            amenities: ['wifi', 'bicycle']
          },
          {
            type: 'standard',
            number: 'OBB-123-5',
            class: 'second',
            amenities: ['wifi', 'bicycle']
          },
          {
            type: 'compartment',
            number: 'OBB-123-6',
            class: 'first',
            amenities: ['wifi', 'restaurant', 'bicycle']
          }
        ],
        notes: 'Влакът спира само на основните гари'
      }
    ],
    totalDuration: 735,
    totalPrice: 150.00,
    transfers: 1,
    departureTime: '2024-03-20T06:30:00',
    arrivalTime: '2024-03-20T18:45:00',
    amenities: ['restaurant', 'wifi', 'bicycle'],
    occupancy: 'medium',
    availableSeats: 12,
    isPromo: true,
  },
  // Night train with sleeper (BDZ + CFR)
  {
    id: '3',
    segments: [
      {
        id: '3-1',
        carrier: 'BDZ',
        trainNumber: 'EN 321',
        trainType: 'night',
        fromStation: 'София',
        toStation: 'Букурещ',
        departureTime: '2024-03-20T22:00:00',
        arrivalTime: '2024-03-21T08:30:00',
        duration: 630,
        amenities: ['sleeper', 'restaurant'],
        platform: '3',
        occupancy: 'low',
        price: 95.00,
        availableSeats: 24,
        class: 'second',
        wagons: [
          {
            type: 'sleeper',
            number: '51-22-80-70-123-13',
            class: 'second',
            amenities: ['sleeper', 'restaurant']
          },
          {
            type: 'sleeper',
            number: '51-22-80-70-123-14',
            class: 'second',
            amenities: ['sleeper', 'restaurant']
          },
          {
            type: 'sleeper',
            number: '51-22-80-70-123-15',
            class: 'first',
            amenities: ['sleeper', 'restaurant']
          }
        ],
        notes: 'Влакът спира на всички междинни гари'
      },
      {
        id: '3-2',
        carrier: 'CFR',
        trainNumber: 'IR 456',
        trainType: 'high-speed',
        fromStation: 'Букурещ',
        toStation: 'Будапеща',
        departureTime: '2024-03-21T09:30:00',
        arrivalTime: '2024-03-21T16:45:00',
        duration: 435,
        amenities: ['restaurant', 'wifi'],
        platform: '2',
        occupancy: 'medium',
        price: 75.00,
        availableSeats: 45,
        class: 'second',
        wagons: [
          {
            type: 'standard',
            number: 'CFR-123-4',
            class: 'second',
            amenities: ['wifi']
          },
          {
            type: 'standard',
            number: 'CFR-123-5',
            class: 'second',
            amenities: ['wifi']
          },
          {
            type: 'compartment',
            number: 'CFR-123-6',
            class: 'first',
            amenities: ['wifi', 'restaurant']
          }
        ],
        notes: 'Влакът спира само на основните гари'
      }
    ],
    totalDuration: 1065,
    totalPrice: 170.00,
    transfers: 1,
    departureTime: '2024-03-20T22:00:00',
    arrivalTime: '2024-03-21T16:45:00',
    amenities: ['sleeper', 'restaurant', 'wifi'],
    occupancy: 'low',
    availableSeats: 24,
    isPromo: false,
  },
  // Long route with three carriers (BDZ + MAV + OBB)
  {
    id: '4',
    segments: [
      {
        id: '4-1',
        carrier: 'BDZ',
        trainNumber: 'IC 789',
        trainType: 'high-speed',
        fromStation: 'София',
        toStation: 'Будапеща',
        departureTime: '2024-03-20T07:15:00',
        arrivalTime: '2024-03-20T15:45:00',
        duration: 510,
        amenities: ['restaurant', 'wifi'],
        platform: '3',
        occupancy: 'medium',
        price: 95.00,
        availableSeats: 35,
        class: 'second',
        wagons: [
          {
            type: 'standard',
            number: '51-22-80-70-123-16',
            class: 'second',
            amenities: ['wifi']
          },
          {
            type: 'standard',
            number: '51-22-80-70-123-17',
            class: 'second',
            amenities: ['wifi']
          },
          {
            type: 'compartment',
            number: '51-22-80-70-123-18',
            class: 'first',
            amenities: ['wifi', 'restaurant']
          }
        ],
        notes: 'Влакът спира на всички основни гари'
      },
      {
        id: '4-2',
        carrier: 'MAV',
        trainNumber: 'IC 234',
        trainType: 'high-speed',
        fromStation: 'Будапеща',
        toStation: 'Дьор',
        departureTime: '2024-03-20T16:30:00',
        arrivalTime: '2024-03-20T18:15:00',
        duration: 105,
        amenities: ['wifi', 'bicycle'],
        platform: '5',
        occupancy: 'low',
        price: 45.00,
        availableSeats: 85,
        class: 'second',
        wagons: [
          {
            type: 'standard',
            number: 'MAV-123-4',
            class: 'second',
            amenities: ['wifi', 'bicycle']
          },
          {
            type: 'standard',
            number: 'MAV-123-5',
            class: 'second',
            amenities: ['wifi', 'bicycle']
          },
          {
            type: 'compartment',
            number: 'MAV-123-6',
            class: 'first',
            amenities: ['wifi', 'restaurant', 'bicycle']
          }
        ],
        notes: 'Влакът спира само на основните гари'
      },
      {
        id: '4-3',
        carrier: 'OBB',
        trainNumber: 'RJ 567',
        trainType: 'high-speed',
        fromStation: 'Дьор',
        toStation: 'Виена',
        departureTime: '2024-03-20T19:00:00',
        arrivalTime: '2024-03-20T20:45:00',
        duration: 105,
        amenities: ['restaurant', 'wifi', 'bicycle'],
        platform: '2',
        occupancy: 'high',
        price: 55.00,
        availableSeats: 15,
        class: 'second',
        wagons: [
          {
            type: 'standard',
            number: 'OBB-234-1',
            class: 'second',
            amenities: ['wifi', 'bicycle']
          },
          {
            type: 'standard',
            number: 'OBB-234-2',
            class: 'second',
            amenities: ['wifi', 'bicycle']
          },
          {
            type: 'compartment',
            number: 'OBB-234-3',
            class: 'first',
            amenities: ['wifi', 'restaurant', 'bicycle']
          }
        ],
        notes: 'Влакът спира само на основните гари'
      }
    ],
    totalDuration: 810,
    totalPrice: 195.00,
    transfers: 2,
    departureTime: '2024-03-20T07:15:00',
    arrivalTime: '2024-03-20T20:45:00',
    amenities: ['restaurant', 'wifi', 'bicycle'],
    occupancy: 'medium',
    availableSeats: 15,
    isPromo: true,
  }
];

// Sorting options
const SORT_OPTIONS = [
  { value: 'departure_asc', label: 'Най-ранно тръгване' },
  { value: 'departure_desc', label: 'Най-късно тръгване' },
  { value: 'duration_asc', label: 'Най-кратко време за пътуване' },
  { value: 'price_asc', label: 'Най-ниска цена' },
];

// Add new styles for the route visualization
const routeStyles = {
  segmentContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    mb: 2,
    minHeight: '120px',
  },
  segmentLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'grey.300',
    position: 'relative',
    marginTop: '40px',
    marginBottom: '40px',
  },
  segmentDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: 'primary.main',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
  },
  transferDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'grey.500',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
  },
  stationLabel: {
    position: 'absolute',
    top: '100%',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
    fontSize: '0.875rem',
    color: 'text.secondary',
    mt: 1,
    backgroundColor: 'white',
    padding: '0 4px',
    borderRadius: '4px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    zIndex: 2,
  },
  timeLabel: {
    position: 'absolute',
    bottom: '100%',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
    fontSize: '0.875rem',
    fontWeight: 'medium',
    mb: 1,
    backgroundColor: 'white',
    padding: '0 4px',
    borderRadius: '4px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    zIndex: 2,
  },
  trainInfo: {
    position: 'absolute',
    top: '-40px',
    transform: 'translateX(-50%)',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0.5,
  },
  carrierCode: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'white',
    padding: '2px 8px',
    borderRadius: 1,
    boxShadow: 1,
    color: 'text.primary',
  },
  trainIcon: {
    backgroundColor: 'white',
    padding: '2px 8px',
    borderRadius: 1,
    boxShadow: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
  },
  transferInfo: {
    position: 'absolute',
    top: '-20px',
    transform: 'translateX(-50%)',
    backgroundColor: 'grey.100',
    padding: '2px 8px',
    borderRadius: 1,
    fontSize: '0.75rem',
    color: 'text.secondary',
    zIndex: 2,
    whiteSpace: 'nowrap',
  }
};

export default function RouteSearchResult() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchParams = location.state?.route;

  // State
  const [routes, setRoutes] = useState<Route[]>(MOCK_ROUTES);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>(MOCK_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('departure_asc');
  const [filters, setFilters] = useState({
    timeOfDay: [] as TimeOfDay[],
    maxTransfers: 2,
    trainTypes: [] as TrainType[],
    amenities: [] as Amenity[],
    carriers: [] as Carrier[],
  });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showFilters, setShowFilters] = useState(false);

  // Effects
  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...routes];

    // Apply time of day filter
    if (filters.timeOfDay.length > 0) {
      filtered = filtered.filter(route => {
        const hour = new Date(route.departureTime).getHours();
        return filters.timeOfDay.some(period => 
          hour >= TIME_PERIODS[period].start && hour < TIME_PERIODS[period].end
        );
      });
    }

    // Apply transfers filter
    filtered = filtered.filter(route => route.transfers <= filters.maxTransfers);

    // Apply train types filter
    if (filters.trainTypes.length > 0) {
      filtered = filtered.filter(route =>
        route.segments.some(segment => filters.trainTypes.includes(segment.trainType))
      );
    }

    // Apply amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(route =>
        filters.amenities.every(amenity => route.amenities.includes(amenity))
      );
    }

    // Apply carriers filter
    if (filters.carriers.length > 0) {
      filtered = filtered.filter(route =>
        route.segments.some(segment => filters.carriers.includes(segment.carrier))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'departure_asc':
          return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
        case 'departure_desc':
          return new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime();
        case 'duration_asc':
          return a.totalDuration - b.totalDuration;
        case 'price_asc':
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

    setFilteredRoutes(filtered);
    setPage(1);
  }, [routes, filters, sortBy]);

  // Handlers
  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (filterType: keyof typeof filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      timeOfDay: [],
      maxTransfers: 2,
      trainTypes: [],
      amenities: [],
      carriers: [],
    });
  };

  const handleRouteSelect = (route: Route) => {
    setSelectedRoute(route);
    
    // Save route data to ticketSlice
    const routePayload = {
      fromStation: route.segments[0].fromStation,
      toStation: route.segments[route.segments.length - 1].toStation,
      departureDate: route.departureTime,
      departureTime: route.departureTime,
      viaStation: route.segments.length > 1 ? route.segments[0].toStation : undefined,
      basePrice: route.totalPrice,
      passengers: searchParams?.passengers || {
        adults: 1,
        children: 0,
        seniors: 0,
        students: 0
      }
    };
    
    dispatch(setRouteSelection(routePayload));
    
    // Navigate to tickets page
    navigate('/cashier/tickets', { 
      state: { 
        route: {
          ...route,
          passengers: searchParams?.passengers
        }
      } 
    });
  };

  const handleRouteExpand = (routeId: string) => {
    setExpandedRoute(expandedRoute === routeId ? null : routeId);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Render functions
  const renderSearchSummary = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <Typography variant="h6" gutterBottom>
            {searchParams?.fromStation} → {searchParams?.toStation}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {format(new Date(searchParams?.departureDate), 'EEEE, d MMMM yyyy', { locale: bg })}
            {searchParams?.departureTime && ` • ${searchParams.departureTime}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Object.entries(searchParams?.passengers || {})
              .filter(([_, count]) => (count as number) > 0)
              .map(([type, count]) => `${type}: ${count}`)
              .join(', ')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/cashier/routes')}
          >
            Промени параметрите
          </Button>
        </Box>
      </Box>
    </Paper>
  );

  const renderFilters = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Филтри и сортиране</Typography>
          <Box>
            <Button
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ mr: 1 }}
            >
              {showFilters ? 'Скрий филтри' : 'Покажи филтри'}
            </Button>
            <Button
              startIcon={<Clear />}
              onClick={handleClearFilters}
              disabled={Object.values(filters).every(f => 
                Array.isArray(f) ? f.length === 0 : f === 2
              )}
            >
              Изчисти филтри
            </Button>
          </Box>
        </Box>

        <Box sx={{ width: '100%', maxWidth: 300 }}>
          <FormControl fullWidth>
            <InputLabel>Сортиране по</InputLabel>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              label="Сортиране по"
            >
              {SORT_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
            <Box sx={{ flex: '1 1 250px' }}>
              <Typography variant="subtitle2" gutterBottom>Време на тръгване</Typography>
              <FormGroup>
                {Object.entries(TIME_PERIODS).map(([period, { label }]) => (
                  <FormControlLabel
                    key={period}
                    control={
                      <Checkbox
                        checked={filters.timeOfDay.includes(period as TimeOfDay)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...filters.timeOfDay, period as TimeOfDay]
                            : filters.timeOfDay.filter(p => p !== period);
                          handleFilterChange('timeOfDay', newValue);
                        }}
                      />
                    }
                    label={label}
                  />
                ))}
              </FormGroup>
            </Box>

            <Box sx={{ flex: '1 1 250px' }}>
              <Typography variant="subtitle2" gutterBottom>Максимален брой прекачвания</Typography>
              <FormControl fullWidth>
                <Select
                  value={filters.maxTransfers}
                  onChange={(e) => handleFilterChange('maxTransfers', e.target.value)}
                >
                  <MenuItem value={0}>Без прекачване</MenuItem>
                  <MenuItem value={1}>До 1 прекачване</MenuItem>
                  <MenuItem value={2}>До 2 прекачвания</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flex: '1 1 250px' }}>
              <Typography variant="subtitle2" gutterBottom>Тип влак</Typography>
              <FormGroup>
                {Object.entries(TRAIN_TYPES).map(([type, { label }]) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={filters.trainTypes.includes(type as TrainType)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...filters.trainTypes, type as TrainType]
                            : filters.trainTypes.filter(t => t !== type);
                          handleFilterChange('trainTypes', newValue);
                        }}
                      />
                    }
                    label={label}
                  />
                ))}
              </FormGroup>
            </Box>

            <Box sx={{ flex: '1 1 250px' }}>
              <Typography variant="subtitle2" gutterBottom>Удобства</Typography>
              <FormGroup>
                {Object.entries(AMENITIES).map(([amenity, { label }]) => (
                  <FormControlLabel
                    key={amenity}
                    control={
                      <Checkbox
                        checked={filters.amenities.includes(amenity as Amenity)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...filters.amenities, amenity as Amenity]
                            : filters.amenities.filter(a => a !== amenity);
                          handleFilterChange('amenities', newValue);
                        }}
                      />
                    }
                    label={label}
                  />
                ))}
              </FormGroup>
            </Box>

            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" gutterBottom>Превозвачи</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(CARRIERS).map(([carrier, { name }]) => (
                  <Chip
                    key={carrier}
                    label={name}
                    onClick={() => {
                      const newValue = filters.carriers.includes(carrier as Carrier)
                        ? filters.carriers.filter(c => c !== carrier)
                        : [...filters.carriers, carrier as Carrier];
                      handleFilterChange('carriers', newValue);
                    }}
                    color={filters.carriers.includes(carrier as Carrier) ? 'primary' : 'default'}
                    variant={filters.carriers.includes(carrier as Carrier) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );

  const renderSegmentDetails = (segment: RouteSegment) => (
    <Box sx={{ width: '100%' }}>
      {/* Segment header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 2,
        p: 2,
        backgroundColor: 'grey.50',
        borderRadius: 1
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: CARRIERS[segment.carrier].color,
          color: 'white',
          px: 1.5,
          py: 0.5,
          borderRadius: 1
        }}>
          {TRAIN_TYPES[segment.trainType].icon}
          <Typography variant="body1" sx={{ ml: 0.5, fontWeight: 'medium' }}>
            {segment.trainNumber}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {segment.fromStation} → {segment.toStation}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {CARRIERS[segment.carrier].name} • {CARRIERS[segment.carrier].country}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {TRAIN_CLASSES[segment.class].icon}
          <Typography variant="body2" color="text.secondary">
            {TRAIN_CLASSES[segment.class].label}
          </Typography>
        </Box>
      </Box>

      {/* Journey details table */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: 2,
        mb: 2,
        '& > *': { py: 1 }
      }}>
        {/* Times */}
        <Box>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {format(new Date(segment.departureTime), 'HH:mm')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(segment.departureTime), 'EEEE, d MMMM', { locale: bg })}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: 'grey.300',
            zIndex: 0
          }
        }}>
          <Box sx={{ 
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'white',
            px: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {Math.floor(segment.duration / 60)}ч {segment.duration % 60}м
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {format(new Date(segment.arrivalTime), 'HH:mm')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(segment.arrivalTime), 'EEEE, d MMMM', { locale: bg })}
          </Typography>
        </Box>

        {/* Stations */}
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {segment.fromStation}
          </Typography>
          {segment.platform && (
            <Typography variant="body2" color="text.secondary">
              Платформа {segment.platform}
            </Typography>
          )}
        </Box>

        <Box />

        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {segment.toStation}
          </Typography>
          {segment.platform && (
            <Typography variant="body2" color="text.secondary">
              Платформа {segment.platform}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Wagons information */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Вагони
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 2
        }}>
          {segment.wagons.map((wagon, index) => (
            <Paper key={index} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {WAGON_TYPES[wagon.type].icon}
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {WAGON_TYPES[wagon.type].label}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Вагон {wagon.number}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {TRAIN_CLASSES[wagon.class].icon}
                <Typography variant="body2">
                  {TRAIN_CLASSES[wagon.class].label}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {wagon.amenities.map(amenity => (
                  <Tooltip key={amenity} title={AMENITIES[amenity].label}>
                    <IconButton size="small">
                      {AMENITIES[amenity].icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Additional information */}
      {segment.notes && (
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'info.light', 
          color: 'info.contrastText',
          borderRadius: 1,
          mb: 2
        }}>
          <Typography variant="body2">
            {segment.notes}
          </Typography>
        </Box>
      )}

      {/* Price and availability */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        backgroundColor: 'grey.50',
        borderRadius: 1
      }}>
        <Box>
          <Typography variant="h6" color="primary">
            {segment.price.toFixed(2)} лв.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {TRAIN_CLASSES[segment.class].label}
          </Typography>
        </Box>
        <Chip
          label={`${segment.availableSeats} свободни места`}
          color={
            segment.occupancy === 'low' ? 'success' :
            segment.occupancy === 'medium' ? 'warning' : 'error'
          }
        />
      </Box>
    </Box>
  );

  const renderRouteCard = (route: Route) => {
    const isExpanded = expandedRoute === route.id;
    const departureDate = new Date(route.departureTime);
    const arrivalDate = new Date(route.arrivalTime);

    const renderRouteSegments = () => {
      const totalDuration = route.totalDuration;
      const segments = route.segments;

      return (
        <Box sx={routeStyles.segmentContainer}>
          <Box sx={{ width: 60, flexShrink: 0, textAlign: 'right', pr: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {format(departureDate, 'HH:mm')}
            </Typography>
          </Box>
          
          <Box sx={{ flex: 1, position: 'relative' }}>
            <Box sx={routeStyles.segmentLine}>
              {/* Start station */}
              <Box sx={{ ...routeStyles.segmentDot, left: 0 }}>
                <Typography sx={{ ...routeStyles.stationLabel, left: '50%' }}>
                  {segments[0].fromStation}
                </Typography>
                <Typography sx={{ ...routeStyles.timeLabel, left: '50%' }}>
                  {format(departureDate, 'HH:mm')}
                </Typography>
              </Box>

              {segments.map((segment, index) => {
                const segmentStart = (new Date(segment.departureTime).getTime() - departureDate.getTime()) / (totalDuration * 60 * 1000) * 100;
                const segmentEnd = (new Date(segment.arrivalTime).getTime() - departureDate.getTime()) / (totalDuration * 60 * 1000) * 100;
                const segmentMiddle = (segmentStart + segmentEnd) / 2;

                // Determine if this is a Bulgarian segment
                const isBulgarianSegment = segment.fromStation === 'София' || 
                                         segment.fromStation === 'Бургас' || 
                                         segment.fromStation === 'Варна' || 
                                         segment.fromStation === 'Пловдив' ||
                                         segment.toStation === 'София' || 
                                         segment.toStation === 'Бургас' || 
                                         segment.toStation === 'Варна' || 
                                         segment.toStation === 'Пловдив';

                // Use BDZ for Bulgarian segments
                const carrierCode = isBulgarianSegment ? 'BDZ' : segment.carrier;

                return (
                  <React.Fragment key={segment.id}>
                    {/* Train info */}
                    <Box
                      sx={{
                        ...routeStyles.trainInfo,
                        left: `${segmentMiddle}%`,
                      }}
                    >
                      <Typography 
                        sx={{
                          ...routeStyles.carrierCode,
                          color: CARRIERS[carrierCode].color,
                        }}
                      >
                        {carrierCode}
                      </Typography>
                      <Box 
                        sx={{
                          ...routeStyles.trainIcon,
                          backgroundColor: CARRIERS[carrierCode].color,
                          color: 'white',
                        }}
                      >
                        {TRAIN_TYPES[segment.trainType].icon}
                        <Typography variant="body2">
                          {segment.trainNumber}
                        </Typography>
                      </Box>
                    </Box>

                    {/* End station */}
                    <Box sx={{ ...routeStyles.segmentDot, left: `${segmentEnd}%` }}>
                      <Typography sx={{ ...routeStyles.stationLabel, left: '50%' }}>
                        {segment.toStation}
                      </Typography>
                      <Typography sx={{ ...routeStyles.timeLabel, left: '50%' }}>
                        {format(new Date(segment.arrivalTime), 'HH:mm')}
                      </Typography>
                    </Box>

                    {/* Transfer info */}
                    {index < segments.length - 1 && (
                      <>
                        <Box sx={{ ...routeStyles.transferDot, left: `${segmentEnd}%` }} />
                        <Box
                          sx={{
                            ...routeStyles.transferInfo,
                            left: `${segmentEnd}%`,
                          }}
                        >
                          {format(addMinutes(new Date(segment.arrivalTime), 30), 'HH:mm')}
                        </Box>
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </Box>
          </Box>

          <Box sx={{ width: 60, flexShrink: 0, textAlign: 'left', pl: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {format(arrivalDate, 'HH:mm')}
            </Typography>
          </Box>
        </Box>
      );
    };

    return (
      <Card key={route.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              {/* Route visualization */}
              {renderRouteSegments()}

              {/* Route summary */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {Math.floor(route.totalDuration / 60)}ч {route.totalDuration % 60}м
                </Typography>
                {route.transfers > 0 && (
                  <Chip
                    size="small"
                    label={`${route.transfers} ${route.transfers === 1 ? 'прекачване' : 'прекачвания'}`}
                  />
                )}
              </Box>

              {/* Amenities */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {route.amenities.map(amenity => (
                  <Tooltip key={amenity} title={AMENITIES[amenity].label}>
                    <IconButton size="small">
                      {AMENITIES[amenity].icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            </Box>

            {/* Price and availability */}
            <Box sx={{ flex: '0 0 200px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                  {route.totalPrice.toFixed(2)} лв.
                </Typography>
                <Chip
                  size="small"
                  label={`${route.availableSeats} свободни места`}
                  color={
                    route.occupancy === 'low' ? 'success' :
                    route.occupancy === 'medium' ? 'warning' : 'error'
                  }
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => handleRouteExpand(route.id)}
                  endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                >
                  Детайли
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleRouteSelect(route)}
                  disabled={route.availableSeats === 0}
                >
                  Избери
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Expanded details */}
          <Collapse in={isExpanded}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {route.segments.map((segment, index) => (
                <React.Fragment key={segment.id}>
                  {renderSegmentDetails(segment)}
                  {index < route.segments.length - 1 && (
                    <Paper sx={{ 
                      p: 2, 
                      backgroundColor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <SwapHoriz color="action" />
                      <Box>
                        <Typography variant="subtitle2">
                          Прекачване в {segment.toStation}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Време за връзка: 30 мин • 
                          Следващ влак: {format(addMinutes(new Date(segment.arrivalTime), 30), 'HH:mm')}
                        </Typography>
                      </Box>
                    </Paper>
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {renderSearchSummary()}
      {renderFilters()}

      {/* Results count */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Намерени {filteredRoutes.length} маршрута
      </Typography>

      {/* Route list */}
      <Box sx={{ mb: 3 }}>
        {filteredRoutes
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map(renderRouteCard)}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Stack spacing={2} direction="row" alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={itemsPerPage.toString()}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <MenuItem value="5">5 на страница</MenuItem>
              <MenuItem value="10">10 на страница</MenuItem>
              <MenuItem value="20">20 на страница</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            count={Math.ceil(filteredRoutes.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </Box>
    </Box>
  );
} 