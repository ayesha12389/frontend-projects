import React, { useContext, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { DoctorQueueList, DoctorApplicationDetail } from './pages/AdminDoctorQueue';
import Homepage        from './pages/homepage';
import AdminDashboard  from './pages/adminDashboard';
import UploadImage     from './pages/uploadImage';
import ReportsTable    from './pages/reports';
import ScanReport      from './pages/scanReports';
import DoctorApplicationForm from './pages/docApp';
import DoctorProfilePage from './pages/doctorProfile';
import AppointmentsPage from './pages/appointment';
import DoctorListPage from './pages/DdoctorListPage';
import DoctorDetailPage from './pages/DoctorDetailpage'
import LumbarSpineGuide from './pages/guide'
import Sidebar         from './pages/sidebar';
import Topbar          from './pages/topbar';
import Settings from './pages/settings';
import AboutUsPage from './pages/about';
import ChangePassword from './pages/ChangePassworrd ';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import Userlist from './pages/Userlist';
import { AuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';

/* ------------- RequireAuth (protects private routes) ---------------------- */
export function RequireAuth({ children }) {
  const { user, checking } = useContext(AuthContext);

  if (checking) {
    // While checking auth status, show a spinner or nothing
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/home" replace />;
}


/* ------------- Layout that owns sidebar + topbar ------------------------- */
function DashboardLayout () {
  const { user, logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);

  const userRole   = user?.role         ?? 'patient';
  const userName   = user?.username     ?? 'Guest User';
  const userAvatar = user?.profileImage ?? 'https://i.pravatar.cc/40';

  return (
    <div className="app-container">
      <Sidebar
        userRole={userRole}
        userName={userName}
        userAvatar={userAvatar}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onLogout={logout}
      />

      <div className="main-content">
        <div className="topbar-container">
          <Topbar
            userRole={userRole}
            userAvatar={userAvatar}
            notifications={5}
            onSearch={(t) => console.log('search:', t)}
            onLogout={logout}
          />
        </div>

        {/* nested routes */}
        <Outlet />
      </div>
    </div>
  );
}

/* --------------------------- App routes only ------------------------------ */
export default function App () {
  return (
    <>
      <Routes>
        {/* PUBLIC */}
        <Route path="/home" element={<Homepage />} />
        <Route path="/"     element={<Homepage />} />
         <Route path="/guide"     element={<LumbarSpineGuide />} />
<Route path="/about"     element={<AboutUsPage />} />
        {/* PRIVATE */}
        <Route element={<RequireAuth><DashboardLayout/></RequireAuth>}>
          <Route path="/dashboard"       element={<AdminDashboard/>} />
          <Route path="/access-doctor"   element={<DoctorApplicationForm/>} />
            <Route path="/appointment"   element={<AppointmentsPage/>} />
          <Route path="/upload"          element={<UploadImage userRole="doctor"/>} />
          <Route path="/scan/:scanId"    element={<ScanReport/>} />
          <Route path="/reports"         element={<ReportsTable userRole="admin"/>} />
          <Route path="/admin/doctor-queue" element={<RequireAuth><DoctorQueueList/></RequireAuth>} />
<Route path="/admin/doctor-queue/:id" element={<RequireAuth><DoctorApplicationDetail/></RequireAuth>} />
<Route path="/doctor" element={<DoctorProfilePage/>} />
<Route path="/doctorslist" element={<DoctorListPage />} />
<Route path="/doctor/:userId" element={<DoctorDetailPage />} />
<Route path="/settings" element={<Settings />} />
<Route path="/settings/edit-profile" element={<EditProfile />} />
<Route path="/settings/change-password" element={<ChangePassword />} />
<Route path="/settings/profile" element={<UserProfile />} />
<Route path="/settings/manage-roles" element={<Userlist />} />


        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      {/* Toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
    </>
  );
}
