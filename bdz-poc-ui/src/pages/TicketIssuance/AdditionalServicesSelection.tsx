import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Tooltip,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  Alert
} from '@mui/material';
import {
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  Luggage as LuggageIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCurrentTicket, setAdditionalServices, AdditionalService } from '../../store/features/ticket/ticketSlice';

// Types
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  pricePerPassenger: boolean;
  image?: string;
  icon?: React.ReactNode;
  category: ServiceCategory;
  options?: ServiceOption[];
  maxQuantity?: number;
  available: boolean;
  incompatibleWith?: string[];
  features?: string[];
  restrictions?: string[];
}

interface ServiceOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

type ServiceCategory = 'accommodation' | 'food' | 'luggage' | 'insurance' | 'assistance';

interface CategoryInfo {
  id: ServiceCategory;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface SelectedService {
  serviceId: string;
  quantity: number;
  selectedOptions?: string[];
  totalPrice: number;
}

// Mock data for service categories
const SERVICE_CATEGORIES: CategoryInfo[] = [
  {
    id: 'luggage',
    name: 'Багаж и транспорт',
    description: 'Допълнителни опции за багаж и превоз на специални предмети',
    icon: <LuggageIcon />
  },
  {
    id: 'accommodation',
    name: 'Специални вагони и места',
    description: 'Изберете удобен спален вагон или специално място за вашето пътуване',
    icon: <HotelIcon />
  },
  {
    id: 'food',
    name: 'Хранене и кетъринг',
    description: 'Поръчайте храна и напитки за вашето пътуване',
    icon: <RestaurantIcon />
  },
  {
    id: 'assistance',
    name: 'Асистенция за пътници',
    description: 'Специална помощ и подкрепа по време на пътуването',
    icon: <SupportIcon />
  },
  {
    id: 'insurance',
    name: 'Застраховки и допълнителни защити',
    description: 'Защита и осигуровки за вашето пътуване',
    icon: <SecurityIcon />
  }
];

// Mock data for services
const SERVICES: Service[] = [
  // Luggage services
  {
    id: 'bicycle',
    name: 'Превоз на велосипед',
    description: 'Специално място за превоз на велосипед',
    price: 15,
    pricePerPassenger: false,
    category: 'luggage',
    icon: <LuggageIcon />,
    available: true,
    maxQuantity: 1,
    restrictions: [
      'Максимални размери: 180x80x40 см',
      'Максимално тегло: 25 кг',
      'Необходима предварителна резервация'
    ]
  },
  {
    id: 'pet',
    name: 'Превоз на домашен любимец',
    description: 'Специално място за превоз на малък домашен любимец в транспортен бокс',
    price: 20,
    pricePerPassenger: false,
    category: 'luggage',
    icon: <LuggageIcon />,
    available: true,
    maxQuantity: 1,
    restrictions: [
      'Максимално тегло на животното с бокса: 10 кг',
      'Необходима валидна здравна книжка',
      'Транспортен бокс с размери до 60x40x40 см',
      'Предварителна резервация задължителна'
    ]
  },
  // Accommodation services
  {
    id: 'single_cabin',
    name: 'Единично купе в спален вагон',
    description: 'Приватно купе с единично легло, тоалетна и душ',
    price: 120,
    pricePerPassenger: true,
    category: 'accommodation',
    icon: <HotelIcon />,
    available: true,
    features: [
      'Приватно купе',
      'Единично легло',
      'Тоалетна и душ',
      'Безплатен WiFi',
      'Закуска включена'
    ]
  },
  {
    id: 'double_cabin',
    name: 'Двойно купе в спален вагон',
    description: 'Приватно купе с две легла, тоалетна и душ',
    price: 180,
    pricePerPassenger: true,
    category: 'accommodation',
    icon: <HotelIcon />,
    available: true,
    features: [
      'Приватно купе',
      'Две легла',
      'Тоалетна и душ',
      'Безплатен WiFi',
      'Закуска включена'
    ]
  },
  // Food services
  {
    id: 'standard_lunch',
    name: 'Стандартен обяд',
    description: 'Традиционно меню с основно ястие, салата и десерт',
    price: 25,
    pricePerPassenger: true,
    category: 'food',
    icon: <RestaurantIcon />,
    available: true,
    features: [
      'Основно ястие',
      'Салата',
      'Десерт',
      'Напитка по избор',
      'Хлебче'
    ]
  },
  // Assistance services
  {
    id: 'mobility_assistance',
    name: 'Асистенция за пътници с ограничена подвижност',
    description: 'Помощ при качване, слизане и прекачване',
    price: 0,
    pricePerPassenger: true,
    category: 'assistance',
    icon: <SupportIcon />,
    available: true,
    features: [
      'Помощ при качване и слизане',
      'Асистенция при прекачване',
      'Помощ с багаж',
      'Специален транспорт в гарата'
    ]
  },
  // Insurance services
  {
    id: 'basic_insurance',
    name: 'Базова туристическа застраховка',
    description: 'Основно покритие за медицински разходи и багаж',
    price: 10,
    pricePerPassenger: true,
    category: 'insurance',
    icon: <SecurityIcon />,
    available: true,
    features: [
      'Медицински разходи до 10,000 EUR',
      'Покритие на багаж до 1,000 EUR',
      'Правна помощ',
      '24/7 поддръжка'
    ]
  }
];

interface AdditionalServicesSelectionProps {
  onComplete: () => void;
  onBack: () => void;
}

export const AdditionalServicesSelection: React.FC<AdditionalServicesSelectionProps> = ({
  onComplete,
  onBack
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const currentTicket = useAppSelector(selectCurrentTicket);
  
  // State
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('luggage');
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [mobileCategorySelect, setMobileCategorySelect] = useState<string>('luggage');
  
  // Calculate totals
  const subtotal = selectedServices.reduce((sum, service) => sum + service.totalPrice, 0);
  const ticketPrice = currentTicket?.totalPrice || 0;
  const total = ticketPrice;

  // Handlers
  const handleCategoryChange = (event: React.SyntheticEvent, newValue: ServiceCategory) => {
    setActiveCategory(newValue);
  };

  const handleMobileCategoryChange = (event: SelectChangeEvent) => {
    setMobileCategorySelect(event.target.value);
    setActiveCategory(event.target.value as ServiceCategory);
  };

  const handleServiceSelect = (service: Service) => {
    const existingService = selectedServices.find(s => s.serviceId === service.id);
    
    if (existingService) {
      // Remove service if already selected
      const newServices = selectedServices.filter(s => s.serviceId !== service.id);
      setSelectedServices(newServices);
      dispatch(setAdditionalServices(newServices.map(s => ({
        id: s.serviceId,
        name: SERVICES.find(serv => serv.id === s.serviceId)?.name || '',
        category: SERVICES.find(serv => serv.id === s.serviceId)?.category || 'accommodation',
        quantity: s.quantity,
        selectedOptions: s.selectedOptions,
        totalPrice: s.totalPrice
      }))));
    } else {
      // Add new service
      const newService: SelectedService = {
        serviceId: service.id,
        quantity: 1,
        totalPrice: service.price,
        selectedOptions: []
      };
      
      // Check for incompatible services
      const incompatibleServices = selectedServices.filter(s => 
        SERVICES.find(service => service.id === s.serviceId)?.incompatibleWith?.includes(service.id)
      );
      
      let updatedServices = selectedServices;
      if (incompatibleServices.length > 0) {
        // Remove incompatible services
        updatedServices = selectedServices.filter(s => !incompatibleServices.some(is => is.serviceId === s.serviceId));
      }
      
      const finalServices = [...updatedServices, newService];
      setSelectedServices(finalServices);
      dispatch(setAdditionalServices(finalServices.map(s => ({
        id: s.serviceId,
        name: SERVICES.find(serv => serv.id === s.serviceId)?.name || '',
        category: SERVICES.find(serv => serv.id === s.serviceId)?.category || 'accommodation',
        quantity: s.quantity,
        selectedOptions: s.selectedOptions,
        totalPrice: s.totalPrice
      }))));
    }
  };

  const handleQuantityChange = (serviceId: string, change: number) => {
    const updatedServices = selectedServices.map(service => {
      if (service.serviceId === serviceId) {
        const serviceData = SERVICES.find(s => s.id === serviceId);
        if (!serviceData) return service;

        const newQuantity = Math.max(1, Math.min(service.quantity + change, serviceData.maxQuantity || 10));
        const basePrice = serviceData.price;
        const optionsPrice = (service.selectedOptions || []).reduce((sum, optId) => {
          const opt = serviceData.options?.find(o => o.id === optId);
          return sum + (opt?.price || 0);
        }, 0);

        const totalPrice = serviceData.pricePerPassenger 
          ? (basePrice + optionsPrice) * newQuantity * (currentTicket?.passengers.length || 1)
          : (basePrice + optionsPrice) * newQuantity;

        return {
          ...service,
          quantity: newQuantity,
          totalPrice: totalPrice
        };
      }
      return service;
    });
    
    setSelectedServices(updatedServices);
    dispatch(setAdditionalServices(updatedServices.map(s => ({
      id: s.serviceId,
      name: SERVICES.find(serv => serv.id === s.serviceId)?.name || '',
      category: SERVICES.find(serv => serv.id === s.serviceId)?.category || 'accommodation',
      quantity: s.quantity,
      selectedOptions: s.selectedOptions,
      totalPrice: s.totalPrice
    }))));
  };

  const handleOptionSelect = (serviceId: string, optionId: string) => {
    const updatedServices = selectedServices.map(service => {
      if (service.serviceId === serviceId) {
        const serviceData = SERVICES.find(s => s.id === serviceId);
        if (!serviceData) return service;
        
        const option = serviceData.options?.find(o => o.id === optionId);
        
        if (!option) return service;
        
        const selectedOptions = service.selectedOptions || [];
        const newSelectedOptions = selectedOptions.includes(optionId)
          ? selectedOptions.filter(id => id !== optionId)
          : [...selectedOptions, optionId];
        
        const optionsPrice = newSelectedOptions.reduce((sum, optId) => {
          const opt = serviceData.options?.find(o => o.id === optId);
          return sum + (opt?.price || 0);
        }, 0);
        
        return {
          ...service,
          selectedOptions: newSelectedOptions,
          totalPrice: serviceData.price * service.quantity + optionsPrice
        };
      }
      return service;
    });
    
    setSelectedServices(updatedServices);
    dispatch(setAdditionalServices(updatedServices.map(s => ({
      id: s.serviceId,
      name: SERVICES.find(serv => serv.id === s.serviceId)?.name || '',
      category: SERVICES.find(serv => serv.id === s.serviceId)?.category || 'accommodation',
      quantity: s.quantity,
      selectedOptions: s.selectedOptions,
      totalPrice: s.totalPrice
    }))));
  };

  const toggleServiceExpand = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  // Render functions
  const renderCategoryTabs = () => {
    if (isMobile) {
      return (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Категория услуги</InputLabel>
          <Select
            value={mobileCategorySelect}
            onChange={handleMobileCategoryChange}
            label="Категория услуги"
          >
            {SERVICE_CATEGORIES.map(category => (
              <MenuItem key={category.id} value={category.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {category.icon}
                  {category.name}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    return (
      <Tabs
        value={activeCategory}
        onChange={handleCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        {SERVICE_CATEGORIES.map(category => (
          <Tab
            key={category.id}
            value={category.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {category.icon}
                {category.name}
              </Box>
            }
          />
        ))}
      </Tabs>
    );
  };

  const renderServiceCard = (service: Service) => {
    const isSelected = selectedServices.some(s => s.serviceId === service.id);
    const selectedService = selectedServices.find(s => s.serviceId === service.id);
    const isExpanded = expandedService === service.id;

    return (
      <Card 
        key={service.id}
        sx={{ 
          mb: 2,
          border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none'
        }}
      >
        <CardContent>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' },
            gap: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ color: 'primary.main' }}>
                {service.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  {service.price} лв. {service.pricePerPassenger ? 'на пътник' : ''}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleServiceSelect(service)}
                    disabled={!service.available}
                  />
                }
                label={isSelected ? 'Избрано' : 'Избери'}
              />
              
              {isSelected && selectedService && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(service.id, -1)}
                    disabled={selectedService.quantity <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{selectedService.quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(service.id, 1)}
                    disabled={selectedService.quantity >= (service.maxQuantity || 10)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              )}
              
              {service.options && (
                <Button
                  size="small"
                  endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => toggleServiceExpand(service.id)}
                >
                  Опции
                </Button>
              )}
            </Box>
          </Box>

          {service.options && (
            <Collapse in={isExpanded}>
              <Box sx={{ mt: 2, pl: 6 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Налични опции:
                </Typography>
                <List dense>
                  {service.options.map(option => (
                    <ListItem key={option.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedService?.selectedOptions?.includes(option.id)}
                            onChange={() => handleOptionSelect(service.id, option.id)}
                            disabled={!isSelected}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2">
                              {option.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.description}
                            </Typography>
                            <Typography variant="body2" color="primary">
                              +{option.price} лв.
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSelectedServices = () => {
    if (selectedServices.length === 0) {
      return (
        <Alert severity="info" sx={{ mb: 2 }}>
          Няма избрани допълнителни услуги
        </Alert>
      );
    }

    return (
      <List>
        {selectedServices.map(service => {
          const serviceData = SERVICES.find(s => s.id === service.serviceId);
          if (!serviceData) return null;

          return (
            <ListItem
              key={service.serviceId}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleServiceSelect(serviceData)}
                >
                  <RemoveIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={serviceData.name}
                secondary={
                  <>
                    <Typography variant="body2" component="span">
                      Количество: {service.quantity}
                    </Typography>
                    {service.selectedOptions && service.selectedOptions.length > 0 && (
                      <Typography variant="body2" component="span" display="block">
                        Опции: {service.selectedOptions.map(optId => 
                          serviceData.options?.find(o => o.id === optId)?.name
                        ).join(', ')}
                      </Typography>
                    )}
                  </>
                }
              />
              <Typography variant="body1" color="primary" sx={{ ml: 2 }}>
                {service.totalPrice} лв.
              </Typography>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Избор на допълнителни услуги
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Подобрете пътуването си с допълнителни услуги
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 3 
      }}>
        {/* Services Selection */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {renderCategoryTabs()}
          
          <Box>
            {SERVICES.filter(service => service.category === activeCategory)
              .map(service => renderServiceCard(service))}
          </Box>
        </Box>

        {/* Selected Services Summary */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ p: 2, position: isMobile ? 'static' : 'sticky', top: 24 }}>
            <Typography variant="h6" gutterBottom>
              Избрани услуги
            </Typography>
            
            {renderSelectedServices()}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Обобщение:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Базова цена на билета:</Typography>
                <Typography>{currentTicket?.basePrice || 0} лв.</Typography>
              </Box>
              {currentTicket?.passengers.map((passenger, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {passenger.category === 'adults' ? 'Възрастен' :
                     passenger.category === 'children' ? 'Дете' :
                     passenger.category === 'seniors' ? 'Пенсионер' : 'Студент'}
                    {passenger.discount !== 'Без намаление' && ` (${passenger.discount})`}
                  </Typography>
                  <Typography variant="body2">
                    {currentTicket.basePrice * 
                     (passenger.category === 'adults' ? 1.0 :
                      passenger.category === 'children' ? 0.5 :
                      passenger.category === 'seniors' ? 0.7 : 0.8) *
                     (passenger.discount === 'Без намаление' ? 1.0 :
                      passenger.discount === 'Карта за отстъпка' ? 0.5 :
                      passenger.discount === 'Карта за семейство' ? 0.7 :
                      passenger.discount === 'Карта за студент' ? 0.8 : 0.7)} лв.
                  </Typography>
                </Box>
              ))}
              {currentTicket?.returnType === 'round-trip-fixed' && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Двупосочен билет (x2)
                  </Typography>
                </Box>
              )}
              {selectedServices.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Допълнителни услуги:</Typography>
                  <Typography>{subtotal} лв.</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Обща сума:</Typography>
                <Typography variant="h6" color="primary">{total} лв.</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}; 