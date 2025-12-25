import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Stock from '../pages/Stock';
import Sales from '../pages/Sales';
import Crew from '../pages/Crew';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/stock" element={<Stock />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/crew" element={<Crew />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};