import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FinancialsPage from './pages/FinancialsPage';
import SaasPage from './pages/SaasPage';
import CustomerPage from './pages/CustomerPage';
import SocialMediaPage from './pages/SocialMediaPage';
import CustomerFeedbackPage from './pages/CustomerFeedbackPage';
import IntegrationsPage from './pages/IntegrationsPage';
import CustomDashboardPage from './pages/CustomDashboardPage';
import { AuthProvider } from './contexts/AuthContext';
import Integrations from './pages/integrations';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import ERDDiagram from './pages/ERDDiagram';

// Main App component with routing
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Single root route — query params control behavior */}
            <Route path="/" element={<MainApp />} />

            {/* Catch-all redirects back to root with defaults */}
            <Route path="*" element={<Navigate to="/?user_id=101&organization_id=301" replace />} />
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={5000} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

// MainApp component that handles layout and section rendering
function MainApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  

  // Extract query params
  const searchParams = new URLSearchParams(location.search);
  const user_id = searchParams.get('user_id') || '101';
  const organization_id = searchParams.get('organization_id') || '301';

  // Keep section only in React state
  const [activeSection, setActiveSection] = useState<string>('financials');

  const handleSectionChange = (newSection: string) => {
    setActiveSection(newSection);
    // Keep same query params, only update section in state
    navigate(`/?user_id=${user_id}&organization_id=${organization_id}`, { replace: true });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'saas':
        return <SaasPage />;
      case 'customer':
        return <CustomerPage />;
      case 'social-media':
        return <SocialMediaPage />;
      case 'customer-feedback':
        return <CustomerFeedbackPage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'custom-dashboard':
        return <CustomDashboardPage />;
      case 'financials':
      default:
        return <FinancialsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
