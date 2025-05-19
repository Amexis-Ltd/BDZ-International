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
} from '@mui/material';
import {
  QrCodeScanner,
  Search,
  CheckCircle,
  Cancel,
  Warning,
  ExpandMore,
  ExpandLess,
  Print,
  Edit,
  History,
  Wifi,
  WifiOff,
  Train,
  Person,
  EventSeat,
  AccessTime,
  LocationOn,
  AttachMoney,
  Receipt,
  Info,
  DirectionsBike,
  Pets,
  Restaurant,
  Luggage,
  AccessibilityNew,
  School,
  Elderly,
  ChildCare,
  Security,
  Sync,
  Save,
  Add,
  Remove,
  Refresh,
  ConfirmationNumber,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format, parseISO, isBefore, isAfter, addMinutes } from 'date-fns';
import { bg } from 'date-fns/locale';

// Types
type TicketStatus = 'valid' | 'invalid' | 'warning' | 'used' | 'expired' | 'cancelled';
type TicketType = 'international' | 'domestic';
type TicketFormat = 'electronic' | 'paper';
type PassengerCategory = 'adult' | 'child' | 'youth' | 'senior' | 'student';
type SegmentStatus = 'upcoming' | 'used' | 'cancelled';
type ValidationStatus = 'pending' | 'validated' | 'rejected';
type ConnectionStatus = 'online' | 'offline';

interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  category: PassengerCategory;
  documentType: string;
  documentNumber: string;
  discounts: string[];
  requiresDocumentCheck: boolean;
}

interface RouteSegment {
  id: string;
  carrier: string;
  trainNumber: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  platform?: string;
  status: SegmentStatus;
  seats: {
    wagonNumber: string;
    seatNumber: string;
    class: 'first' | 'second';
  }[];
}

interface AdditionalService {
  type: 'meal' | 'bicycle' | 'pet' | 'luggage' | 'assistance';
  description: string;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface ValidationRecord {
  id: string;
  timestamp: string;
  location: string;
  validator: string;
  status: ValidationStatus;
  notes?: string;
}

interface Ticket {
  id: string;
  ticketNumber: string;
  barcode: string;
  qrCode: string;
  type: TicketType;
  format: TicketFormat;
  status: TicketStatus;
  issueDate: string;
  validFrom: string;
  validTo: string;
  saleChannel: 'counter' | 'online' | 'mobile';
  passengers: Passenger[];
  route: RouteSegment[];
  totalPrice: number;
  priceBreakdown: {
    basePrice: number;
    supplements: number;
    discounts: number;
    additionalServices: number;
  };
  additionalServices: AdditionalService[];
  validationHistory: ValidationRecord[];
  issuedBy: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
}

// Mock data for demonstration
const MOCK_TICKETS: Ticket[] = [
  {
    id: 'T1',
    ticketNumber: 'INT-2024-001',
    barcode: '123456789012',
    qrCode: 'data:image/png;base64,...',
    type: 'international',
    format: 'electronic',
    status: 'valid',
    issueDate: '2024-03-20T10:00:00',
    validFrom: '2024-03-21T08:00:00',
    validTo: '2024-03-21T18:45:00',
    saleChannel: 'counter',
    passengers: [
      {
        id: 'P1',
        firstName: 'Иван',
        lastName: 'Петров',
        category: 'adult',
        documentType: 'ЕГН',
        documentNumber: '7501011234',
        discounts: [],
        requiresDocumentCheck: false
      }
    ],
    route: [
      {
        id: 'S1',
        carrier: 'BDZ',
        trainNumber: 'IC 123',
        fromStation: 'София',
        toStation: 'Виена',
        departureTime: '2024-03-21T08:00:00',
        arrivalTime: '2024-03-21T14:45:00',
        platform: '1',
        status: 'upcoming',
        seats: [
          {
            wagonNumber: '51-22-80-70-123-4',
            seatNumber: '45',
            class: 'second'
          }
        ]
      }
    ],
    totalPrice: 150.00,
    priceBreakdown: {
      basePrice: 120.00,
      supplements: 20.00,
      discounts: 0.00,
      additionalServices: 10.00
    },
    additionalServices: [
      {
        type: 'bicycle',
        description: 'Велосипед',
        price: 10.00,
        status: 'confirmed'
      }
    ],
    validationHistory: [],
    issuedBy: 'cashier1',
    lastModifiedBy: 'cashier1',
    lastModifiedAt: '2024-03-20T10:00:00'
  },
  {
    id: 'T2',
    ticketNumber: 'INT-2024-002',
    barcode: '234567890123',
    qrCode: 'data:image/png;base64,...',
    type: 'international',
    format: 'electronic',
    status: 'used',
    issueDate: '2024-03-19T15:30:00',
    validFrom: '2024-03-20T06:00:00',
    validTo: '2024-03-20T16:30:00',
    saleChannel: 'online',
    passengers: [
      {
        id: 'P2',
        firstName: 'Мария',
        lastName: 'Иванова',
        category: 'senior',
        documentType: 'ЕГН',
        documentNumber: '5501012345',
        discounts: ['senior'],
        requiresDocumentCheck: true
      }
    ],
    route: [
      {
        id: 'S3',
        carrier: 'BDZ',
        trainNumber: 'IC 456',
        fromStation: 'София',
        toStation: 'Букурещ',
        departureTime: '2024-03-20T06:00:00',
        arrivalTime: '2024-03-20T16:30:00',
        platform: '3',
        status: 'used',
        seats: [
          {
            wagonNumber: '51-22-80-70-456-7',
            seatNumber: '12',
            class: 'first'
          }
        ]
      }
    ],
    totalPrice: 180.00,
    priceBreakdown: {
      basePrice: 200.00,
      supplements: 0.00,
      discounts: 20.00,
      additionalServices: 0.00
    },
    additionalServices: [],
    validationHistory: [
      {
        id: 'V1',
        timestamp: '2024-03-20T06:15:00',
        location: 'София Централна гара',
        validator: 'Контрольор 2',
        status: 'validated',
        notes: 'Валидиран при влизане'
      }
    ],
    issuedBy: 'system',
    lastModifiedBy: 'system',
    lastModifiedAt: '2024-03-19T15:30:00'
  },
  {
    id: 'T3',
    ticketNumber: 'INT-2024-003',
    barcode: '345678901234',
    qrCode: 'data:image/png;base64,...',
    type: 'international',
    format: 'electronic',
    status: 'expired',
    issueDate: '2024-03-18T09:00:00',
    validFrom: '2024-03-19T07:00:00',
    validTo: '2024-03-19T17:00:00',
    saleChannel: 'mobile',
    passengers: [
      {
        id: 'P3',
        firstName: 'Георги',
        lastName: 'Димитров',
        category: 'student',
        documentType: 'Студентска карта',
        documentNumber: '2023-12345',
        discounts: ['student'],
        requiresDocumentCheck: true
      }
    ],
    route: [
      {
        id: 'S4',
        carrier: 'BDZ',
        trainNumber: 'IC 789',
        fromStation: 'София',
        toStation: 'Белград',
        departureTime: '2024-03-19T07:00:00',
        arrivalTime: '2024-03-19T17:00:00',
        platform: '2',
        status: 'upcoming',
        seats: [
          {
            wagonNumber: '51-22-80-70-789-0',
            seatNumber: '34',
            class: 'second'
          }
        ]
      }
    ],
    totalPrice: 90.00,
    priceBreakdown: {
      basePrice: 120.00,
      supplements: 0.00,
      discounts: 30.00,
      additionalServices: 0.00
    },
    additionalServices: [],
    validationHistory: [],
    issuedBy: 'system',
    lastModifiedBy: 'system',
    lastModifiedAt: '2024-03-18T09:00:00'
  }
];

// Status colors and labels
const STATUS_CONFIG: Record<TicketStatus, { label: string; color: 'success' | 'error' | 'warning' | 'default' }> = {
  valid: { label: 'Валиден', color: 'success' },
  invalid: { label: 'Невалиден', color: 'error' },
  warning: { label: 'Предупреждение', color: 'warning' },
  used: { label: 'Използван', color: 'default' },
  expired: { label: 'Изтекъл', color: 'error' },
  cancelled: { label: 'Анулиран', color: 'error' }
};

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StatusBadge = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const ValidationButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
}));

const StatusChip = styled(Chip)<{ status: TicketStatus }>(({ theme, status }) => {
  const statusColors = {
    valid: theme.palette.success.main,
    invalid: theme.palette.error.main,
    warning: theme.palette.warning.main,
    used: theme.palette.info.main,
    expired: theme.palette.error.main,
    cancelled: theme.palette.error.main,
  };

  return {
    backgroundColor: statusColors[status],
    color: theme.palette.common.white,
  };
});

const TicketValidation: React.FC = () => {
  // State
  const [ticketNumber, setTicketNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('online');
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);
  const [validationNotes, setValidationNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [offlineValidations, setOfflineValidations] = useState<ValidationRecord[]>([]);

  // Theme and responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Effects
  useEffect(() => {
    // Simulate connection status changes
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.9 ? 'offline' : 'online');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleScan = () => {
    setIsScanning(true);
    setError(null);

    // Simulate scanning delay
    setTimeout(() => {
      // Randomly select a mock ticket
      const randomTicket = MOCK_TICKETS[Math.floor(Math.random() * MOCK_TICKETS.length)];
      setTicketNumber(randomTicket.ticketNumber);
      setIsScanning(false);
      handleTicketSearch();
    }, 2000);
  };

  const handleTicketSearch = () => {
    if (!ticketNumber) {
      setError('Моля, въведете номер на билет');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      const ticket = MOCK_TICKETS.find(t => 
        t.ticketNumber === ticketNumber || 
        t.barcode === ticketNumber
      );

      if (ticket) {
        setCurrentTicket(ticket);
      } else {
        setError('Билетът не е намерен. Моля, проверете номера и опитайте отново.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleValidate = () => {
    if (!currentTicket) return;

    if (connectionStatus === 'offline') {
      setShowOfflineDialog(true);
      return;
    }

    setShowValidationDialog(true);
  };

  const handleConfirmValidation = () => {
    if (!currentTicket) return;

    const validation: ValidationRecord = {
      id: `V${Date.now()}`,
      timestamp: new Date().toISOString(),
      location: 'София Централна гара',
      validator: 'Контрольор 1',
      status: 'validated',
      notes: validationNotes
    };

    setCurrentTicket(prev => {
      if (!prev) return null;
      return {
        ...prev,
        validationHistory: [...prev.validationHistory, validation]
      };
    });

    setShowValidationDialog(false);
    setValidationNotes('');
  };

  const handleSegmentValidation = (segmentId: string) => {
    if (!currentTicket) return;

    setCurrentTicket(prev => {
      if (!prev) return null;
      return {
        ...prev,
        route: prev.route.map(segment => 
          segment.id === segmentId
            ? { ...segment, status: 'used' as SegmentStatus }
            : segment
        )
      };
    });
  };

  const handleOfflineValidation = () => {
    if (!currentTicket) return;

    const validation: ValidationRecord = {
      id: `V${Date.now()}`,
      timestamp: new Date().toISOString(),
      location: 'София Централна гара',
      validator: 'Контрольор 1',
      status: 'pending',
      notes: validationNotes
    };

    setOfflineValidations(prev => [...prev, validation]);
    setShowOfflineDialog(false);
    setValidationNotes('');
  };

  // Render functions
  const renderTicketSearch = () => (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Проверка на билет
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 2,
        alignItems: 'center'
      }}>
        <Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="Номер на билет"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              disabled={isScanning || isLoading}
              error={!!error}
              helperText={error}
              InputProps={{
                startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                endAdornment: (
                  <IconButton
                    onClick={handleScan}
                    disabled={isScanning || isLoading}
                  >
                    {isScanning ? <CircularProgress size={24} /> : <QrCodeScanner />}
                  </IconButton>
                ),
              }}
            />
            <ValidationButton
              variant="contained"
              onClick={handleTicketSearch}
              disabled={!ticketNumber.trim() || isScanning || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Валидирай'}
            </ValidationButton>
          </Box>
        </Box>
        
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Статус на връзката:
            </Typography>
            <Chip
              icon={connectionStatus === 'online' ? <Wifi /> : <WifiOff />}
              label={connectionStatus === 'online' ? 'Онлайн' : 'Офлайн'}
              color={connectionStatus === 'online' ? 'success' : 'error'}
              size="small"
            />
          </Box>
        </Box>
      </Box>
    </StyledPaper>
  );

  const renderValidationResult = () => {
    if (!currentTicket) return null;

    const getStatusColor = (status: TicketStatus) => {
      switch (status) {
        case 'valid':
          return 'success';
        case 'invalid':
        case 'expired':
        case 'cancelled':
          return 'error';
        case 'warning':
          return 'warning';
        case 'used':
          return 'info';
        default:
          return 'default';
      }
    };

    return (
      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Резултат от проверката
          </Typography>
          <StatusChip
            status={currentTicket.status}
            label={currentTicket.status.toUpperCase()}
            color={getStatusColor(currentTicket.status)}
          />
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2 
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ConfirmationNumber />
              <Typography variant="h6">Детайли за билета</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Person />
              <Typography>
                {currentTicket.passengers.map(p => 
                  `${p.firstName} ${p.lastName} (${p.category})`
                ).join(', ')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Train />
              <Typography>
                {currentTicket.route.map(segment => 
                  `${segment.fromStation} → ${segment.toStation} (${segment.trainNumber})`
                ).join(' | ')}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <EventSeat />
              <Typography variant="h6">Места и пътници</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Receipt />
              <Typography>
                Цена: {currentTicket.totalPrice.toFixed(2)} лв.
              </Typography>
            </Box>

            {currentTicket.validationHistory.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <History />
                <Typography>
                  Последна валидация: {
                    new Date(currentTicket.validationHistory[0].timestamp).toLocaleString()
                  }
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Скрий детайли' : 'Покажи детайли'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowValidationDialog(true)}
            disabled={currentTicket.status !== 'valid'}
          >
            Валидирай
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setCurrentTicket(null);
              setTicketNumber('');
            }}
          >
            Нова проверка
          </Button>
        </Box>
      </StyledPaper>
    );
  };

  // Dialogs
  const renderValidationDialog = () => (
    <Dialog
      open={showValidationDialog}
      onClose={() => setShowValidationDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Потвърждение на валидация</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Сигурни ли сте, че искате да валидирате билет {currentTicket?.ticketNumber}?
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Бележки"
          value={validationNotes}
          onChange={(e) => setValidationNotes(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowValidationDialog(false)}>Отказ</Button>
        <Button onClick={handleConfirmValidation} variant="contained" color="primary">
          Потвърди
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderOfflineDialog = () => (
    <Dialog
      open={showOfflineDialog}
      onClose={() => setShowOfflineDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WifiOff color="warning" />
          Офлайн валидация
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Устройството работи в офлайн режим. Валидацията ще бъде запазена локално и синхронизирана при възстановяване на връзката.
        </Alert>
        <Typography gutterBottom>
          Сигурни ли сте, че искате да валидирате билет {currentTicket?.ticketNumber} в офлайн режим?
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Бележки"
          value={validationNotes}
          onChange={(e) => setValidationNotes(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowOfflineDialog(false)}>Отказ</Button>
        <Button onClick={handleOfflineValidation} variant="contained" color="warning">
          Валидирай офлайн
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Main render
  return (
    <Box sx={{ p: 3 }}>
      {renderTicketSearch()}
      {currentTicket && renderValidationResult()}
      {renderValidationDialog()}
      {renderOfflineDialog()}

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Offline validations indicator */}
      {offlineValidations.length > 0 && (
        <Alert
          severity="info"
          sx={{ mt: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<Sync />}
              onClick={() => {
                // Simulate sync
                setOfflineValidations([]);
              }}
            >
              Синхронизирай
            </Button>
          }
        >
          {offlineValidations.length} офлайн валидации чакат синхронизация
        </Alert>
      )}
    </Box>
  );
};

export default TicketValidation; 