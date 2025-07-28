import React from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, BarChart, Zap, Users, Share, Star, Settings, HelpCircle, MessageCircle, LogOut, Plug } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, isCollapsed, onToggleCollapse }) => {
  const [isDashboardExpanded, setIsDashboardExpanded] = React.useState(true);

  const navigationItems = [
    { id: 'financials', label: 'Financials', icon: BarChart },
    { id: 'saas', label: 'Saas', icon: Zap },
    { id: 'customer', label: 'Customer', icon: Users },
    { id: 'social-media', label: 'Social Media', icon: Share },
    { id: 'customer-feedback', label: 'Customer Feedback', icon: Star, badge: 2 },
    { id: 'custom-dashboard', label: 'Custom Dashboard', icon: Settings },
    { id: 'integrations', label: 'Integrations', icon: Plug }
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-slate-800 text-white flex flex-col rounded-r-2xl fixed left-0 top-0 h-screen z-50 transition-all duration-300`}>
      {/* Logo */}
      <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
          M
        </div>
        {!isCollapsed && <span className="text-lg font-medium">Core&Outline</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {/* Dashboard Section */}
        <div className="mb-4">
          {!isCollapsed && (
            <div
              onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
              className="flex items-center justify-between px-3 py-2 cursor-pointer text-gray-400 hover:text-white transition-colors"
            >
              <div className="flex items-center space-x-2">
                <BarChart className="w-4 h-4" />
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
          <div className={`space-y-1 ${!isCollapsed && !isDashboardExpanded ? 'hidden' : ''}`}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <div
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} ${isCollapsed ? 'px-3' : 'px-3 ml-4'} py-1.5 cursor-pointer font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'text-orange-500 bg-slate-700' 
                      : 'text-gray-300 hover:text-white hover:bg-slate-700'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge ? (
                    <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {item.badge}
                    </div>
                  ) : !isCollapsed ? (
                    <ChevronRight className="w-3 h-3" />
                  ) : null}
                  {isCollapsed && item.badge && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 text-gray-300 hover:text-white cursor-pointer font-medium rounded-lg hover:bg-slate-700 transition-colors`} title={isCollapsed ? 'Help Centre' : undefined}>
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Help Centre</span>}
        </div>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 text-gray-300 hover:text-white cursor-pointer font-medium rounded-lg hover:bg-slate-700 transition-colors`} title={isCollapsed ? 'Contact us' : undefined}>
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Contact us</span>}
        </div>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-3 py-2 text-orange-500 hover:text-orange-400 cursor-pointer font-medium rounded-lg hover:bg-slate-700 transition-colors`} title={isCollapsed ? 'Log out' : undefined}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Log out</span>}
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-4 w-6 h-6 bg-slate-800 border-2 border-slate-600 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </div>
  );
};

export default Sidebar;