import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Grid,
  IconButton,
  Button,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Tab,
  Tabs,
  ListItemButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Stack,
  Chip,
  Autocomplete,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  FormLabel,
  FormGroup,
  Checkbox,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  AttachMoney as FinanceIcon,
  VerifiedUser as ValidationIcon,
  Train as CarrierIcon,
  SwapHoriz as ClearingIcon,
  TrendingUp as MarketingIcon,
  DashboardCustomize as CustomIcon,
  Save as TemplateIcon,
  Download as ExportIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  FilterList as FilterIcon,
  ViewList as TableIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, subDays, subMonths } from 'date-fns';
import { bg } from 'date-fns/locale/bg';

// Types
interface ReportCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface ReportParameter {
  id: string;
  label: string;
  type: 'date' | 'select' | 'multiselect' | 'number' | 'text';
  options?: string[];
  required: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  parameters: ReportParameter[];
  visualization: 'table' | 'chart' | 'combined';
}

// Additional types
interface ReportFormData {
  [key: string]: any;
}

interface ReportConfig {
  id: string;
  name: string;
  category: string;
  parameters: ReportParameter[];
  defaultVisualization: 'table';
  description: string;
}

interface ReportData {
  id: string;
  [key: string]: any;
}

// Constants
const DRAWER_WIDTH = 280;

const reportCategories: ReportCategory[] = [
  { id: 'operational', label: 'Операционни отчети', icon: <AssessmentIcon />, description: 'Отчети за продажби, резервации и анулирания' },
  { id: 'financial', label: 'Финансови отчети', icon: <FinanceIcon />, description: 'Отчети за приходи, възстановявания и допълнителни услуги' },
  { id: 'validation', label: 'Отчети за валидации', icon: <ValidationIcon />, description: 'Отчети за контрол и нередности' },
  { id: 'carrier', label: 'Отчети по превозвачи', icon: <CarrierIcon />, description: 'Отчети за продажби и взаиморазчети с превозвачи' },
  { id: 'clearing', label: 'Отчети за клиринг (UIC)', icon: <ClearingIcon />, description: 'UIC стандартизирани отчети и клирингови данни' },
  { id: 'marketing', label: 'Маркетингови анализи', icon: <MarketingIcon />, description: 'Анализ на клиентско поведение и пазарен дял' },
  { id: 'custom', label: 'Персонализирани отчети', icon: <CustomIcon />, description: 'Създаване на персонализирани анализи' },
  { id: 'templates', label: 'Запазени шаблони', icon: <TemplateIcon />, description: 'Достъп до запазени шаблони за отчети' },
];

// Mock report configurations
const reportConfigs: ReportConfig[] = [
  {
    id: 'sales-report',
    name: 'Отчет за продажби на международни билети',
    category: 'operational',
    description: 'Детайлен анализ на продажбите на международни билети по различни критерии',
    defaultVisualization: 'table',
    parameters: [
      {
        id: 'dateRange',
        label: 'Времеви период',
        type: 'date',
        required: true,
      },
      {
        id: 'detailLevel',
        label: 'Ниво на детайлност',
        type: 'select',
        options: ['дневно', 'седмично', 'месечно'],
        required: true,
      },
      {
        id: 'groupBy',
        label: 'Групиране по',
        type: 'multiselect',
        options: ['превозвачи', 'маршрути', 'канали на продажба', 'класове пътуване'],
        required: true,
      },
      {
        id: 'filters',
        label: 'Филтри',
        type: 'multiselect',
        options: ['конкретни дестинации', 'специфични влакове', 'типове билети'],
        required: false,
      },
    ],
  },
  {
    id: 'financial-report',
    name: 'Отчет за приходи от международни билети',
    category: 'financial',
    description: 'Финансов анализ на приходите от международни билети',
    defaultVisualization: 'table',
    parameters: [
      {
        id: 'dateRange',
        label: 'Времеви период',
        type: 'date',
        required: true,
      },
      {
        id: 'currency',
        label: 'Валута',
        type: 'select',
        options: ['BGN', 'EUR', 'USD'],
        required: true,
      },
      {
        id: 'groupBy',
        label: 'Групиране по',
        type: 'multiselect',
        options: ['превозвачи', 'маршрути', 'продукти', 'канали на продажба'],
        required: true,
      },
      {
        id: 'comparison',
        label: 'Сравнение с',
        type: 'select',
        options: ['предходен период', 'бюджет', 'предходна година'],
        required: false,
      },
    ],
  },
  // Add more report configurations as needed
];

// Mock data for sales report
const mockSalesData: ReportData[] = [
  {
    id: '1',
    date: '2024-03-01',
    carrier: 'BDZ',
    route: 'София - Белград',
    ticketsSold: 45,
    revenue: 4500,
    currency: 'BGN',
    salesChannel: 'Каса',
    travelClass: 'Втори клас',
  },
  {
    id: '2',
    date: '2024-03-01',
    carrier: 'BDZ',
    route: 'София - Солун',
    ticketsSold: 28,
    revenue: 2800,
    currency: 'BGN',
    salesChannel: 'Онлайн',
    travelClass: 'Първи клас',
  },
  {
    id: '3',
    date: '2024-03-01',
    carrier: 'ЖСМ',
    route: 'София - Скопие',
    ticketsSold: 32,
    revenue: 3200,
    currency: 'BGN',
    salesChannel: 'Каса',
    travelClass: 'Втори клас',
  },
  {
    id: '4',
    date: '2024-03-02',
    carrier: 'BDZ',
    route: 'София - Белград',
    ticketsSold: 38,
    revenue: 3800,
    currency: 'BGN',
    salesChannel: 'Онлайн',
    travelClass: 'Първи клас',
  },
  {
    id: '5',
    date: '2024-03-02',
    carrier: 'ЖСМ',
    route: 'София - Скопие',
    ticketsSold: 25,
    revenue: 2500,
    currency: 'BGN',
    salesChannel: 'Каса',
    travelClass: 'Втори клас',
  },
];

// Mock data for financial report
const mockFinancialData: ReportData[] = [
  {
    id: '1',
    date: '2024-03-01',
    carrier: 'BDZ',
    route: 'София - Белград',
    revenue: 4500,
    currency: 'BGN',
    expenses: 2000,
    profit: 2500,
    product: 'Билет',
    salesChannel: 'Каса',
  },
  {
    id: '2',
    date: '2024-03-01',
    carrier: 'BDZ',
    route: 'София - Солун',
    revenue: 2800,
    currency: 'BGN',
    expenses: 1200,
    profit: 1600,
    product: 'Билет',
    salesChannel: 'Онлайн',
  },
  {
    id: '3',
    date: '2024-03-01',
    carrier: 'ЖСМ',
    route: 'София - Скопие',
    revenue: 3200,
    currency: 'BGN',
    expenses: 1500,
    profit: 1700,
    product: 'Билет',
    salesChannel: 'Каса',
  },
  {
    id: '4',
    date: '2024-03-02',
    carrier: 'BDZ',
    route: 'София - Белград',
    revenue: 3800,
    currency: 'BGN',
    expenses: 1800,
    profit: 2000,
    product: 'Билет',
    salesChannel: 'Онлайн',
  },
  {
    id: '5',
    date: '2024-03-02',
    carrier: 'ЖСМ',
    route: 'София - Скопие',
    revenue: 2500,
    currency: 'BGN',
    expenses: 1100,
    profit: 1400,
    product: 'Билет',
    salesChannel: 'Каса',
  },
];

// Update column definitions to be simpler
interface TableColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string;
}

const salesColumns: TableColumn[] = [
  { id: 'date', label: 'Дата', minWidth: 120 },
  { id: 'carrier', label: 'Превозвач', minWidth: 120 },
  { id: 'route', label: 'Маршрут', minWidth: 180 },
  { 
    id: 'ticketsSold', 
    label: 'Продадени билети', 
    minWidth: 150,
    align: 'right',
  },
  { 
    id: 'revenue', 
    label: 'Приход', 
    minWidth: 120,
    align: 'right',
    format: (value: number) => `${value} BGN`,
  },
  { id: 'salesChannel', label: 'Канал на продажба', minWidth: 150 },
  { id: 'travelClass', label: 'Клас', minWidth: 120 },
];

const financialColumns: TableColumn[] = [
  { id: 'date', label: 'Дата', minWidth: 120 },
  { id: 'carrier', label: 'Превозвач', minWidth: 120 },
  { id: 'route', label: 'Маршрут', minWidth: 180 },
  { 
    id: 'revenue', 
    label: 'Приход', 
    minWidth: 120,
    align: 'right',
    format: (value: number) => `${value} BGN`,
  },
  { 
    id: 'expenses', 
    label: 'Разходи', 
    minWidth: 120,
    align: 'right',
    format: (value: number) => `${value} BGN`,
  },
  { 
    id: 'profit', 
    label: 'Печалба', 
    minWidth: 120,
    align: 'right',
    format: (value: number) => `${value} BGN`,
  },
  { id: 'product', label: 'Продукт', minWidth: 120 },
  { id: 'salesChannel', label: 'Канал на продажба', minWidth: 150 },
];

// Styled components
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.default,
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: DRAWER_WIDTH,
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
  },
}));

const ReportHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const ReportConfig = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const ReportVisualization = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  minHeight: 400,
}));

// Form field components
const DateRangeField: React.FC<{
  label: string;
  value: { start: Date | null; end: Date | null };
  onChange: (value: { start: Date | null; end: Date | null }) => void;
  required?: boolean;
}> = ({ label, value, onChange, required }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
        <DatePicker
          label={`${label} от`}
          value={value.start}
          onChange={(newValue) => onChange({ ...value, start: newValue })}
          slotProps={{ textField: { fullWidth: true, required, size: "small" } }}
        />
        <DatePicker
          label={`${label} до`}
          value={value.end}
          onChange={(newValue) => onChange({ ...value, end: newValue })}
          slotProps={{ textField: { fullWidth: true, required, size: "small" } }}
        />
      </Stack>
    </LocalizationProvider>
  );
};

const SelectField: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
  multiple?: boolean;
}> = ({ label, value, options, onChange, required, multiple }) => {
  if (multiple) {
    return (
      <Autocomplete
        multiple
        options={options}
        value={value ? value.split(',') : []}
        onChange={(_, newValue) => onChange(newValue.join(','))}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            required={required}
            fullWidth
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option}
              {...getTagProps({ index })}
              key={option}
            />
          ))
        }
      />
    );
  }

  return (
    <FormControl fullWidth required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Main component
const ReportsAndStatistics: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedCategory, setSelectedCategory] = useState<string>('operational');
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [formData, setFormData] = useState<ReportFormData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: string) => {
    // TODO: Implement export functionality
    handleExportClose();
  };

  const selectedReport = reportConfigs.find(
    (config) => config.category === selectedCategory
  );

  const handleFormChange = (parameterId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parameterId]: value,
    }));
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement report generation
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Generating report with data:', formData);
    } catch (err) {
      setError('Възникна грешка при генериране на отчета');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Update report data when category changes
  React.useEffect(() => {
    if (selectedCategory === 'operational') {
      setReportData(mockSalesData);
      setColumns(salesColumns);
    } else if (selectedCategory === 'financial') {
      setReportData(mockFinancialData);
      setColumns(financialColumns);
    } else {
      setReportData([]);
      setColumns([]);
    }
  }, [selectedCategory]);

  const renderFormField = (parameter: ReportParameter) => {
    switch (parameter.type) {
      case 'date':
        return (
          <DateRangeField
            label={parameter.label}
            value={formData[parameter.id] || { start: null, end: null }}
            onChange={(value) => handleFormChange(parameter.id, value)}
            required={parameter.required}
          />
        );
      case 'select':
        return (
          <SelectField
            label={parameter.label}
            value={formData[parameter.id] || ''}
            options={parameter.options || []}
            onChange={(value) => handleFormChange(parameter.id, value)}
            required={parameter.required}
          />
        );
      case 'multiselect':
        return (
          <SelectField
            label={parameter.label}
            value={formData[parameter.id] || ''}
            options={parameter.options || []}
            onChange={(value) => handleFormChange(parameter.id, value)}
            required={parameter.required}
            multiple
          />
        );
      case 'number':
        return (
          <TextField
            label={parameter.label}
            type="number"
            value={formData[parameter.id] || ''}
            onChange={(e) => handleFormChange(parameter.id, e.target.value)}
            required={parameter.required}
            fullWidth
            size="small"
          />
        );
      case 'text':
        return (
          <TextField
            label={parameter.label}
            value={formData[parameter.id] || ''}
            onChange={(e) => handleFormChange(parameter.id, e.target.value)}
            required={parameter.required}
            fullWidth
            size="small"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Отчети и статистики
      </Typography>

      {/* Main Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {reportCategories.map((category) => (
            <Tab
              key={category.id}
              value={category.id}
              icon={category.icon}
              label={category.label}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Report Header */}
      <ReportHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="h6" component="h2">
              {reportCategories.find(c => c.id === selectedCategory)?.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {reportCategories.find(c => c.id === selectedCategory)?.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<ExportIcon />}
              onClick={handleExportClick}
            >
              Експортирай
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleExportClose}
            >
              <MenuItem onClick={() => handleExport('pdf')}>PDF</MenuItem>
              <MenuItem onClick={() => handleExport('excel')}>Excel</MenuItem>
              <MenuItem onClick={() => handleExport('csv')}>CSV</MenuItem>
              <MenuItem onClick={() => handleExport('uic')}>UIC формат</MenuItem>
            </Menu>
            <IconButton>
              <PrintIcon />
            </IconButton>
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
      </ReportHeader>

      {/* Report View Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<FilterIcon />} label="Параметри" />
          <Tab icon={<TableIcon />} label="Таблица" />
        </Tabs>
      </Paper>

      {/* Report Content */}
      {selectedTab === 0 && (
        <ReportConfig>
          {selectedReport && (
            <Stack spacing={3}>
              <Typography variant="h6" gutterBottom>
                {selectedReport.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedReport.description}
              </Typography>
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
              <Stack spacing={2}>
                {selectedReport.parameters.map((parameter) => (
                  <Box key={parameter.id}>
                    {renderFormField(parameter)}
                  </Box>
                ))}
              </Stack>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleGenerateReport}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Генериране...' : 'Генерирай отчет'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<TemplateIcon />}
                >
                  Запази като шаблон
                </Button>
              </Box>
            </Stack>
          )}
        </ReportConfig>
      )}

      {selectedTab === 1 && (
        <ReportVisualization>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number'
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={reportData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Редове на страница:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} от ${count}`
              }
            />
          </Paper>
        </ReportVisualization>
      )}
    </Box>
  );
};

export default ReportsAndStatistics; 