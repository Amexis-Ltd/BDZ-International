import React, { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { useLocation } from 'react-router-dom';
import { startNewTicket, setRouteSelection } from '../../store/features/ticket/ticketSlice';

const TicketIssuance = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.route) {
      const routeData = location.state.route;
      
      // Initialize ticket process
      dispatch(startNewTicket());
      
      // Set route selection
      dispatch(setRouteSelection({
        fromStation: routeData.segments[0].fromStation,
        toStation: routeData.segments[routeData.segments.length - 1].toStation,
        viaStation: routeData.segments.length > 1 ? routeData.segments[0].toStation : undefined,
        departureDate: routeData.departureTime,
        departureTime: routeData.departureTime,
        basePrice: routeData.totalPrice,
        passengers: routeData.passengers || {
          adults: 1,
          children: 0,
          seniors: 0,
          students: 0
        }
      }));
    }
  }, [location.state, dispatch]);

  return (
    // Rest of the component code
  );
};

export default TicketIssuance; 