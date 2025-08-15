import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useParams } from 'react-router-dom';

const Header: React.FC = () => {
  const { user_id } = useParams();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetch(`http://localhost:4000/auth/get-user/${user_id}`)
      .then(res => res.json())
      .then(data => setUserName(data.data.NAME))
      .finally(() => {});
  }, [user_id]);

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-medium text-gray-900">Welcome Back, {userName}</h1>
      <div className="flex items-center space-x-4">
        <Search className="w-6 h-6 text-gray-400 cursor-pointer" />
        <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <span className="text-gray-700 font-normal">{userName}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;