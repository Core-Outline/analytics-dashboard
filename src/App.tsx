import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import React, { useState } from 'react';
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

// Type for route parameters
type RouteParams = {
  user_id: string;
  organization_id: string;
  section?: string;
};

// Main App component with routing
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/:user_id/:organization_id/*" element={<MainApp />} />
          {/* Redirect root to a default route */}
          <Route path="/" element={
            <Navigate to="/101/301/financials" replace />
          } />
          {/* Catch-all route */}
          <Route path="*" element={
            <Navigate to="/101/301/financials" replace />
          } />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={5000} />
    </AuthProvider>
  );
}

// MainApp component that handles the main layout and routing
function MainApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user_id, organization_id, section = 'financials' } = useParams<keyof RouteParams>() as RouteParams;
  const [activeSection, setActiveSection] = useState(section);

  // Update active section when URL changes
  React.useEffect(() => {
    setActiveSection(section);
  }, [section]);

  const handleSectionChange = (newSection: string) => {
    setActiveSection(newSection);
    navigate(`/${user_id}/${organization_id}/${newSection}`);
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