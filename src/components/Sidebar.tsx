import React from 'react';
import { ChevronRight, BarChart3, Zap, User, Share2, Star, Settings, HelpCircle, MessageCircle, LogOut, Plug } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const navigationItems = [
    { id: 'financials', label: 'Financials', icon: BarChart3 },
    { id: 'saas', label: 'Saas', icon: Zap },
    { id: 'customer', label: 'Customer', icon: User },
    { id: 'social-media', label: 'Social Media', icon: Share2 },
    { id: 'customer-feedback', label: 'Customer Feedback', icon: Star, badge: 2 },
    { id: 'customer-dashboard', label: 'Customer Dashboard', icon: Settings },
    { id: 'integrations', label: 'Integrations', icon: Plug }
  ];

  return (
    <div className="w-64 bg-slate-800 text-white flex flex-col rounded-r-2xl">
      {/* Logo */}
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-lg">
          M
        </div>
        <span className="text-xl font-medium">Core&Outline</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <div
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer font-medium rounded-lg ${
                  isActive 
                    ? 'text-orange-500 bg-slate-700' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge ? (
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {item.badge}
                  </div>
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 space-y-1">
        <div className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm">Help Centre</span>
        </div>
        <div className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white cursor-pointer font-medium">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">Contact us</span>
        </div>
        <div className="flex items-center space-x-3 px-4 py-3 text-orange-500 hover:text-orange-400 cursor-pointer font-medium">
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Log out</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;