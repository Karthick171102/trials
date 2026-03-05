
import React, { useState } from 'react';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import IncidentManagement from './views/IncidentManagement';
import ThreatIntelligence from './views/ThreatIntelligence';
import Playbooks from './views/Playbooks';
import Assets from './views/Assets';
import Users from './views/Users';
import ClientPortal from './views/ClientPortal';
import PlaceholderView from './views/PlaceholderView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ToastContainer } from './components/Toast';
import { ToastProvider } from './context/ToastContext';

export type View = 'Dashboard' | 'Incidents' | 'Threat Intelligence' | 'Playbooks' | 'Assets' | 'Users' | 'Client Portal' | 'Notifications' | 'Settings' | 'Audit Logs';

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<View>('Dashboard');

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Incidents':
        return <IncidentManagement />;
      case 'Threat Intelligence':
        return <ThreatIntelligence />;
      case 'Playbooks':
        return <Playbooks />;
      case 'Assets':
        return <Assets />;
      case 'Users':
        return <Users />;
      case 'Client Portal':
        return <ClientPortal />;
      case 'Notifications':
        return <PlaceholderView title="Notifications and Alerts" />;
      case 'Settings':
        return <PlaceholderView title="Settings & Integrations" />;
      case 'Audit Logs':
        return <PlaceholderView title="Audit Logs & Reports" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout} setCurrentView={setCurrentView} currentView={currentView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6 md:p-8 lg:p-10">
          {renderView()}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};


const App: React.FC = () => (
  <ToastProvider>
    <AppContent />
  </ToastProvider>
);


export default App;