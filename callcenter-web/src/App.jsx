import React from 'react'; // Refresh Trigger: 2026-01-29 17:10
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AgentLoginPage from './pages/AgentLoginPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import AuthPage from './pages/AuthPage';
import LossPage from './pages/LossPage';
import OutboundPage from './pages/OutboundPage';
import OutboundCallPage from './pages/OutboundCallPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AuditLogPage from './pages/AuditLogPage';
import ComplianceReportPage from './pages/ComplianceReportPage';
import RecordingListPage from './pages/RecordingListPage';
import InboundCallPage from './pages/InboundCallPage';

import StatusBridge from './pages/StatusBridge';
import SessionMonitor from './components/SessionMonitor';

// PrivateRoute to protect authenticated routes (Any logged in user)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('operator_token');
  return token ? children : <Navigate to="/" replace />;
};

// AdminRoute to protect admin-only routes
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('operator_token');
  const role = localStorage.getItem('agentRole');
  return token && role === 'ADMIN' ? children : <Navigate to="/dashboard" replace />;
};

function Layout({ children }) {
  return (
    <div className="app-container">
      <SessionMonitor />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<AgentLoginPage />} />
          
          {/* Protected Routes (Agent & Admin) */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
          <Route path="/auth" element={<PrivateRoute><AuthPage /></PrivateRoute>} />
          <Route path="/loss" element={<PrivateRoute><LossPage /></PrivateRoute>} />
          <Route path="/outbound" element={<PrivateRoute><OutboundPage /></PrivateRoute>} />
          <Route path="/outbound/call" element={<PrivateRoute><OutboundCallPage /></PrivateRoute>} />
          <Route path="/inbound" element={<PrivateRoute><InboundCallPage /></PrivateRoute>} />
          <Route path="/bridge" element={<StatusBridge />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/audit" element={<AdminRoute><AuditLogPage /></AdminRoute>} />
          <Route path="/admin/recordings" element={<AdminRoute><RecordingListPage /></AdminRoute>} />
          <Route path="/admin/compliance" element={<AdminRoute><ComplianceReportPage /></AdminRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
