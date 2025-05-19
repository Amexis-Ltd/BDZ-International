import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardActions,
  Grid,
  TextField,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CampaignIcon from '@mui/icons-material/Campaign';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { bg } from 'date-fns/locale/bg';
import { useAppSelector } from '../store/hooks';
import { selectIsCustomerLoggedIn } from '../store/features/auth/authSlice';

// Styled Components
const HeroBanner = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(8, 2),
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  backgroundImage: 'url("https://images.unsplash.com/photo-1506677513809-d4b1e5737cca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80")',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  borderRadius: '0 0 12px 12px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: alpha(theme.palette.primary.dark, 0.4),
    borderRadius: 'inherit',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
}));

const Section = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  paddingTop: theme.spacing(4),
  borderTop: `1px solid ${theme.palette.divider}`,
  '&:first-of-type': {
      borderTop: 'none',
      paddingTop: 0, 
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  elevation: 1,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4],
  }
}));

// --- HomePage Component --- 
const HomePage: React.FC = () => {
  const [fromStation, setFromStation] = useState<string>('');
  const [toStation, setToStation] = useState<string>('');
  const [searchDate, setSearchDate] = useState<Date | null>(new Date());
  const isCustomerLoggedIn = useAppSelector(selectIsCustomerLoggedIn);
  const navigate = useNavigate();

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const searchData = {
          from: fromStation,
          to: toStation,
          date: searchDate ? searchDate.toLocaleDateString('bg-BG') : null,
      };
      console.log('Navigating to search results with:', searchData);
      navigate('/search-results', { state: searchData });
  };

  return (
    <Box sx={{ backgroundColor: '#fcfcfc' }}>
      {/* Hero Banner */}
      <HeroBanner>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0,0,0,0.5)', fontWeight: 700 }}>
            Пътувайте изгодно с БДЖ!
          </Typography>
          <Typography variant="h6" component="p" sx={{ mb: 3, color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', fontWeight: 400 }}>
            Международно билетоиздаване
          </Typography>
        </Container>
      </HeroBanner>

      <Container maxWidth="lg">
        {/* News Section */}
        <Section>
          <Typography variant="h5" component="h2" gutterBottom><CampaignIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Новини и съобщения</Typography>
          <Grid container spacing={0}>
            <Box sx={{ width: '100%', p: 1.5 }}> 
              <StyledCard>
                <Box sx={{ flexGrow: 1, p: 2}}>
                  <Typography variant="h6" component="h3">Промени в разписанието</Typography>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom><CalendarTodayIcon sx={{ fontSize: 'inherit', mr: 0.5 }} /> 05.04.2025</Typography>
                  <Typography variant="body2">Във връзка с ремонтни дейности по жп линията София-Пловдив...</Typography>
                </Box>
                <CardActions>
                  <Button 
                    href="#" 
                    sx={{ 
                      padding: '8px 12px', 
                      minWidth: 'auto', 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      gap: 1,
                      textTransform: 'none'
                    }}
                  >
                    Прочети повече <ArrowForwardIcon fontSize="small" />
                  </Button>
                </CardActions>
              </StyledCard>
            </Box>
          </Grid>
        </Section>

      </Container>
    </Box>
  );
};

export default HomePage; 