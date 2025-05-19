import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  FormControl,
  Button,
  Divider,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // For adding stock
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // For removing stock

// Mock data for available goods (shared)
interface Good {
  id: string;
  name: string;
  price: number;
  stock: number; 
}

const AVAILABLE_GOODS: Good[] = [
  { id: 'g1', name: 'Вестник "Стандарт"', price: 2.50, stock: 50 },
  { id: 'g2', name: 'Минерална вода 0.5л', price: 1.20, stock: 100 },
  { id: 'g3', name: 'Кроасан', price: 1.80, stock: 30 },
  { id: 'g4', name: 'Списание "Тема"', price: 5.00, stock: 25 },
  { id: 'g5', name: 'Дъвки', price: 0.90, stock: 80 },
];

interface CartItem extends Good {
  quantity: number;
}

const SellGoods: React.FC = () => {
  const [selectedGood, setSelectedGood] = useState<Good | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddGood = () => {
    if (!selectedGood || quantity <= 0) return;
    if (quantity > selectedGood.stock) {
      // Handle insufficient stock error
      console.error('Insufficient stock for', selectedGood.name);
      return; 
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === selectedGood.id);
      if (existingItemIndex > -1) {
        // Update quantity if item already in cart
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // Add new item to cart
        return [...prevCart, { ...selectedGood, quantity }];
      }
    });
    setSelectedGood(null); // Clear selection
    setQuantity(1);      // Reset quantity
  };

  const handleRemoveItem = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const handleSell = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    // Simulate sale process (API call, fiscal receipt)
    const total = calculateTotal();
    console.log('Selling goods:', cart, 'Total:', total);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('--- PRINTING FISCAL RECEIPT (Goods) ---');
    // TODO: Update actual stock based on sold items (API call)
    setCart([]); // Clear cart after successful sale
    setLoading(false);
  };

  const handleCancel = () => {
    setSelectedGood(null);
    setQuantity(1);
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Продажба на стоки
      </Typography>
      
      {/* Goods Selection */} 
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 3 }}>
        <Autocomplete
          options={AVAILABLE_GOODS}
          getOptionLabel={(option) => `${option.name} (${option.price.toFixed(2)} лв.) - Нал: ${option.stock}`}
          value={selectedGood}
          onChange={(_event, newValue) => {
            setSelectedGood(newValue);
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => 
            <TextField {...params} label="Избор на стока" size="small" />
          }
          sx={{ flexGrow: 1 }}
          disabled={loading}
        />
        <TextField
          label="Количество"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          size="small"
          InputProps={{ inputProps: { min: 1 } }}
          sx={{ width: 100 }}
          disabled={!selectedGood || loading}
        />
        <Button
          variant="contained"
          onClick={handleAddGood}
          disabled={!selectedGood || quantity <= 0 || loading}
          startIcon={<AddShoppingCartIcon />}
          sx={{ height: '40px' }} // Align height with TextField
        >
          Добави
        </Button>
      </Box>

      {/* Cart/List */} 
      {cart.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Кошница:</Typography>
          <List dense sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            {cart.map((item) => (
              <ListItem key={item.id}>
                <ListItemText 
                  primary={`${item.name} x ${item.quantity}`}
                  secondary={`${(item.price * item.quantity).toFixed(2)} лв.`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.id)} size="small" disabled={loading}>
                    <DeleteIcon fontSize="small"/>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            <Divider />
            <ListItem sx={{ fontWeight: 'bold' }}>
              <ListItemText primary="Общо:" />
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{calculateTotal().toFixed(2)} лв.</Typography>
            </ListItem>
          </List>
        </Box>
      )}

      {/* Actions */} 
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button 
          variant="outlined" 
          onClick={handleCancel} 
          disabled={loading}
        >
          Отказ
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSell} 
          disabled={cart.length === 0 || loading}
          startIcon={<PointOfSaleIcon />}
        >
          {loading ? 'Продажба...' : 'Продай'}
        </Button>
      </Box>
    </Box>
  );
};

type StockOperation = 'add' | 'remove';

const ManageStock: React.FC = () => {
  const [selectedGood, setSelectedGood] = useState<Good | null>(null);
  const [operation, setOperation] = useState<StockOperation>('add');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExecuteStockOperation = async () => {
    if (!selectedGood || quantity <= 0) return;
    setError(null);
    setSuccess(null);

    if (operation === 'remove' && quantity > selectedGood.stock) {
      setError(`Недостатъчна наличност (${selectedGood.stock}) за отписване на ${quantity} бр.`);
      return;
    }

    setLoading(true);
    const operationText = operation === 'add' ? 'Заскладяване' : 'Отписване';
    console.log(`${operationText}:`, { 
      good: selectedGood.name, 
      quantity: quantity, 
      operation: operation 
    });
    
    // Simulate API call to update stock
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock update of local stock for visual feedback (in real app, data would refetch)
    const goodIndex = AVAILABLE_GOODS.findIndex(g => g.id === selectedGood.id);
    if (goodIndex > -1) {
        if (operation === 'add') AVAILABLE_GOODS[goodIndex].stock += quantity;
        else AVAILABLE_GOODS[goodIndex].stock -= quantity;
    }
    
    setSuccess(`${operationText} на ${quantity} бр. от "${selectedGood.name}" успешно.`);
    
    // Reset form after success
    setSelectedGood(null);
    setQuantity(1);
    setOperation('add');
    setLoading(false);
    
    // Clear success message after a few seconds
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleCancel = () => {
    setSelectedGood(null);
    setQuantity(1);
    setOperation('add');
    setError(null);
    setSuccess(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Управление на склад
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
         <Autocomplete
          options={AVAILABLE_GOODS}
          getOptionLabel={(option) => `${option.name} - Наличност: ${option.stock}`}
          value={selectedGood}
          onChange={(_event, newValue) => {
            setSelectedGood(newValue);
            setError(null); // Clear error on new selection
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => 
            <TextField {...params} label="Избор на стока" size="small" required />
          }
          sx={{ flexGrow: 1 }}
          disabled={loading}
        />

        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>Операция</FormLabel>
          <RadioGroup
            row
            aria-label="stock-operation"
            name="stockOperation"
            value={operation}
            onChange={(e) => {
                setOperation(e.target.value as StockOperation);
                setError(null); // Clear error on operation change
            }}
          >
            <FormControlLabel value="add" control={<Radio size="small" />} label="Заскладяване" disabled={loading} />
            <FormControlLabel value="remove" control={<Radio size="small" />} label="Отписване" disabled={loading} />
          </RadioGroup>
        </FormControl>

        <TextField
          label="Количество"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          size="small"
          InputProps={{ inputProps: { min: 1 } }}
          required
          disabled={!selectedGood || loading}
        />

        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 1 }}>{success}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
          <Button 
            variant="outlined" 
            onClick={handleCancel} 
            disabled={loading}
          >
            Отказ
          </Button>
          <Button 
            variant="contained" 
            onClick={handleExecuteStockOperation} 
            disabled={!selectedGood || quantity <= 0 || loading}
            startIcon={operation === 'add' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          >
            {loading ? 'Обработка...' : 'Изпълни'}
          </Button>
        </Box>
      </Box>
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
      id={`goods-tabpanel-${index}`}
      aria-labelledby={`goods-tab-${index}`}
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

// Consistent StyledTabs 
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(0), // No margin below tabs
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
  },
}));

// Consistent StyledTab
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

const GoodsOperations: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper sx={{ p: 0, overflow: 'hidden' }}> {/* Wrapper Paper with no internal padding */}
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="goods operations tabs"
          variant="fullWidth" // Use fullWidth for two tabs
        >
          <StyledTab label="Продажба" />
          <StyledTab label="Склад" />
        </StyledTabs>
        
        <TabPanel value={value} index={0}>
          <SellGoods />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ManageStock />
        </TabPanel>
    </Paper>
  );
};

export default GoodsOperations; 