import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import { AttachMoney as MoneyIcon } from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';
import { selectCurrentTicket } from '../store/features/ticket/ticketSlice';

export const PriceSummaryBar: React.FC = () => {
  const currentTicket = useAppSelector(selectCurrentTicket);

  if (!currentTicket) return null;

  return (
    <Paper 
      elevation={1}
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
        mb: 3
      }}
    >
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        px: 3, 
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MoneyIcon color="primary" />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Базова цена
            </Typography>
            <Typography variant="h6" color="primary">
              {currentTicket.basePrice.toFixed(2)} лв.
            </Typography>
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Обща сума
            </Typography>
            <Typography variant="h6" color="primary">
              {currentTicket.totalPrice.toFixed(2)} лв.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}; 