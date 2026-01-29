import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
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

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/loss" element={<LossPage />} />
          <Route path="/outbound" element={<OutboundPage />} />
          <Route path="/outbound/call" element={<OutboundCallPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
