import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import Header from './components/Header';
import RequireAuth from "./components/RequireAuth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminPendingDevices from "./pages/AdminPendingDevices";
import ClientTotens from "./pages/ClientTotens";
import ClientPendingDevices from "./pages/ClientPendingDevices";
import ClientPlaylistEditor from "./pages/ClientPlaylistEditor";
import ClientMedia from "./pages/ClientMedia";
import ClientConfig from "./pages/ClientConfig";

export default function App() {
  return (
    <Routes>

<Route
  path="/client/config"
  element={
    <RequireAuth>
      <ClientConfig />
    </RequireAuth>
  }
/>

<Route
  path="/client/media"
  element={
    <RequireAuth>
      <ClientMedia />
    </RequireAuth>
  }
/>

<Route
  path="/client/playlists/:id"
  element={
    <RequireAuth>
      <ClientPlaylistEditor />
    </RequireAuth>
  }
/>

      <Route
  path="/client/pendentes"
  element={
    <RequireAuth>
      <ClientPendingDevices />
    </RequireAuth>
  }
/>

<Route
  path="/client/totens"
  element={
    <RequireAuth>
      <ClientTotens />
    </RequireAuth>
  }
/>

      <Route
  path="/admin/dispositivos-pendentes"
  element={
    <RequireAuth>
      <AdminPendingDevices />
    </RequireAuth>
  }
/>
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
