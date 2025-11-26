import { Routes, Route } from "react-router-dom";

// Públicos
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Componentes
import Header from "./components/Header";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";

// CLIENTE
import ClientDashboard from "./pages/ClientDashboard";
import ClientTotens from "./pages/ClientTotens";
import ClientTotenDetails from "./pages/ClientTotenDetails";
import ClientTotenPlaylist from "./pages/ClientTotenPlaylist";
import ClientPlaylistEditor from "./pages/ClientPlaylistEditor";
import ClientPendingDevices from "./pages/ClientPendingDevices";
import ClientMedia from "./pages/ClientMedia";
import ClientConfig from "./pages/ClientConfig";

// ADMIN – Dashboard e Clientes
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardAdvanced from "./pages/AdminDashboardAdvanced";
import AdminClientsList from "./pages/AdminClientsList";
import AdminClientsNew from "./pages/AdminClientsNew";
import AdminClientDetails from "./pages/AdminClientDetails";
import AdminClientEdit from "./pages/AdminClientEdit";
import AdminClientTotens from "./pages/AdminClientTotens";
import AdminClientPlaylists from "./pages/AdminClientPlaylists";
import AdminClientMedia from "./pages/AdminClientMedia";

// ADMIN – Totens
import AdminTotensList from "./pages/AdminTotensList";
import AdminTotenDetails from "./pages/AdminTotenDetails";
import AdminTotenLogs from "./pages/AdminTotenLogs";
import AdminTotenPlaylist from "./pages/AdminTotenPlaylist";
import AdminPendingTotens from "./pages/AdminPendingTotens";
import AdminPendingDevices from "./pages/AdminPendingDevices";

// ADMIN – Playlists
import AdminPlaylistsList from "./pages/AdminPlaylistsList";
import AdminPlaylistsNew from "./pages/AdminPlaylistsNew";
import AdminPlaylistDetails from "./pages/AdminPlaylistDetails";
import AdminPlaylistEdit from "./pages/AdminPlaylistEdit";
import AdminPlaylistPreview from "./pages/AdminPlaylistPreview";
import AdminPlaylistAddMedia from "./pages/AdminPlaylistAddMedia";
import AdminPlaylistOrder from "./pages/AdminPlaylistOrder";

// ADMIN – Mídias
import AdminMediaList from "./pages/AdminMediaList";
import AdminMediaDetails from "./pages/AdminMediaDetails";
import AdminMediaUpload from "./pages/AdminMediaUpload";

// ADMIN – Administradores
import AdminAdminsList from "./pages/AdminAdminsList";
import AdminAdminsNew from "./pages/AdminAdminsNew";
import AdminAdminsEdit from "./pages/AdminAdminsEdit";

export default function App() {
  return (
    <Routes>

      {/* =======================
          ROTAS ADMINISTRADOR
      ======================== */}

      {/* Admin: Administradores */}
      <Route path="/admin/admins" element={<RequireAdmin><AdminAdminsList /></RequireAdmin>} />
      <Route path="/admin/admins/new" element={<RequireAdmin><AdminAdminsNew /></RequireAdmin>} />
      <Route path="/admin/admins/:id/edit" element={<RequireAdmin><AdminAdminsEdit /></RequireAdmin>} />

      {/* Admin: Mídias */}
      <Route path="/admin/media" element={<RequireAdmin><AdminMediaList /></RequireAdmin>} />
      <Route path="/admin/media/upload" element={<RequireAdmin><AdminMediaUpload /></RequireAdmin>} />
      <Route path="/admin/media/:id" element={<RequireAdmin><AdminMediaDetails /></RequireAdmin>} />

      {/* Admin: Playlists */}
      <Route path="/admin/playlists" element={<RequireAdmin><AdminPlaylistsList /></RequireAdmin>} />
      <Route path="/admin/playlists/new" element={<RequireAdmin><AdminPlaylistsNew /></RequireAdmin>} />
      <Route path="/admin/playlists/:id" element={<RequireAdmin><AdminPlaylistDetails /></RequireAdmin>} />
      <Route path="/admin/playlists/:id/edit" element={<RequireAdmin><AdminPlaylistEdit /></RequireAdmin>} />
      <Route path="/admin/playlists/:id/preview" element={<RequireAdmin><AdminPlaylistPreview /></RequireAdmin>} />
      <Route path="/admin/playlists/:id/add-media" element={<RequireAdmin><AdminPlaylistAddMedia /></RequireAdmin>} />
      <Route path="/admin/playlists/:id/order" element={<RequireAdmin><AdminPlaylistOrder /></RequireAdmin>} />

      {/* Admin: Clientes */}
      <Route path="/admin/clients" element={<RequireAdmin><AdminClientsList /></RequireAdmin>} />
      <Route path="/admin/clients/new" element={<RequireAdmin><AdminClientsNew /></RequireAdmin>} />
      <Route path="/admin/clients/:id" element={<RequireAdmin><AdminClientDetails /></RequireAdmin>} />
      <Route path="/admin/clients/:id/edit" element={<RequireAdmin><AdminClientEdit /></RequireAdmin>} />
      <Route path="/admin/clients/:id/totens" element={<RequireAdmin><AdminClientTotens /></RequireAdmin>} />
      <Route path="/admin/clients/:id/playlists" element={<RequireAdmin><AdminClientPlaylists /></RequireAdmin>} />
      <Route path="/admin/clients/:id/media" element={<RequireAdmin><AdminClientMedia /></RequireAdmin>} />

      {/* Admin: Totens */}
      <Route path="/admin/totens" element={<RequireAdmin><AdminTotensList /></RequireAdmin>} />
      <Route path="/admin/totens/:id" element={<RequireAdmin><AdminTotenDetails /></RequireAdmin>} />
      <Route path="/admin/totens/:id/logs" element={<RequireAdmin><AdminTotenLogs /></RequireAdmin>} />
      <Route path="/admin/totens/:id/playlist" element={<RequireAdmin><AdminTotenPlaylist /></RequireAdmin>} />
      <Route path="/admin/pending-totens" element={<RequireAdmin><AdminPendingTotens /></RequireAdmin>} />
      <Route path="/admin/dispositivos-pendentes" element={<RequireAdmin><AdminPendingDevices /></RequireAdmin>} />

      {/* Admin: Dashboard */}
      <Route
        path="/admin"
        element={
          <RequireAuth role="admin">
            <Header />
            <AdminDashboard />
          </RequireAuth>
        }
      />

      {/* =======================
          ROTAS CLIENTE
      ======================== */}

      <Route
        path="/client"
        element={
          <RequireAuth role="client">
            <Header />
            <ClientDashboard />
          </RequireAuth>
        }
      />

      <Route path="/client/totens" element={<RequireAuth><ClientTotens /></RequireAuth>} />
      <Route path="/client/totens/:id" element={<RequireAuth><ClientTotenDetails /></RequireAuth>} />
      <Route path="/client/totens/:id/playlist" element={<RequireAuth><ClientTotenPlaylist /></RequireAuth>} />
      <Route path="/client/pendentes" element={<RequireAuth><ClientPendingDevices /></RequireAuth>} />
      <Route path="/client/playlists/:id" element={<RequireAuth><ClientPlaylistEditor /></RequireAuth>} />
      <Route path="/client/media" element={<RequireAuth><ClientMedia /></RequireAuth>} />
      <Route path="/client/config" element={<RequireAuth><ClientConfig /></RequireAuth>} />

      {/* =======================
          ROTAS PÚBLICAS
      ======================== */}

      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

    </Routes>
  );
}
