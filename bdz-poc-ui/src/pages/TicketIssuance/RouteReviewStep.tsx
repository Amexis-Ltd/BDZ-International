import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from '@mui/material';
import {
  DirectionsRailway as TrainIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentTicket } from '../../store/features/ticket/ticketSlice';
import { useNavigate } from 'react-router-dom';

interface RouteReviewStepProps {
  onComplete: () => void;
}

export const RouteReviewStep: React.FC<RouteReviewStepProps> = ({ onComplete }) => {
  const currentTicket = useAppSelector(selectCurrentTicket);
  const navigate = useNavigate();

  if (!currentTicket?.route) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Няма избран маршрут
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/cashier/routes/results')}
          sx={{ mt: 2 }}
        >
          Избери маршрут
        </Button>
      </Box>
    );
  }

  const formatDateTime = (dateStr: string, timeStr?: string) => {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('bg-BG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (timeStr) {
      const time = new Date(timeStr);
      const formattedTime = time.toLocaleTimeString('bg-BG', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `${formattedDate}, ${formattedTime}`;
    }

    return formattedDate;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Преглед на избрания маршрут
      </Typography>

      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItem>
          <ListItemIcon>
            <TrainIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Маршрут" 
            secondary={`${currentTicket.route.fromStation} - ${currentTicket.route.toStation}`}
            secondaryTypographyProps={{ variant: 'h6', color: 'primary' }}
          />
        </ListItem>

        <Divider variant="inset" component="li" />

        <ListItem>
          <ListItemIcon>
            <CalendarIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Дата на пътуване" 
            secondary={formatDateTime(currentTicket.route.departureDate)}
          />
        </ListItem>

        {currentTicket.route.departureTime && (
          <>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <TimeIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Час на тръгване" 
                secondary={formatDateTime(currentTicket.route.departureDate, currentTicket.route.departureTime)}
              />
            </ListItem>
          </>
        )}

        {currentTicket.route.viaStation && (
          <>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <LocationIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="През" 
                secondary={currentTicket.route.viaStation}
              />
            </ListItem>
          </>
        )}

      </List>
    </Box>
  );
}; 