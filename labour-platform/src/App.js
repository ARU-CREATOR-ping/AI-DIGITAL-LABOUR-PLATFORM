import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Layout
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RoleSelectPage from './pages/RoleSelectPage';
import WorkerProfileSetup from './pages/WorkerProfileSetup';
import WorkerDashboard from './pages/WorkerDashboard';
import JobListingPage from './pages/JobListingPage';
import ApplicationsPage from './pages/ApplicationsPage';
import AttendancePage from './pages/AttendancePage';
import ClientDashboard from './pages/ClientDashboard';
import PostJobPage from './pages/PostJobPage';
import ApplicantsPage from './pages/ApplicantsPage';
import PaymentPage from './pages/PaymentPage';
import ReviewPage from './pages/ReviewPage';
import NotFoundPage from './pages/NotFoundPage';

// Route guard
import ProtectedRoute from './routes/ProtectedRoute';

function AppRoutes() {
  const { user, role } = useApp();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={user ? <Navigate to={role === 'worker' ? '/worker/dashboard' : '/client/dashboard'} /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/role-select" /> : <LoginPage />} />
        <Route path="/role-select" element={
          <ProtectedRoute><RoleSelectPage /></ProtectedRoute>
        } />

        {/* Worker routes */}
        <Route path="/worker/profile-setup" element={
          <ProtectedRoute requiredRole="worker"><WorkerProfileSetup /></ProtectedRoute>
        } />
        <Route path="/worker/dashboard" element={
          <ProtectedRoute requiredRole="worker"><WorkerDashboard /></ProtectedRoute>
        } />
        <Route path="/worker/jobs" element={
          <ProtectedRoute requiredRole="worker"><JobListingPage /></ProtectedRoute>
        } />
        <Route path="/worker/applications" element={
          <ProtectedRoute requiredRole="worker"><ApplicationsPage /></ProtectedRoute>
        } />
        <Route path="/worker/attendance" element={
          <ProtectedRoute requiredRole="worker"><AttendancePage /></ProtectedRoute>
        } />

        {/* Client routes */}
        <Route path="/client/dashboard" element={
          <ProtectedRoute requiredRole="client"><ClientDashboard /></ProtectedRoute>
        } />
        <Route path="/client/post-job" element={
          <ProtectedRoute requiredRole="client"><PostJobPage /></ProtectedRoute>
        } />
        <Route path="/client/applicants" element={
          <ProtectedRoute requiredRole="client"><ApplicantsPage /></ProtectedRoute>
        } />
        <Route path="/client/payment" element={
          <ProtectedRoute requiredRole="client"><PaymentPage /></ProtectedRoute>
        } />

        {/* Shared */}
        <Route path="/review" element={
          <ProtectedRoute><ReviewPage /></ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
