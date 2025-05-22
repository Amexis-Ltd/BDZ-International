import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  issueTicket,
  selectCurrentTicket,
  startNewTicket,
  setRouteSelection,
} from '../store/features/ticket/ticketSlice';
import { PassengerCountStep } from './TicketIssuance/PassengerCountStep';
import { ReturnOptionsStep } from './TicketIssuance/ReturnOptionsStep';
import { DiscountsStep } from './TicketIssuance/DiscountsStep';
import { SeatSelectionStep } from './TicketIssuance/SeatSelectionStep';
import { ReviewStep } from './TicketIssuance/ReviewStep';
import { RouteReviewStep } from './TicketIssuance/RouteReviewStep';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdditionalServicesSelection } from './TicketIssuance/AdditionalServicesSelection';
import { PriceSummaryBar } from '../components/PriceSummaryBar';

// Define step keys to better align with the use case UC-CashDesk-04
const steps = [
  'Преглед на маршрут',
  'Опции за връщане',
  'Брой пътници',
  'Информация за пътници',
  'Избор на места',
  'Допълнителни услуги',
  'Преглед и плащане',
];

const TicketIssuance: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useAppDispatch();
  const currentTicket = useAppSelector(selectCurrentTicket);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize ticket if none exists
  useEffect(() => {
    if (!currentTicket) {
      console.log("Starting new ticket");
      dispatch(startNewTicket());
    }
  }, []); // Only run once on mount

  // Handle route data from navigation state
  useEffect(() => {
    const routeData = location.state?.route;
    if (routeData && currentTicket && !currentTicket.route) {
      console.log("Received route data:", routeData);
      // Transform route data to match RouteSelectionPayload format
      const routePayload = {
        fromStation: routeData.segments[0].fromStation,
        toStation: routeData.segments[routeData.segments.length - 1].toStation,
        departureDate: routeData.departureTime,
        departureTime: routeData.departureTime,
        viaStation: routeData.segments.length > 1 ? routeData.segments[0].toStation : undefined,
        // Always include passenger data, defaulting to 1 adult if not provided
        passengers: {
          adults: routeData.passengers?.adults ?? 1,
          children: routeData.passengers?.children ?? 0,
          seniors: routeData.passengers?.seniors ?? 0,
          students: routeData.passengers?.students ?? 0
        }
      };
      console.log("Dispatching route selection with payload:", routePayload);
      dispatch(setRouteSelection(routePayload));
    }
  }, [location.state, currentTicket?.route, dispatch]);

  // Debug logging
  useEffect(() => {
    console.log("Current ticket state:", currentTicket);
  }, [currentTicket]);

  const handleNext = () => {
    if (currentTicket) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      console.error("Cannot proceed: No ticket in progress");
      dispatch(startNewTicket());
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    if (currentTicket) {
      dispatch(issueTicket());
      // Show a more professional confirmation instead of alert
      navigate('/cashier/dashboard', { 
        state: { ticketSuccess: true, ticketTimestamp: new Date().getTime() } 
      });
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <RouteReviewStep
            onComplete={handleNext}
          />
        );
      case 1:
        return (
          <ReturnOptionsStep />
        );
      case 2:
        return (
          <PassengerCountStep />
        );
      case 3:
        return (
          <DiscountsStep
            onComplete={handleNext}
          />
        );
      case 4:
        return (
          <SeatSelectionStep
            onComplete={handleNext}
          />
        );
      case 5:
        return (
          <AdditionalServicesSelection
            onComplete={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return <ReviewStep />;
      default:
        return <Typography>Невалидна стъпка</Typography>;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
        Издаване на билет
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <PriceSummaryBar />

      <Paper sx={{ p: 3 }}>
        {renderStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Назад
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="success" onClick={handleFinish}>
              Издаване и плащане
            </Button>
          ) : (
             ![0, 3, 4].includes(activeStep) && (
                <Button variant="contained" onClick={handleNext}>
                  Напред
                </Button>
             )
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TicketIssuance; 