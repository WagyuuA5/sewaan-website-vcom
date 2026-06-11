import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { ToastProvider } from './components/ui/Toast';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Rentals from './pages/Rentals';
import Invoices from './pages/Invoices';
import Service from './pages/Service';
import ServiceHistory from './pages/ServiceHistory';
import Customers from './pages/Customers';
import Devices from './pages/Devices';
import Spareparts from './pages/Spareparts';
import Users from './pages/Users';
import OperationalNotes from './pages/OperationalNotes';
import Bookkeeping from './pages/Bookkeeping';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
        {/* Sidebar — persistent on desktop, overlay on mobile */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/service" element={<Service />} />
              <Route path="/service-history" element={<ServiceHistory />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/spareparts" element={<Spareparts />} />
              <Route path="/users" element={<Users />} />
              <Route path="/operational-notes" element={<OperationalNotes />} />
              <Route path="/bookkeeping" element={<Bookkeeping />} />
            </Routes>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
