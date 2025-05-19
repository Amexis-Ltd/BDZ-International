import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  QrCodeScanner,
  History,
  AccessTime,
  CheckCircle,
  Cancel,
  Edit,
  Print,
  Payment,
  Train,
  Person,
  Email,
  Phone,
  CalendarToday,
  LocationOn,
  ConfirmationNumber,
  Receipt,
  Warning,
  Info,
} from '@mui/icons-material';
import { format, parseISO, addMinutes, isBefore, isAfter } from 'date-fns';
import { bg } from 'date-fns/locale';

// Types
type ReservationStatus = 'temporary' | 'confirmed' | 'cancelled' | 'expired';
type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'partially_refunded';
type TicketFormat = 'paper' | 'electronic' | 'mobile';
type PaymentMethod = 'cash' | 'card' | 'bank_transfer';
type TrainClass = 'first' | 'second';
type WagonType = 'standard' | 'compartment' | 'sleeper' | 'couchette';
type DiscountType = 'child' | 'student' | 'senior' | 'group' | 'loyalty';
type AdditionalService = 'bicycle' | 'pet' | 'extra_luggage' | 'meal';

interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  documentType: string;
  documentNumber: string;
  contactEmail?: string;
  contactPhone?: string;
  discounts: DiscountType[];
}

interface Seat {
  wagonNumber: string;
  seatNumber: string;
  class: TrainClass;
  type: WagonType;
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
  seats: Seat[];
}

interface AdditionalServiceInfo {
  type: AdditionalService;
  price: number;
  description: string;
}

interface Reservation {
  id: string;
  reservationNumber: string;
  barcode: string;
  qrCode: string;
  createdAt: string;
  validUntil?: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  passengers: Passenger[];
  route: RouteSegment[];
  totalPrice: number;
  paidAmount: number;
  refundedAmount: number;
  additionalServices: AdditionalServiceInfo[];
  ticketFormat?: TicketFormat;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdBy: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
}

// Mock data for reservations
const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: '1',
    reservationNumber: 'RES-2024-001',
    barcode: '123456789012',
    qrCode: 'data:image/png;base64,...',
    createdAt: '2024-03-20T10:00:00',
    validUntil: '2024-03-20T11:00:00',
    status: 'temporary',
    paymentStatus: 'pending',
    passengers: [
      {
        id: 'P1',
        firstName: 'Иван',
        lastName: 'Петров',
        age: 35,
        documentType: 'ЕГН',
        documentNumber: '7501011234',
        contactEmail: 'ivan.petrov@email.com',
        contactPhone: '+359888123456',
        discounts: []
      }
    ],
    route: [
      {
        id: 'S1',
        carrier: 'BDZ',
        trainNumber: 'IC 123',
        fromStation: 'София',
        toStation: 'Бургас',
        departureTime: '2024-03-21T08:00:00',
        arrivalTime: '2024-03-21T12:30:00',
        platform: '1',
        seats: [
          {
            wagonNumber: '51-22-80-70-123-4',
            seatNumber: '45',
            class: 'second',
            type: 'standard'
          }
        ]
      }
    ],
    totalPrice: 45.00,
    paidAmount: 0,
    refundedAmount: 0,
    additionalServices: [],
    createdBy: 'cashier1',
    lastModifiedBy: 'cashier1',
    lastModifiedAt: '2024-03-20T10:00:00'
  },
  {
    id: '2',
    reservationNumber: 'RES-2024-002',
    barcode: '123456789013',
    qrCode: 'data:image/png;base64,...',
    createdAt: '2024-03-20T09:30:00',
    status: 'confirmed',
    paymentStatus: 'paid',
    passengers: [
      {
        id: 'P2',
        firstName: 'Мария',
        lastName: 'Иванова',
        age: 28,
        documentType: 'ЕГН',
        documentNumber: '9602025678',
        contactEmail: 'maria.ivanova@email.com',
        contactPhone: '+359888765432',
        discounts: ['student']
      },
      {
        id: 'P3',
        firstName: 'Петър',
        lastName: 'Иванов',
        age: 65,
        documentType: 'ЕГН',
        documentNumber: '5903039012',
        contactEmail: 'petar.ivanov@email.com',
        contactPhone: '+359888901234',
        discounts: ['senior']
      }
    ],
    route: [
      {
        id: 'S2',
        carrier: 'BDZ',
        trainNumber: 'IC 456',
        fromStation: 'София',
        toStation: 'Виена',
        departureTime: '2024-03-21T06:30:00',
        arrivalTime: '2024-03-21T14:45:00',
        platform: '2',
        seats: [
          {
            wagonNumber: '51-22-80-70-123-7',
            seatNumber: '12',
            class: 'second',
            type: 'standard'
          },
          {
            wagonNumber: '51-22-80-70-123-7',
            seatNumber: '13',
            class: 'second',
            type: 'standard'
          }
        ]
      },
      {
        id: 'S3',
        carrier: 'OBB',
        trainNumber: 'RJ 789',
        fromStation: 'Виена',
        toStation: 'Мюнхен',
        departureTime: '2024-03-21T15:30:00',
        arrivalTime: '2024-03-21T18:45:00',
        platform: '5',
        seats: [
          {
            wagonNumber: 'OBB-123-4',
            seatNumber: '23',
            class: 'second',
            type: 'standard'
          },
          {
            wagonNumber: 'OBB-123-4',
            seatNumber: '24',
            class: 'second',
            type: 'standard'
          }
        ]
      }
    ],
    totalPrice: 150.00,
    paidAmount: 150.00,
    refundedAmount: 0,
    additionalServices: [
      {
        type: 'bicycle',
        price: 10.00,
        description: 'Велосипед'
      }
    ],
    ticketFormat: 'electronic',
    paymentMethod: 'card',
    createdBy: 'cashier2',
    lastModifiedBy: 'cashier2',
    lastModifiedAt: '2024-03-20T09:30:00'
  },
  // Add more mock reservations here...
];

// Status colors and labels
const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
  temporary: { label: 'Временна', color: 'warning' },
  confirmed: { label: 'Потвърдена', color: 'success' },
  cancelled: { label: 'Анулирана', color: 'error' },
  expired: { label: 'Изтекла', color: 'default' }
};

// Component
export default function ReservationManagement() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<'reservation' | 'passenger' | 'contact'>('reservation');
  const [activeTab, setActiveTab] = useState(0);
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all');
  const [recentReservations, setRecentReservations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialogs state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Effects
  useEffect(() => {
    // Filter reservations based on status
    let filtered = [...reservations];
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    setFilteredReservations(filtered);
  }, [reservations, statusFilter]);

  // Handlers
  const handleSearch = () => {
    setIsLoading(true);
    setError(null);

    try {
      let results: Reservation[] = [];

      switch (searchType) {
        case 'reservation':
          results = reservations.filter(r => 
            r.reservationNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
            r.barcode.includes(searchValue)
          );
          break;
        case 'passenger':
          results = reservations.filter(r =>
            r.passengers.some(p =>
              `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchValue.toLowerCase()) ||
              p.documentNumber.includes(searchValue)
            )
          );
          break;
        case 'contact':
          results = reservations.filter(r =>
            r.passengers.some(p =>
              (p.contactEmail && p.contactEmail.toLowerCase().includes(searchValue.toLowerCase())) ||
              (p.contactPhone && p.contactPhone.includes(searchValue))
            )
          );
          break;
      }

      setFilteredReservations(results);
      if (results.length === 0) {
        setError('Не са намерени резервации, отговарящи на критериите за търсене.');
      }
    } catch (err) {
      setError('Възникна грешка при търсенето. Моля, опитайте отново.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReservationSelect = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    // Add to recent reservations
    setRecentReservations(prev => {
      const updated = [reservation.id, ...prev.filter(id => id !== reservation.id)].slice(0, 5);
      return updated;
    });
  };

  const handleStatusFilterChange = (status: ReservationStatus | 'all') => {
    setStatusFilter(status);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Add these handlers after the existing handlers
  const handleConfirmModification = () => {
    if (!selectedReservation) return;
    
    // TODO: Implement actual modification logic
    setShowModifyDialog(false);
    setShowSuccessDialog(true);
  };

  const handleConfirmCancellation = () => {
    if (!selectedReservation) return;
    
    // TODO: Implement actual cancellation logic
    setShowCancelDialog(false);
    setShowSuccessDialog(true);
  };

  const handleConfirmFinalization = () => {
    if (!selectedReservation) return;
    
    // TODO: Implement actual finalization logic
    setShowFinalizeDialog(false);
    setShowSuccessDialog(true);
  };

  // Render functions
  const renderSearchSection = () => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 2,
        alignItems: 'center'
      }}>
        <Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="Търсене на резервация"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                endAdornment: (
                  <IconButton>
                    <QrCodeScanner />
                  </IconButton>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={!searchValue.trim()}
            >
              Търси
            </Button>
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant={searchType === 'reservation' ? 'contained' : 'outlined'}
              onClick={() => setSearchType('reservation')}
              startIcon={<ConfirmationNumber />}
            >
              По резервация
            </Button>
            <Button
              variant={searchType === 'passenger' ? 'contained' : 'outlined'}
              onClick={() => setSearchType('passenger')}
              startIcon={<Person />}
            >
              По пътник
            </Button>
            <Button
              variant={searchType === 'contact' ? 'contained' : 'outlined'}
              onClick={() => setSearchType('contact')}
              startIcon={<Email />}
            >
              По контакт
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Recent reservations */}
      {recentReservations.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Последно прегледани резервации:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {recentReservations.map(id => {
              const reservation = reservations.find(r => r.id === id);
              if (!reservation) return null;
              return (
                <Chip
                  key={id}
                  label={`${reservation.reservationNumber} - ${reservation.passengers[0].firstName} ${reservation.passengers[0].lastName}`}
                  onClick={() => handleReservationSelect(reservation)}
                  color={reservation.status === 'temporary' ? 'warning' : 'default'}
                  variant="outlined"
                />
              );
            })}
          </Stack>
        </Box>
      )}
    </Paper>
  );

  const renderActiveReservations = () => (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Активни резервации за днес
      </Typography>

      {/* Status filters */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="Всички"
            onClick={() => handleStatusFilterChange('all')}
            color={statusFilter === 'all' ? 'primary' : 'default'}
            variant={statusFilter === 'all' ? 'filled' : 'outlined'}
          />
          {Object.entries(STATUS_CONFIG).map(([status, { label, color }]) => (
            <Chip
              key={status}
              label={label}
              onClick={() => handleStatusFilterChange(status as ReservationStatus)}
              color={statusFilter === status ? color : 'default'}
              variant={statusFilter === status ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
      </Box>

      {/* Reservations table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Резервация</TableCell>
              <TableCell>Маршрут</TableCell>
              <TableCell>Заминаване</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Пътници</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservations.map(reservation => (
              <TableRow
                key={reservation.id}
                hover
                onClick={() => handleReservationSelect(reservation)}
                selected={selectedReservation?.id === reservation.id}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{reservation.reservationNumber}</TableCell>
                <TableCell>
                  {reservation.route[0].fromStation} → {reservation.route[reservation.route.length - 1].toStation}
                </TableCell>
                <TableCell>
                  {format(new Date(reservation.route[0].departureTime), 'HH:mm')}
                </TableCell>
                <TableCell>
                  <Chip
                    label={STATUS_CONFIG[reservation.status].label}
                    color={STATUS_CONFIG[reservation.status].color}
                    size="small"
                  />
                </TableCell>
                <TableCell>{reservation.passengers.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  const renderReservationDetails = () => {
    if (!selectedReservation) {
      return (
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Изберете резервация за преглед на детайли
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper sx={{ p: 2 }}>
        {/* Reservation header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Резервация {selectedReservation.reservationNumber}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={STATUS_CONFIG[selectedReservation.status].label}
                color={STATUS_CONFIG[selectedReservation.status].color}
              />
              <Chip
                label={`Създадена на ${format(new Date(selectedReservation.createdAt), 'dd.MM.yyyy HH:mm')}`}
                variant="outlined"
              />
              {selectedReservation.validUntil && (
                <Chip
                  icon={<AccessTime />}
                  label={`Валидна до ${format(new Date(selectedReservation.validUntil), 'dd.MM.yyyy HH:mm')}`}
                  color={isBefore(new Date(), new Date(selectedReservation.validUntil)) ? 'warning' : 'error'}
                />
              )}
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {selectedReservation.status === 'temporary' && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Payment />}
                onClick={() => setShowFinalizeDialog(true)}
              >
                Финализирай
              </Button>
            )}
            {selectedReservation.status === 'confirmed' && (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setShowModifyDialog(true)}
              >
                Промени
              </Button>
            )}
            {['temporary', 'confirmed'].includes(selectedReservation.status) && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => setShowCancelDialog(true)}
              >
                Анулирай
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={() => window.print()}
            >
              Разпечатай
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Route details */}
        <Typography variant="subtitle1" gutterBottom>
          Маршрут
        </Typography>
        <Box sx={{ mb: 3 }}>
          {selectedReservation.route.map((segment, index) => (
            <React.Fragment key={segment.id}>
              <Card variant="outlined" sx={{ mb: 1 }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr 1fr' },
                    gap: 2 
                  }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        {format(new Date(segment.departureTime), 'HH:mm')}
                      </Typography>
                      <Typography variant="body2">
                        {segment.fromStation}
                      </Typography>
                      {segment.platform && (
                        <Typography variant="caption" color="text.secondary">
                          Платформа {segment.platform}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Train color="action" />
                        <Typography variant="body2">
                          {segment.carrier} {segment.trainNumber}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                        {Math.floor((new Date(segment.arrivalTime).getTime() - new Date(segment.departureTime).getTime()) / (1000 * 60))} мин
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" align="right">
                        {format(new Date(segment.arrivalTime), 'HH:mm')}
                      </Typography>
                      <Typography variant="body2" align="right">
                        {segment.toStation}
                      </Typography>
                      {segment.platform && (
                        <Typography variant="caption" color="text.secondary" align="right" sx={{ display: 'block' }}>
                          Платформа {segment.platform}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              {index < selectedReservation.route.length - 1 && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <Chip
                    size="small"
                    label={`Прекачване в ${segment.toStation} - ${format(addMinutes(new Date(segment.arrivalTime), 30), 'HH:mm')}`}
                    variant="outlined"
                  />
                </Box>
              )}
            </React.Fragment>
          ))}
        </Box>

        {/* Passengers */}
        <Typography variant="subtitle1" gutterBottom>
          Пътници
        </Typography>
        <Box sx={{ mb: 3 }}>
          {selectedReservation.passengers.map((passenger, index) => (
            <Card key={passenger.id} variant="outlined" sx={{ mb: 1 }}>
              <CardContent>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2 
                }}>
                  <Box>
                    <Typography variant="subtitle2">
                      {passenger.firstName} {passenger.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {passenger.age} години
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {passenger.documentType}: {passenger.documentNumber}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">
                      {passenger.contactEmail && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <Email fontSize="small" color="action" />
                          {passenger.contactEmail}
                        </Box>
                      )}
                      {passenger.contactPhone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Phone fontSize="small" color="action" />
                          {passenger.contactPhone}
                        </Box>
                      )}
                    </Typography>
                  </Box>
                </Box>
                {passenger.discounts.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={1}>
                      {passenger.discounts.map(discount => (
                        <Chip
                          key={discount}
                          label={
                            discount === 'child' ? 'Детска' :
                            discount === 'student' ? 'Студентска' :
                            discount === 'senior' ? 'Пенсионерска' :
                            discount === 'group' ? 'Групова' : 'Лоялност'
                          }
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Additional services */}
        {selectedReservation.additionalServices.length > 0 && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Допълнителни услуги
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {selectedReservation.additionalServices.map(service => (
                  <Chip
                    key={service.type}
                    label={`${service.description} - ${service.price.toFixed(2)} лв.`}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          </>
        )}

        {/* Price information */}
        <Typography variant="subtitle1" gutterBottom>
          Ценова информация
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2 
            }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Обща цена
                </Typography>
                <Typography variant="h6" color="primary">
                  {selectedReservation.totalPrice.toFixed(2)} лв.
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Статус на плащане
                </Typography>
                <Chip
                  label={
                    selectedReservation.paymentStatus === 'paid' ? 'Платено' :
                    selectedReservation.paymentStatus === 'pending' ? 'Чакащо плащане' :
                    selectedReservation.paymentStatus === 'refunded' ? 'Възстановено' :
                    'Частично възстановено'
                  }
                  color={
                    selectedReservation.paymentStatus === 'paid' ? 'success' :
                    selectedReservation.paymentStatus === 'pending' ? 'warning' :
                    'info'
                  }
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Paper>
    );
  };

  // Main render
  return (
    <Box sx={{ p: 3 }}>
      {/* Search section */}
      {renderSearchSection()}

      {/* Main content */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2 
      }}>
        {/* Active reservations */}
        <Box>
          {renderActiveReservations()}
        </Box>

        {/* Reservation details */}
        {selectedReservation && (
          <Box>
            {renderReservationDetails()}
          </Box>
        )}
      </Box>

      {/* Loading indicator */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Dialogs */}
      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Потвърждение на промяна</DialogTitle>
        <DialogContent>
          <Typography>
            Сигурни ли сте, че искате да промените резервация {selectedReservation?.reservationNumber}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Отказ</Button>
          <Button onClick={handleConfirmModification} variant="contained" color="primary">
            Потвърди
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancellation Dialog */}
      <Dialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Анулиране на резервация</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Сигурни ли сте, че искате да анулирате резервация {selectedReservation?.reservationNumber}?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Това действие не може да бъде отменено. Всички свързани плащания ще бъдат възстановени според политиката за отмяна.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)}>Отказ</Button>
          <Button onClick={handleConfirmCancellation} variant="contained" color="error">
            Анулирай
          </Button>
        </DialogActions>
      </Dialog>

      {/* Finalization Dialog */}
      <Dialog
        open={showFinalizeDialog}
        onClose={() => setShowFinalizeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Финализиране на резервация</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Финализиране на временна резервация {selectedReservation?.reservationNumber}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Детайли на плащане:
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr',
              gap: 2 
            }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Обща сума за плащане
                </Typography>
                <Typography variant="h6" color="primary">
                  {selectedReservation?.totalPrice.toFixed(2)} лв.
                </Typography>
              </Box>
              <Box>
                <FormControl fullWidth>
                  <InputLabel>Начин на плащане</InputLabel>
                  <Select
                    label="Начин на плащане"
                    defaultValue="card"
                  >
                    <MenuItem value="cash">В брой</MenuItem>
                    <MenuItem value="card">С карта</MenuItem>
                    <MenuItem value="bank_transfer">Банков превод</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FormControl fullWidth>
                  <InputLabel>Формат на билета</InputLabel>
                  <Select
                    label="Формат на билета"
                    defaultValue="electronic"
                  >
                    <MenuItem value="paper">Хартиен</MenuItem>
                    <MenuItem value="electronic">Електронен</MenuItem>
                    <MenuItem value="mobile">Мобилен</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFinalizeDialog(false)}>Отказ</Button>
          <Button onClick={handleConfirmFinalization} variant="contained" color="primary">
            Финализирай и плати
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle color="success" />
            Успешно
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Операцията беше изпълнена успешно.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccessDialog(false)} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog
        open={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="error" />
            Грешка
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Възникна грешка при изпълнение на операцията. Моля, опитайте отново.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowErrorDialog(false)} variant="contained" color="error">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 