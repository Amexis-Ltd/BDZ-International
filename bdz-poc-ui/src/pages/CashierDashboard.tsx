import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  Paper,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  ConfirmationNumber as TicketIcon,
  Cancel as CancelIcon,
  EventNote as ReservationIcon,
  AddShoppingCart as AddServiceIcon,
  Print as PrintIcon,
  Assessment as ReportIcon,
  Feedback as FeedbackIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Apps as AppsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectUsername, selectUserRole } from '../store/features/auth/authSlice';

// Styled components
const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflow: 'auto',
  height: 'calc(100vh - 64px)',
  marginTop: '64px',
  '& > *': {
    width: '100%',
    maxWidth: '1200px',
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  width: '100%',
  zIndex: theme.zIndex.appBar,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const QuickActionButton = styled(Button)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  '& .MuiButton-startIcon': {
    margin: 0,
    fontSize: '2rem',
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}));

// Navigation items - Business process menu options
const navigationItems = [
  {
    label: 'Търсене на международни маршрути',
    icon: <SearchIcon />,
    path: '/cashier/routes',
  },
  {
    label: 'Управление на резервации',
    icon: <ReservationIcon />,
    path: '/cashier/reservations',
  },
  {
    label: 'Продажба на билети',
    icon: <TicketIcon />,
    path: '/cashier/tickets',
  },
  {
    label: 'Анулиране и промяна на билети',
    icon: <CancelIcon />,
    path: '/cashier/ticket-modifications',
  },
  {
    label: 'Продажба на допълнителни услуги',
    icon: <AddServiceIcon />,
    path: '/cashier/additional-services',
  },
  {
    label: 'Управление на печатни материали',
    icon: <PrintIcon />,
    path: '/cashier/printing-materials',
  },
  {
    label: 'Справки и отчети',
    icon: <ReportIcon />,
    path: '/cashier/reports',
  },
  {
    label: 'Обратна връзка и жалби',
    icon: <FeedbackIcon />,
    path: '/cashier/feedback',
  },
];

// Mock data for dashboard statistics
const mockStats = {
  ticketsIssued: 24,
  totalSales: 1250.50,
  activeReservations: 8,
  availableForms: 150,
};

// Mock data for recent transactions
const mockTransactions = [
  {
    id: 1,
    type: 'Продажба билет',
    amount: 45.50,
    time: '14:30',
    details: 'София - Белград',
  },
  {
    id: 2,
    type: 'Анулиране',
    amount: -32.00,
    time: '14:15',
    details: 'София - Букурещ',
  },
  {
    id: 3,
    type: 'Продажба билет',
    amount: 89.00,
    time: '13:45',
    details: 'София - Солун',
  },
  {
    id: 4,
    type: 'Допълнителна услуга',
    amount: 15.00,
    time: '13:30',
    details: 'Резервация на място',
  },
  {
    id: 5,
    type: 'Продажба билет',
    amount: 67.50,
    time: '13:00',
    details: 'София - Истанбул',
  },
];

// Current time component
const CurrentTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Typography variant="body2" sx={{ color: 'inherit' }}>
      {currentTime.toLocaleDateString('bg-BG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
      {' | '}
      {currentTime.toLocaleTimeString('bg-BG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}
    </Typography>
  );
};

const CashierDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const username = useAppSelector(selectUsername);
  const userRole = useAppSelector(selectUserRole);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuIconClose = () => {
    setMenuAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuIconClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Main>
        {/* Quick Actions Section */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Бързи действия
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          <StyledCard>
            <QuickActionButton
              variant="contained"
              color="primary"
              startIcon={<TicketIcon />}
              onClick={() => handleNavigation('/cashier/ticket-issuance')}
            >
              Издаване на билет
            </QuickActionButton>
          </StyledCard>
          <StyledCard>
            <QuickActionButton
              variant="contained"
              color="secondary"
              startIcon={<TicketIcon />}
              onClick={() => handleNavigation('/cashier/tickets/check')}
            >
              Проверка на билет
            </QuickActionButton>
          </StyledCard>
          <StyledCard>
            <QuickActionButton
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleNavigation('/cashier/tickets/cancel')}
            >
              Анулиране на билет
            </QuickActionButton>
          </StyledCard>
          <StyledCard>
            <QuickActionButton
              variant="contained"
              color="info"
              startIcon={<ReservationIcon />}
              onClick={() => handleNavigation('/cashier/reservations')}
            >
              Управление на резервации
            </QuickActionButton>
          </StyledCard>
        </Box>

        {/* Statistics Section */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Статистика за деня
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          <StatCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Издадени международни билети
              </Typography>
              <Typography variant="h4" component="div">
                {mockStats.ticketsIssued}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                за днес
              </Typography>
            </CardContent>
          </StatCard>
          <StatCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Обща стойност на продажбите
              </Typography>
              <Typography variant="h4" component="div">
                {mockStats.totalSales.toFixed(2)} лв.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                за днес
              </Typography>
            </CardContent>
          </StatCard>
          <StatCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Активни резервации
              </Typography>
              <Typography variant="h4" component="div">
                {mockStats.activeReservations}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                текущи
              </Typography>
            </CardContent>
          </StatCard>
          <StatCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Налични билетни бланки
              </Typography>
              <Typography variant="h4" component="div">
                {mockStats.availableForms}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                броя
              </Typography>
            </CardContent>
          </StatCard>
        </Box>

        {/* Recent Transactions Section */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Последни операции
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Час</TableCell>
                <TableCell>Операция</TableCell>
                <TableCell>Детайли</TableCell>
                <TableCell align="right">Сума</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.time}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.details}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{
                      color: transaction.amount < 0 ? 'error.main' : 'success.main',
                    }}
                  >
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} лв.
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Main>
    </Box>
  );
};

export default CashierDashboard; 