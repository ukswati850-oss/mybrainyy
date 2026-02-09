import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Toaster } from 'react-hot-toast';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans">
      <Navbar />
      <main className="md:pl-64 pb-20 md:pb-0 min-h-screen">
        <div className="max-w-3xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
};
