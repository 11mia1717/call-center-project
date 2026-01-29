import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AgentLoginPage from './pages/AgentLoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SearchPage from './pages/SearchPage';
import AuthPage from './pages/AuthPage';
import LossPage from './pages/LossPage';
import OutboundPage from './pages/OutboundPage';
import OutboundCallPage from './pages/OutboundCallPage';

function Layout({ children }) {
  return (
    <div className="app-container">
      {children}
    </div>
  );
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem('operator_token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* 기본 경로 접속 시 로그인으로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AgentLoginPage />} />
          
          {/* [보안] 로그인 필수 경로 보호 */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboardPage /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
          <Route path="/auth" element={<PrivateRoute><AuthPage /></PrivateRoute>} />
          <Route path="/loss" element={<PrivateRoute><LossPage /></PrivateRoute>} />
          <Route path="/outbound" element={<PrivateRoute><OutboundPage /></PrivateRoute>} />
          <Route path="/outbound/call" element={<PrivateRoute><OutboundCallPage /></PrivateRoute>} />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
