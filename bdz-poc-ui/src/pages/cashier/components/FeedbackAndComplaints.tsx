import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Chip,
  FormHelperText,
  Stack,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  FormLabel,
  FormGroup,
  Checkbox,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  Badge,
  Avatar,
  useTheme,
  useMediaQuery,
  Menu,
  CardHeader,
  MenuList,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
  PriorityHigh as PriorityIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon,
  Archive as ArchiveIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Train as TrainIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  EventNote as EventNoteIcon,
  LocationOn as LocationOnIcon,
  DirectionsTransit as DirectionsTransitIcon,
  DirectionsBus as DirectionsBusIcon,
  DirectionsCar as DirectionsCarIcon,
  DirectionsBoat as DirectionsBoatIcon,
  DirectionsSubway as DirectionsSubwayIcon,
  DirectionsRailway as DirectionsRailwayIcon,
  QrCodeScanner as QrCodeScannerIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format, addDays, isAfter, isBefore, isEqual } from 'date-fns';
import { bg } from 'date-fns/locale/bg';

// Types
interface FeedbackCase {
  id: string;
  type: 'complaint' | 'claim' | 'suggestion' | 'praise';
  category: string;
  status: 'new' | 'in_progress' | 'waiting_carrier' | 'waiting_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submissionDate: Date;
  dueDate: Date;
  ticketNumber?: string;
  route: {
    from: string;
    to: string;
  };
  trainNumber: string;
  trainDate: Date;
  carriers: string[];
  customer: {
    name: string;
    email: string;
    phone: string;
    preferredContact: 'email' | 'phone' | 'mail';
  };
  description: string;
  attachments: string[];
  internalNotes: string;
  assignedTo: string;
  communicationHistory: CommunicationEntry[];
  compensation?: CompensationDetails;
  resolution?: ResolutionDetails;
}

interface CommunicationEntry {
  id: string;
  date: Date;
  type: 'internal' | 'customer' | 'carrier';
  content: string;
  author: string;
  attachments?: string[];
}

interface CompensationDetails {
  amount: number;
  currency: string;
  reason: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  paymentMethod?: string;
  documents: string[];
}

interface ResolutionDetails {
  date: Date;
  outcome: string;
  finalResponse: string;
  customerSatisfaction?: number;
  closedBy: string;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone';
}

interface FormData {
  type: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  ticketNumber: string;
  route: string;
  trainNumber: string;
  trainDate: Date | null;
  carriers: string[];
  customer: CustomerData;
  description: string;
  attachments: string[];
  internalNotes: string;
}

interface FormErrors {
  [key: string]: string | { [key: string]: string } | undefined;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    preferredContact?: string;
  };
  submit?: string;
}

// Constants
const FEEDBACK_TYPES = [
  { value: 'complaint', label: 'Жалба', icon: <ErrorIcon /> },
  { value: 'claim', label: 'Рекламация', icon: <WarningIcon /> },
  { value: 'suggestion', label: 'Предложение', icon: <InfoIcon /> },
  { value: 'praise', label: 'Похвала', icon: <CheckCircleIcon /> },
];

const CATEGORIES = [
  'Закъснение на влак',
  'Пропусната връзка',
  'Проблеми с билет/резервация',
  'Обслужване от персонал',
  'Състояние на влак/удобства',
  'Загубен/повреден багаж',
  'Анулиране/промяна на пътуване',
  'Възстановяване на средства',
  'Други проблеми',
];

const STATUSES = {
  new: { label: 'Нова', color: 'info', icon: <InfoIcon /> },
  in_progress: { label: 'В процес на обработка', color: 'warning', icon: <AccessTimeIcon /> },
  waiting_carrier: { label: 'Очаква отговор от превозвач', color: 'warning', icon: <TrainIcon /> },
  waiting_customer: { label: 'Очаква отговор до клиента', color: 'warning', icon: <PersonIcon /> },
  resolved: { label: 'Разрешена', color: 'success', icon: <CheckCircleIcon /> },
  closed: { label: 'Затворена', color: 'default', icon: <ArchiveIcon /> },
};

const PRIORITIES = {
  low: { label: 'Нисък', color: 'success' },
  medium: { label: 'Среден', color: 'info' },
  high: { label: 'Висок', color: 'warning' },
  urgent: { label: 'Спешен', color: 'error' },
};

// Mock data
const MOCK_CASES: FeedbackCase[] = [
  {
    id: 'FB-2024-001',
    type: 'complaint',
    category: 'Закъснение на влак',
    status: 'in_progress',
    priority: 'high',
    submissionDate: new Date('2024-03-01T10:00:00'),
    dueDate: new Date('2024-03-08T10:00:00'),
    ticketNumber: 'INT-123456',
    route: {
      from: 'София',
      to: 'Белград'
    },
    trainNumber: '341',
    trainDate: new Date('2024-02-28'),
    carriers: ['BDZ', 'ЖСМ'],
    customer: {
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      phone: '+359 88 123 4567',
      preferredContact: 'email'
    },
    description: 'Влакът закъсня с 2 часа и 15 минути. Искам компенсация според регламент 1371.',
    attachments: ['ticket.pdf', 'delay_confirmation.pdf'],
    internalNotes: 'Проверить с ЖСМ причината за закъснението',
    assignedTo: 'Петър Петров',
    communicationHistory: [
      {
        id: '1',
        date: new Date('2024-03-01T10:30:00'),
        type: 'internal',
        content: 'Назначен отговорен служител: Петър Петров',
        author: 'Система'
      },
      {
        id: '2',
        date: new Date('2024-03-01T11:00:00'),
        type: 'carrier',
        content: 'Изпратено запитване до ЖСМ за причината на закъснението',
        author: 'Петър Петров'
      }
    ],
    compensation: {
      amount: 25,
      currency: 'EUR',
      reason: 'Закъснение над 2 часа',
      status: 'pending',
      documents: ['compensation_form.pdf', 'ticket_copy.pdf']
    }
  },
  {
    id: 'FB-2024-002',
    type: 'claim',
    category: 'Пропусната връзка',
    status: 'waiting_carrier',
    priority: 'urgent',
    submissionDate: new Date('2024-03-02T14:30:00'),
    dueDate: new Date('2024-03-03T14:30:00'),
    ticketNumber: 'INT-345678',
    route: {
      from: 'София',
      to: 'Букурещ'
    },
    trainNumber: '347',
    trainDate: new Date('2024-03-02'),
    carriers: ['BDZ', 'CFR'],
    customer: {
      name: 'Мария Петрова',
      email: 'maria@example.com',
      phone: '+359 87 765 4321',
      preferredContact: 'phone'
    },
    description: 'Пропуснах връзката си за Букурещ поради закъснение на влака от София. Искам да бъда преместен на следващия влак без допълнително заплащане.',
    attachments: ['ticket.pdf', 'connection_ticket.pdf'],
    internalNotes: 'Клиентът има резервация за важна среща в Букурещ',
    assignedTo: 'Георги Димитров',
    communicationHistory: [
      {
        id: '1',
        date: new Date('2024-03-02T14:45:00'),
        type: 'internal',
        content: 'Назначен отговорен служител: Георги Димитров',
        author: 'Система'
      },
      {
        id: '2',
        date: new Date('2024-03-02T15:00:00'),
        type: 'customer',
        content: 'Клиентът потвърди, че има резервация за среща в 15:00 ч. в Букурещ',
        author: 'Георги Димитров'
      }
    ]
  },
  {
    id: 'FB-2024-003',
    type: 'suggestion',
    category: 'Обслужване от персонал',
    status: 'new',
    priority: 'medium',
    submissionDate: new Date('2024-03-03T09:15:00'),
    dueDate: new Date('2024-03-10T09:15:00'),
    ticketNumber: 'DOM-789012',
    route: {
      from: 'София',
      to: 'Варна'
    },
    trainNumber: '1621',
    trainDate: new Date('2024-03-02'),
    carriers: ['BDZ'],
    customer: {
      name: 'Николай Тодоров',
      email: 'nikolay@example.com',
      phone: '+359 89 123 7890',
      preferredContact: 'email'
    },
    description: 'Предлагам да се увеличи броят на влаковете за Варна през уикендите, тъй като текущите са претоварени.',
    attachments: ['ticket.pdf', 'photos.pdf'],
    internalNotes: 'Клиентът е редовен пътник на маршрута',
    assignedTo: 'Анна Иванова',
    communicationHistory: [
      {
        id: '1',
        date: new Date('2024-03-03T09:30:00'),
        type: 'internal',
        content: 'Назначен отговорен служител: Анна Иванова',
        author: 'Система'
      }
    ]
  },
  {
    id: 'FB-2024-004',
    type: 'praise',
    category: 'Обслужване от персонал',
    status: 'resolved',
    priority: 'low',
    submissionDate: new Date('2024-03-03T16:45:00'),
    dueDate: new Date('2024-03-04T16:45:00'),
    ticketNumber: 'DOM-901234',
    route: {
      from: 'Пловдив',
      to: 'Бургас'
    },
    trainNumber: '8601',
    trainDate: new Date('2024-03-03'),
    carriers: ['BDZ'],
    customer: {
      name: 'Елена Димитрова',
      email: 'elena@example.com',
      phone: '+359 88 456 7890',
      preferredContact: 'email'
    },
    description: 'Искам да благодаря на кондукторката на влака за професионалното и любезно обслужване. Помогна ми с багажа и даде полезна информация за връзките.',
    attachments: [],
    internalNotes: 'Препоръчително е да се отбележи в досието на служителя',
    assignedTo: 'Петя Петрова',
    communicationHistory: [
      {
        id: '1',
        date: new Date('2024-03-03T17:00:00'),
        type: 'internal',
        content: 'Назначен отговорен служител: Петя Петрова',
        author: 'Система'
      },
      {
        id: '2',
        date: new Date('2024-03-03T17:30:00'),
        type: 'internal',
        content: 'Изпратено благодарствено писмо до служителя',
        author: 'Петя Петрова'
      }
    ],
    resolution: {
      date: new Date('2024-03-04T10:00:00'),
      outcome: 'Благодарността е предадена на служителя',
      finalResponse: 'Благодарим за обратната връзка! Вашето мнение е важно за нас.',
      customerSatisfaction: 5,
      closedBy: 'Петя Петрова'
    }
  },
  {
    id: 'FB-2024-005',
    type: 'complaint',
    category: 'Състояние на влак/удобства',
    status: 'waiting_customer',
    priority: 'high',
    submissionDate: new Date('2024-03-04T11:20:00'),
    dueDate: new Date('2024-03-05T11:20:00'),
    ticketNumber: 'INT-567890',
    route: {
      from: 'София',
      to: 'Солун'
    },
    trainNumber: '363',
    trainDate: new Date('2024-03-04'),
    carriers: ['BDZ', 'OSE'],
    customer: {
      name: 'Димитър Стоянов',
      email: 'dimitar@example.com',
      phone: '+359 87 890 1234',
      preferredContact: 'phone'
    },
    description: 'Климатикът в вагона не работеше, а температурата беше над 30 градуса. Искам компенсация за неудобството.',
    attachments: ['ticket.pdf', 'temperature_photo.jpg'],
    internalNotes: 'Проверить с техническия екип за ремонт на климатика',
    assignedTo: 'Иван Петров',
    communicationHistory: [
      {
        id: '1',
        date: new Date('2024-03-04T11:35:00'),
        type: 'internal',
        content: 'Назначен отговорен служител: Иван Петров',
        author: 'Система'
      },
      {
        id: '2',
        date: new Date('2024-03-04T12:00:00'),
        type: 'internal',
        content: 'Изпратена заявка за ремонт на климатика',
        author: 'Иван Петров'
      },
      {
        id: '3',
        date: new Date('2024-03-04T14:00:00'),
        type: 'customer',
        content: 'Предложена компенсация от 15 EUR',
        author: 'Иван Петров'
      }
    ]
  },
  {
    id: 'FB-2024-006',
    type: 'claim',
    category: 'Загубен/повреден багаж',
    status: 'in_progress',
    priority: 'high',
    submissionDate: new Date('2024-03-04T15:30:00'),
    dueDate: new Date('2024-03-11T15:30:00'),
    ticketNumber: 'INT-890123',
    route: {
      from: 'София',
      to: 'Истанбул'
    },
    trainNumber: '371',
    trainDate: new Date('2024-03-04'),
    carriers: ['BDZ', 'TCDD'],
    customer: {
      name: 'Стоян Георгиев',
      email: 'stoyan@example.com',
      phone: '+359 88 567 8901',
      preferredContact: 'phone'
    },
    description: 'Куфарът ми не пристигна на крайната гара. Съдържа важни документи и лични вещи.',
    attachments: ['ticket.pdf', 'baggage_claim.pdf', 'baggage_photo.jpg'],
    internalNotes: 'Проверить с багажната служба на TCDD',
    assignedTo: 'Мария Иванова',
    communicationHistory: [
      {
        id: '1',
        date: new Date('2024-03-04T15:45:00'),
        type: 'internal',
        content: 'Назначен отговорен служител: Мария Иванова',
        author: 'Система'
      },
      {
        id: '2',
        date: new Date('2024-03-04T16:00:00'),
        type: 'carrier',
        content: 'Изпратена заявка до TCDD за проследяване на багажа',
        author: 'Мария Иванова'
      }
    ]
  },
  {
    id: 'FB-2024-007',
    type: 'complaint',
    category: 'Проблеми с билет/резервация',
    status: 'new',
    priority: 'medium',
    submissionDate: new Date('2024-03-05T09:00:00'),
    dueDate: new Date('2024-03-12T09:00:00'),
    ticketNumber: 'DOM-234567',
    route: {
      from: 'София',
      to: 'Пловдив'
    },
    trainNumber: '8603',
    trainDate: new Date('2024-03-05'),
    carriers: ['BDZ'],
    customer: {
      name: 'Радослав Петков',
      email: 'radoslav@example.com',
      phone: '+359 89 678 9012',
      preferredContact: 'email'
    },
    description: 'Не можах да направя онлайн резервация поради технически проблем в системата. Загубих предварителната отстъпка.',
    attachments: ['screenshot.pdf', 'error_message.pdf'],
    internalNotes: 'Проверить логовете на системата за периода',
    assignedTo: 'Георги Тодоров',
    communicationHistory: [
      {
        id: '1',
        date: new Date('2024-03-05T09:15:00'),
        type: 'internal',
        content: 'Назначен отговорен служител: Георги Тодоров',
        author: 'Система'
      }
    ]
  },
  {
    id: 'FB-2024-008',
    type: 'suggestion',
    category: 'Други проблеми',
    status: 'in_progress',
    priority: 'low',
    submissionDate: new Date('2024-03-05T13:45:00'),
    dueDate: new Date('2024-03-12T13:45:00'),
    ticketNumber: 'DOM-456789',
    route: {
      from: 'София',
      to: 'Русе'
    },
    trainNumber: '8605',
    trainDate: new Date('2024-03-05'),
    carriers: ['BDZ'],
    customer: {
      name: 'Людмила Иванова',
      email: 'lyudmila@example.com',
      phone: '+359 88 789 0123',
      preferredContact: 'email'
    },
    description: 'Предлагам да се добави безплатен Wi-Fi в по-дългите влакове. Това ще подобри комфорта на пътниците.',
    attachments: [],
    internalNotes: 'Предадено на IT отдела за анализ',
    assignedTo: 'Петър Димитров',
    communicationHistory: [
      {
        id: '1',
        date: new Date('2024-03-05T14:00:00'),
        type: 'internal',
        content: 'Назначен отговорен служител: Петър Димитров',
        author: 'Система'
      },
      {
        id: '2',
        date: new Date('2024-03-05T14:30:00'),
        type: 'internal',
        content: 'Изпратена заявка до IT отдела за анализ на възможността',
        author: 'Петър Димитров'
      }
    ]
  }
];

// Mock ticket data
const MOCK_TICKETS = [
  {
    ticketNumber: 'INT-123456',
    route: {
      from: 'София',
      to: 'Белград'
    },
    trainNumber: '341',
    trainDate: new Date('2024-03-15'),
    carriers: ['BDZ', 'ЖСМ'],
    status: 'active',
    type: 'international',
    class: '2nd',
    price: 45.00,
    currency: 'EUR'
  },
  {
    ticketNumber: 'DOM-789012',
    route: {
      from: 'София',
      to: 'Варна'
    },
    trainNumber: '1621',
    trainDate: new Date('2024-03-20'),
    carriers: ['BDZ'],
    status: 'active',
    type: 'domestic',
    class: '1st',
    price: 35.00,
    currency: 'BGN'
  },
  {
    ticketNumber: 'INT-345678',
    route: {
      from: 'София',
      to: 'Букурещ'
    },
    trainNumber: '347',
    trainDate: new Date('2024-03-18'),
    carriers: ['BDZ', 'CFR'],
    status: 'active',
    type: 'international',
    class: '2nd',
    price: 55.00,
    currency: 'EUR'
  },
  {
    ticketNumber: 'DOM-901234',
    route: {
      from: 'Пловдив',
      to: 'Бургас'
    },
    trainNumber: '8601',
    trainDate: new Date('2024-03-22'),
    carriers: ['BDZ'],
    status: 'active',
    type: 'domestic',
    class: '2nd',
    price: 28.00,
    currency: 'BGN'
  },
  {
    ticketNumber: 'INT-567890',
    route: {
      from: 'София',
      to: 'Солун'
    },
    trainNumber: '363',
    trainDate: new Date('2024-03-25'),
    carriers: ['BDZ', 'OSE'],
    status: 'active',
    type: 'international',
    class: '1st',
    price: 65.00,
    currency: 'EUR'
  },
  {
    ticketNumber: 'DOM-234567',
    route: {
      from: 'София',
      to: 'Пловдив'
    },
    trainNumber: '8603',
    trainDate: new Date('2024-03-17'),
    carriers: ['BDZ'],
    status: 'active',
    type: 'domestic',
    class: '2nd',
    price: 15.00,
    currency: 'BGN'
  },
  {
    ticketNumber: 'INT-890123',
    route: {
      from: 'София',
      to: 'Истанбул'
    },
    trainNumber: '371',
    trainDate: new Date('2024-03-28'),
    carriers: ['BDZ', 'TCDD'],
    status: 'active',
    type: 'international',
    class: '1st',
    price: 75.00,
    currency: 'EUR'
  },
  {
    ticketNumber: 'DOM-456789',
    route: {
      from: 'София',
      to: 'Русе'
    },
    trainNumber: '8605',
    trainDate: new Date('2024-03-19'),
    carriers: ['BDZ'],
    status: 'active',
    type: 'domestic',
    class: '2nd',
    price: 32.00,
    currency: 'BGN'
  }
];

// Form component for new feedback
const NewFeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    type: '',
    category: '',
    priority: 'medium',
    ticketNumber: '',
    route: '',
    trainNumber: '',
    trainDate: null,
    carriers: [],
    customer: {
      name: '',
      email: '',
      phone: '',
      preferredContact: 'email',
    },
    description: '',
    attachments: [],
    internalNotes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedChange = (parent: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as Record<string, any>),
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.type) {
      newErrors.type = 'Моля, изберете тип';
    }
    if (!formData.category) {
      newErrors.category = 'Моля, изберете категория';
    }
    if (!formData.priority) {
      newErrors.priority = 'Моля, изберете приоритет';
    }
    if (!formData.route) {
      newErrors.route = 'Моля, въведете маршрут';
    }
    if (!formData.trainNumber) {
      newErrors.trainNumber = 'Моля, въведете номер на влак';
    }
    if (!formData.trainDate) {
      newErrors.trainDate = 'Моля, изберете дата на пътуване';
    }
    if (formData.carriers.length === 0) {
      newErrors.carriers = 'Моля, изберете поне един превозвач';
    }
    if (!formData.customer.name) {
      newErrors['customer.name'] = 'Моля, въведете име';
    }
    if (!formData.customer.email && !formData.customer.phone) {
      newErrors['customer.contact'] = 'Моля, въведете поне един контакт';
    }
    if (!formData.description) {
      newErrors.description = 'Моля, въведете описание';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Implement API call to save feedback
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Submitting feedback:', formData);
      // Reset form after successful submission
      setFormData({
        type: '',
        category: '',
        priority: 'medium',
        ticketNumber: '',
        route: '',
        trainNumber: '',
        trainDate: null,
        carriers: [],
        customer: {
          name: '',
          email: '',
          phone: '',
          preferredContact: 'email',
        },
        description: '',
        attachments: [],
        internalNotes: '',
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrors({ submit: 'Възникна грешка при запазване на жалбата' });
    } finally {
      setLoading(false);
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setErrors((prev: FormErrors) => {
      const newErrors = { ...prev };
      delete newErrors.ticketNumber;
      return newErrors;
    });

    setTimeout(() => {
      try {
        const scenarios = [
          // Success scenario - random valid ticket
          () => {
            const randomTicket = MOCK_TICKETS[Math.floor(Math.random() * MOCK_TICKETS.length)];
            handleChange('ticketNumber', randomTicket.ticketNumber);
            // Format route as "from - to"
            const formattedRoute = `${randomTicket.route.from} - ${randomTicket.route.to}`;
            handleChange('route', formattedRoute);
            handleChange('trainNumber', randomTicket.trainNumber);
            handleChange('trainDate', randomTicket.trainDate);
            handleChange('carriers', randomTicket.carriers);
            setIsScanning(false);
          },
          // Invalid barcode scenario
          () => {
            setErrors((prev: FormErrors) => ({
              ...prev,
              ticketNumber: 'Невалиден баркод. Моля, опитайте отново.'
            }));
            setIsScanning(false);
          },
          // Expired ticket scenario
          () => {
            const expiredTicket = {
              ...MOCK_TICKETS[Math.floor(Math.random() * MOCK_TICKETS.length)],
              trainDate: new Date('2024-02-01') // Past date
            };
            handleChange('ticketNumber', expiredTicket.ticketNumber);
            // Format route as "from - to"
            const formattedRoute = `${expiredTicket.route.from} - ${expiredTicket.route.to}`;
            handleChange('route', formattedRoute);
            handleChange('trainNumber', expiredTicket.trainNumber);
            handleChange('trainDate', expiredTicket.trainDate);
            handleChange('carriers', expiredTicket.carriers);
            setErrors((prev: FormErrors) => ({
              ...prev,
              ticketNumber: 'Билетът е с изтекъл срок на валидност.'
            }));
            setIsScanning(false);
          },
          // Already used ticket scenario
          () => {
            const usedTicket = MOCK_TICKETS[Math.floor(Math.random() * MOCK_TICKETS.length)];
            handleChange('ticketNumber', usedTicket.ticketNumber);
            // Format route as "from - to"
            const formattedRoute = `${usedTicket.route.from} - ${usedTicket.route.to}`;
            handleChange('route', formattedRoute);
            handleChange('trainNumber', usedTicket.trainNumber);
            handleChange('trainDate', usedTicket.trainDate);
            handleChange('carriers', usedTicket.carriers);
            setErrors((prev: FormErrors) => ({
              ...prev,
              ticketNumber: 'Билетът вече е използван.'
            }));
            setIsScanning(false);
          }
        ];

        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        randomScenario();
      } catch (error) {
        setErrors((prev: FormErrors) => ({
          ...prev,
          ticketNumber: 'Грешка при сканиране. Моля, опитайте отново.'
        }));
        setIsScanning(false);
      }
    }, 1500 + Math.random() * 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {/* Type and Category */}
        <Grid container spacing={2}>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Тип</InputLabel>
              <Select
                value={formData.type}
                label="Тип"
                onChange={(e) => handleChange('type', e.target.value)}
              >
                {FEEDBACK_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {typeof errors.type === 'string' && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Категория</InputLabel>
              <Select
                value={formData.category}
                label="Категория"
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {typeof errors.category === 'string' && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth error={!!errors.priority}>
              <InputLabel>Приоритет</InputLabel>
              <Select
                value={formData.priority}
                label="Приоритет"
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                {Object.entries(PRIORITIES).map(([value, { label, color }]) => (
                  <MenuItem key={value} value={value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={label}
                        size="small"
                        color={color as any}
                        sx={{ minWidth: '80px' }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {typeof errors.priority === 'string' && <FormHelperText>{errors.priority}</FormHelperText>}
            </FormControl>
          </Box>
        </Grid>

        {/* Journey Details */}
        <Grid container spacing={2}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Номер на билет"
              value={formData.ticketNumber}
              onChange={(e) => handleChange('ticketNumber', e.target.value)}
              error={!!errors.ticketNumber}
              helperText={typeof errors.ticketNumber === 'string' ? errors.ticketNumber : ''}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleScan}
                    disabled={isScanning}
                    edge="end"
                  >
                    {isScanning ? (
                      <CircularProgress size={24} />
                    ) : (
                      <QrCodeScannerIcon />
                    )}
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Маршрут"
              value={formData.route}
              onChange={(e) => handleChange('route', e.target.value)}
              error={!!errors.route}
              helperText={typeof errors.route === 'string' ? errors.route : ''}
              placeholder="Напр. София - Варна"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
              <DatePicker
                label="Дата на влак"
                value={formData.trainDate}
                onChange={(date) => handleChange('trainDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.trainDate,
                    helperText: typeof errors.trainDate === 'string' ? errors.trainDate : '',
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Номер на влак"
              value={formData.trainNumber}
              onChange={(e) => handleChange('trainNumber', e.target.value)}
              error={!!errors.trainNumber}
              helperText={typeof errors.trainNumber === 'string' ? errors.trainNumber : ''}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              multiple
              options={['BDZ', 'ЖСМ', 'МАВ', 'ЖС', 'ЦД']}
              value={formData.carriers}
              onChange={(_, newValue) => handleChange('carriers', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Превозвачи"
                  error={!!errors.carriers}
                  helperText={typeof errors.carriers === 'string' ? errors.carriers : ''}
                />
              )}
            />
          </Box>
        </Grid>

        {/* Customer Details */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Име на клиент"
              value={formData.customer.name}
              onChange={(e) => handleNestedChange('customer', 'name', e.target.value)}
              error={!!errors.customer?.name}
              helperText={typeof errors.customer?.name === 'string' ? errors.customer?.name : ''}
            />
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Имейл"
              type="email"
              value={formData.customer.email}
              onChange={(e) => handleNestedChange('customer', 'email', e.target.value)}
              error={!!errors.customer?.email}
              helperText={typeof errors.customer?.email === 'string' ? errors.customer?.email : ''}
            />
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              fullWidth
              label="Телефон"
              value={formData.customer.phone}
              onChange={(e) => handleNestedChange('customer', 'phone', e.target.value)}
              error={!!errors.customer?.phone}
              helperText={typeof errors.customer?.phone === 'string' ? errors.customer?.phone : ''}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Предпочитан начин за контакт</FormLabel>
              <RadioGroup
                row
                value={formData.customer.preferredContact}
                onChange={(e) => handleNestedChange('customer', 'preferredContact', e.target.value)}
              >
                <FormControlLabel value="email" control={<Radio />} label="Имейл" />
                <FormControlLabel value="phone" control={<Radio />} label="Телефон" />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>

        {/* Feedback Details */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Детайли на жалбата
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Описание"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={!!errors.description}
            helperText={typeof errors.description === 'string' ? errors.description : ''}
          />
          <Button
            component="label"
            variant="outlined"
            startIcon={<AttachIcon />}
          >
            Прикачи файлове
            <input
              type="file"
              hidden
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                handleChange('attachments', files.map(f => f.name));
              }}
            />
          </Button>
          {formData.attachments.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {formData.attachments.map((file, index) => (
                <Chip
                  key={index}
                  label={file}
                  onDelete={() => {
                    const newAttachments = [...formData.attachments];
                    newAttachments.splice(index, 1);
                    handleChange('attachments', newAttachments);
                  }}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          )}
        </Paper>

        {/* Internal Notes */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Вътрешни бележки
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Бележки"
            value={formData.internalNotes}
            onChange={(e) => handleChange('internalNotes', e.target.value)}
            helperText="Видими само за служители"
          />
        </Paper>

        {/* Submit Button */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => {
              setFormData({
                type: '',
                category: '',
                priority: 'medium',
                ticketNumber: '',
                route: '',
                trainNumber: '',
                trainDate: null,
                carriers: [],
                customer: {
                  name: '',
                  email: '',
                  phone: '',
                  preferredContact: 'email',
                },
                description: '',
                attachments: [],
                internalNotes: '',
              });
              setErrors({});
            }}
          >
            Изчисти
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Регистриране...' : 'Регистрирай жалбата'}
          </Button>
        </Box>

        {typeof errors.submit === 'string' && (
          <Alert severity="error" onClose={() => setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.submit;
            return newErrors;
          })}>
            {errors.submit}
          </Alert>
        )}
      </Stack>
    </form>
  );
};

// Active Cases Table component
const ActiveCasesTable: React.FC<{
  cases: FeedbackCase[];
  onCaseSelect: (case_: FeedbackCase) => void;
  filters: {
    status: string;
    category: string;
    carrier: string;
    priority: string;
    dateRange: { start: Date | null; end: Date | null };
  };
  onFilterChange: (filter: string, value: any) => void;
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPriorityChange: (caseId: string, currentPriority: string) => void;
}> = ({
  cases,
  onCaseSelect,
  filters,
  onFilterChange,
  searchQuery,
  onSearchChange,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onPriorityChange,
}) => {
  const filteredCases = cases.filter(case_ => {
    const matchesStatus = !filters.status || case_.status === filters.status;
    const matchesCategory = !filters.category || case_.category === filters.category;
    const matchesCarrier = !filters.carrier || case_.carriers.includes(filters.carrier);
    const matchesPriority = !filters.priority || case_.priority === filters.priority;
    const matchesDateRange = (!filters.dateRange.start || !filters.dateRange.end) ||
      (case_.submissionDate >= filters.dateRange.start && case_.submissionDate <= filters.dateRange.end);
    const matchesSearch = !searchQuery ||
      case_.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesCarrier && matchesPriority && matchesDateRange && matchesSearch;
  });

  return (
    <Box>
      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(6, 1fr)' }, gap: 2, alignItems: 'center' }}>
          <Box>
            <TextField
              fullWidth
              label="Търсене"
              value={searchQuery}
              onChange={onSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Box>
          <Box>
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                value={filters.status}
                label="Статус"
                onChange={(e) => onFilterChange('status', e.target.value)}
              >
                <MenuItem value="">Всички</MenuItem>
                {Object.entries(STATUSES).map(([value, { label }]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl fullWidth>
              <InputLabel>Категория</InputLabel>
              <Select
                value={filters.category}
                label="Категория"
                onChange={(e) => onFilterChange('category', e.target.value)}
              >
                <MenuItem value="">Всички</MenuItem>
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl fullWidth>
              <InputLabel>Превозвач</InputLabel>
              <Select
                value={filters.carrier}
                label="Превозвач"
                onChange={(e) => onFilterChange('carrier', e.target.value)}
              >
                <MenuItem value="">Всички</MenuItem>
                {['BDZ', 'ЖСМ', 'МАВ', 'ЖС', 'ЦД'].map((carrier) => (
                  <MenuItem key={carrier} value={carrier}>{carrier}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl fullWidth>
              <InputLabel>Приоритет</InputLabel>
              <Select
                value={filters.priority}
                label="Приоритет"
                onChange={(e) => onFilterChange('priority', e.target.value)}
              >
                <MenuItem value="">Всички</MenuItem>
                {Object.entries(PRIORITIES).map(([value, { label }]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
              <DatePicker
                label="От дата"
                value={filters.dateRange.start}
                onChange={(date) => onFilterChange('dateRange', { ...filters.dateRange, start: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
              <DatePicker
                label="До дата"
                value={filters.dateRange.end}
                onChange={(date) => onFilterChange('dateRange', { ...filters.dateRange, end: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Тип</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>Подател</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Приоритет</TableCell>
                <TableCell>Срок</TableCell>
                <TableCell>Отговорен</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCases
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((case_) => (
                  <TableRow
                    hover
                    key={case_.id}
                    onClick={() => onCaseSelect(case_)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{case_.id}</TableCell>
                    <TableCell>
                      {format(case_.submissionDate, 'dd.MM.yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {FEEDBACK_TYPES.find(t => t.value === case_.type)?.icon}
                        {FEEDBACK_TYPES.find(t => t.value === case_.type)?.label}
                      </Box>
                    </TableCell>
                    <TableCell>{case_.category}</TableCell>
                    <TableCell>{case_.customer.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={STATUSES[case_.status].label}
                        color={STATUSES[case_.status].color as any}
                        size="small"
                        icon={STATUSES[case_.status].icon}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={PRIORITIES[case_.priority].label}
                        color={PRIORITIES[case_.priority].color as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {format(case_.dueDate, 'dd.MM.yyyy')}
                        {isAfter(case_.dueDate, new Date()) ? (
                          <AccessTimeIcon color="warning" />
                        ) : (
                          <ErrorIcon color="error" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{case_.assignedTo}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onCaseSelect(case_);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPriorityChange(case_.id, case_.priority);
                          }}
                        >
                          <PriorityIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredCases.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          labelRowsPerPage="Редове на страница:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} от ${count}`
          }
        />
      </Paper>
    </Box>
  );
};

// Add filter types
interface ReportFilters {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  category?: string;
  carrier?: string;
  status?: string;
  priority?: string;
}

// Update Reports and Analytics component
const ReportsAndAnalytics: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: { start: null, end: null },
    category: '',
    carrier: '',
    status: '',
    priority: ''
  });

  const handleReportTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveReportTab(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, reportId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(reportId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const handleFilterChange = (filter: keyof ReportFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: Date | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    // TODO: Implement export functionality
    console.log(`Exporting ${selectedReport} as ${format}`);
    handleMenuClose();
  };

  const handlePrint = () => {
    // TODO: Implement print functionality
    console.log(`Printing ${selectedReport}`);
    handleMenuClose();
  };

  const reportTabs = [
    { 
      label: 'Статистически отчети', 
      icon: <BarChartIcon />,
      type: 'statistics',
      content: (
        <>
          <FilterSection 
            type="statistics"
            filters={filters}
            onFilterChange={handleFilterChange}
            onDateRangeChange={handleDateRangeChange}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Категория</TableCell>
                  <TableCell align="right">Брой жалби</TableCell>
                  <TableCell align="right">Средно време за отговор</TableCell>
                  <TableCell align="right">Средно време за резолюция</TableCell>
                  <TableCell align="right">Процент удовлетворени</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {CATEGORIES.map((category) => (
                  <TableRow key={category}>
                    <TableCell>{category}</TableCell>
                    <TableCell align="right">42</TableCell>
                    <TableCell align="right">2.5 часа</TableCell>
                    <TableCell align="right">24 часа</TableCell>
                    <TableCell align="right">85%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )
    },
    { 
      label: 'Разпределение по превозвачи', 
      icon: <TrainIcon />,
      type: 'carriers',
      content: (
        <>
          <FilterSection 
            type="carriers"
            filters={filters}
            onFilterChange={handleFilterChange}
            onDateRangeChange={handleDateRangeChange}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Превозвач</TableCell>
                  <TableCell>Маршрут</TableCell>
                  <TableCell align="right">Брой жалби</TableCell>
                  <TableCell align="right">Най-честа причина</TableCell>
                  <TableCell align="right">Средно време за резолюция</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['BDZ', 'ЖСМ', 'МАВ', 'ЖС', 'ЦД'].map((carrier) => (
                  <TableRow key={carrier}>
                    <TableCell>{carrier}</TableCell>
                    <TableCell>София - Варна</TableCell>
                    <TableCell align="right">15</TableCell>
                    <TableCell align="right">Закъснение</TableCell>
                    <TableCell align="right">18 часа</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )
    },
    { 
      label: 'Анализ на тенденциите', 
      icon: <TimelineIcon />,
      type: 'trends',
      content: (
        <>
          <FilterSection 
            type="trends"
            filters={filters}
            onFilterChange={handleFilterChange}
            onDateRangeChange={handleDateRangeChange}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Период</TableCell>
                  <TableCell align="right">Общ брой жалби</TableCell>
                  <TableCell align="right">Нови жалби</TableCell>
                  <TableCell align="right">Разрешени жалби</TableCell>
                  <TableCell align="right">Средно време за резолюция</TableCell>
                  <TableCell align="right">Процент удовлетворени</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Текущ месец</TableCell>
                  <TableCell align="right">156</TableCell>
                  <TableCell align="right">45</TableCell>
                  <TableCell align="right">38</TableCell>
                  <TableCell align="right">22 часа</TableCell>
                  <TableCell align="right">82%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Предходен месец</TableCell>
                  <TableCell align="right">142</TableCell>
                  <TableCell align="right">48</TableCell>
                  <TableCell align="right">42</TableCell>
                  <TableCell align="right">24 часа</TableCell>
                  <TableCell align="right">79%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Промяна</TableCell>
                  <TableCell align="right" sx={{ color: 'success.main' }}>+9.9%</TableCell>
                  <TableCell align="right" sx={{ color: 'error.main' }}>-6.3%</TableCell>
                  <TableCell align="right" sx={{ color: 'error.main' }}>-9.5%</TableCell>
                  <TableCell align="right" sx={{ color: 'success.main' }}>-8.3%</TableCell>
                  <TableCell align="right" sx={{ color: 'success.main' }}>+3.8%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )
    },
    { 
      label: 'Препоръки за подобрения', 
      icon: <LightbulbIcon />,
      type: 'recommendations',
      content: (
        <>
          <FilterSection 
            type="recommendations"
            filters={filters}
            onFilterChange={handleFilterChange}
            onDateRangeChange={handleDateRangeChange}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Проблем</TableCell>
                  <TableCell>Категория</TableCell>
                  <TableCell align="right">Брой случаи</TableCell>
                  <TableCell>Препоръчителни действия</TableCell>
                  <TableCell>Статус</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Повтарящи се проблеми с климатиците</TableCell>
                  <TableCell>Състояние на влак/удобства</TableCell>
                  <TableCell align="right">15</TableCell>
                  <TableCell>Планиране на профилактична поддръжка на климатиците</TableCell>
                  <TableCell>
                    <Chip label="В процес" color="warning" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Закъснения на маршрут София-Варна</TableCell>
                  <TableCell>Закъснение на влак</TableCell>
                  <TableCell align="right">23</TableCell>
                  <TableCell>Оптимизация на графика и координация с други превозвачи</TableCell>
                  <TableCell>
                    <Chip label="Планирани" color="info" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Проблеми с онлайн резервации</TableCell>
                  <TableCell>Проблеми с билет/резервация</TableCell>
                  <TableCell align="right">18</TableCell>
                  <TableCell>Подобряване на стабилността на системата за резервации</TableCell>
                  <TableCell>
                    <Chip label="Приложени" color="success" size="small" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Report Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeReportTab}
          onChange={handleReportTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {reportTabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Report Content */}
      <Card>
        <CardHeader 
          title={reportTabs[activeReportTab].label}
          action={
            <IconButton onClick={(e) => handleMenuClick(e, reportTabs[activeReportTab].label)}>
              <MoreVertIcon />
            </IconButton>
          }
        />
        <Divider />
        <CardContent>
          {reportTabs[activeReportTab].content}
        </CardContent>
      </Card>

      {/* Export Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleExport('pdf')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Експорт като PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('excel')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Експорт като Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('csv')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Експорт като CSV</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handlePrint}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Печат</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Main component
const FeedbackAndComplaints: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [cases, setCases] = useState<FeedbackCase[]>(MOCK_CASES);
  const [selectedCase, setSelectedCase] = useState<FeedbackCase | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    carrier: '',
    priority: '',
    dateRange: { start: null, end: null },
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityChangeDialog, setPriorityChangeDialog] = useState<{
    open: boolean;
    caseId: string | null;
    currentPriority: string;
  }>({
    open: false,
    caseId: null,
    currentPriority: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCaseSelect = (case_: FeedbackCase) => {
    setSelectedCase(case_);
    setIsDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setIsDetailsOpen(false);
    setSelectedCase(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilterChange = (filter: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value,
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePriorityChange = (caseId: string, currentPriority: string) => {
    setPriorityChangeDialog({
      open: true,
      caseId,
      currentPriority,
    });
  };

  const handlePriorityUpdate = (newPriority: string) => {
    if (priorityChangeDialog.caseId) {
      setCases(prevCases => 
        prevCases.map(case_ => 
          case_.id === priorityChangeDialog.caseId
            ? { ...case_, priority: newPriority as 'low' | 'medium' | 'high' | 'urgent' }
            : case_
        )
      );
      setPriorityChangeDialog({ open: false, caseId: null, currentPriority: '' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Обратна връзка и жалби
      </Typography>

      {/* Main Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<AddIcon />} 
            label="Регистриране на нова жалба/обратна връзка" 
            iconPosition="start"
          />
          <Tab 
            icon={<AssignmentIcon />} 
            label="Активни случаи" 
            iconPosition="start"
          />
          <Tab 
            icon={<AssessmentIcon />} 
            label="Отчети и анализи" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Регистриране на нова жалба/обратна връзка
          </Typography>
          <NewFeedbackForm />
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Активни случаи
          </Typography>
          <ActiveCasesTable
            cases={cases.filter(c => c.status !== 'closed')}
            onCaseSelect={handleCaseSelect}
            filters={filters}
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            onPriorityChange={handlePriorityChange}
          />
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Отчети и анализи
          </Typography>
          <ReportsAndAnalytics />
        </Box>
      )}

      {/* Case Details Dialog */}
      <Dialog
        open={isDetailsOpen}
        onClose={handleDetailsClose}
        maxWidth="lg"
        fullWidth
      >
        {selectedCase && (
          <>
            <DialogTitle>
              Детайли за случай {selectedCase.id}
            </DialogTitle>
            <DialogContent>
              {/* Case Details Content will be implemented here */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDetailsClose}>Затвори</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Priority Change Dialog */}
      <PriorityChangeDialog
        open={priorityChangeDialog.open}
        onClose={() => setPriorityChangeDialog({ open: false, caseId: null, currentPriority: '' })}
        currentPriority={priorityChangeDialog.currentPriority}
        onPriorityChange={handlePriorityUpdate}
      />
    </Box>
  );
};

// Priority Change Dialog component
const PriorityChangeDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  currentPriority: string;
  onPriorityChange: (priority: string) => void;
}> = ({ open, onClose, currentPriority, onPriorityChange }) => {
  // Ensure currentPriority is a valid priority value
  const validPriority = Object.keys(PRIORITIES).includes(currentPriority) 
    ? currentPriority 
    : 'medium';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Промяна на приоритет</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Текущ приоритет:
          </Typography>
          <Chip
            label={PRIORITIES[validPriority as keyof typeof PRIORITIES].label}
            color={PRIORITIES[validPriority as keyof typeof PRIORITIES].color as any}
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" gutterBottom>
            Изберете нов приоритет:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Object.entries(PRIORITIES).map(([value, { label, color }]) => (
              <Button
                key={value}
                variant={validPriority === value ? "contained" : "outlined"}
                color={color as any}
                onClick={() => onPriorityChange(value)}
                startIcon={<PriorityIcon />}
                sx={{ justifyContent: 'flex-start' }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отказ</Button>
      </DialogActions>
    </Dialog>
  );
};

// Filter Section component
const FilterSection = ({ 
  type,
  filters,
  onFilterChange,
  onDateRangeChange
}: { 
  type: string;
  filters: ReportFilters;
  onFilterChange: (filter: keyof ReportFilters, value: any) => void;
  onDateRangeChange: (field: 'start' | 'end', value: Date | null) => void;
}): React.ReactElement | null => {
  switch (type) {
    case 'statistics':
      return (
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Категория</InputLabel>
            <Select
              value={filters.category || ''}
              label="Категория"
              onChange={(e) => onFilterChange('category', e.target.value)}
            >
              <MenuItem value="">Всички</MenuItem>
              {CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
            <DatePicker
              label="От дата"
              value={filters.dateRange.start}
              onChange={(date) => onDateRangeChange('start', date)}
              slotProps={{
                textField: {
                  sx: { minWidth: 200 }
                }
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
            <DatePicker
              label="До дата"
              value={filters.dateRange.end}
              onChange={(date) => onDateRangeChange('end', date)}
              slotProps={{
                textField: {
                  sx: { minWidth: 200 }
                }
              }}
            />
          </LocalizationProvider>
        </Box>
      );

    case 'carriers':
      return (
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Превозвач</InputLabel>
            <Select
              value={filters.carrier || ''}
              label="Превозвач"
              onChange={(e) => onFilterChange('carrier', e.target.value)}
            >
              <MenuItem value="">Всички</MenuItem>
              {['BDZ', 'ЖСМ', 'МАВ', 'ЖС', 'ЦД'].map((carrier) => (
                <MenuItem key={carrier} value={carrier}>{carrier}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
            <DatePicker
              label="От дата"
              value={filters.dateRange.start}
              onChange={(date) => onDateRangeChange('start', date)}
              slotProps={{
                textField: {
                  sx: { minWidth: 200 }
                }
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
            <DatePicker
              label="До дата"
              value={filters.dateRange.end}
              onChange={(date) => onDateRangeChange('end', date)}
              slotProps={{
                textField: {
                  sx: { minWidth: 200 }
                }
              }}
            />
          </LocalizationProvider>
        </Box>
      );

    case 'trends':
      return (
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Превозвач</InputLabel>
            <Select
              value={filters.carrier || ''}
              label="Превозвач"
              onChange={(e) => onFilterChange('carrier', e.target.value)}
            >
              <MenuItem value="">Всички</MenuItem>
              {['BDZ', 'ЖСМ', 'МАВ', 'ЖС', 'ЦД'].map((carrier) => (
                <MenuItem key={carrier} value={carrier}>{carrier}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      );

    case 'recommendations':
      return (
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Категория</InputLabel>
            <Select
              value={filters.category || ''}
              label="Категория"
              onChange={(e) => onFilterChange('category', e.target.value)}
            >
              <MenuItem value="">Всички</MenuItem>
              {CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Превозвач</InputLabel>
            <Select
              value={filters.carrier || ''}
              label="Превозвач"
              onChange={(e) => onFilterChange('carrier', e.target.value)}
            >
              <MenuItem value="">Всички</MenuItem>
              {['BDZ', 'ЖСМ', 'МАВ', 'ЖС', 'ЦД'].map((carrier) => (
                <MenuItem key={carrier} value={carrier}>{carrier}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      );

    default:
      return null;
  }
};

// Export at the end of the file
export default FeedbackAndComplaints; 