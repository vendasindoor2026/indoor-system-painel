import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import Header from './components/Header';
import RequireAuth from "./components/RequireAuth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


export default function App() {
  return (
    <Routes>

      
      <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
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
  );
}
