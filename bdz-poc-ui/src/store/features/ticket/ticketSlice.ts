import { createSlice, PayloadAction, ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface RouteSelectionPayload {
  fromStation: string;
  toStation: string;
  viaStation?: string;
  departureDate: string;
  departureTime?: string;
  basePrice?: number;
}

export interface Passenger {
  discount?: string;
  seatNumber?: string;
  carNumber?: string;
  category?: 'adults' | 'children' | 'seniors' | 'students';
  documentNumber?: string;
}

export interface PassengerCategories {
  adults: number;
  children: number;
  seniors: number;
  students: number;
}

export interface AdditionalService {
  id: string;
  name: string;
  category: 'accommodation' | 'food' | 'luggage' | 'insurance' | 'assistance';
  quantity: number;
  selectedOptions?: string[];
  totalPrice: number;
}

export interface TicketData {
  route: RouteSelectionPayload;
  passengerCount: number;
  passengerCategories: PassengerCategories;
  returnType: 'one-way' | 'round-trip-open' | 'round-trip-fixed';
  returnDate?: string;
  passengers: Passenger[];
  ticketType: 'standard' | 'credit' | 'family' | 'regional' | 'small-group' | 'reservation';
  additionalServices?: AdditionalService[];
}

interface TicketState {
  currentTicket: {
    route: RouteSelectionPayload | null;
    passengerCount: number;
    passengerCategories: PassengerCategories;
    returnType: 'one-way' | 'round-trip-open' | 'round-trip-fixed';
    returnDate: string | null;
    passengers: Passenger[];
    additionalServices: AdditionalService[];
    basePrice: number;
    totalPrice: number;
  } | null;
  issuedTickets: any[];
}

const initialState: TicketState = {
  currentTicket: null,
  issuedTickets: [],
};

const PASSENGER_CATEGORY_PRICES: Record<keyof PassengerCategories, number> = {
  adults: 1.0,
  children: 0.5,
  seniors: 0.7,
  students: 0.8
};

const DISCOUNT_CARDS: Record<string, number> = {
  'Без намаление': 1.0,
  'Карта за отстъпка': 0.5,
  'Карта за семейство': 0.7,
  'Карта за студент': 0.8,
  'Карта за пенсионер': 0.7
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    startNewTicket: (state) => {
      state.currentTicket = {
        route: null,
        passengerCount: 1,
        passengerCategories: {
          adults: 1,
          children: 0,
          seniors: 0,
          students: 0
        },
        returnType: 'one-way',
        returnDate: null,
        passengers: [{ 
          category: 'adults',
          discount: 'Без намаление', 
          seatNumber: '',
          carNumber: '',
          documentNumber: undefined
        }],
        additionalServices: [],
        basePrice: 0,
        totalPrice: 0
      };
      state.issuedTickets = [];
    },
    setRouteSelection: (state, action: PayloadAction<RouteSelectionPayload & { passengers?: PassengerCategories; basePrice?: number }>) => {
      if (!state.currentTicket) {
        console.error("Cannot set route selection: No current ticket process started.");
        return;
      }

      const ticket = state.currentTicket;
      if (action.payload.basePrice !== undefined) {
        ticket.basePrice = action.payload.basePrice;
        ticket.totalPrice = action.payload.basePrice;
      }

      ticket.route = {
        fromStation: action.payload.fromStation,
        toStation: action.payload.toStation,
        viaStation: action.payload.viaStation,
        departureDate: action.payload.departureDate,
        departureTime: action.payload.departureTime,
        basePrice: action.payload.basePrice
      };
      
      if (action.payload.passengers) {
        ticket.passengerCategories = action.payload.passengers;
        ticket.passengerCount = Object.values(action.payload.passengers).reduce((sum, count) => sum + count, 0);
        
        const newPassengers: Passenger[] = [];
        Object.entries(action.payload.passengers).forEach(([category, count]) => {
          for (let i = 0; i < count; i++) {
            newPassengers.push({
              category: category as 'adults' | 'children' | 'seniors' | 'students',
              discount: 'Без намаление',
              seatNumber: ''
            });
          }
        });
        
        if (state.currentTicket) {
          state.currentTicket.passengers = newPassengers;
          calculateTotalPrice(state);
        }
      }
    },
    setPassengerCount: (state, action: PayloadAction<number>) => {
      if (!state.currentTicket) {
        console.error("Cannot set passenger count: No current ticket process started.");
        return;
      }

      const ticket = state.currentTicket;
      const newCount = Math.max(1, action.payload);
      const currentCount = ticket.passengers.length;
      ticket.passengerCount = newCount;

      console.log(`Setting passenger count to ${newCount} (was ${currentCount})`);

      if (newCount > currentCount) {
        const newPassengers: Passenger[] = [...ticket.passengers];
        for (let i = currentCount; i < newCount; i++) {
          newPassengers.push({ 
            category: 'adults',
            discount: 'Без намаление', 
            seatNumber: '' 
          });
        }
        if (state.currentTicket) {
          state.currentTicket.passengers = newPassengers;
        }
      } else if (newCount < currentCount) {
        if (state.currentTicket) {
          state.currentTicket.passengers = ticket.passengers.slice(0, newCount);
        }
      }

      calculateTotalPrice(state);
    },
    setPassengerCategories: (state, action: PayloadAction<PassengerCategories>) => {
      if (!state.currentTicket) {
        console.error("Cannot set passenger categories: No current ticket process started.");
        return;
      }
      
      const ticket = state.currentTicket;
      ticket.passengerCategories = action.payload;
      ticket.passengerCount = Object.values(action.payload).reduce((sum, count) => sum + count, 0);
      
      const newPassengers: Passenger[] = [];
      Object.entries(action.payload).forEach(([category, count]) => {
        for (let i = 0; i < count; i++) {
          newPassengers.push({
            category: category as 'adults' | 'children' | 'seniors' | 'students',
            discount: 'Без намаление',
            seatNumber: ''
          });
        }
      });
      
      if (state.currentTicket) {
        state.currentTicket.passengers = newPassengers;
        calculateTotalPrice(state);
      }
    },
    setReturnType: (state, action: PayloadAction<'one-way' | 'round-trip-open' | 'round-trip-fixed'>) => {
      if (state.currentTicket) {
        console.log(`Setting return type to ${action.payload} (was ${state.currentTicket.returnType})`);
        state.currentTicket.returnType = action.payload;
        if (action.payload !== 'round-trip-fixed') {
          state.currentTicket.returnDate = null;
        }
        calculateTotalPrice(state);
      } else {
        console.error("Cannot set return type: No current ticket process started.");
      }
    },
    setReturnDate: (state, action: PayloadAction<string | null>) => {
      if (state.currentTicket && state.currentTicket.returnType === 'round-trip-fixed') {
        state.currentTicket.returnDate = action.payload;
        calculateTotalPrice(state);
      }
    },
    updatePassenger: (state, action: PayloadAction<{ index: number; data: Partial<Passenger> }>) => {
      if (state.currentTicket && state.currentTicket.passengers[action.payload.index]) {
        state.currentTicket.passengers[action.payload.index] = {
          ...state.currentTicket.passengers[action.payload.index],
          ...action.payload.data,
        };
        calculateTotalPrice(state);
      }
    },
    issueTicket: (state) => {
      if (state.currentTicket) {
        console.log('Issuing ticket:', JSON.stringify(state.currentTicket, null, 2));
        state.issuedTickets.push({ ...state.currentTicket, issuedAt: new Date().toISOString() });
        state.currentTicket = null;
      }
    },
    cancelTicketProcess: (state) => {
      state.currentTicket = null;
    },
    setAdditionalServices: (state, action: PayloadAction<AdditionalService[]>) => {
      if (state.currentTicket) {
        state.currentTicket.additionalServices = action.payload;
        calculateTotalPrice(state);
      }
    },
  },
});

const { actions } = ticketSlice;

export const startNewTicket = actions.startNewTicket;
export const setRouteSelection = actions.setRouteSelection as ActionCreatorWithPayload<RouteSelectionPayload & { passengers?: PassengerCategories; basePrice?: number }>;
export const setPassengerCount = actions.setPassengerCount as ActionCreatorWithPayload<number>;
export const setPassengerCategories = actions.setPassengerCategories as ActionCreatorWithPayload<PassengerCategories>;
export const setReturnType = actions.setReturnType as ActionCreatorWithPayload<'one-way' | 'round-trip-open' | 'round-trip-fixed'>;
export const setReturnDate = actions.setReturnDate as ActionCreatorWithPayload<string | null>;
export const updatePassenger = actions.updatePassenger as ActionCreatorWithPayload<{ index: number; data: Partial<Passenger> }>;
export const issueTicket = actions.issueTicket;
export const cancelTicketProcess = actions.cancelTicketProcess;
export const setAdditionalServices = actions.setAdditionalServices as ActionCreatorWithPayload<AdditionalService[]>;

export const selectCurrentTicket = (state: RootState) => state.ticket.currentTicket;
export const selectIssuedTickets = (state: RootState) => state.ticket.issuedTickets;

function calculateTotalPrice(state: TicketState) {
  if (!state.currentTicket) return;

  const { basePrice, passengers, additionalServices, returnType } = state.currentTicket;
  
  console.log('Calculating total price with:', {
    basePrice,
    passengers,
    returnType,
    additionalServices
  });

  let totalPassengerPrice = passengers.reduce((sum, passenger) => {
    const categoryMultiplier = PASSENGER_CATEGORY_PRICES[passenger.category || 'adults'];
    const discountMultiplier = DISCOUNT_CARDS[passenger.discount || 'Без намаление'];
    const passengerPrice = basePrice * categoryMultiplier * discountMultiplier;
    
    console.log('Passenger price calculation:', {
      passenger,
      categoryMultiplier,
      discountMultiplier,
      passengerPrice
    });
    
    return sum + passengerPrice;
  }, 0);

  if (returnType !== 'one-way') {
    totalPassengerPrice *= 2;
  }

  const servicesPrice = additionalServices.reduce((sum, service) => sum + service.totalPrice, 0);
  const totalPrice = totalPassengerPrice + servicesPrice;

  console.log('Final price calculation:', {
    totalPassengerPrice,
    servicesPrice,
    totalPrice
  });

  state.currentTicket.totalPrice = totalPrice;
}

export default ticketSlice.reducer; 