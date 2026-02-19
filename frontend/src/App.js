import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import TopNavbar from './components/TopNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Relocations from './pages/Relocations';
import Bookings from './pages/Bookings';
import Shipments from './pages/Shipments';
import Documents from './pages/Documents';
import ServiceProviders from './pages/ServiceProviders';
import ServiceProviderDashboard from './pages/ServiceProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].some(path => location.pathname.startsWith(path));

  return (
    <div className="App min-h-screen bg-gray-50">
      {!isAuthPage && location.pathname !== '/' && <TopNavbar />}
      <div className={location.pathname !== '/' && !isAuthPage ? 'pt-16' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/provider" element={<Register provider={true} />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/relocations" element={
            <PrivateRoute>
              <Relocations />
            </PrivateRoute>
          } />
          
          <Route path="/bookings" element={
            <PrivateRoute>
              <Bookings />
            </PrivateRoute>
          } />
          
          <Route path="/shipments" element={
            <PrivateRoute>
              <Shipments />
            </PrivateRoute>
          } />
          
          <Route path="/documents" element={
            <PrivateRoute>
              <Documents />
            </PrivateRoute>
          } />
          
          <Route path="/service-providers" element={<ServiceProviders />} />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          
          <Route path="/provider/dashboard" element={
            <PrivateRoute allowedRoles={['service_provider', 'admin']}>
              <ServiceProviderDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/admin/dashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/dashboard" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
