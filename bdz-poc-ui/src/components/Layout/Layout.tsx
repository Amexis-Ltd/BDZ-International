import React, { ReactNode, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // Cashier Login
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // General Logout
import MenuIcon from '@mui/icons-material/Menu';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
// Import all needed state selectors and actions
import {
  selectIsLoggedIn, // General login status
  selectIsCashierLoggedIn,
  selectIsCustomerLoggedIn,
  selectUsername, // Will hold either cashier username or customer identifier
  selectUserRole,
  logout, // Use the single logout action
} from '../../store/features/auth/authSlice';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  icon: React.ReactElement;
  path?: string;
  action?: () => void;
  show?: 'always' | 'loggedOut' | 'loggedInCustomer' | 'loggedInCashier'; // Control visibility
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Get all relevant auth states
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isCashierLoggedIn = useAppSelector(selectIsCashierLoggedIn);
  const isCustomerLoggedIn = useAppSelector(selectIsCustomerLoggedIn);
  const username = useAppSelector(selectUsername);
  const userRole = useAppSelector(selectUserRole);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Use the general logout action
  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/'); // Navigate to home after logout
  };

  // --- Define All Navigation Items --- 
  const navigationItems: NavItem[] = [
    // Always Visible
    { label: 'Начало', path: '/', icon: <HomeIcon sx={{ mr: 1 }} />, show: 'always' },
    // Logged Out Only
    { label: 'Вход', path: '/cashier-login', icon: <VpnKeyIcon sx={{ mr: 1 }} />, show: 'loggedOut' },
    // Logged In Cashier Only
    { label: 'Международно билетоиздаване', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 1 }} />, show: 'loggedInCashier' },
    // Logged In (Any Role)
    // Using separate items for logout because filtering logic checks specific roles
    { label: 'Изход', action: handleLogout, icon: <ExitToAppIcon sx={{ mr: 1 }} />, show: 'loggedInCustomer' },
    { label: 'Изход', action: handleLogout, icon: <ExitToAppIcon sx={{ mr: 1 }} />, show: 'loggedInCashier' },
  ];

  // Filter items based on login state and role
  const getFilteredNavItems = (): NavItem[] => {
    return navigationItems.filter(item => {
      // Check against specific states from Redux
      if (item.show === 'always') return true;
      if (item.show === 'loggedOut' && !isCustomerLoggedIn && !isCashierLoggedIn) return true; // Check both are false
      if (item.show === 'loggedInCustomer' && isCustomerLoggedIn) return true;
      if (item.show === 'loggedInCashier' && isCashierLoggedIn) return true;
      return false;
    });
  };
  
  const renderMenuItems = (isMobileMenu = true) => {
    const items = getFilteredNavItems();
    let firstLoginItemRendered = false; // Track if we've hit the first login item

    return items.map((item, index) => {
      const itemKey = item.label + (item.path || '_action');
      const elements: React.ReactNode[] = [];

      // Check if this is the first login item to render when logged out
      if (!isCustomerLoggedIn && !isCashierLoggedIn && item.show === 'loggedOut' && !firstLoginItemRendered) {
        if (index > 0) { // Don't add divider if it's the very first item
             elements.push(<Divider key={`${itemKey}-divider`} sx={{ my: 0.5 }} />);
        }
        firstLoginItemRendered = true;
      }

      // Render the actual item
      if (item.path) {
        elements.push(
          <MenuItem
            key={itemKey}
            component={Link}
            to={item.path}
            onClick={handleMenuClose}
          >
            {isMobileMenu && item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.label} />
          </MenuItem>
        );
      } else if (item.action) {
        elements.push(
          <MenuItem key={itemKey} onClick={() => { item.action?.(); handleMenuClose(); }}>
            {isMobileMenu && item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.label} />
          </MenuItem>
        );
      }
      // Return array of elements (potentially including divider)
      return elements;
    });
  };

  const renderDesktopButtons = () => {
    const items = getFilteredNavItems();
    let firstLoginItemRendered = false;

    return items.map((item, index) => {
      const itemKey = item.label + (item.path || '_action');
      const elements: React.ReactNode[] = [];

       // Add visual separator before the first login button
       if (!isCustomerLoggedIn && !isCashierLoggedIn && item.show === 'loggedOut' && !firstLoginItemRendered) {
           if (index > 0) { // Don't add separator if it's the first button
               elements.push(
                   <Box key={`${itemKey}-separator`} sx={{ borderLeft: 1, borderColor: 'rgba(255, 255, 255, 0.3)', height: '24px', alignSelf: 'center', mx: 1 }} />
               );
           }
           firstLoginItemRendered = true;
       }

      // Render the actual button
      if (item.path) {
        elements.push(
          <Button
            key={itemKey}
            color="inherit"
            component={Link}
            to={item.path}
            startIcon={item.icon}
          >
            {item.label}
          </Button>
        );
      } else if (item.action) {
        elements.push(
          <Button key={itemKey} color="inherit" onClick={item.action} startIcon={item.icon}>
            {item.label}
          </Button>
        );
      }
      // Return array of elements (potentially including separator)
      return elements;
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              mr: 4, 
              textDecoration: 'none', 
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0
            }}
          >
             {/* Conditional Title */}
            БДЖ {userRole === 'cashier' ? "Каса" : "Пътнически превози"}
          </Typography>
          
          {isMobile ? (
            // --- Mobile Menu --- 
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                size="large"
                edge="end"
                  color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{ 'aria-labelledby': 'menu-button' }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {renderMenuItems(true)}
              </Menu>
            </>
          ) : (
            // --- Desktop Menu --- 
            <>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {renderDesktopButtons()}
              </Box>
              
              <Box sx={{ flexGrow: 1 }} />
              
              {/* Display username based on role */}
              {isLoggedIn && username && (
                <Typography component="span" sx={{ mx: 2, color: 'inherit', whiteSpace: 'nowrap' }}>
                  {userRole === 'cashier' ? `Касиер: ${username}` : `${username}`}
              </Typography>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.secondary.main,
          color: (theme) => theme.palette.getContrastText(theme.palette.secondary.main),
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' БДЖ Пътнически превози'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 