import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import Header from './components/Header';
import RequireAuth from "./components/RequireAuth";

export default () => (
  <div>
    <Routes>
     <Routes>

  {/* Página pública */}
  <Route path="/" element={<Landing />} />

  {/* Login */}
  <Route path="/login" element={<Login />} />

  {/* Painel ADMIN */}
  <Route
    path="/admin"
    element={
      <RequireAuth role="admin">
        <Header />
        <AdminDashboard />
      </RequireAuth>
    }
  />

  {/* Painel CLIENTE */}
  <Route
    path="/client"
    element={
      <RequireAuth role="client">
        <Header />
        <ClientDashboard />
      </RequireAuth>
    }
  />

</Routes>

    </Routes>
  </div>
);
