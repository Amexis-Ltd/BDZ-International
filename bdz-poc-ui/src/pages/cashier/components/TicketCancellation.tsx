import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextareaAutosize,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
} from '@mui/material';
import {
  QrCodeScanner as QrCodeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Types
interface CancellationRules {
  freeCancellationUntil: string;
  cancellationFee: number;
  refundPercentage: number;
}

interface TicketSegment {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  status: 'used' | 'unused' | 'cancelled';
  carrier: string;
  price: number;
  cancellationRules: CancellationRules;
}

interface TicketDetails {
  ticketNumber: string;
  passengerName: string;
  issueDate: string;
  segments: TicketSegment[];
  totalPrice: number;
  status: 'active' | 'partially_used' | 'cancelled';
  refundableAmount: number;
  cancellationFees: number;
  cancellationDeadline: string;
  financialChannel: 'card' | 'cash' | 'bank_transfer';
  originalPaymentMethod: string;
}

interface CancellationState {
  isFreeCancellation: boolean;
  requiresConfirmation: boolean;
  alternatives: string[];
}

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  fontFamily: theme.typography.fontFamily,
  fontSize: '0.875rem',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  borderColor: theme.palette.divider,
  resize: 'vertical',
  minRows: 3,
}));

const ScannerButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const steps = [
  'Въвеждане на билет',
  'Проверка на статус',
  'Избор на сегменти',
  'Потвърждение',
  'Анулиране',
  'Завършване',
];

const TicketCancellation: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [ticketNumber, setTicketNumber] = useState('');
  const [reason, setReason] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [cancellationRules, setCancellationRules] = useState<CancellationState | null>(null);

  const validateTicketCancellation = (ticket: TicketDetails): CancellationState => {
    const now = new Date();
    const isFreeCancellation = ticket.segments.every(
      segment => new Date(segment.cancellationRules.freeCancellationUntil) > now
    );
    
    const requiresConfirmation = !isFreeCancellation;
    const alternatives = ['Презаверяване на билета', 'Промяна на дата'];

    return {
      isFreeCancellation,
      requiresConfirmation,
      alternatives
    };
  };

  const calculateRefundAmount = (segment: TicketSegment): number => {
    const now = new Date();
    const isFreeCancellation = new Date(segment.cancellationRules.freeCancellationUntil) > now;
    
    if (segment.status === 'used') return 0;
    if (segment.status === 'cancelled') return 0;
    
    const refundAmount = segment.price * (segment.cancellationRules.refundPercentage / 100);
    return isFreeCancellation ? refundAmount : refundAmount - segment.cancellationRules.cancellationFee;
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setTicketNumber('TK123456789');
      setIsScanning(false);
      handleTicketSearch();
    }, 2000);
  };

  const handleTicketSearch = () => {
    if (!ticketNumber) {
      setError('Моля, въведете номер на билет');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    // Simulate API call
    setTimeout(() => {
      try {
        const mockTicket: TicketDetails = {
          ticketNumber: ticketNumber,
          passengerName: 'Иван Иванов',
          issueDate: '2024-03-15',
          segments: [
            {
              id: '1',
              from: 'София',
              to: 'Бургас',
              departureTime: '2024-03-20 08:00',
              arrivalTime: '2024-03-20 12:30',
              status: 'unused',
              carrier: 'BDZ',
              price: 45.00,
              cancellationRules: {
                freeCancellationUntil: '2024-03-19 23:59',
                cancellationFee: 4.50,
                refundPercentage: 90
              }
            },
            {
              id: '2',
              from: 'Бургас',
              to: 'Варна',
              departureTime: '2024-03-21 09:00',
              arrivalTime: '2024-03-21 11:30',
              status: 'used',
              carrier: 'BDZ',
              price: 35.00,
              cancellationRules: {
                freeCancellationUntil: '2024-03-20 23:59',
                cancellationFee: 3.50,
                refundPercentage: 0
              }
            }
          ],
          totalPrice: 80.00,
          status: 'partially_used',
          refundableAmount: 40.50,
          cancellationFees: 4.50,
          cancellationDeadline: '2024-03-19 23:59',
          financialChannel: 'card',
          originalPaymentMethod: 'Visa ****1234'
        };

        // Validate ticket and calculate refund amounts
        const cancellationState = validateTicketCancellation(mockTicket);
        const totalRefundableAmount = mockTicket.segments.reduce(
          (sum, segment) => sum + calculateRefundAmount(segment),
          0
        );
        const totalCancellationFees = mockTicket.segments.reduce(
          (sum, segment) => sum + (segment.status === 'unused' ? segment.cancellationRules.cancellationFee : 0),
          0
        );

        mockTicket.refundableAmount = totalRefundableAmount;
        mockTicket.cancellationFees = totalCancellationFees;

        setCancellationRules(cancellationState);
        setTicketDetails(mockTicket);
        setActiveStep(1);
      } catch (err) {
        setError('Възникна грешка при извличане на данните за билета');
    } finally {
        setIsProcessing(false);
      }
    }, 1000);
  };

  const handleSegmentSelection = (segmentId: string) => {
    setSelectedSegments(prev =>
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const handleConfirmation = () => {
    if (!reason) {
      setError('Моля, въведете причина за анулиране');
      return;
    }
    setShowConfirmation(true);
  };

  const handleCancellation = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API calls to all carriers
      const cancellationResults = await Promise.all(
        selectedSegments.map(async (segmentId) => {
          // Simulate carrier API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { segmentId, status: 'success' };
        })
      );

      // Check if all cancellations were successful
      const allSuccessful = cancellationResults.every(result => result.status === 'success');
      if (!allSuccessful) {
        throw new Error('Някои от сегментите не могат да бъдат анулирани');
      }

      // Simulate database update
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate financial refund initiation
      await new Promise(resolve => setTimeout(resolve, 500));

      setShowConfirmation(false);
      setActiveStep(5);
      setShowReceipt(true);
      setSuccess('Билетът е успешно анулиран');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Възникна грешка при анулирането на билета');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    // Implement receipt printing logic
    console.log('Printing receipt...');
  };

  const renderTicketInput = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Въведете номер на билет или сканирайте QR код
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            label="Номер на билет"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
          disabled={isScanning || isProcessing}
          error={!!error}
          helperText={error}
        />
        <ScannerButton
          variant="contained"
          startIcon={<QrCodeIcon />}
          onClick={handleScan}
          disabled={isScanning || isProcessing}
        >
          {isScanning ? <CircularProgress size={24} /> : 'Сканирай'}
        </ScannerButton>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleTicketSearch}
        disabled={!ticketNumber || isScanning || isProcessing}
      >
        {isProcessing ? <CircularProgress size={24} /> : 'Търси'}
      </Button>
    </Box>
  );

  const renderTicketDetails = () => {
    if (!ticketDetails || !cancellationRules) return null;

    const isSegmentUsed = (status: TicketSegment['status']) => status === 'used';
    const formatDateTime = (dateStr: string) => new Date(dateStr).toLocaleString('bg-BG');

    return (
      <Box>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Билет #{ticketDetails.ticketNumber}
                <StatusChip
                  label={
                    ticketDetails.status === 'active' ? 'Активен' :
                    ticketDetails.status === 'partially_used' ? 'Частично използван' : 'Анулиран'
                  }
                  color={
                    ticketDetails.status === 'active' ? 'success' :
                    ticketDetails.status === 'partially_used' ? 'warning' : 'error'
                  }
                />
              </Typography>
              <Box>
                <Typography variant="subtitle1">
                  Пътник: {ticketDetails.passengerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Дата на издаване: {formatDateTime(ticketDetails.issueDate)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {!cancellationRules.isFreeCancellation && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Периодът за безплатно анулиране е изтекъл. Ще бъдат приложени такси за анулиране.
              </Alert>
            )}

            <List>
              {ticketDetails.segments.map((segment) => (
                <ListItem
                  key={segment.id}
                  secondaryAction={
                    <Box sx={{ textAlign: 'right' }}>
                      {!isSegmentUsed(segment.status) && (
                        <Button
                          variant={selectedSegments.includes(segment.id) ? 'contained' : 'outlined'}
                          onClick={() => handleSegmentSelection(segment.id)}
                          disabled={isSegmentUsed(segment.status)}
                          sx={{ mb: 1 }}
                        >
                          {selectedSegments.includes(segment.id) ? 'Избран' : 'Избери'}
                        </Button>
                      )}
                      {isSegmentUsed(segment.status) && (
                        <Chip
                          label="Използван"
                          color="success"
            size="small"
                        />
                      )}
                      <Typography variant="body2" color="text.secondary">
                        Възстановима сума: {calculateRefundAmount(segment).toFixed(2)} лв.
                      </Typography>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {isSegmentUsed(segment.status) ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <ScheduleIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${segment.from} → ${segment.to}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          {formatDateTime(segment.departureTime)} - {formatDateTime(segment.arrivalTime)}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Превозвач: {segment.carrier} | Цена: {segment.price.toFixed(2)} лв.
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Безплатно анулиране до: {formatDateTime(segment.cancellationRules.freeCancellationUntil)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

          <StyledTextarea
            aria-label="reason for cancellation"
            placeholder="Причина за анулиране *"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
              disabled={isProcessing}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Обща възстановима сума: {ticketDetails.refundableAmount.toFixed(2)} лв.
                </Typography>
                <Typography variant="subtitle2" color="error">
                  Такси за анулиране: {ticketDetails.cancellationFees.toFixed(2)} лв.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Финансов канал: {ticketDetails.financialChannel === 'card' ? 'Карта' : 'Банков превод'}
                  {ticketDetails.financialChannel === 'card' && ` (${ticketDetails.originalPaymentMethod})`}
                </Typography>
        </Box>
          <Button
            variant="contained"
                color="primary"
                onClick={handleConfirmation}
                disabled={selectedSegments.length === 0 || !reason || isProcessing}
          >
                Продължи към анулиране
          </Button>
        </Box>

            {cancellationRules.alternatives.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Алтернативни опции:
                </Typography>
                <List dense>
                  {cancellationRules.alternatives.map((alt, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <InfoIcon color="info" />
                      </ListItemIcon>
                      <ListItemText primary={alt} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderConfirmationDialog = () => (
    <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)}>
      <DialogTitle>Потвърждение за анулиране</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Сигурни ли сте, че искате да анулирате избраните сегменти?
        </Alert>
        <Typography variant="body1" gutterBottom>
          Възстановима сума: {ticketDetails?.refundableAmount.toFixed(2)} лв.
        </Typography>
        <Typography variant="body2" color="error" gutterBottom>
          Такси за анулиране: {ticketDetails?.cancellationFees.toFixed(2)} лв.
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Причина: {reason}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowConfirmation(false)}>Отказ</Button>
        <Button
          onClick={handleCancellation}
          variant="contained"
          color="primary"
          disabled={isProcessing}
        >
          {isProcessing ? <CircularProgress size={24} /> : 'Потвърди анулиране'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderReceiptDialog = () => {
    if (!ticketDetails) return null;

    const formatDateTime = (dateStr: string) => new Date(dateStr).toLocaleString('bg-BG');
    const operationNumber = `CANC-${Date.now()}`;

    return (
      <Dialog open={showReceipt} onClose={() => setShowReceipt(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Документ за анулиране</Typography>
            <IconButton onClick={() => setShowReceipt(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <ReceiptIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h6" gutterBottom>
                  Анулиране на билет #{ticketDetails.ticketNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Дата: {formatDateTime(new Date().toISOString())}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <MoneyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Възстановена сума"
                    secondary={`${ticketDetails.refundableAmount.toFixed(2)} лв.`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Финансов канал"
                    secondary={
                      ticketDetails.financialChannel === 'card' 
                        ? `Карта (${ticketDetails.originalPaymentMethod})`
                        : 'Банков превод'
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Статус"
                    secondary="Анулиран успешно"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Номер на операция"
                    secondary={operationNumber}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Причина за анулиране"
                    secondary={reason}
                  />
                </ListItem>
              </List>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  * Възстановяването на средствата може да отнеме до 5 работни дни
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  * Запазете този документ като доказателство за анулирането
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<PrintIcon />}
            onClick={handlePrintReceipt}
            variant="contained"
            color="primary"
          >
            Принтирай
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Анулиране на билет
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && renderTicketInput()}
      {activeStep === 1 && renderTicketDetails()}
      
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

      {renderConfirmationDialog()}
      {renderReceiptDialog()}
    </StyledPaper>
  );
};

export default TicketCancellation; 