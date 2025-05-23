import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumbs, Typography, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactElement;
}

interface BreadcrumbProps {
  customItems?: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ customItems }) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Define route mappings for breadcrumbs
  const routeMapping: Record<string, BreadcrumbItem[]> = {
    '/cashier/dashboard': [
      { label: 'Дашборд', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> }
    ],
    '/cashier/tickets': [
      { label: 'Дашборд', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      { label: 'Билетоиздаване' }
    ],
    '/cashier/ticket-issuance': [
      { label: 'Дашборд', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      { label: 'Ново билетоиздаване' }
    ],
    '/cashier/tickets/check': [
      { label: 'Дашборд', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      { label: 'Билети', path: '/cashier/tickets' },
      { label: 'Валидиране на билети' }
    ],
    '/cashier/tickets/cancel': [
      { label: 'Дашборд', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      { label: 'Билети', path: '/cashier/tickets' },
      { label: 'Анулиране на билети' }
    ],
    '/cashier/reservations': [
      { label: 'Дашборд', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      { label: 'Резервации' }
    ],
    '/cashier/routes': [
      { label: 'Дашборд', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      { label: 'Търсене на маршрути' }
    ],
    '/cashier/routes/results': [
      { label: 'Дашборд', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      { label: 'Маршрути', path: '/cashier/routes' },
      { label: 'Резултати от търсенето' }
    ],
    '/cashier/ticket-modifications': [
      { label: 'Дашборд', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      { label: 'Промени по билети' }
    ],
    '/cashier/additional-services': [
      { label: 'Дашборд', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      { label: 'Допълнителни услуги' }
    ],
    '/cashier/printing-materials': [
      { label: 'Дашборд', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      { label: 'Печатни материали' }
    ],
    '/cashier/reports': [
      { label: 'Дашборд', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      { label: 'Отчети и статистики' }
    ],
    '/cashier/feedback': [
      { label: 'Дашборд', path: '/cashier/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
      { label: 'Обратна връзка и жалби' }
    ]
  };

  // Use custom items if provided, otherwise use route mapping
  const breadcrumbItems = customItems || routeMapping[pathname] || [];

  // Don't render breadcrumb if there are no items or only one item
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: 'text.secondary'
          }
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          if (isLast) {
            // Last item - not clickable
            return (
              <Typography 
                key={index}
                color="text.primary"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 'medium'
                }}
              >
                {item.icon}
                {item.label}
              </Typography>
            );
          } else if (item.path) {
            // Clickable breadcrumb item
            return (
              <Link
                key={index}
                to={item.path}
                style={{ textDecoration: 'none' }}
              >
                <Typography
                  color="text.secondary"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
                </Typography>
              </Link>
            );
          } else {
            // Non-clickable breadcrumb item
            return (
              <Typography 
                key={index}
                color="text.secondary"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center'
                }}
              >
                {item.icon}
                {item.label}
              </Typography>
            );
          }
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb; 