import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Home as HomeIcon,
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
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectUsername, selectUserRole, logout } from '../../store/features/auth/authSlice';
import { CurrentTime } from '../../components/CurrentTime';
import Breadcrumb from '../Breadcrumb';

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

// Navigation items - Business process menu options
const navigationItems = [
  {
    label: 'Начало',
    icon: <HomeIcon />,
    path: '/cashier/dashboard',
  },
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
    label: 'Проверка на билети',
    icon: <TicketIcon />,
    path: '/cashier/tickets/check',
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

interface CashierLayoutProps {
  children: React.ReactNode;
}

const CashierLayout: React.FC<CashierLayoutProps> = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const username = useAppSelector(selectUsername);
  const userRole = useAppSelector(selectUserRole);
  const dispatch = useAppDispatch();

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
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuIconClose();
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            БДЖ Пътнически превози - Международно билетоиздаване
          </Typography>
          
          {/* Current Time */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 3 }}>
            <CurrentTime />
          </Box>

          <Button
            onClick={handleMenuIconClick}
            startIcon={<AppsIcon sx={{ fontSize: 28 }} />}
            sx={{
              mr: 2,
              color: 'white',
              backgroundColor: 'primary.main',
              fontWeight: 'bold',
              px: 2,
              py: 1,
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'primary.dark',
                color: 'white',
                boxShadow: 4,
              },
            }}
            aria-controls="quick-menu"
            aria-haspopup="true"
            size="medium"
            variant="contained"
          >
            Меню
          </Button>

          <Menu
            id="quick-menu"
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuIconClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 280,
              },
            }}
          >
            {navigationItems.map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                selected={isActiveRoute(item.path)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </MenuItem>
            ))}
          </Menu>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {username}
            </Typography>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 1 }}
              aria-controls="user-menu"
              aria-haspopup="true"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <PersonIcon />
              </Avatar>
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                },
              }}
            >
              <MenuItem disabled>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {username} ({userRole})
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Изход</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </StyledAppBar>

      <Main>
        <Breadcrumb />
        {children}
      </Main>
    </Box>
  );
};

export default CashierLayout; 