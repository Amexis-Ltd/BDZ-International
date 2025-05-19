import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, ListItemIcon } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentTicket } from '../../store/features/ticket/ticketSlice';
import {
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  Luggage as LuggageIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
} from '@mui/icons-material';

interface ReviewStepProps {
  // No onComplete needed here, the main component handles finish
}

export const ReviewStep: React.FC<ReviewStepProps> = () => {
  const currentTicket = useAppSelector(selectCurrentTicket);

  if (!currentTicket) {
    return <Typography>Грешка: Липсват данни за билета.</Typography>;
  }

  // Helper to format time from ISO string
  const formatTime = (isoString: string | undefined) => {
    if (!isoString) return 'Не е избран';
    try {
      return new Date(isoString).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Не е избран';
    }
  };

  // Helper to get icon for service category
  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'accommodation':
        return <HotelIcon />;
      case 'food':
        return <RestaurantIcon />;
      case 'luggage':
        return <LuggageIcon />;
      case 'insurance':
        return <SecurityIcon />;
      case 'assistance':
        return <SupportIcon />;
      default:
        return null;
    }
  };

  // Helper function to calculate ticket price for a passenger
  const calculatePassengerPrice = (passenger: any, basePrice: number) => {
    if (!basePrice) return 0;

    const categoryMultiplier = 
      passenger.category === 'adults' ? 1.0 :
      passenger.category === 'children' ? 0.5 :
      passenger.category === 'seniors' ? 0.7 : 0.8;

    const discountMultiplier = 
      passenger.discount === 'Без намаление' ? 1.0 :
      passenger.discount === 'Карта за отстъпка' ? 0.5 :
      passenger.discount === 'Карта за семейство' ? 0.7 :
      passenger.discount === 'Карта за студент' ? 0.8 : 0.7;

    return basePrice * categoryMultiplier * discountMultiplier;
  };

  // Calculate total tickets price
  const calculateTotalTicketsPrice = () => {
    if (!currentTicket || !currentTicket.basePrice) return 0;
    
    const basePrice = currentTicket.basePrice;
    console.log('Calculating total tickets price with base price:', basePrice);
    
    const ticketsPrice = currentTicket.passengers.reduce((sum, passenger) => {
      const passengerPrice = calculatePassengerPrice(passenger, basePrice);
      console.log('Passenger price:', {
        passenger,
        basePrice,
        passengerPrice
      });
      return sum + passengerPrice;
    }, 0);
    
    // Double the price for round trips
    const finalPrice = currentTicket.returnType !== 'one-way' ? ticketsPrice * 2 : ticketsPrice;
    console.log('Final tickets price:', finalPrice);
    return finalPrice;
  };

  // Calculate additional services price
  const calculateAdditionalServicesPrice = () => {
    if (!currentTicket?.additionalServices || currentTicket.additionalServices.length === 0) {
      return 0;
    }
    return currentTicket.additionalServices.reduce((sum, service) => sum + (service.totalPrice || 0), 0);
  };

  // Calculate prices
  const basePrice = currentTicket.basePrice || 0;
  const totalTicketsPrice = calculateTotalTicketsPrice();
  const additionalServicesPrice = calculateAdditionalServicesPrice();
  const finalTotal = totalTicketsPrice + additionalServicesPrice;

  console.log('Price summary:', {
    basePrice,
    totalTicketsPrice,
    additionalServicesPrice,
    finalTotal
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Преглед и потвърждение
      </Typography>
      <List disablePadding>
        <ListItem>
          <ListItemText primary="Маршрут" secondary={`${currentTicket.route?.fromStation || '?'} - ${currentTicket.route?.toStation || '?'}`} />
        </ListItem>
        <ListItem>
          <ListItemText
             primary="Дата и час"
             // Combine date and time
             secondary={`${currentTicket.route?.departureDate ? new Date(currentTicket.route.departureDate).toLocaleDateString('bg-BG') : '?'} ${formatTime(currentTicket.route?.departureTime)}`}
           />
        </ListItem>
        {/* Remove Time Slot display
        {currentTicket.route?.departureTimeSlot && (
          <ListItem>
            <ListItemText primary="Времеви слот" secondary={currentTicket.route.departureTimeSlot} />
          </ListItem>
        )} */}
         <ListItem>
          <ListItemText primary="Тип връщане" secondary={currentTicket.returnType === 'one-way' ? 'Еднопосочен' : currentTicket.returnType === 'round-trip-open' ? 'Двупосочен отворен' : 'Двупосочен с дата'} />
        </ListItem>
         {currentTicket.returnType === 'round-trip-fixed' && currentTicket.returnDate && (
          <>
            <ListItem>
              <ListItemText 
                primary="Дата на връщане" 
                secondary={new Date(currentTicket.returnDate).toLocaleDateString('bg-BG')} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Час на връщане" 
                secondary={formatTime(currentTicket.returnDate)} 
              />
            </ListItem>
          </>
        )}
        <ListItem>
          <ListItemText primary="Брой пътници" secondary={currentTicket.passengerCount} />
        </ListItem>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle1" sx={{ mt: 1 }}>Пътници:</Typography>
        {currentTicket.passengers.map((passenger, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Пътник ${index + 1}`}
              secondary={`Намаление: ${passenger.discount || 'Няма'}, Вагон: ${passenger.carNumber || 'Не е избран'}, Място: ${passenger.seatNumber || 'Автоматично'}`}
            />
          </ListItem>
        ))}

        {/* Additional Services Section */}
        {currentTicket.additionalServices && currentTicket.additionalServices.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" sx={{ mt: 1 }}>Допълнителни услуги:</Typography>
            {currentTicket.additionalServices.map((service, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {getServiceIcon(service.category)}
                </ListItemIcon>
                <ListItemText
                  primary={service.name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Количество: {service.quantity}
                        {service.selectedOptions && service.selectedOptions.length > 0 && (
                          <> • Опции: {service.selectedOptions.join(', ')}</>
                        )}
                      </Typography>
                      <Typography component="div" variant="body2" color="primary">
                        {service.totalPrice} лв.
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
            <ListItem>
              <ListItemText
                primary="Обща сума за допълнителни услуги"
                primaryTypographyProps={{ variant: 'subtitle1' }}
                secondary={
                  <Typography variant="h6" color="primary">
                    {currentTicket.additionalServices.reduce((sum, service) => sum + service.totalPrice, 0)} лв.
                  </Typography>
                }
              />
            </ListItem>
          </>
        )}

        {/* Price Summary Section */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Обобщение на цените
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Базова цена на билета"
              secondary={`${basePrice.toFixed(2)} лв.`}
            />
          </ListItem>
          
          {currentTicket.passengers.map((passenger, index) => {
            const passengerPrice = calculatePassengerPrice(passenger, basePrice);
            return (
              <ListItem key={index}>
                <ListItemText
                  primary={`Пътник ${index + 1} (${passenger.category === 'adults' ? 'Възрастен' :
                    passenger.category === 'children' ? 'Дете' :
                    passenger.category === 'seniors' ? 'Пенсионер' : 'Студент'})`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {passenger.discount !== 'Без намаление' && `Намаление: ${passenger.discount}`}
                      </Typography>
                      <Typography component="div" variant="body2">
                        {passengerPrice.toFixed(2)} лв.
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            );
          })}

          {currentTicket.returnType !== 'one-way' && (
            <ListItem>
              <ListItemText
                primary="Двупосочен билет"
                secondary="Цената е удвоена"
              />
            </ListItem>
          )}

          <Divider sx={{ my: 1 }} />
          
          <ListItem>
            <ListItemText
              primary="Обща сума за билети"
              primaryTypographyProps={{ variant: 'subtitle1', fontWeight: 'bold' }}
              secondary={
                <Typography variant="h6" color="primary">
                  {totalTicketsPrice.toFixed(2)} лв.
                </Typography>
              }
            />
          </ListItem>

          {currentTicket.additionalServices && currentTicket.additionalServices.length > 0 && (
            <ListItem>
              <ListItemText
                primary="Обща сума за допълнителни услуги"
                primaryTypographyProps={{ variant: 'subtitle1' }}
                secondary={
                  <Typography variant="h6" color="primary">
                    {additionalServicesPrice.toFixed(2)} лв.
                  </Typography>
                }
              />
            </ListItem>
          )}

          <Divider sx={{ my: 1 }} />
          
          <ListItem>
            <ListItemText
              primary="Крайна сума"
              primaryTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
              secondary={
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                  {finalTotal.toFixed(2)} лв.
                </Typography>
              }
            />
          </ListItem>
        </List>
      </List>
      {/* The "Издаване на билет" button is handled by the main component */}
    </Box>
  );
}; 