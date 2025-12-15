import { Outlet, useLocation } from 'react-router-dom';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Layout() {
  const location = useLocation();

  const noHeaderRoutes = ['/', '/login', '/signup'];
  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      
      {showHeader && <Header />}

      <main className={`${showHeader ? "pt-16" : ""} flex-grow`}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
