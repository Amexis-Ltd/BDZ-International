import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Switch,
  FormControlLabel,
  Badge,
  Avatar,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  Checkbox,
  Slider,
  Rating,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Search,
  QrCodeScanner,
  ExpandMore,
  ExpandLess,
  Add,
  Remove,
  Delete,
  Train,
  DirectionsBike,
  Pets,
  Restaurant,
  Luggage,
  AccessibilityNew,
  Security,
  LocalParking,
  BusinessCenter,
  Hotel,
  Bed,
  Panorama,
  AirlineSeatReclineNormal,
  AirlineSeatIndividualSuite,
  AirlineSeatFlat,
  AirlineSeatReclineExtra,
  EventSeat,
  ConfirmationNumber,
  Person,
  AccessTime,
  LocationOn,
  AttachMoney,
  Receipt,
  Info,
  Warning,
  CheckCircle,
  Cancel,
  Sync,
  Save,
  Print,
  Edit,
  History,
  Wifi,
  WifiOff,
  School,
  Elderly,
  ChildCare,
  LocalHospital,
  LocalPharmacy,
  LocalDining,
  LocalCafe,
  LocalBar,
  LocalFlorist,
  LocalGroceryStore,
  LocalMall,
  LocalOffer,
  LocalTaxi,
  LocalHotel,
  LocalAirport,
  LocalAtm,
  LocalActivity,
  LocalLibrary,
  LocalMovies,
  LocalPlay,
  LocalPostOffice,
  LocalSee,
  LocalShipping,
  LocalCarWash,
  LocalGasStation,
  LocalConvenienceStore,
  LocalPizza,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format, parseISO, isBefore, isAfter, addMinutes } from 'date-fns';
import { bg } from 'date-fns/locale';

// Types and Interfaces
type ServiceCategory = 
  | 'special_carriages'
  | 'catering'
  | 'luggage'
  | 'assistance'
  | 'insurance'
  | 'station_services';

type ServiceStatus = 'available' | 'limited' | 'unavailable';

type ServicePrice = {
  amount: number;
  currency: string;
  perPerson: boolean;
  perCabin?: boolean;
};

type AdditionalService = {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  status: ServiceStatus;
  price: ServicePrice;
  image?: string;
  icon?: React.ReactNode;
  availableFrom?: Date;
  availableTo?: Date;
  minNoticeHours?: number;
  maxQuantity?: number;
  requiresDetails?: boolean;
  detailsForm?: React.ReactNode;
  restrictions?: string[];
  features?: string[];
};

type CarriageType = 
  | 'single_cabin'
  | 'double_cabin'
  | 'triple_cabin'
  | 'couchette_4'
  | 'couchette_6'
  | 'panorama'
  | 'business';

type MealType = 
  | 'standard_lunch'
  | 'standard_dinner'
  | 'vegetarian'
  | 'special_diet'
  | 'snacks'
  | 'beverages';

type LuggageType = 
  | 'extra_baggage'
  | 'bicycle'
  | 'pet'
  | 'special_luggage';

type AssistanceType = 
  | 'mobility'
  | 'transfer'
  | 'luggage'
  | 'unaccompanied_minor';

type InsuranceType = 
  | 'basic'
  | 'standard'
  | 'premium'
  | 'delay_protection'
  | 'flexible_booking'
  | 'trip_interruption';

type StationServiceType = 
  | 'vip_lounge'
  | 'transfer'
  | 'luggage_storage'
  | 'parking';

// Mock Data
const MOCK_CATEGORIES = [
  {
    id: 'special_carriages',
    name: 'Специални вагони и места',
    icon: <Hotel />,
    description: 'Изберете удобен спален вагон или специално място за вашето пътуване',
  },
  {
    id: 'catering',
    name: 'Хранене и кетъринг',
    icon: <Restaurant />,
    description: 'Поръчайте храна и напитки за вашето пътуване',
  },
  {
    id: 'luggage',
    name: 'Багаж и транспорт',
    icon: <Luggage />,
    description: 'Допълнителни опции за багаж и превоз на специални предмети',
  },
  {
    id: 'assistance',
    name: 'Асистенция за пътници',
    icon: <AccessibilityNew />,
    description: 'Специална помощ и подкрепа по време на пътуването',
  },
  {
    id: 'insurance',
    name: 'Застраховки и допълнителни защити',
    icon: <Security />,
    description: 'Защита и осигуровки за вашето пътуване',
  },
  {
    id: 'station_services',
    name: 'Услуги в гарите',
    icon: <LocalParking />,
    description: 'Допълнителни услуги в началната и крайната гара',
  },
];

const MOCK_SERVICES: AdditionalService[] = [
  // Special Carriages
  {
    id: 'single_cabin',
    name: 'Единично купе в спален вагон',
    description: 'Приватно купе с единично легло, тоалетна и душ',
    category: 'special_carriages',
    status: 'available',
    price: {
      amount: 120,
      currency: 'EUR',
      perPerson: true,
      perCabin: true,
    },
    icon: <AirlineSeatIndividualSuite />,
    features: [
      'Приватно купе',
      'Единично легло',
      'Тоалетна и душ',
      'Безплатен WiFi',
      'Закуска включена',
    ],
  },
  {
    id: 'double_cabin',
    name: 'Двойно купе в спален вагон',
    description: 'Приватно купе с две легла, тоалетна и душ',
    category: 'special_carriages',
    status: 'limited',
    price: {
      amount: 180,
      currency: 'EUR',
      perPerson: true,
      perCabin: true,
    },
    icon: <AirlineSeatReclineExtra />,
    features: [
      'Приватно купе',
      'Две легла',
      'Тоалетна и душ',
      'Безплатен WiFi',
      'Закуска включена',
    ],
  },
  // Catering
  {
    id: 'standard_lunch',
    name: 'Стандартен обяд',
    description: 'Традиционно меню с основно ястие, салата и десерт',
    category: 'catering',
    status: 'available',
    price: {
      amount: 25,
      currency: 'EUR',
      perPerson: true,
    },
    icon: <LocalDining />,
    features: [
      'Основно ястие',
      'Салата',
      'Десерт',
      'Напитка по избор',
      'Хлебче',
    ],
  },
  // Luggage
  {
    id: 'bicycle',
    name: 'Превоз на велосипед',
    description: 'Специално място за превоз на велосипед',
    category: 'luggage',
    status: 'available',
    price: {
      amount: 15,
      currency: 'EUR',
      perPerson: false,
    },
    icon: <DirectionsBike />,
    restrictions: [
      'Максимални размери: 180x80x40 см',
      'Максимално тегло: 25 кг',
      'Необходима предварителна резервация',
    ],
  },
  // Assistance
  {
    id: 'mobility_assistance',
    name: 'Асистенция за пътници с ограничена подвижност',
    description: 'Помощ при качване, слизане и прекачване',
    category: 'assistance',
    status: 'available',
    price: {
      amount: 0,
      currency: 'EUR',
      perPerson: true,
    },
    icon: <AccessibilityNew />,
    requiresDetails: true,
    features: [
      'Помощ при качване и слизане',
      'Асистенция при прекачване',
      'Помощ с багаж',
      'Специален транспорт в гарата',
    ],
  },
  // Insurance
  {
    id: 'basic_insurance',
    name: 'Базова туристическа застраховка',
    description: 'Основно покритие за медицински разходи и багаж',
    category: 'insurance',
    status: 'available',
    price: {
      amount: 10,
      currency: 'EUR',
      perPerson: true,
    },
    icon: <Security />,
    features: [
      'Медицински разходи до 10,000 EUR',
      'Покритие на багаж до 1,000 EUR',
      'Правна помощ',
      '24/7 поддръжка',
    ],
  },
  // Station Services
  {
    id: 'vip_lounge',
    name: 'Достъп до VIP чакалня',
    description: 'Комфортна чакалня с безплатни напитки и закуски',
    category: 'station_services',
    status: 'available',
    price: {
      amount: 30,
      currency: 'EUR',
      perPerson: true,
    },
    icon: <BusinessCenter />,
    features: [
      'Безплатни напитки',
      'Леки закуски',
      'Безплатен WiFi',
      'Работно пространство',
      'Детска зона',
    ],
  },
];

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ServiceCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 140,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const StatusChip = styled(Chip)<{ status: ServiceStatus }>(({ theme, status }) => ({
  backgroundColor: 
    status === 'available' ? theme.palette.success.light :
    status === 'limited' ? theme.palette.warning.light :
    theme.palette.error.light,
  color: 
    status === 'available' ? theme.palette.success.contrastText :
    status === 'limited' ? theme.palette.warning.contrastText :
    theme.palette.error.contrastText,
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

// Main Component
const AdditionalServices: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<ServiceCategory>('special_carriages');
  const [selectedServices, setSelectedServices] = useState<AdditionalService[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<AdditionalService | null>(null);

  // Theme and responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Handlers
  const handleSearch = () => {
    setIsLoading(true);
    setError(null);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock ticket data
      setSelectedTicket({
        id: 'T123456',
        route: 'София - Букурещ',
        date: new Date(),
        passengers: [
          { name: 'Иван Иванов', seat: '12A' },
          { name: 'Мария Иванова', seat: '12B' },
        ],
        class: 'Първа класа',
      });
    }, 1000);
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      setSearchQuery('T123456');
      handleSearch();
    }, 2000);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: ServiceCategory) => {
    setActiveTab(newValue);
  };

  const handleServiceSelect = (service: AdditionalService) => {
    if (service.requiresDetails) {
      setSelectedService(service);
      setDetailsDialogOpen(true);
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const handleServiceRemove = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const handleDetailsSubmit = (details: any) => {
    if (selectedService) {
      setSelectedServices(prev => [...prev, { ...selectedService, details }]);
      setDetailsDialogOpen(false);
      setSelectedService(null);
    }
  };

  // Render functions
  const renderSearchSection = () => (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr auto' }, gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Търсене на билет или резервация"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
        <Button
          variant="outlined"
          startIcon={<QrCodeScanner />}
          onClick={handleScan}
          disabled={isScanning}
        >
          {isScanning ? 'Сканиране...' : 'Сканирай билет'}
        </Button>
      </Box>

      {selectedTicket && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Маршрут</Typography>
              <Typography variant="body1">
                {selectedTicket.route}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Дата и час</Typography>
              <Typography variant="body1">
                {format(selectedTicket.date, 'dd MMMM yyyy, HH:mm', { locale: bg })}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Пътници</Typography>
              <Typography variant="body1">
                {selectedTicket.passengers.map(p => p.name).join(', ')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Клас</Typography>
              <Typography variant="body1">
                {selectedTicket.class}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );

  const renderServiceCard = (service: AdditionalService) => (
    <ServiceCard>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' }, gap: 2, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {service.icon || <Info sx={{ fontSize: 40, color: 'primary.main' }} />}
        </Box>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="h3">
              {service.name}
            </Typography>
            <StatusChip status={service.status} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {service.description}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1 }}>
            <PriceTypography variant="subtitle1" component="div">
              {service.price.amount} {service.price.currency}
              {service.price.perPerson && ' / човек'}
              {service.price.perCabin && ' / купе'}
            </PriceTypography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleServiceSelect(service)}
                disabled={service.status === 'unavailable'}
              >
                Добави
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </ServiceCard>
  );

  const renderSelectedServices = () => (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Избрани услуги
      </Typography>
      {selectedServices.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Няма избрани услуги
        </Typography>
      ) : (
        <>
          <List>
            {selectedServices.map((service) => (
              <ListItem
                key={service.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleServiceRemove(service.id)}
                  >
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemIcon>{service.icon}</ListItemIcon>
                <ListItemText
                  primary={service.name}
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {service.price.amount} {service.price.currency}
                      {service.price.perPerson && ' / човек'}
                      {service.price.perCabin && ' / купе'}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Обща сума за допълнителни услуги:
            </Typography>
            <Typography variant="h6" color="primary">
              {selectedServices.reduce((sum, service) => sum + service.price.amount, 0)} EUR
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Save />}
          >
            Запази избраните услуги
          </Button>
        </>
      )}
    </StyledPaper>
  );

  const renderServiceDetailsDialog = () => (
    <Dialog
      open={detailsDialogOpen}
      onClose={() => setDetailsDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Допълнителна информация
      </DialogTitle>
      <DialogContent>
        {selectedService && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {selectedService.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {selectedService.description}
            </Typography>
            {/* Add specific form fields based on service type */}
            {selectedService.category === 'assistance' && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Тип асистенция</InputLabel>
                <Select
                  label="Тип асистенция"
                  defaultValue=""
                >
                  <MenuItem value="wheelchair">Инвалидна количка</MenuItem>
                  <MenuItem value="walking">Помощ при ходене</MenuItem>
                  <MenuItem value="transfer">Трансфер</MenuItem>
                </Select>
              </FormControl>
            )}
            {selectedService.category === 'catering' && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Специални изисквания</InputLabel>
                <Select
                  label="Специални изисквания"
                  defaultValue=""
                >
                  <MenuItem value="vegetarian">Вегетарианско</MenuItem>
                  <MenuItem value="vegan">Веган</MenuItem>
                  <MenuItem value="gluten_free">Без глутен</MenuItem>
                  <MenuItem value="lactose_free">Без лактоза</MenuItem>
                </Select>
              </FormControl>
            )}
            {/* Add more specific forms for other service types */}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDetailsDialogOpen(false)}>
          Отказ
        </Button>
        <Button
          variant="contained"
          onClick={() => handleDetailsSubmit({})}
        >
          Потвърди
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Допълнителни услуги
      </Typography>
      
      {renderSearchSection()}
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Box>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            {MOCK_CATEGORIES.map((category) => (
              <Tab
                key={category.id}
                value={category.id}
                label={category.name}
                icon={category.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            {MOCK_SERVICES
              .filter(service => service.category === activeTab)
              .map(service => renderServiceCard(service))}
          </Box>
        </Box>
        
        {renderSelectedServices()}
      </Box>
      
      {renderServiceDetailsDialog()}
    </Box>
  );
};

export default AdditionalServices; 