import React from 'react';
import { Box, Tabs, Tab, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import IssueTicketsAndAdditions from './components/IssueTicketsAndAdditions';
import TicketConfirmation from './components/TicketConfirmation';
import TicketReconfirmation from './components/TicketReconfirmation';
import TicketCancellation from './components/TicketCancellation';
import TicketReturn from './components/TicketReturn';
import JourneyInterruption from './components/JourneyInterruption';
import TicketComplaint from './components/TicketComplaint';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ticket-tabpanel-${index}`}
      aria-labelledby={`ticket-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
};

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiTabs-scroller': {
    overflowX: 'auto !important',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  minWidth: 'auto',
  padding: theme.spacing(1, 2),
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

const TicketOperations: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.grey[100],
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.grey[400],
          borderRadius: '3px',
        },
      }}>
        <StyledTabs 
          value={value} 
          onChange={handleChange} 
          aria-label="ticket operations tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <StyledTab label="Издаване на талони и добавки" />
          <StyledTab label="Заверяване на билет" />
          <StyledTab label="Презаверяване на билет" />
          <StyledTab label="Анулиране на билет" />
          <StyledTab label="Връщане на билет" />
          <StyledTab label="Прекъсване на пътуване" />
          <StyledTab label="Рекламация" />
        </StyledTabs>
      </Box>
      <TabPanel value={value} index={0}>
        <IssueTicketsAndAdditions />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TicketConfirmation />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <TicketReconfirmation />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <TicketCancellation />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <TicketReturn />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <JourneyInterruption />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <TicketComplaint />
      </TabPanel>
    </Box>
  );
};

export default TicketOperations; 