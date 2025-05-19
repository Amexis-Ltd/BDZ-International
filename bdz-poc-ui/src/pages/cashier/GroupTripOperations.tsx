import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// Import the actual components
import RegisterGroupRequest from './components/RegisterGroupRequest';
import IssueGroupTicket from './components/IssueGroupTicket';
import CancelGroupReservation from './components/CancelGroupReservation';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  width: '100%',
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`group-trip-tabpanel-${index}`}
      aria-labelledby={`group-trip-tab-${index}`}
      {...other}
    >
      {value === index && (
        <StyledPaper>{children}</StyledPaper>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `group-trip-tab-${index}`,
    'aria-controls': `group-trip-tabpanel-${index}`,
  };
}

const GroupTripOperations: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={1} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="group trip operations tabs"
          variant="fullWidth"
        >
          <Tab label="Регистрация Заявка" {...a11yProps(0)} />
          <Tab label="Издаване Билет" {...a11yProps(1)} />
          <Tab label="Анулиране" {...a11yProps(2)} />
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0}>
        <RegisterGroupRequest />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <IssueGroupTicket />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CancelGroupReservation />
      </TabPanel>
    </Box>
  );
};

export default GroupTripOperations; 