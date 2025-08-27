import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, BarChart3, Zap, Users, Share2, Heart, Settings, HelpCircle, MessageCircle, LogOut, Plug2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SupportTicketModal from './SupportTicketModal';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, isCollapsed, onToggleCollapse }) => {
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(true);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Extract organization_id from query params
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const organization_id = searchParams.get('organization_id');

  const [organizationDetails, setOrganizationDetails] = React.useState({
    CONTACT_EMAIL: "",
    INDUSTRY: "",
    LATEST_PAYMENT: null,
    NAME: "",
    NUMBER_OF_EMPLOYEES: "",
    ORGANIZATION_ID: organization_id,
    PRICING_PLAN: null,
    WEBSITE: ""
  });

  React.useEffect(() => {
    fetch(`https://api.coreoutline.com/organization/${organization_id}`)
      .then(res => res.json())
      .then(data => setOrganizationDetails(data.data))
      .catch(() => {});
  }, [organization_id]);

  const navigationItems = [
    { id: 'financials', label: 'Financials', icon: BarChart3 },
    { id: 'saas', label: 'Saas', icon: Zap },
    { id: 'customer', label: 'Customer', icon: Users },
    { id: 'social-media', label: 'Social Media', icon: Share2 },
    { id: 'customer-feedback', label: 'Customer Feedback', icon: Heart, badge: 2 },
    { id: 'custom-dashboard', label: 'Custom Dashboard', icon: Settings },
    { id: 'integrations', label: 'Integrations', icon: Plug2 },
    { id: 'churn', label: 'Churn Analysis', icon: Plug2 }
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-[#03045e] text-white flex flex-col rounded-r-2xl fixed left-0 top-0 h-screen z-50 transition-all duration-300`}>
      {/* Logo */}
      <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
        <div className="w-8 h-8 bg-[#00b4d8] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
          {organizationDetails.NAME.charAt(0).toUpperCase()}
        </div>
        {!isCollapsed && <span className="text-lg font-medium text-white">{organizationDetails.NAME}</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
        {/* Dashboard Section */}
        <div className="mb-4">
          {!isCollapsed && (
            <div
              onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
              className="flex items-center justify-between px-3 py-2 cursor-pointer text-[#caf0f8] hover:text-white transition-colors"
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Dashboard</span>
              </div>
              {isDashboardExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </div>
          )}
          
          {/* Dashboard Items */}
          <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
            !isCollapsed && !isDashboardExpanded 
              ? 'max-h-0 opacity-0' 
              : 'max-h-96 opacity-100'
          }`}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <div
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} ${isCollapsed ? 'px-3' : 'px-3 ml-4'} py-2 cursor-pointer font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'text-white bg-[#0077b6]' 
                      : 'text-[#caf0f8] hover:text-white hover:bg-[#0077b6]'
                  }`}
                >
                  <div className="flex items-center">
                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <div className="w-4 h-4 bg-[#90e0ef] rounded-full flex items-center justify-center text-xs font-bold text-[#03045e]">
                      {item.badge}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1 mt-auto">
        <div 
          onClick={() => setIsSupportModalOpen(true)}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 text-[#caf0f8] hover:text-white cursor-pointer font-medium rounded-lg hover:bg-[#0077b6] transition-colors`}
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Help Centre</span>}
        </div>
        <div 
          onClick={() => setIsSupportModalOpen(true)}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 text-[#caf0f8] hover:text-white cursor-pointer font-medium rounded-lg hover:bg-[#0077b6] transition-colors`}
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Contact us</span>}
        </div>
        <a 
          href="https://www.coreoutline.com"
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 text-[#caf0f8] hover:text-white cursor-pointer font-medium rounded-lg hover:bg-[#0077b6] transition-colors no-underline`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Log out</span>}
        </a>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-4 w-6 h-6 bg-slate-800 border-2 border-slate-600 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
      
      {/* Support Ticket Modal */}
      <SupportTicketModal 
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
