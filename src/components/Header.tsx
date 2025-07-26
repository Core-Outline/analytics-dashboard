import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-medium text-gray-900">Welcome Back, Anthony</h1>
      <div className="flex items-center space-x-4">
        <Search className="w-6 h-6 text-gray-400 cursor-pointer" />
        <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <span className="text-gray-700 font-normal">Anthony</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;