import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import IssueDiscountCard from './components/IssueDiscountCard';
import IssueSubscriptionCard from './components/IssueSubscriptionCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Consistent TabPanel from TicketOperations
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`card-tabpanel-${index}`}
      aria-labelledby={`card-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box> {/* No padding here, handled by child component's Paper */}
          {children}
        </Box>
      )}
    </div>
  );
}

// Consistent StyledTabs from TicketOperations
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2), // Add some space below tabs
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
  },
}));

// Consistent StyledTab from TicketOperations
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.typography.pxToRem(14),
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

const CardOperations: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper sx={{ p: 0, overflow: 'hidden' }}> {/* Wrapper Paper with no internal padding */}
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="card operations tabs"
          variant="scrollable" // Use scrollable for potentially more tabs later
          scrollButtons="auto"
        >
          <StyledTab label="Издаване карта намаление" />
          <StyledTab label="Издаване абонаментна карта" />
          {/* Add tabs for card correction/reissuing later if needed */}
        </StyledTabs>
        
        <TabPanel value={value} index={0}>
          <IssueDiscountCard />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <IssueSubscriptionCard />
        </TabPanel>
        {/* Add more TabPanels */}
    </Paper>
  );
};

export default CardOperations; 