import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  Tooltip,
  FormHelperText,
  InputAdornment,
  TablePagination,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
  Autocomplete,
  Stack,
  CircularProgress,
  Badge,
  Avatar,
  CardHeader,
  CardActions,
  CardMedia,
  Collapse,
  AlertTitle,
  Breadcrumbs,
  Link,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  MobileStepper,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  ListItemButton,
  ListItemAvatar,
  ListSubheader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Fab,
  Zoom,
  Grow,
  Fade,
  Slide,
  Skeleton,
  Backdrop,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  MenuBook as MenuBookIcon,
  MenuBookOutlined as MenuBookOutlinedIcon,
  MenuBookRounded as MenuBookRoundedIcon,
  MenuBookSharp as MenuBookSharpIcon,
  MenuBookTwoTone as MenuBookTwoToneIcon,
  MenuOpenOutlined as MenuOpenOutlinedIcon,
  MenuOpenRounded as MenuOpenRoundedIcon,
  MenuOpenSharp as MenuOpenSharpIcon,
  MenuOpenTwoTone as MenuOpenTwoToneIcon,
  MenuOutlined as MenuOutlinedIcon,
  MenuRounded as MenuRoundedIcon,
  MenuSharp as MenuSharpIcon,
  MenuTwoTone as MenuTwoToneIcon,
  MoreHoriz as MoreHorizIcon,
  MoreHorizOutlined as MoreHorizOutlinedIcon,
  MoreHorizRounded as MoreHorizRoundedIcon,
  MoreHorizSharp as MoreHorizSharpIcon,
  MoreHorizTwoTone as MoreHorizTwoToneIcon,
  MoreVertOutlined as MoreVertOutlinedIcon,
  MoreVertRounded as MoreVertRoundedIcon,
  MoreVertSharp as MoreVertSharpIcon,
  MoreVertTwoTone as MoreVertTwoToneIcon,
  RefreshOutlined as RefreshOutlinedIcon,
  RefreshRounded as RefreshRoundedIcon,
  RefreshSharp as RefreshSharpIcon,
  RefreshTwoTone as RefreshTwoToneIcon,
  SearchOutlined as SearchOutlinedIcon,
  SearchRounded as SearchRoundedIcon,
  SearchSharp as SearchSharpIcon,
  SearchTwoTone as SearchTwoToneIcon,
  SortOutlined as SortOutlinedIcon,
  SortRounded as SortRoundedIcon,
  SortSharp as SortSharpIcon,
  SortTwoTone as SortTwoToneIcon,
  FilterListOutlined as FilterListOutlinedIcon,
  FilterListRounded as FilterListRoundedIcon,
  FilterListSharp as FilterListSharpIcon,
  FilterListTwoTone as FilterListTwoToneIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  DeleteRounded as DeleteRoundedIcon,
  DeleteSharp as DeleteSharpIcon,
  DeleteTwoTone as DeleteTwoToneIcon,
  EditOutlined as EditOutlinedIcon,
  EditRounded as EditRoundedIcon,
  EditSharp as EditSharpIcon,
  EditTwoTone as EditTwoToneIcon,
  AddOutlined as AddOutlinedIcon,
  AddRounded as AddRoundedIcon,
  AddSharp as AddSharpIcon,
  AddTwoTone as AddTwoToneIcon,
  PrintOutlined as PrintOutlinedIcon,
  PrintRounded as PrintRoundedIcon,
  PrintSharp as PrintSharpIcon,
  PrintTwoTone as PrintTwoToneIcon,
  SaveOutlined as SaveOutlinedIcon,
  SaveRounded as SaveRoundedIcon,
  SaveSharp as SaveSharpIcon,
  SaveTwoTone as SaveTwoToneIcon,
  CancelOutlined as CancelOutlinedIcon,
  CancelRounded as CancelRoundedIcon,
  CancelSharp as CancelSharpIcon,
  CancelTwoTone as CancelTwoToneIcon,
  CheckOutlined as CheckOutlinedIcon,
  CheckRounded as CheckRoundedIcon,
  CheckSharp as CheckSharpIcon,
  CheckTwoTone as CheckTwoToneIcon,
  CloseOutlined as CloseOutlinedIcon,
  CloseRounded as CloseRoundedIcon,
  CloseSharp as CloseSharpIcon,
  CloseTwoTone as CloseTwoToneIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

// Types
interface Material {
  id: number;
  type: string;
  serial: string;
  batch: string;
  location: string;
  locationDetails: string;
  status: 'available' | 'low' | 'out';
  quantity: number;
  min: number;
}

interface MaterialRequest {
  id: number;
  type: string;
  quantity: number;
  reason: string;
  deliveryDate: string;
  priority: 'normal' | 'urgent';
  status: 'new' | 'approved' | 'processing' | 'delivered' | 'rejected';
  requester: string;
  createdAt: string;
  updatedAt: string;
}

interface MaterialTransfer {
  id: number;
  source: string;
  destination: string;
  type: string;
  quantity: number;
  serialRange: { from: string; to: string };
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  transferredBy: string;
  receivedBy: string | null;
  createdAt: string;
  completedAt: string | null;
}

interface Inventory {
  id: number;
  location: string;
  date: string;
  status: 'draft' | 'in_progress' | 'completed' | 'has_discrepancies';
  createdBy: string;
  completedBy: string | null;
  createdAt: string;
  completedAt: string | null;
  items: Array<{
    type: string;
    expected: number;
    actual: number | null;
    difference: number | null;
    explanation: string;
  }>;
}

interface Disposal {
  id: number;
  location: string;
  date: string;
  type: string;
  quantity: number;
  serialRange: { from: string; to: string };
  reason: 'damaged' | 'expired' | 'printing_error' | 'other';
  reasonDetails: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedBy: string;
  approvedBy: string | null;
  createdAt: string;
  approvedAt: string | null;
  completedAt: string | null;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

// Mock data
const MATERIAL_TYPES = [
  'Билет',
  'Резервация',
  'Специална форма',
  'Карта',
  'Друг',
];

const LOCATIONS = [
  'Централна каса',
  'Каса 1',
  'Каса 2',
  'Каса 3',
  'Склад',
];

const MOCK_MATERIALS: Material[] = [
  {
    id: 1,
    type: 'Билет',
    serial: 'B001',
    batch: '2024-01',
    location: 'Централна каса',
    locationDetails: 'Шкаф 1, Полица 2',
    status: 'available',
    quantity: 1000,
    min: 200,
  },
  {
    id: 2,
    type: 'Резервация',
    serial: 'R001',
    batch: '2024-01',
    location: 'Каса 1',
    locationDetails: 'Шкаф 2, Полица 1',
    status: 'low',
    quantity: 150,
    min: 200,
  },
  {
    id: 3,
    type: 'Специална форма',
    serial: 'S001',
    batch: '2024-01',
    location: 'Склад',
    locationDetails: 'Шкаф 3, Полица 3',
    status: 'out',
    quantity: 0,
    min: 50,
  },
];

const REQUEST_STATUSES = {
  new: 'Нова',
  approved: 'Одобрена',
  processing: 'В обработка',
  delivered: 'Доставена',
  rejected: 'Отхвърлена',
};

const MOCK_REQUESTS: MaterialRequest[] = [
  {
    id: 1,
    type: 'Билет',
    quantity: 500,
    reason: 'Нормално попълване',
    deliveryDate: '2024-02-01',
    priority: 'normal',
    status: 'approved',
    requester: 'Иван Иванов',
    createdAt: '2024-01-15T10:00:00',
    updatedAt: '2024-01-15T11:30:00',
  },
  {
    id: 2,
    type: 'Резервация',
    quantity: 200,
    reason: 'Спешна нужда',
    deliveryDate: '2024-01-20',
    priority: 'urgent',
    status: 'processing',
    requester: 'Петър Петров',
    createdAt: '2024-01-16T14:20:00',
    updatedAt: '2024-01-16T14:20:00',
  },
];

const TRANSFER_STATUSES = {
  pending: 'Чакаща',
  in_progress: 'В процес',
  completed: 'Завършена',
  cancelled: 'Отменена',
};

const MOCK_TRANSFERS: MaterialTransfer[] = [
  {
    id: 1,
    source: 'Склад',
    destination: 'Централна каса',
    type: 'Билет',
    quantity: 200,
    serialRange: { from: 'B001', to: 'B200' },
    status: 'completed',
    transferredBy: 'Иван Иванов',
    receivedBy: 'Петър Петров',
    createdAt: '2024-01-10T09:00:00',
    completedAt: '2024-01-10T10:30:00',
  },
  {
    id: 2,
    source: 'Централна каса',
    destination: 'Каса 1',
    type: 'Резервация',
    quantity: 50,
    serialRange: { from: 'R001', to: 'R050' },
    status: 'pending',
    transferredBy: 'Иван Иванов',
    receivedBy: null,
    createdAt: '2024-01-17T11:00:00',
    completedAt: null,
  },
];

const INVENTORY_STATUSES = {
  draft: 'Чернова',
  in_progress: 'В процес',
  completed: 'Завършена',
  has_discrepancies: 'С несъответствия',
};

const MOCK_INVENTORIES: Inventory[] = [
  {
    id: 1,
    location: 'Централна каса',
    date: '2024-01-15',
    status: 'completed',
    createdBy: 'Иван Иванов',
    completedBy: 'Петър Петров',
    createdAt: '2024-01-15T08:00:00',
    completedAt: '2024-01-15T10:30:00',
    items: [
      {
        type: 'Билет',
        expected: 1000,
        actual: 1000,
        difference: 0,
        explanation: '',
      },
      {
        type: 'Резервация',
        expected: 200,
        actual: 195,
        difference: -5,
        explanation: 'Пет броя са използвани, но не са отчетени',
      },
    ],
  },
  {
    id: 2,
    location: 'Каса 1',
    date: '2024-01-16',
    status: 'in_progress',
    createdBy: 'Петър Петров',
    completedBy: null,
    createdAt: '2024-01-16T09:00:00',
    completedAt: null,
    items: [
      {
        type: 'Билет',
        expected: 500,
        actual: null,
        difference: null,
        explanation: '',
      },
      {
        type: 'Резервация',
        expected: 100,
        actual: null,
        difference: null,
        explanation: '',
      },
    ],
  },
];

const DISPOSAL_STATUSES = {
  pending: 'Чакаща',
  approved: 'Одобрена',
  rejected: 'Отхвърлена',
  completed: 'Завършена',
};

const DISPOSAL_REASONS = {
  damaged: 'Повредени',
  expired: 'С изтекъл срок',
  printing_error: 'Печатна грешка',
  other: 'Друга причина',
};

const MOCK_DISPOSALS: Disposal[] = [
  {
    id: 1,
    location: 'Централна каса',
    date: '2024-01-10',
    type: 'Билет',
    quantity: 10,
    serialRange: { from: 'B001', to: 'B010' },
    reason: 'printing_error',
    reasonDetails: 'Грешка в печата на серийните номера',
    status: 'completed',
    requestedBy: 'Иван Иванов',
    approvedBy: 'Петър Петров',
    createdAt: '2024-01-10T14:00:00',
    approvedAt: '2024-01-10T15:30:00',
    completedAt: '2024-01-10T16:00:00',
  },
  {
    id: 2,
    location: 'Каса 1',
    date: '2024-01-17',
    type: 'Резервация',
    quantity: 5,
    serialRange: { from: 'R001', to: 'R005' },
    reason: 'damaged',
    reasonDetails: 'Повредени при транспортиране',
    status: 'pending',
    requestedBy: 'Петър Петров',
    approvedBy: null,
    createdAt: '2024-01-17T11:30:00',
    approvedAt: null,
    completedAt: null,
  },
];

const REPORT_TYPES = [
  'Движение на материали',
  'Наличности по локации',
  'Отписвания',
  'Заявки за материали',
];

const MOCK_MOVEMENT_DATA = [
  {
    date: '2024-01-01',
    type: 'Билет',
    location: 'Централна каса',
    in: 1000,
    out: 200,
    balance: 800,
  },
  {
    date: '2024-01-02',
    type: 'Резервация',
    location: 'Каса 1',
    in: 200,
    out: 50,
    balance: 150,
  },
];

const MOCK_INVENTORY_BY_LOCATION = [
  {
    location: 'Централна каса',
    type: 'Билет',
    quantity: 800,
    min: 200,
    status: 'available',
  },
  {
    location: 'Каса 1',
    type: 'Резервация',
    quantity: 150,
    min: 200,
    status: 'low',
  },
];

const MOCK_DISPOSAL_STATS = [
  {
    type: 'Билет',
    quantity: 10,
    reason: 'printing_error',
    date: '2024-01-10',
    location: 'Централна каса',
  },
  {
    type: 'Резервация',
    quantity: 5,
    reason: 'damaged',
    date: '2024-01-17',
    location: 'Каса 1',
  },
];

const MOCK_REQUEST_STATS = [
  {
    type: 'Билет',
    requested: 1000,
    approved: 1000,
    rejected: 0,
    pending: 0,
  },
  {
    type: 'Резервация',
    requested: 500,
    approved: 450,
    rejected: 50,
    pending: 0,
  },
];

const PrintedMaterialsManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);
  const [requests, setRequests] = useState<MaterialRequest[]>(MOCK_REQUESTS);
  const [transfers, setTransfers] = useState<MaterialTransfer[]>(MOCK_TRANSFERS);
  const [inventories, setInventories] = useState<Inventory[]>(MOCK_INVENTORIES);
  const [disposals, setDisposals] = useState<Disposal[]>(MOCK_DISPOSALS);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Управление на печатни материали
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Наличности" />
          <Tab label="Заявки" />
          <Tab label="Разпределение" />
          <Tab label="Инвентаризация" />
          <Tab label="Отписване" />
          <Tab label="Справки" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Наличности
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Тип</TableCell>
                  <TableCell>Серия</TableCell>
                  <TableCell>Партида</TableCell>
                  <TableCell>Локация</TableCell>
                  <TableCell>Детайли</TableCell>
                  <TableCell>Количество</TableCell>
                  <TableCell>Мин.</TableCell>
                  <TableCell>Статус</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>{material.type}</TableCell>
                    <TableCell>{material.serial}</TableCell>
                    <TableCell>{material.batch}</TableCell>
                    <TableCell>{material.location}</TableCell>
                    <TableCell>{material.locationDetails}</TableCell>
                    <TableCell>{material.quantity}</TableCell>
                    <TableCell>{material.min}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          material.status === 'available'
                            ? 'Наличен'
                            : material.status === 'low'
                            ? 'Ниско'
                            : 'Изчерпан'
                        }
                        color={
                          material.status === 'available'
                            ? 'success'
                            : material.status === 'low'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Заявки
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Тип</TableCell>
                  <TableCell>Количество</TableCell>
                  <TableCell>Причина</TableCell>
                  <TableCell>Дата на доставка</TableCell>
                  <TableCell>Приоритет</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Заявител</TableCell>
                  <TableCell>Дата на създаване</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>{request.deliveryDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.priority === 'normal' ? 'Нормален' : 'Спешен'}
                        color={request.priority === 'normal' ? 'default' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={REQUEST_STATUSES[request.status]}
                        color={
                          request.status === 'approved'
                            ? 'success'
                            : request.status === 'rejected'
                            ? 'error'
                            : request.status === 'processing'
                            ? 'warning'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{request.requester}</TableCell>
                    <TableCell>
                      {format(new Date(request.createdAt), 'dd.MM.yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" title="Преглед">
                        <SearchIcon />
                      </IconButton>
                      {request.status === 'new' && (
                        <>
                          <IconButton size="small" title="Одобри">
                            <CheckIcon />
                          </IconButton>
                          <IconButton size="small" title="Отхвърли">
                            <CloseIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Разпределение
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Източник</TableCell>
                  <TableCell>Дестинация</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>Количество</TableCell>
                  <TableCell>Серийни номера</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Предал</TableCell>
                  <TableCell>Приел</TableCell>
                  <TableCell>Дата на създаване</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>{transfer.source}</TableCell>
                    <TableCell>{transfer.destination}</TableCell>
                    <TableCell>{transfer.type}</TableCell>
                    <TableCell>{transfer.quantity}</TableCell>
                    <TableCell>
                      {transfer.serialRange.from} - {transfer.serialRange.to}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={TRANSFER_STATUSES[transfer.status]}
                        color={
                          transfer.status === 'completed'
                            ? 'success'
                            : transfer.status === 'cancelled'
                            ? 'error'
                            : transfer.status === 'in_progress'
                            ? 'warning'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{transfer.transferredBy}</TableCell>
                    <TableCell>{transfer.receivedBy || '-'}</TableCell>
                    <TableCell>
                      {format(new Date(transfer.createdAt), 'dd.MM.yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" title="Преглед">
                        <SearchIcon />
                      </IconButton>
                      {transfer.status === 'pending' && (
                        <>
                          <IconButton size="small" title="Приключи">
                            <CheckIcon />
                          </IconButton>
                          <IconButton size="small" title="Отмени">
                            <CloseIcon />
                          </IconButton>
                        </>
                      )}
                      {transfer.status === 'completed' && (
                        <IconButton size="small" title="Печат">
                          <PrintIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Инвентаризация
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Локация</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Създал</TableCell>
                  <TableCell>Приключил</TableCell>
                  <TableCell>Дата на създаване</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventories.map((inventory) => (
                  <TableRow key={inventory.id}>
                    <TableCell>{inventory.location}</TableCell>
                    <TableCell>{inventory.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={INVENTORY_STATUSES[inventory.status]}
                        color={
                          inventory.status === 'completed'
                            ? 'success'
                            : inventory.status === 'has_discrepancies'
                            ? 'error'
                            : inventory.status === 'in_progress'
                            ? 'warning'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{inventory.createdBy}</TableCell>
                    <TableCell>{inventory.completedBy || '-'}</TableCell>
                    <TableCell>
                      {format(new Date(inventory.createdAt), 'dd.MM.yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" title="Преглед">
                        <SearchIcon />
                      </IconButton>
                      {inventory.status === 'draft' && (
                        <IconButton size="small" title="Редактирай">
                          <EditIcon />
                        </IconButton>
                      )}
                      {inventory.status === 'in_progress' && (
                        <IconButton size="small" title="Приключи">
                          <CheckIcon />
                        </IconButton>
                      )}
                      {inventory.status === 'completed' && (
                        <IconButton size="small" title="Печат">
                          <PrintIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 4 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Отписване
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Локация</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>Количество</TableCell>
                  <TableCell>Серийни номера</TableCell>
                  <TableCell>Причина</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Заявил</TableCell>
                  <TableCell>Одобрил</TableCell>
                  <TableCell>Дата на създаване</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {disposals.map((disposal) => (
                  <TableRow key={disposal.id}>
                    <TableCell>{disposal.location}</TableCell>
                    <TableCell>{disposal.date}</TableCell>
                    <TableCell>{disposal.type}</TableCell>
                    <TableCell>{disposal.quantity}</TableCell>
                    <TableCell>
                      {disposal.serialRange.from} - {disposal.serialRange.to}
                    </TableCell>
                    <TableCell>
                      {DISPOSAL_REASONS[disposal.reason]}
                      {disposal.reason === 'other' && `: ${disposal.reasonDetails}`}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={DISPOSAL_STATUSES[disposal.status]}
                        color={
                          disposal.status === 'completed'
                            ? 'success'
                            : disposal.status === 'rejected'
                            ? 'error'
                            : disposal.status === 'approved'
                            ? 'warning'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{disposal.requestedBy}</TableCell>
                    <TableCell>{disposal.approvedBy || '-'}</TableCell>
                    <TableCell>
                      {format(new Date(disposal.createdAt), 'dd.MM.yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" title="Преглед">
                        <SearchIcon />
                      </IconButton>
                      {disposal.status === 'pending' && (
                        <>
                          <IconButton size="small" title="Одобри">
                            <CheckIcon />
                          </IconButton>
                          <IconButton size="small" title="Отхвърли">
                            <CloseIcon />
                          </IconButton>
                        </>
                      )}
                      {disposal.status === 'approved' && (
                        <IconButton size="small" title="Приключи">
                          <CheckIcon />
                        </IconButton>
                      )}
                      {disposal.status === 'completed' && (
                        <IconButton size="small" title="Печат">
                          <PrintIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 5 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Справки
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Тип на справката</InputLabel>
                <Select
                  value={REPORT_TYPES[0]}
                  label="Тип на справката"
                >
                  {REPORT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Дата</TableCell>
                      <TableCell>Тип</TableCell>
                      <TableCell>Локация</TableCell>
                      <TableCell>Входящо</TableCell>
                      <TableCell>Изходящо</TableCell>
                      <TableCell>Баланс</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {MOCK_MOVEMENT_DATA.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.location}</TableCell>
                        <TableCell>{row.in}</TableCell>
                        <TableCell>{row.out}</TableCell>
                        <TableCell>{row.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PrintedMaterialsManagement; 