import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DirectionsRailwayIcon from '@mui/icons-material/DirectionsRailway';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

// Types for route data
interface Route {
  id: string;
  from: string;
  to: string;
  country: string;
  isDirect: boolean;
  frequency: number;
  flagIcon?: string; // URL to flag icon (to be implemented)
}

// Mock data for popular international routes
const POPULAR_ROUTES: Route[] = [
  {
    id: 'sofia-vienna',
    from: 'София',
    to: 'Виена',
    country: 'Австрия',
    isDirect: true,
    frequency: 100,
  },
  {
    id: 'sofia-budapest',
    from: 'София',
    to: 'Будапеща',
    country: 'Унгария',
    isDirect: true,
    frequency: 95,
  },
  {
    id: 'sofia-belgrade',
    from: 'София',
    to: 'Белград',
    country: 'Сърбия',
    isDirect: true,
    frequency: 90,
  },
  {
    id: 'sofia-bucharest',
    from: 'София',
    to: 'Букурещ',
    country: 'Румъния',
    isDirect: true,
    frequency: 85,
  },
  {
    id: 'sofia-istanbul',
    from: 'София',
    to: 'Истанбул',
    country: 'Турция',
    isDirect: false,
    frequency: 80,
  },
  {
    id: 'sofia-thessaloniki',
    from: 'София',
    to: 'Солун',
    country: 'Гърция',
    isDirect: true,
    frequency: 75,
  },
  {
    id: 'sofia-munich',
    from: 'София',
    to: 'Мюнхен',
    country: 'Германия',
    isDirect: false,
    frequency: 70,
  },
  {
    id: 'plovdiv-istanbul',
    from: 'Пловдив',
    to: 'Истанбул',
    country: 'Турция',
    isDirect: true,
    frequency: 55,
  },
  {
    id: 'varna-bucharest',
    from: 'Варна',
    to: 'Букурещ',
    country: 'Румъния',
    isDirect: true,
    frequency: 50,
  }
].sort((a, b) => b.frequency - a.frequency); // Sort by frequency

export default function TicketIssuance() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Determine number of cards per row based on screen size
  const getCardsPerRow = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const handleRouteSelect = (routeId: string) => {
    const selectedRoute = POPULAR_ROUTES.find(route => route.id === routeId);
    if (selectedRoute) {
      navigate('/cashier/routes/results', {
        state: {
          route: {
            fromStation: selectedRoute.from,
            toStation: selectedRoute.to,
            departureDate: new Date().toISOString(), // Default to current date
            passengers: {
              adults: 1,
              children: 0,
              seniors: 0,
              students: 0
            }
          }
        }
      });
    }
  };

  const handleNewSearch = () => {
    // TODO: Implement navigation to detailed search screen (RouteSearch)
    navigate('/cashier/routes');
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Издаване на международен билет
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Изберете маршрут или започнете ново търсене
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>

      {/* Popular Routes Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Популярни международни маршрути
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          },
          gap: 3 
        }}>
          {POPULAR_ROUTES.map((route) => (
            <Box key={route.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardActionArea 
                  onClick={() => handleRouteSelect(route.id)}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DirectionsRailwayIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" component="div">
                        {route.from} - {route.to}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {route.country}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {route.isDirect ? (
                          <Typography variant="body2" color="success.main">
                            Директен
                          </Typography>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SwapHorizIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2" color="warning.main">
                              С прекачване
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* New Search Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        mt: 4,
        p: 4,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
      }}>
        <Typography variant="h6" gutterBottom>
          Не намирате желания маршрут?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Използвайте разширеното търсене
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleNewSearch}
          sx={{ 
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            minWidth: 200,
          }}
        >
          Ново търсене на маршрут
        </Button>
      </Box>
    </Box>
  );
}

/* 
TODO: Future Enhancements
1. Integration with Redux for state management
2. API integration for real-time popular routes data
3. Add flag icons for each destination country
4. Implement actual navigation to date/passenger selection
5. Add loading states and error handling
6. Add animations for route selection
7. Implement route caching for better performance
8. Add search history feature
9. Implement route favorites
10. Add seasonal route highlighting
*/ 