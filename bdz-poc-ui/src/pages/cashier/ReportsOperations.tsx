import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { bg } from 'date-fns/locale/bg';

const REPORT_TYPES = [
  { value: 'summary', label: 'Обобщен периодичен отчет' },
  { value: 'detailed', label: 'Детайлен периодичен отчет' },
  { value: 'fiscal', label: 'Фискален периодичен отчет' },
];

const DailyReport: React.FC = () => {
  const [reportType, setReportType] = useState('');
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setGeneratedReport(null);
    // Simulate report generation
    console.log('Generating Daily Report:', reportType);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const reportContent = `--- Дневен отчет (${REPORT_TYPES.find(rt => rt.value === reportType)?.label}) ---\nДата: ${new Date().toLocaleDateString('bg-BG')}\nКасиер: 001\n...
Детайли за продажби...
Общо: 123.45 лв.\n--------------------`;
    setGeneratedReport(reportContent);
    setLoading(false);
  };

  const handlePrint = () => {
    if (generatedReport) {
      console.log('--- PRINTING ---\n' + generatedReport + '\n--- END PRINTING ---');
      // In a real app, this would trigger the browser's print dialog
      // window.print(); or use a library for better print formatting
    }
  };

  const handleCancel = () => {
    setReportType('');
    setGeneratedReport(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Дневен отчет
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth required variant="outlined" size="small">
          <InputLabel id="daily-report-type-label">Вид отчет</InputLabel>
          <Select
            labelId="daily-report-type-label"
            value={reportType}
            label="Вид отчет"
            onChange={(e: SelectChangeEvent) => setReportType(e.target.value)}
            disabled={loading || !!generatedReport}
          >
            {REPORT_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            variant="outlined" 
            onClick={handleCancel} 
            disabled={loading}
          >
            {generatedReport ? 'Нов отчет' : 'Отказ'}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleExecute} 
            disabled={!reportType || loading || !!generatedReport}
          >
            {loading ? 'Генериране...' : 'Изпълни'}
          </Button>
        </Box>
      </Box>

      {generatedReport && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" gutterBottom>Генериран отчет:</Typography>
          <Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap', fontFamily: 'monospace', maxHeight: 300, overflowY: 'auto' }}>
            {generatedReport}
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" onClick={handlePrint}>
              Отпечатай
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const PeriodicReport: React.FC = () => {
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setGeneratedReport(null);
    // Simulate report generation
    console.log('Generating Periodic Report:', { reportType, startDate, endDate });
    await new Promise(resolve => setTimeout(resolve, 1000));
    const reportContent = `--- Периодичен отчет (${REPORT_TYPES.find(rt => rt.value === reportType)?.label}) ---\nПериод: ${startDate?.toLocaleDateString('bg-BG')} - ${endDate?.toLocaleDateString('bg-BG')}\nКасиер: 001\n...
Детайли за продажби...
Общо: 456.78 лв.\n--------------------`;
    setGeneratedReport(reportContent);
    setLoading(false);
  };

  const handlePrint = () => {
    if (generatedReport) {
      console.log('--- PRINTING ---\n' + generatedReport + '\n--- END PRINTING ---');
    }
  };

  const handleCancel = () => {
    setReportType('');
    setStartDate(null);
    setEndDate(null);
    setGeneratedReport(null);
  };

  const isFormValid = reportType !== '' && startDate !== null && endDate !== null && startDate <= endDate;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Периодичен отчет
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <DatePicker
              label="Начална дата"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { size: "small", required: true } }}
              disabled={loading || !!generatedReport}
              maxDate={endDate || undefined}
            />
            <DatePicker
              label="Крайна дата"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { size: "small", required: true } }}
              disabled={loading || !!generatedReport}
              minDate={startDate || undefined}
            />
          </Box>
        </LocalizationProvider>

        <FormControl fullWidth required variant="outlined" size="small">
          <InputLabel id="periodic-report-type-label">Вид отчет</InputLabel>
          <Select
            labelId="periodic-report-type-label"
            value={reportType}
            label="Вид отчет"
            onChange={(e: SelectChangeEvent) => setReportType(e.target.value)}
            disabled={loading || !!generatedReport}
          >
            {REPORT_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            variant="outlined" 
            onClick={handleCancel} 
            disabled={loading}
          >
            {generatedReport ? 'Нов отчет' : 'Отказ'}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleExecute} 
            disabled={!isFormValid || loading || !!generatedReport}
          >
            {loading ? 'Генериране...' : 'Изпълни'}
          </Button>
        </Box>
      </Box>

      {generatedReport && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" gutterBottom>Генериран отчет:</Typography>
          <Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap', fontFamily: 'monospace', maxHeight: 300, overflowY: 'auto' }}>
            {generatedReport}
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" onClick={handlePrint}>
              Отпечатай
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const KLEN_REPORT_TYPES = [
  { value: 'by_date', label: 'По дати' },
  { value: 'by_receipt', label: 'По номера на бележки' },
];

const KlenReport: React.FC = () => {
  const [reportType, setReportType] = useState('by_date'); // Default to date range
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startReceipt, setStartReceipt] = useState('');
  const [endReceipt, setEndReceipt] = useState('');
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setGeneratedReport(null);
    const params = reportType === 'by_date' ? { startDate, endDate } : { startReceipt, endReceipt };
    console.log('Generating KLEN Report:', { reportType, ...params });
    await new Promise(resolve => setTimeout(resolve, 1000));
    let reportContent = `--- КЛЕН отчет (${KLEN_REPORT_TYPES.find(rt => rt.value === reportType)?.label}) ---\n`;
    if (reportType === 'by_date') {
      reportContent += `Период: ${startDate?.toLocaleDateString('bg-BG')} - ${endDate?.toLocaleDateString('bg-BG')}\n`;
    } else {
      reportContent += `Бележки: ${startReceipt} - ${endReceipt}\n`;
    }
    reportContent += `...
Детайли от КЛЕН...
--------------------`;
    setGeneratedReport(reportContent);
    setLoading(false);
  };

  const handlePrint = () => {
    if (generatedReport) {
      console.log('--- PRINTING ---\n' + generatedReport + '\n--- END PRINTING ---');
    }
  };

  const handleCancel = () => {
    // Keep reportType selection, reset others
    setStartDate(null);
    setEndDate(null);
    setStartReceipt('');
    setEndReceipt('');
    setGeneratedReport(null);
  };

  const isFormValid = () => {
    if (reportType === 'by_date') {
      return startDate !== null && endDate !== null && startDate <= endDate;
    } else {
      return startReceipt.trim() !== '' && endReceipt.trim() !== '';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        КЛЕН отчет
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth required variant="outlined" size="small">
          <InputLabel id="klen-report-type-label">Тип КЛЕН</InputLabel>
          <Select
            labelId="klen-report-type-label"
            value={reportType}
            label="Тип КЛЕН"
            onChange={(e: SelectChangeEvent) => setReportType(e.target.value)}
            disabled={loading || !!generatedReport}
          >
            {KLEN_REPORT_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {reportType === 'by_date' ? (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Начална дата"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { size: "small", required: true } }}
                disabled={loading || !!generatedReport}
                maxDate={endDate || undefined}
              />
              <DatePicker
                label="Крайна дата"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { size: "small", required: true } }}
                disabled={loading || !!generatedReport}
                minDate={startDate || undefined}
              />
            </Box>
          </LocalizationProvider>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="От бележка №"
              value={startReceipt}
              onChange={(e) => setStartReceipt(e.target.value)}
              required
              variant="outlined"
              size="small"
              disabled={loading || !!generatedReport}
              sx={{ flex: 1 }}
            />
            <TextField
              label="До бележка №"
              value={endReceipt}
              onChange={(e) => setEndReceipt(e.target.value)}
              required
              variant="outlined"
              size="small"
              disabled={loading || !!generatedReport}
              sx={{ flex: 1 }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            variant="outlined" 
            onClick={handleCancel} 
            disabled={loading}
          >
            {generatedReport ? 'Нов отчет' : 'Отказ'}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleExecute} 
            disabled={!isFormValid() || loading || !!generatedReport}
          >
            {loading ? 'Генериране...' : 'Изпълни'}
          </Button>
        </Box>
      </Box>

      {generatedReport && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" gutterBottom>Генериран отчет:</Typography>
          <Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap', fontFamily: 'monospace', maxHeight: 300, overflowY: 'auto' }}>
            {generatedReport}
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" onClick={handlePrint}>
              Отпечатай
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const ZReport: React.FC = () => {
  const [reportDate, setReportDate] = useState<Date | null>(new Date()); // Default to today
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!reportDate) return;
    setLoading(true);
    setGeneratedReport(null);
    console.log('Generating Z Report for:', reportDate?.toLocaleDateString('bg-BG'));
    await new Promise(resolve => setTimeout(resolve, 1000));
    const reportContent = `--- Z ОТЧЕТ ---\nДата: ${reportDate?.toLocaleDateString('bg-BG')}\nФискално устройство: FP-12345\n...
Дневни суми, данъци и т.н...
Общо: 987.65 лв.\n--------------------`;
    setGeneratedReport(reportContent);
    setLoading(false);
  };

  const handlePrint = () => {
    if (generatedReport) {
      console.log('--- PRINTING ---\n' + generatedReport + '\n--- END PRINTING ---');
    }
  };

  const handleCancel = () => {
    setReportDate(new Date()); // Reset to today
    setGeneratedReport(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Z отчет
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
          <DatePicker
            label="Дата на отчет"
            value={reportDate}
            onChange={(newValue) => setReportDate(newValue)}
            slotProps={{ textField: { size: "small", required: true } }}
            disabled={loading || !!generatedReport}
          />
        </LocalizationProvider>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            variant="outlined" 
            onClick={handleCancel} 
            disabled={loading}
          >
            {generatedReport ? 'Нов отчет' : 'Отказ'}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleExecute} 
            disabled={!reportDate || loading || !!generatedReport}
          >
            {loading ? 'Генериране...' : 'Изпълни'}
          </Button>
        </Box>
      </Box>

      {generatedReport && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" gutterBottom>Генериран отчет:</Typography>
          <Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap', fontFamily: 'monospace', maxHeight: 300, overflowY: 'auto' }}>
            {generatedReport}
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" onClick={handlePrint}>
              Отпечатай
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

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
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}> {/* Add padding inside the panel */}
          {children}
        </Box>
      )}
    </div>
  );
}

// Consistent StyledTabs from TicketOperations
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(0), // No margin below tabs
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

const ReportsOperations: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper sx={{ p: 0, overflow: 'hidden' }}> {/* Wrapper Paper with no internal padding */}
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="report operations tabs"
          variant="scrollable" 
          scrollButtons="auto"
        >
          <StyledTab label="Дневен" />
          <StyledTab label="Периодичен" />
          <StyledTab label="КЛЕН" />
          <StyledTab label="Z отчет" />
        </StyledTabs>
        
        <TabPanel value={value} index={0}>
          <DailyReport />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PeriodicReport />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <KlenReport />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ZReport />
        </TabPanel>
    </Paper>
  );
};

export default ReportsOperations; 