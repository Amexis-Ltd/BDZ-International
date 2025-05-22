import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

export const CurrentTime: React.FC = () => {
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