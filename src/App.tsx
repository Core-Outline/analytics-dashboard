import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FinancialsPage from './pages/FinancialsPage';
import SaasPage from './pages/SaasPage';
import CustomerPage from './pages/CustomerPage';
import SocialMediaPage from './pages/SocialMediaPage';

function App() {
  const [activeSection, setActiveSection] = useState('financials');

  const renderContent = () => {
    switch (activeSection) {
      case 'saas':
        return <SaasPage />;
      case 'customer':
        return <CustomerPage />;
      case 'social-media':
        return <SocialMediaPage />;
      case 'financials':
      default:
        return <FinancialsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        {renderContent()}
      </div>
    </div>
  );
}

export default App;