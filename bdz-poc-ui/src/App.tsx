import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { store } from './store/store';
import theme from './styles/theme';
import Layout from './components/Layout/Layout'
import CashierLayout from './components/Layout/CashierLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import CashierDashboard from './pages/CashierDashboard'
import TicketIssuanceNew from './pages/cashier/components/TicketIssuance'
import TicketIssuance from './pages/TicketIssuance'
import TicketCancellation from './pages/cashier/components/TicketCancellation'
import RouteSearch from './pages/cashier/components/RouteSearch'
import RouteSearchResult from './pages/cashier/components/RouteSearchResult'
import ReservationManagement from './pages/cashier/components/ReservationManagement'
import TicketValidation from './pages/cashier/components/TicketValidation'
import AdditionalServices from './pages/cashier/components/AdditionalServices'
import PrintedMaterialsManagement from './pages/cashier/components/PrintedMaterialsManagement'
import ReportsAndStatistics from './pages/cashier/components/reports/ReportsAndStatistics'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import SearchResultsPage from './pages/SearchResultsPage'
import SchedulePage from './pages/SchedulePage'
import PurchasePage from './pages/PurchasePage'
import FeedbackAndComplaints from './pages/cashier/components/FeedbackAndComplaints'

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public routes with default Layout */}
            <Route element={<Layout><Outlet /></Layout>}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cashier-login" element={<LoginPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/search-results" element={<SearchResultsPage />} />
              <Route path="/purchase" element={<PurchasePage />} />
            </Route>

            {/* Protected cashier routes with CashierLayout */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['cashier']}>
                  <CashierLayout><Outlet /></CashierLayout>
                </ProtectedRoute>
              }
            >
              <Route path="/cashier/dashboard" element={<CashierDashboard />} />
              <Route path="/cashier/tickets" element={<TicketIssuance />} />
              <Route path="/cashier/ticket-issuance" element={<TicketIssuanceNew />} />
              <Route path="/cashier/tickets/check" element={<TicketValidation />} />
              <Route path="/cashier/tickets/cancel" element={<TicketCancellation />} />
              <Route path="/cashier/reservations" element={<ReservationManagement />} />
              <Route path="/cashier/routes" element={<RouteSearch />} />
              <Route path="/cashier/routes/results" element={<RouteSearchResult />} />
              <Route path="/cashier/ticket-modifications" element={<TicketCancellation />} />
              <Route path="/cashier/additional-services" element={<AdditionalServices />} />
              <Route path="/cashier/printing-materials" element={<PrintedMaterialsManagement />} />
              <Route path="/cashier/reports" element={<ReportsAndStatistics />} />
              <Route path="/cashier/feedback" element={<FeedbackAndComplaints />} />
            </Route>

            {/* Redirect all other routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  )
}

export default App
