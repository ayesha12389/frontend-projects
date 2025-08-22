import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import Home from './Home';
import Services from './components/Services';
import Appointments from './components/appointments';
import About from './components/About';
import Contact from './components/Contact';
import UserProfile from './components/UserProfile';
import Technician from './Technician';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Workload from './techComponents/Workload';
import UpdateJob from './techComponents/UpdateJob';
import Availability from './techComponents/Availability'; 
import Report from './techComponents/Report'; 
import Communication from './techComponents/Communication'
import Admin from './Admin';
import Customers from './adminComponents/Customers';
import Technicians from './adminComponents/Technicians';
import CreateServices from './adminComponents/CreateServices';
import ManageCategories from './adminComponents/ManageCategories';
import Auth from './Forms/Auth';
import AdminProfile from './adminComponents/AdminProfile';
import HeroUser from './components/HeroUser';
import NavbarUser from './components/NavbarUser';
import ResetPassword from './Forms/ResetPassword';
import AppointmentHistroy from './components/AppointmentHistroy';
import ManageReport from './adminComponents/ManageReport';
import ManageMessages from './adminComponents/ManageMessages';

function App() {
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Customer Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={['customer']} />}>
          <Route path="/services" element={<Services />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointment-history" element={<AppointmentHistroy />} />
          
          <Route path="/HeroAfterLogin" element={<HeroUser />} />
          <Route path="/NavAfterLogin" element={<NavbarUser />} />
        </Route>

        {/* Technician Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={['technician']} />}>
          <Route path="/technician" element={<Technician />} />
          <Route path="/workload" element={<Workload />} />
          <Route path="/update" element={<UpdateJob />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/report" element={<Report />} />
          <Route path="/communicate" element={<Communication />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/technicians" element={<Technicians />} />
          <Route path="/CreateServices" element={<CreateServices />} />
          <Route path="/categories" element={<ManageCategories />} />
          <Route path="/manage-reports" element={<ManageReport />} />
          <Route path="/manage-messages" element={<ManageMessages />} />
        
        </Route>   
        <Route element={<PrivateRoute allowedRoles={['customer', 'technician', 'admin']} />}>
        <Route path="/Profile" element={<AdminProfile />} />
       </Route>
      </Routes>
    </Router>
  );
}

export default App;
