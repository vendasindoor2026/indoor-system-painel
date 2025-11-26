import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import Header from './components/Header';

export default () => (
  <div>
    <Routes>
     <Route path='/admin' element={<AdminDashboard />} />

      {/* Página inicial sem Header */}
      <Route path='/' element={<Landing />} />

      {/* Páginas internas com Header */}
      <Route path='/login' element={<><Header /><Login /></>} />
      <Route path='/admin' element={<><Header /><AdminDashboard /></>} />
      <Route path='/client' element={<><Header /><ClientDashboard /></>} />
    </Routes>
  </div>
);
