import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import your Footer component
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <Navbar /> {/* Navbar always visible */}
      <main>
        <Outlet /> {/* Page-specific content will be rendered here */}
      </main>
      <Footer /> {/* Footer always visible */}
    </div>
  );
}

export default Layout;
